<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-morado text-white">
      <q-toolbar class="q-gutter-x-sm">
        <q-toolbar-title>
          <q-icon
              class="q-ml-xs q-mr-md"
              name="fas fa-clock"
              color="white"
          />
          -- : --
        </q-toolbar-title>
        <q-btn flat
               rounded
               color="white"
               icon="fas fa-comments"
               @click="onClick"
        />
        <q-separator vertical inset color="white"/>
        <q-btn flat
               rounded
               color="white"
               :icon="!video ? 'fas fa-video' : 'fas fa-video-slash'"
               @click="video = !video"
        />
        <q-btn flat
               rounded
               color="white"
               :icon="!silenciado ? 'fas fa-microphone' : 'fas fa-microphone-slash'"
               @click="alternarMicro"
        />
        <q-btn
               color="negative"
               icon="fas fa-phone-slash"
               label="Salir"
               @click="abandonar"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view :usuarios="usuarios" />
    </q-page-container>

  </q-layout>
</template>

<script setup>
import {appId, token, rtcUid, audioTracks, rtmUid} from "boot/agora";
import { onMounted, ref } from "vue";
import AgoraRTC from "agora-rtc-sdk-ng";
import AgoraRTM from 'agora-rtm-sdk';
import {useRoute} from "vue-router";

const route = useRoute()

const localStorage = window.localStorage
let infoUsuario = null

if (localStorage.infoUsuario){
  infoUsuario = JSON.parse(localStorage.infoUsuario)
}

let rtcClient
let rtmClient
let canal
let idCanal
const silenciado = ref(true)
const video = ref(false)
const usuarios = ref([])

onMounted(() => {
  idCanal = route.params.canal.toString()
  entrarEnLlamadaRTC()
  entrarEnLlamadaRTM(infoUsuario.nombre + " " + infoUsuario.apellidos, infoUsuario.url_foto)
})

async function entrarEnLlamadaRTC() {
  rtcClient = AgoraRTC.createClient({mode: 'rtc', codec: 'vp8'})

  rtcClient.on('user-left', manejarSalidaUsuarioRTC)
  rtcClient.on('user-published', manejarPublicacionUsuario)

  await rtcClient.join(appId, idCanal, token, rtcUid)

  audioTracks.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack()
  audioTracks.localAudioTrack.setMuted(silenciado.value)

  await rtcClient.publish(audioTracks.localAudioTrack)

  iniciarIndicadorVolumen()
}

async function entrarEnLlamadaRTM(nombre, urlFoto){
  rtmClient = AgoraRTM.createInstance(appId)
  await rtmClient.login({'uid': rtmUid, 'token': token})

  await rtmClient.addOrUpdateLocalUserAttributes({'uidRtc': rtcUid.toString(), 'nombre': nombre, 'urlFoto': urlFoto})

  canal = rtmClient.createChannel(idCanal)
  await canal.join()

  await obtenerMiembrosCanal()

  canal.on('MemberJoined', manejarEntradaUsuario)
  canal.on('MemberLeft', manejarSalidaUsuarioRTM)

  window.addEventListener('beforeunload', abandonarLlamadaRTM)
}

async function manejarEntradaUsuario(uid){
  let {uidRtc, nombre, urlFoto} = await rtmClient.getUserAttributesByKeys(uid, ['uidRtc', 'nombre', 'urlFoto'])
  usuarios.value.push({
    uid: uid,
    uidRtc: uidRtc,
    nombre: nombre,
    urlFoto: urlFoto
  })
}

async function manejarSalidaUsuarioRTC(usuario){
  delete audioTracks.remoteAudioTracks[usuario.uid]
}

async function manejarSalidaUsuarioRTM(uid){
  usuarios.value = usuarios.value.filter((u) => u.uid !== uid)
}

async function manejarPublicacionUsuario(usuario, mediaType){
  await rtcClient.subscribe(usuario, mediaType)

  if (mediaType === 'audio'){
    audioTracks.remoteAudioTracks[usuario.uid] = [usuario.audioTrack]
    usuario.audioTrack.play()
  }
}

async function obtenerMiembrosCanal(){
  let usuariosObtenidos = await canal.getMembers()

  for (const u of usuariosObtenidos) {
    let {uidRtc, nombre, urlFoto} = await rtmClient.getUserAttributesByKeys(u, ['uidRtc', 'nombre', 'urlFoto'])
    let usuarioObtenido = {
      uid: u,
      uidRtc: uidRtc,
      nombre: nombre,
      urlFoto: urlFoto
    }
    usuarios.value.push(usuarioObtenido)
  }
}

function iniciarIndicadorVolumen(){
  AgoraRTC.setParameter('AUDIO_VOLUME_INDICATION_INTERVAL', 200)
  rtcClient.enableAudioVolumeIndicator()
  rtcClient.on('volume-indicator', volumes => {
    volumes.forEach((volume) => {
      try {
        let item = document.getElementsByClassName(`usuario-rtc-${volume.uid}`)[0]

        if (volume.level >= 50) {
          item.style.border = "5px solid #f3840e"
        } else {
          item.style.border = ""
        }
      } catch (e) {
        console.log(e)
      }
    })
  })
}

async function alternarMicro(){
  silenciado.value = !silenciado.value
  audioTracks.localAudioTrack.setMuted(silenciado.value)
}

async function abandonar(){
  audioTracks.localAudioTrack.stop()
  audioTracks.localAudioTrack.close()

  rtcClient.unpublish()
  rtcClient.leave()

  await abandonarLlamadaRTM()

  window.close()
}

async function abandonarLlamadaRTM(){
  await canal.leave()
  await rtmClient.logout()
}
</script>

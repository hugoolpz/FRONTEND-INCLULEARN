<template>
  <div id="enfoque" :style="{ display: modoTDAH ? 'block' : 'none'}">
    <div id="linea-central"></div>
  </div>

  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-naranja text-white">
      <q-toolbar>
        <q-btn
          flat
          class="bg-white"
          color="naranja"
          icon="fas fa-arrow-left"
          @click="$router.push('/tus-clases')"
        />
        <q-toolbar-title class="adventPro-semiBold text-uppercase">
          TUS CHATS PRIVADOS
        </q-toolbar-title>
        <q-btn-group flat class="bg-naranja text-white">
          <q-btn flat icon="fas fa-universal-access"
                 @click="abrirMenuAccess()"/>
          <q-btn-dropdown v-model="idioma" flat color="white" dropdown-icon="none" auto-close>
            <template v-slot:label>
              <div class="row absolute-center">
                <q-icon size="sm" name="fas fa-globe" class="boton-mundo"/>
              </div>
            </template>
            <q-list>
              <q-scroll-area style="width: 160px; height: 112px;">
                <list-item-idioma titulo='Español' idioma="Español" :cod-idioma="locale" cod-bandera='es-ESP'
                                  @al-clickar="cambiarIdioma('Español')"></list-item-idioma>
                <list-item-idioma titulo='English' idioma="Inglés" :cod-idioma="locale" cod-bandera='en-US'
                                  @al-clickar="cambiarIdioma('Inglés')"></list-item-idioma>
                <list-item-idioma titulo='Français' idioma="Francés" :cod-idioma="locale" cod-bandera='fr-FR'
                                  @al-clickar="cambiarIdioma('Francés')"></list-item-idioma>
                <list-item-idioma titulo='Deutsch' idioma="Alemán" :cod-idioma="locale" cod-bandera='de-DE'
                                  @al-clickar="cambiarIdioma('Alemán')"></list-item-idioma>
                <list-item-idioma titulo='Italiano' idioma="Italiano" :cod-idioma="locale" cod-bandera='it-IT'
                                  @al-clickar="cambiarIdioma('Italiano')"></list-item-idioma>
                <list-item-idioma titulo='中文' idioma="Chino" :cod-idioma="locale" cod-bandera='zh-CN'
                                  @al-clickar="cambiarIdioma('Chino')"></list-item-idioma>
              </q-scroll-area>
            </q-list>
          </q-btn-dropdown>
        </q-btn-group>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="menuIzq" :width="320" :breakpoint="500" behavior="mobile">
      <q-scroll-area class="fit">
        <q-toolbar class="bg-morado text-h3 text-white text-center alumniSans-regular">
          <q-toolbar-title>
            {{$t('titAccess')}}
          </q-toolbar-title>
        </q-toolbar>

        <q-list class="q-mt-sm" separator="">
          <list-item-access :titulo-ajuste="$t('titAjDislexia')" :subt-ajuste="$t('subtAjDislexia')" icono="fas fa-font"
                            @al-activar="ajusteDislexia()"></list-item-access>
          <list-item-access :titulo-ajuste="$t('titAjEpilepsia')" :subt-ajuste="$t('subtAjEpilepsia')"
                            icono="fas fa-eye-low-vision" @al-activar="ajusteEpilepsia"></list-item-access>
          <list-item-access :titulo-ajuste="$t('titAjTDAH')" :subt-ajuste="$t('subtAjTDAH')" icono="fas fa-arrows-to-eye"
                            @al-activar="modoTDAH = !modoTDAH"></list-item-access>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-drawer
      side="left"
      v-model="contactos"
      show-if-above
      bordered
      :width="320"
      :breakpoint="500"
    >
      <q-toolbar class="bg-naranja-claro text-white shadow-2 row justify-between">
        <q-btn color="white"
               icon="fas fa-plus"
               label="Nuevo Chat"
               size="md"
               rounded
               text-color="naranja-claro"
               @click="nuevoChat = !nuevoChat"
               class="adventPro-semiBold"
        />
        <q-btn color="white"
               :icon="contactos ? 'fas fa-chevron-left' : 'fas fa-chevron-right'"
               size="md"
               text-color="naranja-claro"
               @click="contactos = !contactos"
        />
      </q-toolbar>

      <q-list bordered separator>
        <q-item v-ripple clickable v-for="chat in chats" @click="chatActual = chat; obtenerHistorialMensajes(chat._id)" :active="esChatElegido(chat)"
                active-class="bg-morado text-white">
          <q-item-section avatar>
            <q-avatar>
              <img v-if="chat.receptor._id !== infoUsuario._id" :src="chat.receptor.url_foto !== './' ? chat.receptor.url_foto : 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg'">
              <img v-else :src="chat.emisor.url_foto !== './' ? chat.emisor.url_foto : 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg'">
            </q-avatar>
          </q-item-section>

          <q-item-section v-if="chat.receptor._id !== infoUsuario._id">
            <q-item-label class="adventPro-semiBold" :class="esChatElegido(chat) ? 'text-white' : 'text-morado'">{{chat.receptor.nombre + ' ' + chat.receptor.apellidos}}</q-item-label>
            <q-item-label caption lines="1" class="adventPro-regular" :class="esChatElegido(chat) ? 'text-white' : 'text-morado'">{{chat.receptor.correo}}</q-item-label>
          </q-item-section>


          <q-item-section v-else>
            <q-item-label class="adventPro-semiBold" :class="esChatElegido(chat) ? 'text-white' : 'text-morado'">{{chat.emisor.nombre + ' ' + chat.emisor.apellidos}}</q-item-label>
            <q-item-label caption lines="1" class="adventPro-regular" :class="esChatElegido(chat) ? 'text-white' : 'text-morado'">{{chat.emisor.correo}}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-icon :color="esChatElegido(chat) ? 'white' : 'morado'" name="fas fa-comment"/>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-dialog v-model="nuevoChat">
      <q-card style="width: 100%; max-width: 400px">
        <q-card-section>
          <div class="text-h5 text-center adventPro-semiBold">Escribe el correo de la persona que deseas escribir:
          </div>
        </q-card-section>

        <q-card-section>
          <q-form
            class="q-gutter-lg"
            @reset="onReset"
            @submit="intentarCrearChatPrivado">
            <q-input
              v-model="correoContacto"
              :rules="[ val => val && val.length > 0 || $t('campoReq')]"
              class="no-padding alumniSans-regular text-body1"
              color="morado"
              filled
              label="Correo de la persona"
              lazy-rules
            />
            <div align="right">
              <q-btn class="adventPro-semiBold" color="naranja" label="Agregar" type="submit"/>
              <q-btn v-close-popup :label="$t('etiquetaCancelar')" class="q-ml-sm adventPro-semiBold"
                     color="naranja-claro"
                     flat type="reset"/>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-page-container>
      <router-view @contactos="contactos = !contactos" :chat-actual="chatActual ? chatActual : null" :mensajes="mensajes"/>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import ListItemIdioma from "components/ListItemIdiomaComponent.vue";
import { today } from '@quasar/quasar-ui-qcalendar/src/index.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarMonth.sass'
import {onMounted, ref, watch} from "vue";
import {useI18n} from "vue-i18n";
import { DatePicker } from "qalendar";
import ListItemAccess from "components/ListItemAccessComponent.vue";
import {QSpinnerHourglass, useQuasar} from "quasar";
import api from "boot/httpSingleton";
document.body.style.overflow = "scroll"
const idioma = ref(false)
const menuIzq = ref(false)
const { locale } = useI18n()
const contactos = ref(true);
const nuevoChat = ref(false);
const chatActual = ref('');
const correoContacto = ref('');
const chats = ref([]);
const mensajes = ref([])
const $q = useQuasar()
const urlApi = api
const localStorage = window.localStorage;
let infoUsuario = null;

if (localStorage.infoUsuario) {
  infoUsuario = JSON.parse(localStorage.infoUsuario);
}

onMounted(() => {
  obtenerChats()
})

//Accesibilidad
const modoDislexia = ref(false)
const modoEpilepsia = ref(false)
const modoTDAH = ref(false);
function abrirMenuAccess() {
  menuIzq.value = !menuIzq.value
}

function ajusteDislexia() {
  modoDislexia.value = !modoDislexia.value;

  const elementosTexto = document.querySelectorAll('body *');

  if (modoDislexia.value) {
    elementosTexto.forEach(elemento => {
      elemento.classList.add('openDyslexic-regular');
    });
  } else {
    elementosTexto.forEach(elemento => {
      elemento.classList.remove('openDyslexic-regular');
    });
  }

  window.localStorage.setItem("dislexia", modoDislexia.value)
}

function ajusteEpilepsia() {
  modoEpilepsia.value = !modoEpilepsia.value;

  if (modoEpilepsia.value) {
    document.querySelector('html').classList.add('filtro-epilepsia');
  } else {
    document.querySelector('html').classList.remove('filtro-epilepsia');
  }

  window.localStorage.setItem("epilepsia", modoEpilepsia.value)
}

watch(modoTDAH, (nuevoValor) => {
  const enfoqueElemento = document.getElementById('enfoque');
  enfoqueElemento.style.display = nuevoValor ? 'block' : 'none';
  document.addEventListener('mousemove', moverEnfoque);
  window.localStorage.setItem("tdah", nuevoValor)
});

function moverEnfoque(event) {
  const enfoqueElemento = document.getElementById('enfoque');
  enfoqueElemento.style.top = (event.pageY - enfoqueElemento.offsetHeight / 30) + 'px';
}

function cambiarIdioma(idioma) {
  locale.value = idioma
}

async function intentarCrearChatPrivado() {
  await fetch(`${urlApi}/usuarios/correo/${correoContacto.value}`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'token-privado': localStorage.tokenPrivado
    },
  })
    .then(respuesta => respuesta.json())
    .then(datos => {
      if (!datos.exito) {
        $q.notify({
          message: "¡Hubo un error al intentar crear el chat!",
          color: "negative",
          position: "top",
          timeout: 1000,
          progress: true,
          icon: "fas fa-circle-exclamation",
        });
      } else {
        if (datos.datos) {
          let idOtro = datos.datos._id
          fetch(`${urlApi}/chatsPrivados`, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              'token-privado': localStorage.tokenPrivado
            },
            body: JSON.stringify({
              "emisor": infoUsuario._id,
              "receptor": idOtro,
            })
          })
            .then(respuesta => respuesta.json())
            .then(datos => {
              if (!datos.exito) {
                $q.notify({
                  message: "¡Hubo un error al intentar crear el chat!",
                  color: "negative",
                  position: "top",
                  timeout: 1000,
                  progress: true,
                  icon: "fas fa-circle-exclamation",
                });
              } else {
                let idChat = datos.datos._id
                fetch(`${urlApi}/usuarios/${infoUsuario._id}`, {
                  method: "PUT",
                  headers: {
                    'Content-Type': 'application/json',
                    'token-privado': localStorage.tokenPrivado
                  },
                  body: JSON.stringify({
                    "chats_privados": idChat
                  })
                })
                  .then(respuesta => respuesta.json())
                  .then(datos => {
                    if (!datos.exito) {
                      $q.notify({
                        message: "¡Hubo un error al intentar crear el chat!",
                        color: "negative",
                        position: "top",
                        timeout: 1000,
                        progress: true,
                        icon: "fas fa-circle-exclamation",
                      });
                    } else {
                      fetch(`${urlApi}/usuarios/${idOtro}`, {
                        method: "PUT",
                        headers: {
                          'Content-Type': 'application/json',
                          'token-privado': localStorage.tokenPrivado
                        },
                        body: JSON.stringify({
                          "chats_privados": idChat
                        })
                      })
                        .then(respuesta => respuesta.json())
                        .then(datos => {
                          if (!datos.exito) {
                            $q.notify({
                              message: "¡Hubo un error al intentar crear el chat!",
                              color: "negative",
                              position: "top",
                              timeout: 1000,
                              progress: true,
                              icon: "fas fa-circle-exclamation",
                            });
                          } else {
                            $q.notify({
                              message: "¡Se creó el chat correctamente!",
                              color: "positive",
                              position: "top",
                              timeout: 1000,
                              progress: true,
                              icon: "fas fa-circle-check",
                            });
                            obtenerChats()
                          }
                        })
                    }
                  })
              }
            })
        } else {
          $q.notify({
            message: "¡No tenemos registros de una cuenta con ese correo!",
            color: "negative",
            position: "top",
            timeout: 1000,
            progress: true,
            icon: "fas fa-circle-exclamation",
          });
        }
      }
    })
  nuevoChat.value = false
}

async function obtenerChats() {
  chats.value.length = 0
  mostrarCarga()
  await fetch(`${urlApi}/usuarios/${infoUsuario._id}`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'token-privado': localStorage.tokenPrivado
    }
  })
    .then(respuesta => respuesta.json())
    .then(datos => {
      if (!datos.exito) {
        $q.notify({
          message: "¡Hubo un error al intentar obtener tus chats!",
          color: "negative",
          position: "top",
          timeout: 1000,
          progress: true,
          icon: "fas fa-circle-exclamation",
        });
      } else {
        if (datos.datos) {
          datos.datos.chats_privados.forEach((chat) => {
            chats.value.push(chat)
          })
        } else {
          $q.notify({
            message: "¡No tienes chats! Prueba a crear uno",
            color: "negative",
            position: "top",
            timeout: 1000,
            progress: true,
            icon: "fas fa-circle-exclamation",
          });
        }
      }

    })
  $q.loading.hide()
}

function mostrarCarga() {
  $q.loading.show({
    spinner: QSpinnerHourglass,
    spinnerColor: 'naranja',
    spinnerSize: 150,
    backgroundColor: 'morado',
    message: 'Reuniendo tus chats...',
    messageColor: 'naranja-claro'
  })
}

function esChatElegido(chat) {
  if (chatActual.value) {
    return chatActual.value._id === chat._id;
  }
}

async function obtenerHistorialMensajes(idCanal) {
  mensajes.value.length = 0
  mostrarCarga()
  await fetch(`${urlApi}/chatsPrivados/${idCanal}`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'token-privado': localStorage.tokenPrivado
    }
  })
    .then(respuesta => respuesta.json())
    .then(datos => {
      if (!datos.exito) {
        $q.notify({
          message: "¡Hubo un error al intentar obtener el historial de mensajes del chat!",
          color: "negative",
          position: "top",
          timeout: 1000,
          progress: true,
          icon: "fas fa-circle-exclamation",
        });
      } else {
        if (datos.datos.mensajes) {
          datos.datos.mensajes.forEach((chat) => {
            let mensaje = {
              idMensaje: chat._id,
              emisor: chat.emisor,
              nombreEmisor: chat.emisor.nombre + " " + chat.emisor.apellidos,
              contenido: chat.contenido,
              marcaTiempo: chat.marca_tiempo
            };
            mensajes.value.push(mensaje)
          })
        }
      }

    })
  $q.loading.hide()
}
</script>

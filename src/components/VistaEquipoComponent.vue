<template>
  <div class="row">
    <q-card class="col-md-1 col-xs-1" flat>
      <q-list bordered class="column flex-center" separator>
        <q-item v-ripple clickable>
          <q-item-section>
            <q-avatar color="morado" icon="fas fa-comments" rounded size="lg" text-color="white"/>
          </q-item-section>
          <q-tooltip :offset="[8,10]" anchor="center right" class="bg-morado" self="center left">
            Tus chats
          </q-tooltip>
        </q-item>
        <q-item v-ripple clickable @click="$router.push('/tus-clases')">
          <q-item-section>
            <q-avatar color="morado" icon="fas fa-user-group" rounded size="lg" text-color="white"/>
          </q-item-section>
          <q-tooltip :offset="[8,10]" anchor="center right" class="bg-morado" self="center left">
            Tus grupos
          </q-tooltip>
        </q-item>
        <q-item v-ripple clickable>
          <q-item-section>
            <q-avatar color="morado" icon="fas fa-scroll" rounded size="lg" text-color="white"/>
          </q-item-section>
          <q-tooltip :offset="[8,10]" anchor="center right" class="bg-morado" self="center left">
            Tus tareas
          </q-tooltip>
        </q-item>
      </q-list>
    </q-card>
    <q-card bordered class="col-md-3 col-xs-5" flat>
      <div class="column">
        <div class="col flex flex-center q-mt-lg">
          <q-avatar :icon="grupoActual.icono" :style="{backgroundColor: grupoActual.color}" rounded size="100px"
                    text-color="white"/>
        </div>
        <div class="col flex flex-center q-mt-md">
          <div class="text-h6 text-center">{{ grupoActual.nombre }}
            <q-btn-dropdown auto-close dropdown-icon="none" flat rounded>
              <template v-slot:label>
                <div class="row absolute-center">
                  <q-icon class="boton-mundo" name="fas fa-ellipsis" size="sm"/>
                </div>
              </template>
              <q-list>
                <q-item v-close-popup clickable @click="$emit('agregarMiembro')">
                  <q-item-section>
                    <q-item-label>Agregar miembro</q-item-label>
                  </q-item-section>
                  <q-item-section avatar>
                    <q-icon name="fas fa-user-plus"/>
                  </q-item-section>
                </q-item>

                <q-item v-close-popup clickable @click="$emit('agregarCanal')">
                  <q-item-section>
                    <q-item-label>Agregar canal</q-item-label>
                  </q-item-section>
                  <q-item-section avatar>
                    <q-icon name="fas fa-comment-medical"/>
                  </q-item-section>
                </q-item>

                <q-item v-close-popup clickable @click="$emit('abandonarGrupo')">
                  <q-item-section>
                    <q-item-label>Abandonar grupo</q-item-label>
                  </q-item-section>
                  <q-item-section avatar>
                    <q-icon name="fas fa-door-open"/>
                  </q-item-section>
                </q-item>

                <q-item v-close-popup :disable="!esCreador" clickable @click="$emit('eliminarGrupo')">
                  <q-tooltip v-if="!esCreador" class="bg-negative">
                    ¡No eres el creador de este grupo!
                  </q-tooltip>
                  <q-item-section>
                    <q-item-label>Eliminar grupo</q-item-label>
                  </q-item-section>
                  <q-item-section avatar>
                    <q-icon name="fas fa-trash"/>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
        </div>
        <div class="col q-mt-md q-ml-md">
          <div class="text-body1">Canales
            <q-icon
              :name="verCanales ? 'fas fa-caret-up' : 'fas fa-caret-down'"
              class="cursor-pointer"
              color="black"
              @click="verCanales = !verCanales"
            />
          </div>
        </div>
        <div class="col q-mt-sm">
          <q-separator/>
          <q-slide-transition>
            <div v-show="verCanales">
              <q-list bordered separator>
                <q-item v-for="(canal, index) in grupoActual.canales" :key="index" v-ripple clickable
                        @click="canalActual = canal; tabCanal = 'chat'" :active="esCanalElegido(canal)" active-class="bg-morado text-white">
                  <q-item-section avatar>
                    <q-avatar :color="esCanalElegido(canal) ? 'white' : 'morado'" icon="fas fa-hashtag" rounded :text-color="esCanalElegido(canal) ? 'morado' : 'white'"/>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ canal.nombre }}</q-item-label>
                    <q-item-label caption :class="esCanalElegido(canal) ? 'text-white' : 'text-morado'">{{ canal.descripcion }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </q-slide-transition>
        </div>
      </div>
    </q-card>
    <div v-if="canalActual !== null" class="col">
      <q-toolbar class="bg-morado text-white">
        <q-toolbar-title>
          <q-icon
            name="fas fa-hashtag"
          />
          {{ canalActual.nombre }}
        </q-toolbar-title>
        <q-tabs
          v-model="tabCanal"
          class="text-white"
          inline-label>
          <q-btn flat
              color="white"
              icon="fas fa-headset"
              @click="onClick"
          />
          <q-separator vertical inset color="white" />
          <q-tab icon="fas fa-comments" label="Chat" name="chat"/>
          <q-tab icon="fas fa-folder" label="Archivos" name="archivos"/>
          <q-tab icon="fas fa-scroll" label="Tareas" name="tareas"/>
        </q-tabs>
      </q-toolbar>
      <q-tab-panels v-model="tabCanal" animated>
        <q-tab-panel class="no-padding" name="chat">
          <q-scroll-area style="height: 375px; max-width: 950px;">
            <div>
              <q-chat-message v-for="chat in  chats" :bg-color="chat.emisor._id === infoUsuario._id ? 'morado' : 'naranja-claro'"
                              :name="chat.emisor._id === infoUsuario._id ? 'Tú' : chat.nombreEmisor"
                              :sent="chat.emisor._id === infoUsuario._id" :stamp="chat.marcaTiempo"
                              :text="[chat.contenido]" :text-color="chat.emisor._id === infoUsuario._id ? 'white' : 'black'"
                              avatar="https://i.pinimg.com/originals/d3/99/67/d399672b6ac028bf8ec8655b9f02f00d.jpg"
                              class="q-pa-lg"
                              text-html>
              </q-chat-message>
            </div>
          </q-scroll-area>
          <div :style="{visibility: !emoji ? 'hidden' : 'visible'}">
            <EmojiPicker class="absolute-right" hide-search style="top: 55px" @select="alSeleccionarEmoji"/>
          </div>
          <q-editor
            v-model="mensaje"
            :definitions="{
                    subir: {
                        icon: 'fas fa-paperclip',
                        label: 'Subir archivo',
                        //handler: uploadIt,
                    },
                    enviar: {
                        icon: 'far fa-paper-plane',
                        label: 'Enviar mensaje',
                        handler: enviarMensaje,
                        disable: !mensaje.trim(),
                        color: mensaje.trim() ? 'primario' : 'grey',
                    },
                    emoticonos: {
                        icon: 'far fa-smile',
                        handler: manejarMenuEmojis,
                    },
                }
                    "
            :toolbar="[
        ['bold', 'italic', 'strike', 'underline'],
        [
            {
                label: $q.lang.editor.formatting,
                icon: $q.iconSet.editor.formatting,
                list: 'no-icons',
                options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code'],
            },
            'removeFormat',
        ],
        ['unordered', 'ordered'],
        ['subir', 'enviar', 'emoticonos'],
    ]"
            min-height="8rem"
            placeholder="Escribe aquí tu mensaje..."
            toolbar-bg="morado"
            toolbar-text-color="white"
            toolbar-toggle-color="naranja"
            @keydown.enter="intentarEnviarMensaje"
          />
        </q-tab-panel>
        <q-tab-panel class="no-padding" name="archivos">
          <q-list bordered separator>
            <q-scroll-area style="height: 530px">
              <q-item v-for="n in 15" v-ripple clickable>
                <q-item-section avatar top>
                  <q-avatar color="naranja-claro" icon="fas fa-file" text-color="white"/>
                </q-item-section>

                <q-item-section>
                  <q-item-label lines="1">Nombre archivo</q-item-label>
                  <q-item-label caption>1.25 MB</q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-btn flat round color="azul-oscuro" icon="fas fa-download" @click="" />
                </q-item-section>
                <q-item-section side>
                  <q-btn flat round color="morado" icon="fas fa-share-nodes" @click=""/>
                </q-item-section>
                <q-item-section side>
                  <q-btn flat round color="negative" icon="fas fa-trash" @click="" />
                </q-item-section>
              </q-item>
            </q-scroll-area>
          </q-list>
        </q-tab-panel>
      </q-tab-panels>
    </div>
    <div v-else class="col column flex-center">
      <q-img
        spinner-color="primary"
        spinner-size="82px"
        src="/Conversation-pana.svg"
        style="width: 45rem;"
      />

      <div class="text-h5 text-morado" style="opacity:.5;">
        ¡Elige un canal y empieza a conversar!
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, ref} from "vue";
import DOMPurify from 'dompurify';
import EmojiPicker from 'vue3-emoji-picker';
import 'vue3-emoji-picker/css';
import {io} from "socket.io-client";

const mensaje = ref('');
const emoji = ref(false);
const socket = io("http://localhost:3000");
const props = defineProps(['grupoActual', 'verCanales', 'esCreador']);
const emits = defineEmits(['agregarMiembro', 'agregarCanal', 'abandonarGrupo', 'eliminarGrupo', 'alClickarCanal']);
const chats = ref([]);
const canalActual = ref(null)
const tabCanal = ref('chat')
const localStorage = window.localStorage;
let infoUsuario = null;

if (localStorage.infoUsuario) {
  infoUsuario = JSON.parse(localStorage.infoUsuario);
}

function alSeleccionarEmoji(emojiElegido) {
  mensaje.value += emojiElegido.i;
  emoji.value = false
}

function manejarMenuEmojis() {
  emoji.value = !emoji.value;
}

function esCanalElegido(canal) {
  if (canalActual.value){
    return canalActual.value._id === canal._id;
  }
}

function intentarEnviarMensaje(event) {
  if (!event.shiftKey) {
    event.preventDefault();
    enviarMensaje();
  }
}

function limpiarContenidoMensaje(contenido) {
  const contenidoLimpio = DOMPurify.sanitize(contenido);
  if (contenido !== contenidoLimpio) {
    console.log("DOMPurify ha encontrado y eliminado contenido malicioso.");
  }
  return contenidoLimpio;
}


function enviarMensaje() {
  if (mensaje.value.trim() !== "") {
    const contenidoLimpio = limpiarContenidoMensaje(mensaje.value);
    socket.emit("mensaje", infoUsuario._id, contenidoLimpio, obtenerMarcaTiempo());
    mensaje.value = "";
  }
}

function obtenerMarcaTiempo() {
  let fecha = new Date();
  return fecha.toLocaleString();
}

socket.on("mensaje", (emisor, contenido, marcaTiempo) => {
  let mensajeEnviado = {
    emisor: emisor,
    nombreEmisor: emisor.nombre + " " + emisor.apellidos,
    contenido: contenido,
    marcaTiempo: marcaTiempo
  };
  chats.value.push(mensajeEnviado);
});
</script>


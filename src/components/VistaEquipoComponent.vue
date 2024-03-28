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
                        @click="canalActual = canal; tabCanal = 'chat'; obtenerHistorialMensajes(canal._id)" :active="esCanalElegido(canal)" active-class="bg-morado text-white">
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
              @click="entrarEnLlamada"
          />
          <q-separator vertical inset color="white" class="q-mx-sm" />
          <q-tab icon="fas fa-comments" label="Chat" name="chat"/>
          <q-tab icon="fas fa-folder" label="Archivos" name="archivos"/>
          <q-tab icon="fas fa-scroll" label="Tareas" name="tareas"/>
        </q-tabs>
      </q-toolbar>
      <q-tab-panels v-model="tabCanal" animated>
        <q-tab-panel class="no-padding" name="chat">
          <q-scroll-area style="height: 375px; max-width: 950px;">
            <div>
              <q-chat-message v-for="(chat, index) in  chats" :bg-color="chat.emisor._id === infoUsuario._id ? 'morado' : 'naranja-claro'"
                              :sent="chat.emisor._id === infoUsuario._id" :stamp="chat.marcaTiempo"
                              :text="[chat.contenido]" :text-color="chat.emisor._id === infoUsuario._id ? 'white' : 'black'"
                              :avatar="chat.emisor.url_foto !== './' ? chat.emisor.url_foto : 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg'"
                              class="q-px-lg q-my-md"
                              text-html>
                <template v-slot:name v-if="chat.emisor._id === infoUsuario._id && index === chats.length-1">
                  <div class="row q-gutter-x-sm">
                    <q-icon
                      name="fas fa-pen"
                      color="naranja-claro"
                      size="15px"
                      class="cursor-pointer"
                      @click="activarModoEdicion(chat)"
                    />
                    <q-icon
                      name="fas fa-trash"
                      color="negative"
                      size="15px"
                      class="cursor-pointer"
                      @click="borrarMensaje(chat.idMensaje)"
                    />
                    <div class="col self-end">Tú</div>
                  </div>
                </template>
                <template v-slot:name v-else>
                  {{chat.emisor._id === infoUsuario._id ? 'Tú' : chat.nombreEmisor}}
                </template>
              </q-chat-message>
            </div>
          </q-scroll-area>
          <div :style="{visibility: !emoji ? 'hidden' : 'visible'}">
            <EmojiPicker class="absolute-right" hide-search style="top: 55px" @select="alSeleccionarEmoji"/>
          </div>
          <q-editor
            v-if="!modoEdicion"
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

          <q-editor
            v-else
            v-model="mensaje"
            :definitions="{
                    subir: {
                        icon: 'fas fa-paperclip',
                        label: 'Subir archivo',
                        //handler: uploadIt,
                    },
                    enviar: {
                        icon: 'far fa-paper-plane',
                        label: 'Editar mensaje',
                        handler: editarMensaje,
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
            @keydown.enter="intentarEditarMensaje"
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
        <q-tab-panel name="tareas">
          <div class="col column flex-center">
            <q-img
              spinner-color="primary"
              spinner-size="82px"
              src="/Software engineer-amico.svg"
              style="width: 25rem;"
            />

            <div class="text-h4 text-naranja q-mt-md" style="opacity:.5;">
              ¡Próximamente: gestión de tareas!
            </div>
          </div>
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
import {ref} from "vue";
import DOMPurify from 'dompurify';
import EmojiPicker from 'vue3-emoji-picker';
import 'vue3-emoji-picker/css';
import {io} from "socket.io-client";
import {QSpinnerHourglass, useQuasar} from "quasar";
import api from "boot/httpSingleton";
import {useRouter} from "vue-router";

const mensaje = ref('');
const emoji = ref(false);
const modoEdicion = ref(false)
const idEdicion = ref(null)
const socket = io("http://localhost:3000");
const props = defineProps(['grupoActual', 'verCanales', 'esCreador']);
const emits = defineEmits(['agregarMiembro', 'agregarCanal', 'abandonarGrupo', 'eliminarGrupo', 'alClickarCanal']);
const chats = ref([]);
const canalActual = ref(null)
const tabCanal = ref('chat')
const localStorage = window.localStorage;
let infoUsuario = null;
const $q = useQuasar()
const urlApi = api

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

function intentarEditarMensaje(event) {
  if (!event.shiftKey) {
    event.preventDefault();
    editarMensaje(idEdicion.value);
  }
}

function limpiarContenidoMensaje(contenido) {
  const contenidoLimpio = DOMPurify.sanitize(contenido);
  if (contenido !== contenidoLimpio) {
    console.log("DOMPurify ha encontrado y eliminado contenido malicioso.");
  }
  return contenidoLimpio;
}


async function enviarMensaje() {
  if (mensaje.value.trim() !== "") {
    const contenidoLimpio = limpiarContenidoMensaje(mensaje.value);
    mensaje.value = "";

    await fetch(`${urlApi}/mensajes/`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'token-privado': localStorage.tokenPrivado
      },
      body: JSON.stringify({
        "emisor": infoUsuario._id,
        "contenido": contenidoLimpio,
        "marca_tiempo": obtenerMarcaTiempo(),
      })
    })
      .then(respuesta => respuesta.json())
      .then(datos => {
        if (!datos.exito) {
          $q.notify({
            message: "¡Hubo un error al intentar enviar tu mensaje!",
            color: "negative",
            position: "top",
            timeout: 1000,
            progress: true,
            icon: "fas fa-circle-exclamation",
          });
        } else {
          let idMensaje = datos.datos._id
          fetch(`${urlApi}/canales/${canalActual.value._id}`, {
            method: "PUT",
            headers: {
              'Content-Type': 'application/json',
              'token-privado': localStorage.tokenPrivado
            },
            body: JSON.stringify({
              "mensajes": datos.datos._id
            })
          })
            .then(respuesta => respuesta.json())
            .then(datos => {
              if (!datos.exito) {
                $q.notify({
                  message: "¡Hubo un error al intentar enviar tu mensaje!",
                  color: "negative",
                  position: "top",
                  timeout: 1000,
                  progress: true,
                  icon: "fas fa-circle-exclamation",
                });
                //TODO: Borrar el mensaje previamente creado
              } else {
                socket.emit("mensaje", idMensaje, infoUsuario._id, contenidoLimpio, obtenerMarcaTiempo());
              }
            })
        }
      })
  }
}

async function obtenerHistorialMensajes(idCanal) {
  chats.value.length = 0
  mostrarCarga()
  await fetch(`${urlApi}/canales/${idCanal}`, {
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
          message: "¡Hubo un error al intentar obtener el historial de mensajes del canal!",
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
            chats.value.push(mensaje)
          })
        }
      }

    })
  $q.loading.hide()
}

function activarModoEdicion(chat){
  modoEdicion.value = true;
  mensaje.value = chat.contenido;
  idEdicion.value = chat.idMensaje
  console.log(mensaje.value)
}

async function editarMensaje(){
  await fetch(`${urlApi}/mensajes/${idEdicion.value}`, {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
      'token-privado': localStorage.tokenPrivado
    },
    body: JSON.stringify({
      "contenido": mensaje.value
    })
  })
    .then(respuesta => respuesta.json())
    .then(datos => {
      if (!datos.exito) {
        $q.notify({
          message: "¡Hubo un error al intentar editar el mensaje!",
          color: "negative",
          position: "top",
          timeout: 1000,
          progress: true,
          icon: "fas fa-circle-exclamation",
        });
      } else {
        $q.notify({
          message: "¡Se editó el mensaje con éxito!",
          color: "positive",
          position: "top",
          timeout: 1000,
          progress: true,
          icon: "fas fa-check",
        });
        socket.emit("mensaje-editado", idEdicion.value, mensaje.value);
        mensaje.value = ""
        modoEdicion.value = false
      }
    })
}

async function borrarMensaje(id){
  await fetch(`${urlApi}/mensajes/${id}`, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json',
      'token-privado': localStorage.tokenPrivado
    },
  })
    .then(respuesta => respuesta.json())
    .then(datos => {
      if (!datos.exito) {
        $q.notify({
          message: "¡Hubo un error al intentar eliminar el mensaje!",
          color: "negative",
          position: "top",
          timeout: 1000,
          progress: true,
          icon: "fas fa-circle-exclamation",
        });
      } else {
        $q.notify({
          message: "¡Se eliminó el mensaje con éxito!",
          color: "positive",
          position: "top",
          timeout: 1000,
          progress: true,
          icon: "fas fa-check",
        });
        socket.emit("mensaje-borrado", id);
      }
    })
}

function mostrarCarga() {
  $q.loading.show({
    spinner: QSpinnerHourglass,
    spinnerColor: 'naranja',
    spinnerSize: 150,
    backgroundColor: 'morado',
    message: 'Reuniendo historial de mensajes...',
    messageColor: 'naranja-claro'
  })
}

socket.on("mensaje", (idMensaje, emisor, contenido, marcaTiempo) => {
  let mensajeEnviado = {
    idMensaje: idMensaje,
    emisor: emisor,
    nombreEmisor: emisor.nombre + " " + emisor.apellidos,
    contenido: contenido,
    marcaTiempo: marcaTiempo
  };
  chats.value.push(mensajeEnviado);
});

socket.on("mensaje-borrado", (idMsg) => {
  chats.value = chats.value.filter((chat) => chat.idMensaje !== idMsg);
});

socket.on("mensaje-editado", (idMsg, contenidoNuevo) => {
  chats.value = chats.value.map((chat) => {
    if (chat.idMensaje === idMsg) {
      return {
        ...chat,
        contenido: contenidoNuevo
      };
    } else {
      return chat;
    }
  });
});


function obtenerMarcaTiempo() {
  return new Date().toLocaleString();
}

function entrarEnLlamada(){
  window.open('http://localhost:9000/llamada/' + canalActual.value._id, '_blank')
}
</script>


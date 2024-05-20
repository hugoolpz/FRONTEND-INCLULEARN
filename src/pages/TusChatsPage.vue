<template>
  <q-page>
    <div class="row">
      <div class="col-12" v-if="chatActual">
        <q-toolbar class="text-white bg-morado">
            <q-btn flat round dense icon="fas fa-list" @click="$emit('contactos')"/>
            <q-toolbar-title class="adventPro-semiBold">
                {{chatActual.receptor.nombre + ' ' + chatActual.receptor.apellidos}}
            </q-toolbar-title>
        </q-toolbar>

        <q-scroll-area style="height: 422px;">
          <div>
            <q-chat-message tabindex="0"
                            v-for="(chat, index) in  chats"
                            :avatar="chat.emisor.url_foto !== './' ? chat.emisor.url_foto : 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg'"
                            :bg-color="chat.emisor._id === infoUsuario._id ? 'morado' : 'naranja-claro'" :sent="chat.emisor._id === infoUsuario._id"
                            :stamp="chat.marcaTiempo"
                            :text="[chat.contenido]"
                            :text-color="chat.emisor._id === infoUsuario._id ? 'white' : 'black'"
                            class="q-px-lg q-my-md adventPro-regular"
                            text-html>
              <template v-if="chat.emisor._id === infoUsuario._id && index === chats.length-1" v-slot:name>
                <div class="row q-gutter-x-sm">
                  <q-icon
                    class="cursor-pointer"
                    color="naranja-claro"
                    name="fas fa-pen"
                    size="15px"
                    @click="activarModoEdicion(chat)"
                    tabindex="0"
                    aria-label="editar mensaje"
                  />
                  <q-icon
                    class="cursor-pointer"
                    color="negative"
                    name="fas fa-trash"
                    size="15px"
                    @click="borrarMensaje(chat.idMensaje)"
                    tabindex="0"
                    aria-label="eliminar mensaje"
                  />
                  <div class="col self-end">Tú</div>
                </div>
              </template>
              <template v-else v-slot:name>
                {{ chat.emisor._id === infoUsuario._id ? 'Tú' : chat.nombreEmisor }}
              </template>
            </q-chat-message>

            <mensaje-escribiendo-component v-for="u in usuariosEscribiendo" :avatar="u.avatar !== './' ? u.avatar : 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg'" :nombre="u.nombre"/>
          </div>
        </q-scroll-area>

        <q-editor
          v-if="!modoEdicion"
          v-model="mensaje"
          class="adventPro-regular"
          :definitions="{
                    subir: {
              label: $t('subirArch'),
              //handler: uploadIt,
              disable: true
                    },
                    enviar: {
                        icon: 'far fa-paper-plane',
              label: $t('enviarMensaje'),
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
          :placeholder="$t('escribeMensaje')"
          toolbar-bg="morado"
          toolbar-text-color="white"
          toolbar-toggle-color="naranja"
          @focus="estaEscribiendo(infoUsuario, chatActual._id)"
          @blur="dejoDeEscribir(infoUsuario, chatActual._id)"
          @keydown.enter="intentarEnviarMensaje"
        />

        <q-editor
          v-else
          v-model="mensaje"
          class="adventPro-regular"
          :definitions="{
                    subir: {
              label: $t('subirArch'),
              //handler: uploadIt,
              disable: true
                    },
                    enviar: {
                        icon: 'far fa-paper-plane',
                                      label: $t('editarMensaje'),
                        handler: editarMensaje,
                        disable: !mensaje.trim(),
                        color: mensaje.trim() ? 'primario' : 'grey',
                    },
                    emoticonos: {
                        icon: 'far fa-smile',
                        handler: manejarMenuEmojis,
                    },
                }
                    " :toolbar="[
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
          :placeholder="$t('escribeMensaje')"
          toolbar-bg="morado"
          toolbar-text-color="white"
          toolbar-toggle-color="naranja"
          @focus="estaEscribiendo(infoUsuario, chatActual._id)"
          @blur="dejoDeEscribir(infoUsuario, chatActual._id)"
          @keydown.enter="intentarEditarMensaje"
        />
      </div>
      <div class="col column flex-center" v-else>
        <q-img
          spinner-color="primary"
          spinner-size="82px"
          src="/Conversation-pana.svg"
          style="width: 45rem;"
        />

        <div class="text-h5 text-morado adventPro-semiBold" style="opacity:.5;">
          {{$t('eligeChat')}}
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import {ref, watch} from "vue";
import {io} from "socket.io-client";
import {QSpinnerHourglass, useQuasar} from "quasar";
import api from "boot/httpSingleton";
import DOMPurify from "dompurify";
import MensajeEscribiendoComponent from "components/MensajeEscribiendoComponent.vue";

const mensaje = ref('');
const emoji = ref(false);
const modoEdicion = ref(false)
const idEdicion = ref(null)
const socket = io("http://localhost:3000");
const chats = ref([]);
const usuariosEscribiendo = ref([]);
const localStorage = window.localStorage;
let infoUsuario = null;
const $q = useQuasar()
const urlApi = api

const emits = defineEmits(['contactos'])
const props = defineProps(['chatActual', 'mensajes'])

if (localStorage.infoUsuario) {
  infoUsuario = JSON.parse(localStorage.infoUsuario);
  chats.value = props.mensajes
}

function alSeleccionarEmoji(emojiElegido) {
  mensaje.value += emojiElegido.i;
  emoji.value = false
}

function manejarMenuEmojis() {
  emoji.value = !emoji.value;
}

function estaEscribiendo(usuario, idCanal) {
  socket.emit('usuario-escribiendo', usuario, idCanal)
}

function dejoDeEscribir(usuario, idCanal) {
  socket.emit('usuario-no-escribiendo', usuario, idCanal)
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
          fetch(`${urlApi}/chatsPrivados/${props.chatActual._id}`, {
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

function activarModoEdicion(chat) {
  modoEdicion.value = true;
  mensaje.value = chat.contenido;
  idEdicion.value = chat.idMensaje
}

async function editarMensaje() {
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

async function borrarMensaje(id) {
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

function obtenerMarcaTiempo() {
  return new Date().toLocaleString();
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

socket.on('usuario-escribiendo', (usuario, idCanal) => {
  if (props.chatActual._id === idCanal && usuario._id !== infoUsuario._id) {
    let u = {
      _id: usuario._id,
      avatar: usuario.url_foto,
      nombre: usuario.nombre + ' ' + usuario.apellidos
    }
    usuariosEscribiendo.value.push(u)
  }
})

socket.on('usuario-no-escribiendo', (usuario, idCanal) => {
  if (props.chatActual._id === idCanal) {
    usuariosEscribiendo.value = usuariosEscribiendo.value.filter((u) => u._id !== usuario._id);
  }
})

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
</script>

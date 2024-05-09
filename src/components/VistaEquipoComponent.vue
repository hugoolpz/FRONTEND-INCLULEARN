<template>
  <div class="row">
    <q-card class="col-md-3 col-xs-5 window-height" flat v-show="verMenu">
      <div class="column">
        <q-toolbar class="bg-naranja-claro text-white row" v-show="canalActual">
          <q-btn color="white" :icon="verMenu ? 'fas fa-chevron-left' : 'fas fa-chevron-right'" size="md"
            text-color="naranja-claro" @click="verMenu = !verMenu" />
        </q-toolbar>

        <div class="col flex flex-center q-mt-lg">
          <q-avatar :icon="grupoActual.icono" :style="{ backgroundColor: grupoActual.color }" rounded size="100px"
            text-color="white" />
        </div>
        <div class="col flex flex-center q-mt-md">
          <div class="text-h6 text-center adventPro-semiBold">{{ grupoActual.nombre }}
            <q-btn-dropdown auto-close dropdown-icon="none" flat rounded>
              <template v-slot:label>
                <div class="row absolute-center">
                  <q-icon class="boton-mundo" name="fas fa-ellipsis" size="sm" />
                </div>
              </template>
              <q-list class="adventPro-semiBold">
                <q-item v-close-popup :disable="!esCreador" clickable @click="$emit('agregarMiembro')">
                  <q-tooltip v-if="!esCreador" class="bg-negative">
                    {{ $t('noCreadorGrupo') }}
                  </q-tooltip>
                  <q-item-section>
                    <q-item-label>{{ $t('agregarMiembro') }}</q-item-label>
                  </q-item-section>
                  <q-item-section avatar>
                    <q-icon name="fas fa-user-plus" />
                  </q-item-section>
                </q-item>

                <q-item v-close-popup :disable="!esCreador" clickable @click="$emit('agregarCanal')">
                  <q-tooltip v-if="!esCreador" class="bg-negative">
                    {{ $t('noCreadorGrupo') }}
                  </q-tooltip>
                  <q-item-section>
                    <q-item-label>{{ $t('agregarCanal') }}</q-item-label>
                  </q-item-section>
                  <q-item-section avatar>
                    <q-icon name="fas fa-comment-medical" />
                  </q-item-section>
                </q-item>

                <q-item v-close-popup clickable @click="$emit('abandonarGrupo')">
                  <q-item-section>
                    <q-item-label>{{ $t('abandonarGrupo') }}</q-item-label>
                  </q-item-section>
                  <q-item-section avatar>
                    <q-icon name="fas fa-door-open" />
                  </q-item-section>
                </q-item>

                <q-item v-close-popup :disable="!esCreador" clickable @click="$emit('eliminarGrupo')">
                  <q-tooltip v-if="!esCreador" class="bg-negative">
                    {{ $t('noCreadorGrupo') }}
                  </q-tooltip>
                  <q-item-section>
                    <q-item-label>{{ $t('eliminarGrupo') }}</q-item-label>
                  </q-item-section>
                  <q-item-section avatar>
                    <q-icon name="fas fa-trash" />
                  </q-item-section>
                </q-item>

                <q-item v-close-popup clickable @click="$emit('copiarCodigo')">
                  <q-item-section>
                    <q-item-label>{{ $t('copiarCodigo') }}</q-item-label>
                  </q-item-section>
                  <q-item-section avatar>
                    <q-icon name="fas fa-key" />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
        </div>
        <div class="col q-mt-md q-ml-md">
          <div class="text-body1 adventPro-semiBold">{{ $t('canales') }}
            <q-icon :name="verCanales ? 'fas fa-caret-up' : 'fas fa-caret-down'" class="cursor-pointer" color="black"
              @click="verCanales = !verCanales" />
          </div>
        </div>
        <div class="col q-mt-sm">
          <q-separator />
          <q-slide-transition>
            <div v-show="verCanales">
              <q-list bordered separator>
                <q-item v-for="(canal, index) in grupoActual.canales" :key="index" v-ripple
                  :active="esCanalElegido(canal)" active-class="bg-morado text-white" clickable
                  @click="canalActual = canal; tabCanal = 'chat'; obtenerHistorialMensajes(canal._id); usuariosEscribiendo.length = 0">
                  <q-item-section avatar>
                    <q-avatar :color="esCanalElegido(canal) ? 'white' : 'morado'"
                      :text-color="esCanalElegido(canal) ? 'morado' : 'white'" icon="fas fa-hashtag" rounded />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="adventPro-semiBold">{{ canal.nombre }}</q-item-label>
                    <q-item-label class="adventPro-regular"
                      :class="esCanalElegido(canal) ? 'text-white' : 'text-morado'" caption>
                      {{ canal.descripcion }}
                    </q-item-label>
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
        <q-btn color="white" icon="fas fa-list" size="md" flat @click="verMenu = !verMenu" />
        <q-toolbar-title class="adventPro-semiBold">
          <q-icon name="fas fa-hashtag" />
          {{ canalActual.nombre }}
        </q-toolbar-title>
        <q-tabs v-model="tabCanal" class="text-white adventPro-semiBold" inline-label>
          <q-btn v-if="!todaviaEnLlamada" :disable="llamadaEnCurso" color="white" flat icon="fas fa-headset"
            @click="comenzarLlamada" aria-label="Entrar en llamada" />
          <q-btn v-else :disable="llamadaEnCurso" color="white" flat icon="fas fa-headset"
            @click="entrarEnLlamada(grupoActual._id)" aria-label="Entrar en llamada en curso">
            <q-tooltip v-if="todaviaEnLlamada">
              {{$t('uneteLlamada')}}
            </q-tooltip>
          </q-btn>
          <q-separator class="q-mx-sm" color="white" inset vertical />
          <q-tab icon="fas fa-comments" :label="$t('chat')" name="chat" />
          <q-tab icon="fas fa-folder" :label="$t('archivos')" name="archivos" @click="obtenerArchivos" />
          <q-tab icon="fas fa-scroll" :label="$t('tareas')" name="tareas" />
        </q-tabs>
      </q-toolbar>
      <q-tab-panels v-model="tabCanal" animated>
        <q-tab-panel class="no-padding" name="chat">
          <q-scroll-area style="height: 375px; max-width: 950px;">
            <div>
              <q-chat-message tabindex="0"
                :aria-label="chat.emisor.nombre + chat.emisor.apellidos + ' dice ' + chat.contenido"
                v-for="(chat, index) in chats"
                :avatar="chat.emisor.url_foto !== './' ? chat.emisor.url_foto : 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg'"
                :bg-color="chat.emisor._id === infoUsuario._id ? 'morado' : 'naranja-claro'"
                :sent="chat.emisor._id === infoUsuario._id" :stamp="chat.marcaTiempo" :text="[chat.contenido]"
                :text-color="chat.emisor._id === infoUsuario._id ? 'white' : 'black'"
                class="q-px-lg q-my-md adventPro-regular" text-html>
                <template v-if="chat.emisor._id === infoUsuario._id && index === chats.length - 1" v-slot:name>
                  <div class="row q-gutter-x-sm">
                    <q-icon class="cursor-pointer" color="naranja-claro" name="fas fa-pen" size="15px"
                      @click="activarModoEdicion(chat)" />
                    <q-icon class="cursor-pointer" color="negative" name="fas fa-trash" size="15px"
                      @click="borrarMensaje(chat.idMensaje)" />
                    <div class="col self-end">Tú</div>
                  </div>
                </template>
                <template v-else v-slot:name>
                  {{ chat.emisor._id === infoUsuario._id ? 'Tú' : chat.nombreEmisor }}
                </template>
              </q-chat-message>

              <mensaje-escribiendo-component v-for="u in usuariosEscribiendo"
                :avatar="u.avatar !== './' ? u.avatar : 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg'"
                :nombre="u.nombre" />
            </div>
          </q-scroll-area>
          <div :style="{ visibility: !emoji ? 'hidden' : 'visible' }">
            <EmojiPicker class="absolute-right" hide-search style="top: 55px" @select="alSeleccionarEmoji" />
          </div>
          <q-editor v-if="!modoEdicion" v-model="mensaje" class="adventPro-regular" :definitions="{
            subir: {
              icon: 'fas fa-paperclip',
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
            ]" min-height="8rem" :placeholder="$t('escribeMensaje')" toolbar-bg="morado"
            toolbar-text-color="white" toolbar-toggle-color="naranja"
            @focus="estaEscribiendo(infoUsuario, canalActual._id)" @blur="dejoDeEscribir(infoUsuario, canalActual._id)"
            @keydown.enter="intentarEnviarMensaje" />

          <q-editor v-else v-model="mensaje" class="adventPro-regular" :definitions="{
            subir: {
              icon: 'fas fa-paperclip',
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
            ]" min-height="8rem" :placeholder="$t('escribeMensaje')" toolbar-bg="morado"
            toolbar-text-color="white" toolbar-toggle-color="naranja"
            @focus="estaEscribiendo(infoUsuario, canalActual._id)" @blur="dejoDeEscribir(infoUsuario, canalActual._id)"
            @keydown.enter="intentarEditarMensaje" />
        </q-tab-panel>
        <q-tab-panel class="no-padding" name="archivos">
          <q-toolbar class="q-pa-sm bg-azul-oscuro">
            <q-uploader ref="archivo" :factory="factoryFn"
              accept=".pdf, .docx, .csv, .ppt, image/*, .zip, .csb, video/*, audio/*" color="morado"
              field-name="filename" :label="$t('subeArchivos')" max-file-size="25000000" no-thumbnails
              @rejected="alRechazar" @uploaded="alSubir" class="adventPro-semiBold">

              <template v-slot:header="scope">
                <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
                  <q-btn v-if="scope.queuedFiles.length > 0" dense flat icon="clear_all" round
                    @click="scope.removeQueuedFiles">
                    <q-tooltip>{{ $t('borraTodos') }}</q-tooltip>
                  </q-btn>
                  <q-btn v-if="scope.uploadedFiles.length > 0" dense flat icon="done_all" round
                    @click="scope.removeUploadedFiles">
                    <q-tooltip>{{ $t('quitarSubidos') }}</q-tooltip>
                  </q-btn>
                  <q-spinner v-if="scope.isUploading" class="q-uploader__spinner" />
                  <div class="col">
                    <div class="q-uploader__title">{{ $t('subeArchivos') }}</div>
                    <div class="q-uploader__subtitle">{{ scope.uploadSizeLabel }} / {{
                      scope.uploadProgressLabel
                      }}
                    </div>
                  </div>
                  <q-btn v-if="scope.canAddFiles" dense flat icon="add_box" round type="a" @click="scope.pickFiles">
                    <q-uploader-add-trigger />
                    <q-tooltip>{{ $t('elegirArchivos') }}</q-tooltip>
                  </q-btn>
                  <q-btn v-if="scope.canUpload" dense flat icon="cloud_upload" round @click="scope.upload">
                    <q-tooltip>{{ $t('subirArchivos') }}</q-tooltip>
                  </q-btn>

                  <q-btn v-if="scope.isUploading" dense flat icon="clear" round @click="scope.abort">
                    <q-tooltip>{{ $t('cancelarSubida') }}</q-tooltip>
                  </q-btn>
                </div>
              </template>
            </q-uploader>
          </q-toolbar>

          <q-list bordered separator>
            <q-scroll-area style="height: 530px">
              <list-archivo-item-component class="adventPro-regular" v-for="archivo in archivos"
                :nombre="archivo.nombre" :tamano="archivo.tamano" @borrar="abrirElim(archivo.nombre)"
                @compartir="copiarUrl(archivo.url)"
                @descargar="descargarArchivo(archivo.url)"></list-archivo-item-component>
            </q-scroll-area>
          </q-list>

          <q-dialog v-model="confirmarElim" persistent>
            <q-card>
              <q-toolbar class="bg-warning text-white">
                <q-avatar>
                  <q-icon name="fas fa-warning"></q-icon>
                </q-avatar>

                <q-toolbar-title>{{ $t('avisoElim') }}</q-toolbar-title>
              </q-toolbar>

              <q-card-section>
                {{ $t('confirmElim') }} <span class="text-weight-bold">{{ nomElim }}</span>?
              </q-card-section>

              <q-card-actions align="right">
                <q-btn v-close-popup :label="$t('siEliminar')" color="positive" flat @click="eliminarElegido()" />
                <q-btn v-close-popup :label="$t('noConservar')" color="negative" flat />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </q-tab-panel>
        <q-tab-panel name="tareas">
          <div class="col column flex-center">
            <q-img spinner-color="primary" spinner-size="82px" src="/Software engineer-amico.svg"
              style="width: 25rem;" />

            <div class="text-h4 text-naranja q-mt-md adventPro-semiBold" style="opacity:.5;">
              {{$t('proxTareas')}}
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
    <div v-else class="col column flex-center">
      <q-img spinner-color="primary" spinner-size="82px" src="/Conversation-pana.svg" style="width: 45rem;" />

      <div class="text-h5 text-morado adventPro-semiBold" style="opacity:.5;">
        {{$t('eligeCanal')}}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import DOMPurify from 'dompurify';
import EmojiPicker from 'vue3-emoji-picker';
import 'vue3-emoji-picker/css';
import { io } from "socket.io-client";
import { QSpinnerHourglass, useQuasar } from "quasar";
import api from "boot/httpSingleton";
import { useRouter } from "vue-router";
import ListArchivoItemComponent from "components/ListArchivoItemComponent.vue";
import TarjetaArchivoComponent from "components/TarjetaArchivoComponent.vue";
import MensajeEscribiendoComponent from "components/MensajeEscribiendoComponent.vue";

const mensaje = ref('');
const emoji = ref(false);
const modoEdicion = ref(false)
const idEdicion = ref(null)
const socket = io("http://localhost:3000");
const props = defineProps(['grupoActual', 'verCanales', 'esCreador']);
const emits = defineEmits(['agregarMiembro', 'agregarCanal', 'abandonarGrupo', 'eliminarGrupo', 'copiarCodigo']);
const chats = ref([]);
const usuariosEscribiendo = ref([]);
const canalActual = ref(null)
const llamadaEnCurso = ref(false)
const todaviaEnLlamada = ref(false)
const tabCanal = ref('chat')
const localStorage = window.localStorage;
let infoUsuario = null;
const $q = useQuasar()
const urlApi = api
const router = useRouter()
const archivo = ref(null)
const archivos = ref([])
const confirmarElim = ref(false)
const nomElim = ref()
const verMenu = ref(true)

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
  if (canalActual.value) {
    return canalActual.value._id === canal._id;
  }
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

function mostrarCarga() {
  $q.loading.show({
    spinner: QSpinnerHourglass,
    spinnerColor: 'naranja',
    spinnerSize: 150,
    backgroundColor: 'morado',
    message: 'CARGANDO...',
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

socket.on('usuario-escribiendo', (usuario, idCanal) => {
  if (canalActual.value._id === idCanal && usuario._id !== infoUsuario._id) {
    let u = {
      _id: usuario._id,
      avatar: usuario.url_foto,
      nombre: usuario.nombre + ' ' + usuario.apellidos
    }
    usuariosEscribiendo.value.push(u)
  }
})

socket.on('usuario-no-escribiendo', (usuario, idCanal) => {
  if (canalActual.value._id === idCanal) {
    usuariosEscribiendo.value = usuariosEscribiendo.value.filter((u) => u._id !== usuario._id);
  }
})

socket.on('irse-de-llamada', (idRecibida) => {
  if (idRecibida === infoUsuario._id) {
    habilitarLlamada()
  }
})

socket.on('cerrar-llamada', () => {
  llamadaEnCurso.value = false
  todaviaEnLlamada.value = false
})

socket.on('notificar-llamada', (canalElegido, usuarioQueLlamo) => {
  if (usuarioQueLlamo._id !== infoUsuario._id) {
    llamadaEnCurso.value = true
    $q.notify({
      message: "¡" + usuarioQueLlamo.nombre + " " + usuarioQueLlamo.apellidos + " ha iniciado una llamada!",
      color: 'azul-oscuro',
      icon: 'fas fa-phone',
      timeout: 0,
      position: 'top',
      actions: [
        {
          label: 'Entrar', color: 'positive', handler: () => {
            entrarEnLlamada(canalElegido._id)
          }
        },
        {
          label: 'Rechazar', color: 'negative', handler: () => {
            habilitarLlamada()
          }
        }
      ]
    })
  }
});

function obtenerMarcaTiempo() {
  return new Date().toLocaleString();
}

function factoryFn() {
  return {
    url: 'http://localhost:3000/api/storage/' + canalActual.value._id,
    method: 'POST',
  }
}

const alSubir = () => {
  $q.notify({
    message: '¡El archivo se subió correctamente!',
    color: 'positive',
    position: 'bottom',
    timeout: 500,
    progress: true,
    icon: 'fas fa-circle-check',
  });

  obtenerArchivos()

  setTimeout(function () {
    archivo.value.removeUploadedFiles()
  }, 500)
};

function descargarArchivo(url) {
  window.open(url, "_blank")
}

function copiarUrl(url) {
  navigator.clipboard.writeText(url)

  $q.notify({
    message: '¡Se ha copiado al portapapeles la URL del archivo!',
    color: 'positive',
    position: 'bottom',
    timeout: 500,
    progress: true,
    icon: 'fas fa-circle-check',
  });
}

async function obtenerArchivos() {
  archivos.value.length = 0
  mostrarCarga()
  await fetch(`${urlApi}/storage/${canalActual.value._id}`, {
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
          message: "¡Hubo un error al intentar obtener tus eventos!",
          color: "negative",
          position: "top",
          timeout: 1000,
          progress: true,
          icon: "fas fa-circle-exclamation",
        });

      } else {
        datos.files.forEach((archivo) => {
          let nuevoArchivo = {
            nombre: archivo.name,
            url: archivo.downloadURL,
            contentType: archivo.contentType,
            tamano: archivo.size,
            fechaCreacion: archivo.created,
            fechaAct: archivo.updated,
          }
          archivos.value.push(nuevoArchivo)
        })
      }

    })
  $q.loading.hide()
}

function abrirElim(nombreElegido) {
  confirmarElim.value = true;
  nomElim.value = nombreElegido
}

async function eliminarElegido() {
  await fetch(`${urlApi}/storage/${canalActual.value._id}/${nomElim.value}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      'token-privado': localStorage.tokenPrivado
    },
  })
    .then((res) => res.json())
    .then((datos) => {
      if (!datos.exito) {
        $q.notify({
          progress: true,
          message: "No se pudo eliminar el archivo " + nomElim.value,
          color: "negative",
          timeout: 1000,
        });
      } else {
        $q.notify({
          progress: true,
          message: "Se ha eliminado el archivo " + nomElim.value,
          color: "positive",
          timeout: 1000,
        });

        obtenerArchivos()
      }
    });
}

function comenzarLlamada() {
  llamadaEnCurso.value = true
  socket.emit('notificar-llamada', props.grupoActual, infoUsuario)
  window.open('http://localhost:9000/llamada/' + props.grupoActual._id, '_blank')
}

function entrarEnLlamada(idGrupo) {
  llamadaEnCurso.value = true
  todaviaEnLlamada.value = false
  window.open('http://localhost:9000/llamada/' + idGrupo, '_blank')
}

function habilitarLlamada() {
  llamadaEnCurso.value = false
  todaviaEnLlamada.value = true
}
</script>

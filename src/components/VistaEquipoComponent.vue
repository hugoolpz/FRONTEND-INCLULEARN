<template>
  <div class="row">
    <q-card class="col-md-1 col-xs0" flat>
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
                        @click="$emit('alClickarCanal', canal._id)">
                  <q-item-section avatar>
                    <q-avatar color="morado" icon="fas fa-hashtag" rounded text-color="white"/>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ canal.nombre }}</q-item-label>
                    <q-item-label caption>{{ canal.descripcion }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </q-slide-transition>
        </div>
      </div>
    </q-card>
    <div class="col">
      <q-scroll-area class="q-px-xl" style="height: 375px; max-width: 950px;">
        <div v-for="n in 10" :key="n">
          <q-chat-message
            :text="['hey, how are you?']"
            avatar="https://cdn.quasar.dev/img/avatar4.jpg"
            name="me"
            sent
            stamp="7 minutes ago"
          />
          <q-chat-message
            :text="[`doing fine, how r you?`]"
            avatar="https://cdn.quasar.dev/img/avatar3.jpg"
            name="Jane"
            stamp="4 minutes ago"
          />
        </div>
      </q-scroll-area>
      <div :style="{visibility: !emoji ? 'hidden' : 'visible'}">
        <EmojiPicker @select="alSeleccionarEmoji" class="absolute-right" style="top: 55px" hide-search />
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
        min-height="9.8rem"
        placeholder="Escribe aquí tu mensaje..."
        toolbar-bg="morado"
        toolbar-text-color="white"
        toolbar-toggle-color="naranja"
      />
    </div>
  </div>
</template>

<script setup>
import {ref} from "vue";
import EmojiPicker from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'

const mensaje = ref('')
const emoji = ref(false)
const props = defineProps(['grupoActual', 'verCanales', 'esCreador'])
const emits = defineEmits(['agregarMiembro', 'agregarCanal', 'abandonarGrupo', 'eliminarGrupo', 'alClickarCanal'])

function alSeleccionarEmoji(emoji) {
  console.log(emoji)
  mensaje.value += emoji.i
}

function manejarMenuEmojis(){
  emoji.value = !emoji.value
}
</script>

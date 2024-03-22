<template>
  <q-card class="tarjeta-chat">
    <q-card-section>
      <q-scroll-area style="height: 300px; max-width: 950px">
        <q-chat-message class="q-px-lg" v-for="n in 10"
                        avatar="https://i.pinimg.com/originals/d3/99/67/d399672b6ac028bf8ec8655b9f02f00d.jpg"
                        name="chat.seudonimo" text-html text="[chat.texto]">
        </q-chat-message>
      </q-scroll-area>
      <q-editor v-model="mensaje" @keydown.enter="intentarEnviarMensaje" placeholder="Escribe aquí tu mensaje..."
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
                        //handler: uploadIt,
                    },
                }
                    " min-height="5rem" :toolbar="[
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
    ]
        " />
    </q-card-section>
  </q-card>
</template>

<script setup>
import {ref} from "vue";

const mensaje = ref('')

function intentarEnviarMensaje(event) {
  if (!event.shiftKey) {
    event.preventDefault();
    enviarMensaje();
  }
}

function enviarMensaje() {
  if (mensaje.value.trim() !== "") {
    console.log(mensaje.value)
  }
}
</script>


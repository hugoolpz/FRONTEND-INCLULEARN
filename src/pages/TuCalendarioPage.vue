<template>
  <q-page>
    <Qalendar
      :key="componentKey"
      :events="eventos"
      :config="config"
      :selected-date="new Date(today())"
      @event-was-dragged="moverEventoManualmente"
      @event-was-resized="moverEventoManualmente"
      @datetime-was-clicked="alClickarIntervalo"
      @edit-event="editarEvento"
      @delete-event="eliminarEvento"
      class="cursor-pointer"
    />
    <q-dialog v-model="crearMarca">
      <q-card style="max-width: 400px; width: 100%">
        <q-toolbar class="bg-naranja">
          <q-toolbar-title class="text-white">Añadir evento</q-toolbar-title>
          <q-btn flat round dense icon="fas fa-xmark" color="white" v-close-popup />
        </q-toolbar>

        <q-card-section>
          <q-form
            @submit="crearEvento"
            @reset="onReset"
            class="q-gutter-md"
          >
            <q-input
              filled
              class="no-padding"
              v-model="titulo"
              label="Título"
              lazy-rules
              color="naranja-claro"
              :rules="[ val => val && val.length > 0 || 'El evento debe tener título']"
            />
            <q-input
              filled
              class="no-padding"
              v-model="detalles"
              label="Detalles"
              lazy-rules
              autogrow
              color="naranja-claro"
              :rules="[ val => val && val.length > 0 || 'El evento debe tener detalles']"
            />
            <input-fecha-hora-component v-model="fechaInicio" label="Fecha de inicio"></input-fecha-hora-component>
            <input-fecha-hora-component v-model="fechaFin" label="Fecha de fin"></input-fecha-hora-component>
            <div class="text-body1 text-underline">Elige el color de tu evento:</div>
            <div class="row flex-center q-mb-lg">
              <div class="col-auto"><chip-calendario-component color="azul-cal" contenido="Azul" @al-clickar="cambiarColorEvento('blue')"></chip-calendario-component></div>
              <div class="col-auto"><chip-calendario-component color="amarillo-cal" contenido="Amarillo" @al-clickar="cambiarColorEvento('yellow')"></chip-calendario-component></div>
              <div class="col-auto"><chip-calendario-component color="verde-cal" contenido="Verde" @al-clickar="cambiarColorEvento('green')"></chip-calendario-component></div>
              <div class="col-auto"><chip-calendario-component color="rojo-cal" contenido="Rojo" @al-clickar="cambiarColorEvento('red')"></chip-calendario-component></div>
              <div class="col-auto"><chip-calendario-component color="rosa-cal" contenido="Rosa" @al-clickar="cambiarColorEvento('pink')"></chip-calendario-component></div>
              <div class="col-auto"><chip-calendario-component color="purpura-cal" contenido="Púrpura" @al-clickar="cambiarColorEvento('purple')"></chip-calendario-component></div>
              <div class="col-auto"><chip-calendario-component color="turquesa-cal" contenido="Turquesa" @al-clickar="cambiarColorEvento('turquoise')"></chip-calendario-component></div>
              <div class="col-auto"><chip-calendario-component color="cafe-cal" contenido="Café" @al-clickar="cambiarColorEvento('brown')"></chip-calendario-component></div>
            </div>
            <div align="right">
              <q-btn label="Crear" type="submit" color="naranja"/>
              <q-btn label="Cancelar" type="reset" color="naranja-claro" flat class="q-ml-sm" v-close-popup/>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="actMarca">
      <q-card style="max-width: 400px; width: 100%">
        <q-toolbar class="bg-naranja">
          <q-toolbar-title class="text-white">Actualizar evento</q-toolbar-title>
          <q-btn flat round dense icon="fas fa-xmark" color="white" v-close-popup />
        </q-toolbar>

        <q-card-section>
          <q-form
            @submit="actualizarEventoElegido"
            @reset="onReset"
            class="q-gutter-md"
          >
            <q-input
              filled
              class="no-padding hidden"
              v-model="idEvento"
            />
            <q-input
              filled
              class="no-padding"
              v-model="titulo"
              label="Título"
              lazy-rules
              color="naranja-claro"
              :rules="[ val => val && val.length > 0 || 'El evento debe tener título']"
            />
            <q-input
              filled
              class="no-padding"
              v-model="detalles"
              label="Detalles"
              lazy-rules
              autogrow
              color="naranja-claro"
              :rules="[ val => val && val.length > 0 || 'El evento debe tener detalles']"
            />
            <input-fecha-hora-component v-model="fechaInicio" label="Fecha de inicio"></input-fecha-hora-component>
            <input-fecha-hora-component v-model="fechaFin" label="Fecha de fin"></input-fecha-hora-component>
            <div class="text-body1 text-underline">Elige el color de tu evento:</div>
            <div class="row flex-center q-mb-lg">
              <div class="col-auto"><chip-calendario-component color="azul-cal" contenido="Azul" @al-clickar="cambiarColorEvento('blue')"></chip-calendario-component></div>
              <div class="col-auto"><chip-calendario-component color="amarillo-cal" contenido="Amarillo" @al-clickar="cambiarColorEvento('yellow')"></chip-calendario-component></div>
              <div class="col-auto"><chip-calendario-component color="verde-cal" contenido="Verde" @al-clickar="cambiarColorEvento('green')"></chip-calendario-component></div>
              <div class="col-auto"><chip-calendario-component color="rojo-cal" contenido="Rojo" @al-clickar="cambiarColorEvento('red')"></chip-calendario-component></div>
              <div class="col-auto"><chip-calendario-component color="rosa-cal" contenido="Rosa" @al-clickar="cambiarColorEvento('pink')"></chip-calendario-component></div>
              <div class="col-auto"><chip-calendario-component color="purpura-cal" contenido="Púrpura" @al-clickar="cambiarColorEvento('purple')"></chip-calendario-component></div>
              <div class="col-auto"><chip-calendario-component color="turquesa-cal" contenido="Turquesa" @al-clickar="cambiarColorEvento('turquoise')"></chip-calendario-component></div>
              <div class="col-auto"><chip-calendario-component color="cafe-cal" contenido="Café" @al-clickar="cambiarColorEvento('brown')"></chip-calendario-component></div>
            </div>
            <div align="right">
              <q-btn label="Actualizar" type="submit" color="naranja"/>
              <q-btn label="Cancelar" type="reset" color="naranja-claro" flat class="q-ml-sm" v-close-popup/>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<style>
@import "qalendar/dist/style.css";
</style>

<script setup>
import {Qalendar} from "qalendar";
import {today} from "@quasar/quasar-ui-qcalendar";
import {onMounted, reactive, ref} from "vue";
import InputIconosComponent from "components/InputIconosComponent.vue";
import InputFechaHoraComponent from "components/InputFechaHoraComponent.vue";
import InputColorComponent from "components/InputColorComponent.vue";
import ChipCalendarioComponent from "components/ChipCalendarioComponent.vue";
import {QSpinnerGears, useQuasar} from "quasar";
import api from "boot/httpSingleton";

const crearMarca = ref(false)
const actMarca = ref(false)
const $q = useQuasar()
const titulo = ref("")
const detalles = ref("")
const fechaInicio = ref('')
const fechaFin = ref('')
const colorEvento = ref("blue")
const idEvento = ref("")


const componentKey = ref(0);
const localStorage = window.localStorage
const infoUsuario = JSON.parse(localStorage.infoUsuario)
const urlApi = api
const eventos = ref([])

onMounted(() => {
  actualizarEventos()
})
function alClickarIntervalo(data){
  crearMarca.value = true;
  fechaInicio.value = data
}

function cambiarColorEvento(color){
  colorEvento.value = color

  if (color == "turquoise"){
    color = "turquesa-cal"
  }

  $q.notify({
    message: "Este es el color de tu evento",
    color: color,
    position: "top",
  });
}

function crearEvento() {
  fetch(`${urlApi}/marcasTiempo`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'token-privado': localStorage.tokenPrivado
    },
    body: JSON.stringify({
      "titulo": titulo.value,
      "detalles": detalles.value,
      "tiempoInicio": fechaInicio.value,
      "tiempoFin": fechaFin.value,
      "color": colorEvento.value
    })
  })
    .then(respuesta => respuesta.json())
    .then(datos => {
      if (!datos.exito) {
        $q.notify({
          message: "¡Hubo un error al intentar crear el evento!",
          color: "negative",
          position: "top",
          timeout: 1000,
          progress: true,
          icon: "fas fa-circle-exclamation",
        });
      } else {
        fetch(`${urlApi}/usuarios/${infoUsuario._id}`, {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json',
            'token-privado': localStorage.tokenPrivado
          },
          body: JSON.stringify({
            "marcas_tiempo": datos.datos._id
          })
        })
          .then(respuesta => respuesta.json())
          .then(datos => {
            if (!datos.exito) {
              $q.notify({
                message: "¡Hubo un error al intentar crear el evento!",
                color: "negative",
                position: "top",
                timeout: 1000,
                progress: true,
                icon: "fas fa-circle-exclamation",
              });
              //TODO: Borrar el evento previamente creado
            } else {
              $q.notify({
                message: "¡Evento guardado con éxito!",
                color: "positive",
                position: "top",
                timeout: 1000,
                progress: true,
                icon: "fas fa-circle-check",
              });
              actualizarEventos()
            }
          })
      }
    })
  crearMarca.value = false
}

function editarEvento(data){
  fetch(`${urlApi}/marcasTiempo/${data}`, {
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
          message: "¡Hubo un error al intentar traer la información el evento!",
          color: "negative",
          position: "top",
          timeout: 1000,
          progress: true,
          icon: "fas fa-circle-exclamation",
        });
      } else {
        idEvento.value = datos.datos._id
        titulo.value = datos.datos.titulo
        detalles.value = datos.datos.detalles
        fechaInicio.value = datos.datos.tiempoInicio
        fechaFin.value = datos.datos.tiempoFin
        colorEvento.value = datos.datos.color
        actMarca.value = true
      }
    })
}

function actualizarEventoElegido(){
  fetch(`${urlApi}/marcasTiempo/${idEvento.value}`, {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
      'token-privado': localStorage.tokenPrivado
    },
    body: JSON.stringify({
      "titulo": titulo.value,
      "detalles": detalles.value,
      "tiempoInicio": fechaInicio.value,
      "tiempoFin": fechaFin.value,
      "color": colorEvento.value
    })
  })
    .then(respuesta => respuesta.json())
    .then(datos => {
      if (!datos.exito) {
        $q.notify({
          message: "¡Hubo un error al intentar editar el evento!",
          color: "negative",
          position: "top",
          timeout: 1000,
          progress: true,
          icon: "fas fa-circle-exclamation",
        });
      } else {
        $q.notify({
          message: "¡Evento editado con éxito!",
          color: "positive",
          position: "top",
          timeout: 1000,
          progress: true,
          icon: "fas fa-circle-check",
        });
        actMarca.value = false
        actualizarEventos()
      }
    })
}

function moverEventoManualmente(data){
  fetch(`${urlApi}/marcasTiempo/${data.id}`, {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
      'token-privado': localStorage.tokenPrivado
    },
    body: JSON.stringify({
      "tiempoInicio": data.time.start,
      "tiempoFin": data.time.end,
    })
  })
    .then(respuesta => respuesta.json())
    .then(datos => {
      if (!datos.exito) {
        $q.notify({
          message: "¡No se pudo cambiar el tamaño del evento, lo cambios no se guardarán!",
          color: "negative",
          position: "top",
          timeout: 1000,
          progress: true,
          icon: "fas fa-circle-exclamation",
        });
      } else {
        $q.notify({
          message: "¡Evento editado con éxito!",
          color: "positive",
          position: "top",
          timeout: 1000,
          progress: true,
          icon: "fas fa-circle-check",
        });
        actualizarEventos()
      }
    })
}

function eliminarEvento(data){
  fetch(`${urlApi}/marcasTiempo/${data}`, {
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
          message: "¡Hubo un error al intentar eliminar el evento!",
          color: "negative",
          position: "top",
          timeout: 1000,
          progress: true,
          icon: "fas fa-circle-exclamation",
        });
      } else {
        fetch(`${urlApi}/usuarios/pull/${infoUsuario._id}`, {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json',
            'token-privado': localStorage.tokenPrivado
          },
          body: JSON.stringify({
            "marcas_tiempo": datos.datos._id
          })
        })
          .then(respuesta => respuesta.json())
          .then(datos => {
            if (!datos.exito) {
              $q.notify({
                message: "¡Hubo un error al intentar eliminar el evento!",
                color: "negative",
                position: "top",
                timeout: 1000,
                progress: true,
                icon: "fas fa-circle-exclamation",
              });
            } else {
              $q.notify({
                message: "¡Evento eliminado con éxito!",
                color: "positive",
                position: "top",
                timeout: 1000,
                progress: true,
                icon: "fas fa-circle-check",
              });
              actualizarEventos()
            }
          })
      }
    })
}

function actualizarEventos() {
  eventos.value.length = 0
  fetch(`${urlApi}/usuarios/${infoUsuario._id}`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'token-privado': localStorage.tokenPrivado
    }
  })
    .then(respuesta => respuesta.json())
    .then(datos => {
      if (!datos.exito){
        $q.notify({
          message: "¡Hubo un error al intentar obtener tus eventos!",
          color: "negative",
          position: "top",
          timeout: 1000,
          progress: true,
          icon: "fas fa-circle-exclamation",
        });
      } else {
        datos.datos.marcas_tiempo.forEach((marca) => {
          let eventoCreado = {
            id: marca._id,
            title: marca.titulo,
            description: marca.detalles,
            color: marca.color,
            time: {
              start: marca.tiempoInicio,
              end: marca.tiempoFin
            },
            isEditable: true,
          }
          eventos.value.push(eventoCreado)
        })
        componentKey.value += 1
      }
    })
}

const config = {
  week: {
    startsOn: 'monday',
    nDays: 7,
  },
  month: {
    showTrailingAndLeadingDates: true,
  },
  defaultMode: 'week',
  isSilent: true,
  showCurrentTime: true,
}
</script>

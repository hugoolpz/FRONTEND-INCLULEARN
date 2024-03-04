<script setup>
import {Qalendar} from "qalendar";
import {today} from "@quasar/quasar-ui-qcalendar";
import {reactive, ref} from "vue";
import InputIconosComponent from "components/InputIconosComponent.vue";
import InputFechaHoraComponent from "components/InputFechaHoraComponent.vue";
import InputColorComponent from "components/InputColorComponent.vue";
import ChipCalendarioComponent from "components/ChipCalendarioComponent.vue";

const crearMarca = defineModel()
const fechaSeleccionada = ref(today())
const titulo = ref("")
const detalles = ref("")
const fechaInicio = ref('')
const fechaFin = ref('')
const colorEvento = ref("blue")
const componentKey = ref(0);
function alClickarIntervalo(data){
  console.log('alClickarIntervalo', data)
  crearMarca.value = true;
  fechaInicio.value = data.intervalStart
  fechaFin.value = data.intervalEnd
}

function cambiarColorEvento(color){
  colorEvento.value = color
}

function crearEvento() {
  const eventoCreado = {
    title: titulo.value,
    description: detalles.value,
    color: colorEvento,
    time: {
      start: fechaInicio.value,
      end: fechaFin.value
    },
    isEditable: true,
    disableResize: true,
  }

  eventos.push(eventoCreado)
  crearMarca.value = false
  componentKey.value += 1
}

const eventos = reactive([
  {
    title: "Advanced algebra",
    time: {start: today() + " 13:00", end: today() + " 13:35"},
    color: "brown",
    isEditable: true,
    id: "753944708f0f",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores assumenda corporis doloremque et expedita molestias necessitatibus quam quas temporibus veritatis. Deserunt excepturi illum nobis perferendis praesentium repudiandae saepe sapiente voluptatem!",
    disableResize: true,
  },
  {
    title: "Ralph on holiday",
    time: {start: "2024-03-06 10:15", end: "2024-03-06 10:40"},
    color: "green",
    isEditable: true,
    id: "5602b6f589fc",
    disableResize: true,
  }])

const config = {
  week: {
    // Takes the value 'sunday' or 'monday'
    // However, if startsOn is set to 'sunday' and nDays to 5, the week displayed will be Monday - Friday
    startsOn: 'monday',
    // Takes the values 5 or 7.
    nDays: 7,
  },
  month: {
    // Hide leading and trailing dates in the month view (defaults to true when not set)
    showTrailingAndLeadingDates: true,
  },
  dayIntervals: {
    length: 15, // Length in minutes of each interval. Accepts values 15, 30 and 60 (the latter is the default)
    height: 50, // The height of each interval
    displayClickableInterval: true, // Needs to be set explicitly to true, if you want to display clickable intervals
  },
  // Takes any valid locale that the browser understands. However, not all locales have been thorougly tested in Qalendar
  // If no locale is set, the preferred browser locale will be used
  // if not set, the mode defaults to 'week'. The three available options are 'month', 'week' and 'day'
  // Please note, that only day and month modes are available for the calendar in mobile-sized wrappers (~700px wide or less, depending on your root font-size)
  defaultMode: 'week',
  // The silent flag can be added, to disable the development warnings. This will also bring a slight performance boost
  isSilent: true,
  showCurrentTime: true, // Display a line indicating the current time
}
</script>

<template>
  <q-page>
    <Qalendar
      :key="componentKey"
      :events="eventos"
      :config="config"
      :selected-date="new Date(today())"
      @event-was-dragged=""
      @interval-was-clicked="alClickarIntervalo"
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
  </q-page>
</template>

<style>
@import "qalendar/dist/style.css";
</style>

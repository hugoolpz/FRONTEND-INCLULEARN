<template>
  <q-page>
    <div class="row justify-center">
      <div style="display: flex; width: 100%; height: 100%;">
        <q-calendar-day
          v-model="fechaSeleccionada"
          locale="es"
          view="week"
          animated
          bordered
          hoverable
          hour24-format
          :interval-minutes="15"
          :interval-start="24"
          :interval-count="68"
          :interval-height="28"
        >
          <template #day-body="{ scope: { timestamp, timeStartPos, timeDurationHeight } }">
            <template
              v-for="event in getEvents(timestamp.date)"
            >
              <div
                v-if="event.time !== undefined"
                class="my-event"
                :class="badgeClasses(event, 'body')"
                :style="badgeStyles(event, 'body', timeStartPos, timeDurationHeight)"
              >
                <div class="title q-calendar__ellipsis">
                  {{ event.title }}
                  <q-tooltip>{{ event.time + ' - ' + event.details }}</q-tooltip>
                </div>
              </div>
            </template>
          </template>
        </q-calendar-day>
      </div>
    </div>
  </q-page>
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
          <input-iconos-component v-model="iconoElegido"></input-iconos-component>
          <input-color-component v-model="colorEvento"></input-color-component>
          <div align="right">
            <q-btn label="Crear" type="submit" color="naranja"/>
            <q-btn label="Cancelar" type="reset" color="naranja-claro" flat class="q-ml-sm" v-close-popup/>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { QCalendarDay, today } from '@quasar/quasar-ui-qcalendar/src/index.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarDay.sass'
import {computed, reactive, ref} from "vue";
import {addToDate, isBetweenDates, parseTime, parseTimestamp} from "@quasar/quasar-ui-qcalendar";
import InputFechaHoraComponent from "components/InputFechaHoraComponent.vue";
import InputIconosComponent from "components/InputIconosComponent.vue";
import InputColorComponent from "components/InputColorComponent.vue";

const crearMarca = defineModel()
const fechaSeleccionada = ref(today())
const titulo = ref("")
const detalles = ref("")
const fechaInicio = ref('')
const fechaFin = ref('')
const iconoElegido = ref("")
const colorEvento = ref("")
const events = reactive([])

const eventsMap = computed(() => {
  const map = {}
  events.forEach(event => {
    if (!map[event.date]) {
      map[event.date] = []
    }
    map[event.date].push(event)
    if (event.days) {
      let timestamp = parseTimestamp(event.date)
      let days = event.days
      do {
        timestamp = addToDate(timestamp, { day: 1 })
        if (!map[timestamp.date]) {
          map[timestamp.date] = []
        }
        map[timestamp.date].push(event)
      } while (--days > 0)
    }
  })
  return map
})

function getEvents(dt) {
  // get all events for the specified date
  const eventsForDate = eventsMap.value[dt] || []

  if (eventsForDate.length === 1) {
    eventsForDate[0].side = 'full'
  } else if (eventsForDate.length === 2) {
    const startTime = addToDate(parseTimestamp(eventsForDate[0].date), { minute: parseTime(eventsForDate[0].time) })
    const endTime = addToDate(startTime, { minute: eventsForDate[0].duration })
    const startTime2 = addToDate(parseTimestamp(eventsForDate[1].date), { minute: parseTime(eventsForDate[1].time) })
    const endTime2 = addToDate(startTime2, { minute: eventsForDate[1].duration })
    if (isBetweenDates(startTime2, startTime, endTime, true) || isBetweenDates(endTime2, startTime, endTime, true)) {
      eventsForDate[0].side = 'left'
      eventsForDate[1].side = 'right'
    } else {
      eventsForDate[0].side = 'full'
      eventsForDate[1].side = 'full'
    }
  }

  return eventsForDate
}
function badgeClasses(event, type) {
  const isHeader = type === 'header'
  return {
    [`text-white`]: true,
    'full-width': !isHeader && (!event.side || event.side === 'full'),
    'left-side': !isHeader && event.side === 'left',
    'right-side': !isHeader && event.side === 'right',
    'rounded-border': true,
  }
}

function badgeStyles(event, type, timeStartPos = undefined, timeDurationHeight = undefined) {
  const s = {};
  if (timeStartPos && timeDurationHeight) {
    s.top = timeStartPos(event.time) + 'px';
    s.height = timeDurationHeight(event.duration) + 'px';
  }
  // Agrega el estilo de backgroundColor con el valor del color hexadecimal
  s.backgroundColor = event.bgcolor;
  s['align-items'] = 'flex-start';
  return s;
}


function crearEvento() {
  const fechaInicioSeparada = fechaInicio.value.split(' ');
  const fechaInicioSoloFecha = fechaInicioSeparada[0];
  const horaInicio = fechaInicioSeparada[1];

  const fechaInicioObj = new Date(fechaInicio.value);
  const fechaFinObj = new Date(fechaFin.value);
  const duracionMinutos = (fechaFinObj.getTime() - fechaInicioObj.getTime()) / (1000 * 60);

  if (!esColorHexadecimal(colorEvento.value)){
    colorEvento.value = '#1976D2'
  }

  const eventoCreado = {
    title: titulo.value,
    details: detalles.value,
    date: fechaInicioSoloFecha,
    time: horaInicio,
    duration: duracionMinutos,
    bgcolor: colorEvento.value,
    icon: iconoElegido.value
  }

  console.log(eventoCreado)
  events.push(eventoCreado)
  console.log(events)
}

function esColorHexadecimal(valor) {
  const regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return regex.test(valor);
}
</script>

<style lang="sass" scoped>
.my-event
  position: absolute
  font-size: 12px
  justify-content: center
  margin: 0 1px
  text-overflow: ellipsis
  overflow: hidden
  cursor: pointer

.title
  position: relative
  display: flex
  justify-content: center
  align-items: center
  height: 100%
</style>

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
              :key="event.id"
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
          @submit="onSubmit"
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
          <input-fecha-hora-component v-bind:fechaHora="fechaInicio" label="Fecha de inicio"></input-fecha-hora-component>
          <input-fecha-hora-component v-bind:fechaHora="fechaFin" label="Fecha de fin"></input-fecha-hora-component>
          <input-iconos-component v-bind:icono="iconoElegido"></input-iconos-component>
          <input-color-component v-bind:hex="colorEvento"></input-color-component>
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
import {computed, ref} from "vue";
import {addToDate, isBetweenDates, parseTime, parseTimestamp} from "@quasar/quasar-ui-qcalendar";
import InputFechaHoraComponent from "components/InputFechaHoraComponent.vue";
import InputIconosComponent from "components/InputIconosComponent.vue";
import InputColorComponent from "components/InputColorComponent.vue";

const crearMarca = defineModel()
const fechaSeleccionada = ref(today())
const titulo = ref("")
const detalles = ref("")
const fechaInicio = ref(today())
const fechaFin = ref(today())
const iconoElegido = ref("")
const colorEvento = ref("")
const events = [
  {
    id: 1,
    title: 'Meeting',
    details: 'Time to pitch my idea to the company',
    date: '2024-03-01',
    time: '09:00',
    duration: 120,
    bgcolor: 'red',
    icon: 'fas fa-handshake'
  },
  {
    id: 2,
    title: 'Lunch',
    details: 'Company is paying!',
    date: today(),
    time: '12:00',
    duration: 60,
    bgcolor: 'teal',
    icon: 'fas fa-hamburger'
  },
  {
    id: 3,
    title: 'Conference',
    details: 'Teaching Javascript 101',
    date: today(),
    time: '13:00',
    duration: 240,
    bgcolor: 'blue',
    icon: 'fas fa-chalkboard-teacher'
  },
  {
    id: 4,
    title: 'Girlfriend',
    details: 'Meet GF for dinner at Swanky Restaurant',
    date: today(),
    time: '19:00',
    duration: 180,
    bgcolor: 'teal-2',
    icon: 'fas fa-utensils'
  }
]

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
    [`text-white bg-${event.bgcolor}`]: true,
    'full-width': !isHeader && (!event.side || event.side === 'full'),
    'left-side': !isHeader && event.side === 'left',
    'right-side': !isHeader && event.side === 'right',
    'rounded-border': true
  }
}
function badgeStyles(event, type, timeStartPos = undefined, timeDurationHeight = undefined) {
  const s = {}
  if (timeStartPos && timeDurationHeight) {
    s.top = timeStartPos(event.time) + 'px'
    s.height = timeDurationHeight(event.duration) + 'px'
  }
  s['align-items'] = 'flex-start'
  return s
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

.text-white
  color: white

.bg-blue
  background: blue

.bg-green
  background: green

.bg-orange
  background: orange

.bg-red
  background: red

.bg-teal
  background: teal

.bg-grey
  background: grey

.bg-purple
  background: purple

.full-width
  left: 0
  width: calc(100% - 2px)

.left-side
  left: 0
  width: calc(50% - 3px)

.right-side
  left: 50%
  width: calc(50% - 3px)

.rounded-border
  border-radius: 2px
</style>

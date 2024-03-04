<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-naranja text-white">
      <q-toolbar>
        <q-toolbar-title>
          Tu calendario
        </q-toolbar-title>
        <q-btn flat round icon="fas fa-universal-access"
               @click="abrirMenuAccess()"/>
        <q-btn-dropdown v-model="idioma" stretch flat color="naranja" dropdown-icon="none">
          <template v-slot:label>
            <div class="row absolute-center">
              <q-icon name="fas fa-globe" color="white"/>
            </div>
          </template>
          <q-list>
            <q-scroll-area style="width: 160px; height: 112px;">
              <list-item-idioma titulo='Español' idioma="Español" :cod-idioma="locale" cod-bandera='es-ESP'
                                @al-clickar="cambiarIdioma('Español')"></list-item-idioma>
              <list-item-idioma titulo='English' idioma="Inglés" :cod-idioma="locale" cod-bandera='en-US'
                                @al-clickar="cambiarIdioma('Inglés')"></list-item-idioma>
              <list-item-idioma titulo='Français' idioma="Francés" :cod-idioma="locale" cod-bandera='fr-FR'
                                @al-clickar="cambiarIdioma('Francés')"></list-item-idioma>
              <list-item-idioma titulo='Deutsch' idioma="Alemán" :cod-idioma="locale" cod-bandera='de-DE'
                                @al-clickar="cambiarIdioma('Alemán')"></list-item-idioma>
              <list-item-idioma titulo='Italiano' idioma="Italiano" :cod-idioma="locale" cod-bandera='it-IT'
                                @al-clickar="cambiarIdioma('Italiano')"></list-item-idioma>
              <list-item-idioma titulo='中文' idioma="Chino" :cod-idioma="locale" cod-bandera='zh-CN'
                                @al-clickar="cambiarIdioma('Chino')"></list-item-idioma>
            </q-scroll-area>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import ListItemIdioma from "components/ListItemIdiomaComponent.vue";
import { today } from '@quasar/quasar-ui-qcalendar/src/index.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarMonth.sass'
import {ref} from "vue";
import {useI18n} from "vue-i18n";
import { DatePicker } from "qalendar";
const crearMarca = ref(false)
const menuCalendario = ref(true)
const fechaSeleccionada = ref(today())
const idioma = ref(false)
const { locale } = useI18n()
function cambiarIdioma(idioma) {
  locale.value = idioma
}
</script>

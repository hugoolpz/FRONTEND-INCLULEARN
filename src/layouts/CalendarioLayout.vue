<template>
  <div id="enfoque" :style="{ display: modoTDAH ? 'block' : 'none'}">
    <div id="linea-central"></div>
  </div>

  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-naranja text-white">
      <q-toolbar>
        <q-btn
          flat
          class="bg-white"
          color="naranja"
          icon="fas fa-home"
          aria-label="Inicio"
          @click="$router.push('/plataforma-educativa')"
        />
        <q-toolbar-title class="adventPro-semiBold text-uppercase">
          {{$t('tuCalendario')}}
        </q-toolbar-title>
        <q-btn-group class="bg-naranja text-white" flat>
          <q-btn aria-label="Crear un evento" class="bg-white text-naranja" flat
                 icon="fas fa-plus" @click="crearMarca = true"/>
          <q-btn aria-label="Accesibilidad" flat
                 icon="fas fa-universal-access" @click="abrirMenuAccess()"/>
          <q-btn-dropdown v-model="idioma" aria-label="Selector de idiomas" auto-close color="white" dropdown-icon="none"
                          flat>
            <template v-slot:label>
              <div class="row absolute-center">
                <q-icon class="boton-mundo" name="fas fa-globe" size="sm"/>
              </div>
            </template>
            <q-list>
              <q-scroll-area style="width: 160px; height: 112px;">
                <list-item-idioma :cod-idioma="locale" aria-label="Español" cod-bandera='es-ESP' idioma="Español"
                                  titulo='Español' @al-clickar="cambiarIdioma('Español')"></list-item-idioma>
                <list-item-idioma :cod-idioma="locale" aria-label="Inglés" cod-bandera='en-US' idioma="Inglés"
                                  titulo='English' @al-clickar="cambiarIdioma('Inglés')"></list-item-idioma>
                <list-item-idioma :cod-idioma="locale" aria-label="Francés" cod-bandera='fr-FR' idioma="Francés"
                                  titulo='Français' @al-clickar="cambiarIdioma('Francés')"></list-item-idioma>
                <list-item-idioma :cod-idioma="locale" aria-label="Alemán" cod-bandera='de-DE' idioma="Alemán"
                                  titulo='Deutsch' @al-clickar="cambiarIdioma('Alemán')"></list-item-idioma>
                <list-item-idioma :cod-idioma="locale" aria-label="Italiano" cod-bandera='it-IT' idioma="Italiano"
                                  titulo='Italiano' @al-clickar="cambiarIdioma('Italiano')"></list-item-idioma>
                <list-item-idioma :cod-idioma="locale" aria-label="Chino" cod-bandera='zh-CN' idioma="Chino"
                                  titulo='中文' @al-clickar="cambiarIdioma('Chino')"></list-item-idioma>
              </q-scroll-area>
            </q-list>
          </q-btn-dropdown>
        </q-btn-group>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="menuIzq" :width="400" :breakpoint="500" behavior="mobile">
      <q-scroll-area class="fit">
        <div style="height: 80px;" class="bg-morado text-h3 text-white flex flex-center alumniSans-regular text-center">{{$t('titAccess')}}</div>
        <q-list class="q-mt-sm" separator="">
          <list-item-access :titulo-ajuste="$t('titAjDislexia')" :subt-ajuste="$t('subtAjDislexia')" icono="fas fa-font"
                            @al-activar="ajusteDislexia()"></list-item-access>
          <list-item-access :titulo-ajuste="$t('titAjEpilepsia')" :subt-ajuste="$t('subtAjEpilepsia')"
                            icono="fas fa-eye-low-vision" @al-activar="ajusteEpilepsia"></list-item-access>
          <list-item-access :titulo-ajuste="$t('titAjTDAH')" :subt-ajuste="$t('subtAjTDAH')" icono="fas fa-arrows-to-eye"
                            @al-activar="modoTDAH = !modoTDAH"></list-item-access>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view v-model="crearMarca"/>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import ListItemIdioma from "components/ListItemIdiomaComponent.vue";
import { today } from '@quasar/quasar-ui-qcalendar/src/index.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarMonth.sass'
import {onMounted, ref, watch} from "vue";
import {useI18n} from "vue-i18n";
import { DatePicker } from "qalendar";
import ListItemAccess from "components/ListItemAccessComponent.vue";
document.body.style.overflow = "scroll"
const idioma = ref(false)
const menuIzq = ref(false)
const crearMarca = ref(false)
const { locale } = useI18n()

//Accesibilidad
const modoDislexia = ref()
const modoEpilepsia = ref()
const modoTDAH = ref();

//Funciones

function abrirMenuAccess() {
  menuIzq.value = !menuIzq.value
  console.log(menuIzq.value)
}

function ajusteDislexia() {
  modoDislexia.value = !modoDislexia.value;

  const elementosTexto = document.querySelectorAll('body :not(i)');

  if (modoDislexia.value) {
    elementosTexto.forEach(elemento => {
      elemento.classList.add('openDyslexic-regular');
    });
  } else {
    elementosTexto.forEach(elemento => {
      elemento.classList.remove('openDyslexic-regular');
    });
  }
}


function ajusteEpilepsia() {
  modoEpilepsia.value = !modoEpilepsia.value;

  if (modoEpilepsia.value) {
    document.querySelector('html').classList.add('filtro-epilepsia');
  } else {
    document.querySelector('html').classList.remove('filtro-epilepsia');
  }
}

watch(modoTDAH, (nuevoValor) => {
  const enfoqueElemento = document.getElementById('enfoque');
  enfoqueElemento.style.display = nuevoValor ? 'block' : 'none';
  document.addEventListener('mousemove', moverEnfoque);
});

function moverEnfoque(event) {
  const enfoqueElemento = document.getElementById('enfoque');
  enfoqueElemento.style.top = (event.pageY - enfoqueElemento.offsetHeight / 30) + 'px';
}

function cambiarIdioma(idioma) {
  locale.value = idioma
}

</script>

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
          :icon="$route.params.grupo ? 'fas fa-arrow-left' : 'fas fa-home'"
          @click="$route.params.grupo ? $router.push('/tus-clases') : $router.push('/plataforma-educativa')"
        />
        <q-toolbar-title class="adventPro-semiBold text-uppercase">
          TUS CLASES
        </q-toolbar-title>
        <q-btn-group flat class="bg-naranja text-white">
          <q-btn flat class="bg-white text-naranja" icon="fas fa-plus" @click="nuevoGrupo = true"
                 v-show="$route.params.grupo === ''"/>
          <q-btn flat icon="fas fa-comments" @click="$router.push('/tus-chats')"/>
          <q-btn flat icon="fas fa-universal-access"
                 @click="abrirMenuAccess()"/>
          <q-btn-dropdown v-model="idioma" flat color="white" dropdown-icon="none" auto-close>
            <template v-slot:label>
              <div class="row absolute-center">
                <q-icon size="sm" name="fas fa-globe" class="boton-mundo"/>
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
        </q-btn-group>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="menuIzq" :width="400" :breakpoint="500" behavior="mobile">
      <q-scroll-area class="fit">
        <div style="height: 80px;" class="bg-morado text-h3 text-white flex flex-center alumniSans-regular">{{$t('titAccess')}}</div>
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
      <router-view v-model="nuevoGrupo"/>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import ListItemIdioma from "components/ListItemIdiomaComponent.vue";
import { today } from '@quasar/quasar-ui-qcalendar/src/index.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarMonth.sass'
import {ref, watch} from "vue";
import {useI18n} from "vue-i18n";
import { DatePicker } from "qalendar";
import ListItemAccess from "components/ListItemAccessComponent.vue";
document.body.style.overflow = "scroll"
const idioma = ref(false)
const menuIzq = ref(false)
const { locale } = useI18n()

const nuevoGrupo = ref(false);

//Accesibilidad
const modoDislexia = ref(false)
const modoEpilepsia = ref(false)
const modoTDAH = ref(false);
function abrirMenuAccess() {
  menuIzq.value = !menuIzq.value
  console.log(menuIzq.value)
}

function ajusteDislexia() {
  modoDislexia.value = !modoDislexia.value;

  const elementosTexto = document.querySelectorAll('body *');

  if (modoDislexia.value) {
    elementosTexto.forEach(elemento => {
      elemento.classList.add('openDyslexic-regular');
    });
  } else {
    elementosTexto.forEach(elemento => {
      elemento.classList.remove('openDyslexic-regular');
    });
  }

  window.localStorage.setItem("dislexia", modoDislexia.value)
}

function ajusteEpilepsia() {
  modoEpilepsia.value = !modoEpilepsia.value;

  if (modoEpilepsia.value) {
    document.querySelector('html').classList.add('filtro-epilepsia');
  } else {
    document.querySelector('html').classList.remove('filtro-epilepsia');
  }

  window.localStorage.setItem("epilepsia", modoEpilepsia.value)
}

watch(modoTDAH, (nuevoValor) => {
  const enfoqueElemento = document.getElementById('enfoque');
  enfoqueElemento.style.display = nuevoValor ? 'block' : 'none';
  document.addEventListener('mousemove', moverEnfoque);
  window.localStorage.setItem("tdah", nuevoValor)
});

function moverEnfoque(event) {
  const enfoqueElemento = document.getElementById('enfoque');
  enfoqueElemento.style.top = (event.pageY - enfoqueElemento.offsetHeight / 30) + 'px';
}

function cambiarIdioma(idioma) {
  locale.value = idioma
}
</script>

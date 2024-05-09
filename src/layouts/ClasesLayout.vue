<template>
  <div id="enfoque" :style="{ display: modoTDAH ? 'block' : 'none'}">
    <div id="linea-central"></div>
  </div>

  <q-layout view="hHh lpR fFf">

    <q-header class="bg-naranja text-white" elevated>
      <q-toolbar>
        <q-btn
          :icon="$route.params.grupo ? 'fas fa-arrow-left' : 'fas fa-home'"
          aria-label="Atrás"
          class="bg-white"
          color="naranja"
          flat
          @click="$route.params.grupo ? $router.push('/tus-clases') : $router.push('/plataforma-educativa')"
        />
        <q-toolbar-title class="adventPro-semiBold text-uppercase">
          {{$t('tusClases')}}
        </q-toolbar-title>
        <q-btn-group class="bg-naranja text-white" flat>
          <q-btn v-show="$route.params.grupo === ''" aria-label="Crear o unirse a un grupo" class="bg-white text-naranja" flat
                 icon="fas fa-plus" @click="nuevoGrupo = true"/>
          <q-btn aria-label="Tus chats" flat icon="fas fa-comments" @click="$router.push('/tus-chats')"/>
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

    <q-drawer v-model="menuIzq" :breakpoint="500" :width="400" behavior="mobile">
      <q-scroll-area class="fit">
        <div class="bg-morado text-h3 text-white flex flex-center alumniSans-regular" style="height: 80px;">
          {{ $t('titAccess') }}
        </div>
        <q-list class="q-mt-sm" separator="">
          <list-item-access :subt-ajuste="$t('subtAjDislexia')" :titulo-ajuste="$t('titAjDislexia')" icono="fas fa-font"
                            @al-activar="ajusteDislexia()"></list-item-access>
          <list-item-access :subt-ajuste="$t('subtAjEpilepsia')" :titulo-ajuste="$t('titAjEpilepsia')"
                            icono="fas fa-eye-low-vision" @al-activar="ajusteEpilepsia"></list-item-access>
          <list-item-access :subt-ajuste="$t('subtAjTDAH')" :titulo-ajuste="$t('titAjTDAH')"
                            icono="fas fa-arrows-to-eye"
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
import {today} from '@quasar/quasar-ui-qcalendar/src/index.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarMonth.sass'
import {onMounted, ref, watch} from "vue";
import {useI18n} from "vue-i18n";
import {DatePicker} from "qalendar";
import ListItemAccess from "components/ListItemAccessComponent.vue";

document.body.style.overflow = "scroll"
const idioma = ref(false)
const menuIzq = ref(false)
const {locale} = useI18n()

const nuevoGrupo = ref(false);

//Accesibilidad
const modoDislexia = ref(window.localStorage.getItem("dislexia"))
const modoEpilepsia = ref(window.localStorage.getItem("epilepsia"))
const modoTDAH = ref(window.localStorage.getItem("tdah"));

//Funciones

onMounted(() => {
  comprobarAjustesActivos()
})

function comprobarAjustesActivos() {
  let lS = window.localStorage

  if (lS.getItem("dislexia")) {
    ajusteDislexia()
  }

  if (lS.getItem("epilepsia")) {
    ajusteEpilepsia()
  }

  if (lS.getItem("tdah")) {
    modoTDAH.value = true
  }
}

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

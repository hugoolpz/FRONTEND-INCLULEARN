<template>
  <q-layout>
    <div id="enfoque" :style="{ display: modoTDAH ? 'block' : 'none'}">
      <div id="linea-central"></div>
    </div>

    <div class="absolute-top-right q-pa-md" style="z-index: 1;">
      <q-btn size="lg" padding="5px" flat round color="naranja" icon="fas fa-universal-access"
        @click="abrirMenuAccess()" />
      <q-btn-dropdown v-model="idioma" flat color="naranja" dropdown-icon="none" auto-close>
        <template v-slot:label>
          <div class="row absolute-center">
            <q-icon size="md" name="fas fa-globe" />
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
    </div>

    <q-drawer v-model="menuIzq" :width="400" :breakpoint="500" behavior="mobile">
      <q-scroll-area class="fit">
        <div style="height: 80px;" class="bg-morado text-h3 text-white flex flex-center alumniSans-regular">Ajustes de accesibilidad</div>
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
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup>
import ListItemAccess from 'src/components/ListItemAccessComponent.vue';
import ListItemIdioma from 'src/components/ListItemIdiomaComponent.vue';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const idioma = ref(false)
const { locale } = useI18n()
const menuIzq = ref(false)

//Accesibilidad
const modoDislexia = ref(false)
const modoEpilepsia = ref(false)
const modoTDAH = ref(false);

//Funciones
function cambiarIdioma(idioma) {
  locale.value = idioma
}

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

</script>

<template>
  <q-layout>
    <div id="enfoque" :style="{ display: modoTDAH ? 'block' : 'none'}">
      <div id="linea-central"></div>
    </div>

    <div class="absolute-top-right q-pa-md" style="z-index: 2;">
      <q-btn size="md" padding="5px" flat round color="naranja" icon="fas fa-universal-access"
             @click="abrirMenuAccess()" class="boton-access" aria-label="Accesibilidad"/>
      <q-btn-dropdown v-model="idioma" flat color="naranja" dropdown-icon="none" aria-label="Selector de idiomas" auto-close>
        <template v-slot:label>
          <div class="row absolute-center">
            <q-icon size="sm" name="fas fa-globe" class="boton-mundo" aria-label="Selector de idiomas"/>
          </div>
        </template>
        <q-list>
          <q-scroll-area style="width: 160px; height: 112px;">
            <list-item-idioma titulo='Español' idioma="Español" :cod-idioma="locale" cod-bandera='es-ESP'
                              @al-clickar="cambiarIdioma('Español')" aria-label="Español"></list-item-idioma>
            <list-item-idioma titulo='English' idioma="Inglés" :cod-idioma="locale" cod-bandera='en-US'
                              @al-clickar="cambiarIdioma('Inglés')" aria-label="Inglés"></list-item-idioma>
            <list-item-idioma titulo='Français' idioma="Francés" :cod-idioma="locale" cod-bandera='fr-FR'
                              @al-clickar="cambiarIdioma('Francés')" aria-label="Francés"></list-item-idioma>
            <list-item-idioma titulo='Deutsch' idioma="Alemán" :cod-idioma="locale" cod-bandera='de-DE'
                              @al-clickar="cambiarIdioma('Alemán')" aria-label="Alemán"></list-item-idioma>
            <list-item-idioma titulo='Italiano' idioma="Italiano" :cod-idioma="locale" cod-bandera='it-IT'
                              @al-clickar="cambiarIdioma('Italiano')" aria-label="Italiano"></list-item-idioma>
            <list-item-idioma titulo='中文' idioma="Chino" :cod-idioma="locale" cod-bandera='zh-CN'
                              @al-clickar="cambiarIdioma('Chino')" aria-label="Chino"></list-item-idioma>
          </q-scroll-area>
        </q-list>
      </q-btn-dropdown>
    </div>

    <q-drawer v-model="menuIzq" :width="400" :breakpoint="500" behavior="mobile">
      <q-scroll-area class="fit">
        <div style="height: 80px;" class="bg-morado text-h4 text-white flex flex-center alumniSans-regular text-center">{{$t('titAccess')}}</div>
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
import {onMounted, ref, watch} from 'vue';
import { useI18n } from 'vue-i18n';

window.localStorage.clear()
//document.body.style.overflow = "hidden"



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
</script>

<style scoped>
@media screen and (max-width: 576px) {
  .boton-access {
    display: none;
  }

  .boton-mundo {
    color: white;
  }
}

/* Estilos para pantallas medianas y grandes */
@media screen and (min-width: 577px) {
  .boton-access {
  }

  .boton-mundo {
  }
}
</style>

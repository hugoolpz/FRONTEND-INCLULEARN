<template>
  <q-page padding>
    <div class="column flex-center">
      <div class="row flex-center q-gutter-xl">
        <div class="col-auto col-md-auto col-sm-auto">
          <q-card class="tarjeta-funcion-plat cursor-pointer bg-clases" v-ripple @click="$router.push({ path: '/tus-clases' })" flat>
            <q-card-section>

            </q-card-section>
            <q-card-section class="text-h3 text-naranja adventPro-semiBold text-left absolute-bottom q-pa-sm">
              <div style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.2);">{{$t('tituloClases')}}</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-auto col-md-auto col-sm-auto">
          <q-card class="tarjeta-funcion-plat bg-image-logo cursor-pointer bg-calendario" v-ripple @click="$router.push({ path: '/tu-calendario' })" flat>
            <q-card-section>

            </q-card-section>
            <q-card-section class="text-h3 text-morado adventPro-semiBold text-left absolute-bottom q-pa-sm">
              <div style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.2);">{{$t('tituloCalendario')}}</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-auto col-md-auto col-sm-auto">
          <q-card class="tarjeta-funcion-plat bg-image-logo cursor-pointer bg-archivos" v-ripple @click="$router.push({ path: '/tu-almacenamiento' })" flat>
            <q-card-section>

            </q-card-section>
            <q-card-section class="text-h3 text-azul-oscuro adventPro-semiBold text-left absolute-bottom q-pa-sm">
              <div style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.2);">{{$t('tituloArchivos')}}</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import {ref} from 'vue'

const grupos = ref(false)
</script>

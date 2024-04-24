<template>
  <q-page padding>
    <div class="column flex-center">
      <div class="row flex-center q-gutter-xl">
        <div class="col-auto col-md-auto col-sm-auto">
          <q-card class="tarjeta-funcion-plat cursor-pointer bg-clases" aria-label="Módulo de clases" tabindex="0" v-ripple @click="$router.push({ path: '/tus-clases' })" flat>
            <q-card-section>

            </q-card-section>
            <q-card-section class="text-h3 text-naranja adventPro-semiBold text-left absolute-bottom q-pa-sm">
              <div style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.2);">{{$t('tituloClases')}}</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-auto col-md-auto col-sm-auto">
          <q-card class="tarjeta-funcion-plat bg-image-logo cursor-pointer bg-calendario" aria-label="Módulo de calendario" tabindex="0" v-ripple @click="$router.push({ path: '/tu-calendario' })" flat>
            <q-card-section>

            </q-card-section>
            <q-card-section class="text-h3 text-morado adventPro-semiBold text-left absolute-bottom q-pa-sm">
              <div style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.2);">{{$t('tituloCalendario')}}</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-auto col-md-auto col-sm-auto">
          <q-card class="tarjeta-funcion-plat bg-image-logo cursor-pointer bg-archivos" aria-label="Módulo de archivos" tabindex="0" v-ripple @click="$router.push({ path: '/tus-archivos' })" flat>
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
import {onMounted, ref} from 'vue'
import api from "boot/httpSingleton";
import {useRouter} from "vue-router";
import {useQuasar} from "quasar";

const localStorage = window.localStorage
let infoUsuario = null

if (localStorage.infoUsuario){
  infoUsuario = JSON.parse(localStorage.infoUsuario)
}

const urlApi = api

const router = useRouter()

const $q = useQuasar()

onMounted(() => {
  comprobarSesion()
})

async function comprobarSesion() {
  if (localStorage.infoUsuario){
    await fetch(`${urlApi}/usuarios/${infoUsuario._id}`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(respuesta => respuesta.json())
      .then(datos => {
        if (!datos.datos) {
          $q.notify({
            message: "Este usuario no existe",
            color: "negative",
            position: "top",
            timeout: 1000,
            progress: true,
            icon: "fas fa-xmark"
          });
          router.push({path: "/"})
        }
      })
  } else {
    $q.notify({
      message: "No tienes permisos para entrar ahí",
      color: "negative",
      position: "top",
      timeout: 1000,
      progress: true,
      icon: "fas fa-xmark"
    });
    router.push({path: "/"})
  }
}
</script>

<template>
  <div class="q-mt-xl q-pt-xl">
    <div align="center" class="text-h4 text-azul-oscuro adventPro-semiBold text-uppercase">
      {{ $t('etqInic2') }}
    </div>
    <div class="column flex-center">
      <div class="row formInic q-mt-md">
        <div class="col">
          <q-form
            class="q-gutter-md row flex-center"
            @reset="onReset"
            @submit="iniciarSesion">
            <div class="col-12 flex flex-center">
              <q-input v-model="correo" :error="correoErroneo" :label="$t('labCorreo')" class="alumniSans-regular text-body1" color="morado"
                       hide-bottom-space
                       outlined rounded style="width: 75%" type="text"/>
            </div>
            <div class="col-12 flex flex-center">
              <q-input v-model="contra" :error="contraErronea" :label="$t('labContra')" class="alumniSans-regular text-body1" color="morado"
                       hide-bottom-space
                       outlined rounded style="width: 75%" type="password"/>
            </div>
            <GoogleLogin :callback="callback">
              <div align="center"
                   class="text-h6 text-azul-oscuro adventPro-regular cursor-pointer hover-underline-animation">
                {{ $t('etqInicGoogle') }}
                <q-icon name="img:src\assets\icons\google.svg" size="25px"/>
              </div>
            </GoogleLogin>
            <div class="col-10 flex flex-center">
              <q-btn :label="$t('etqInic1')" :loading="cargando" class="adventPro-regular text-weight-bold" color="morado"
                     rounded size="lg"
                     style="width: 12em;letter-spacing: 0.10rem;" type="submit"/>
            </div>
            <div align="center" class="text-h6 text-azul-oscuro adventPro-regular">
              {{ $t('etqHaciaReg') }}
              <span class="cursor-pointer hover-underline-animation text-uppercase" @click="$emit('abrirRegistro')">
                    {{ $t('etqReg2') }}
                </span>
            </div>
          </q-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import api from 'src/boot/httpSingleton';
import {useRouter} from 'vue-router';
import {useQuasar, QSpinnerGears} from 'quasar'
import {GoogleLogin, decodeCredential} from "vue3-google-login";
import { useI18n } from "vue-i18n"
const { t } = useI18n()


//Variables form
const correo = ref("")
const contra = ref("")
const correoErroneo = ref(false)
const contraErronea = ref(false)
const cargando = ref(false)

//URL de la API REST
const urlApi = api

//Notify
const $q = useQuasar()

//Emits
const emits = defineEmits(['abrirRegistro'])

//Router
const router = useRouter()

//Local storage
const localStorage = window.localStorage

const callback = (response) => {
  const datosGoogle = decodeCredential(response.credential)
  console.log(datosGoogle.email)
  iniciarSesionConGoogle(datosGoogle)
}

//Funciones
async function iniciarSesionConGoogle(datosGoogle) {
  cargando.value = true
  fetch(`${urlApi}/usuarios`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "nombre": datosGoogle.given_name,
      "apellidos": datosGoogle.family_name,
      "correo": datosGoogle.email,
      "rol": "Alumno",
      "url_foto": "./"
    })
  })
    .then(respuesta => respuesta.json())
    .then(datos => {
      console.log(datos)
      if (!datos.exito) {
        $q.notify({
          message: "¡Hubo un error al intentar iniciar sesión con Google!",
          color: "negative",
          position: "top",
          timeout: 500,
          progress: true,
          icon: "fas fa-circle-exclamation",
        });
        cargando.value = false
      } else {
        $q.notify({
          message: t('haciaPlat'),
          color: "morado",
          position: "top",
          timeout: 1000,
          progress: true,
          spinner: QSpinnerGears,
        });

        localStorage.clear()
        localStorage.setItem("infoUsuario", JSON.parse(datos.usuario))
        localStorage.setItem("tokenPrivado", datos.token)
        cargando.value = false
        setTimeout(function () {
          router.push({path: "/plataforma-educativa"})
        }, 2000)
      }
    })
}

async function iniciarSesion() {
  correoErroneo.value = false
  contraErronea.value = false
  cargando.value = true
  fetch(`${urlApi}/auth`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "correo": correo.value,
      "contra": contra.value,
    })
  })
    .then(respuesta => respuesta.json())
    .then(datos => {
      if (!datos.exito) {
        if (datos.error == "Contraseña incorrecta") {
          contraErronea.value = true
        } else {
          correoErroneo.value = true
        }
        cargando.value = false
      } else {
        $q.notify({
          message: t('haciaPlat'),
          color: "morado",
          position: "top",
          timeout: 1000,
          progress: true,
          spinner: QSpinnerGears,
        });

        localStorage.clear()
        localStorage.setItem("infoUsuario", JSON.stringify(datos.usuario))
        localStorage.setItem("tokenPrivado", datos.token)

        setTimeout(function () {
          router.push({path: "/plataforma-educativa"})
        }, 2000)
      }
    })
}
</script>

<style scoped>
@media screen and (max-width: 576px) {
  .formInic {
    width: 100%;
  }
}

/* Estilos para pantallas medianas y grandes */
@media screen and (min-width: 577px) {
  .formInic {
    width: 50%;
  }
}
</style>

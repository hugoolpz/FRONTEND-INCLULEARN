<template>
    <div class="row flex-center q-mt-xl q-pt-xl" key="form">
        <q-form @submit="iniciarSesion" class="q-gutter-y-md">
            <div class="text-h4 text-azul-oscuro adventPro-semiBold text-uppercase" align="center">
                {{ $t('etqInic1') }}
            </div>
            <div class="row q-gutter-x-md">
                <div class="col-2 flex flex-center">
                    <q-avatar size="130px">
                        <img class="rounded-borders" style="border: 1px solid #824b86;" alt="foto de perfil"
                            src="https://med.virginia.edu/diabetes-technology/wp-content/uploads/sites/265/2020/10/Blank-Avatar.png" />
                    </q-avatar>
                </div>
                <div class="col-6 q-gutter-md">
                    <q-input hide-bottom-space outlined rounded color="morado" class="alumniSans-regular text-body1" v-model="correo"
                        type="text" :label="$t('labCorreo')" style="width: 425px" :error="correoErroneo" />
                    <q-input hide-bottom-space outlined rounded color="morado" class="alumniSans-regular text-body1" v-model="contra"
                        type="password" :label="$t('labContra')" style="width: 425px" :error="contraErronea" />
                </div>
            </div>
            <div class="column flex-center">
                <GoogleLogin :callback="callback">
                    <div class="text-h6 text-azul-oscuro adventPro-regular cursor-pointer hover-underline-animation"
                        align="center">
                        {{ $t('etqInicGoogle') }}
                        <q-icon name="img:src\assets\icons\google.svg" size="25px" />
                    </div>
                </GoogleLogin>
                <q-space class="q-mt-md" />
                <q-btn :label="$t('etqInic1')" rounded type="submit" size="lg" style="width: 300px; letter-spacing: 0.10rem;" color="morado"
                    class="adventPro-regular text-weight-bold" />
            </div>
            <div class="text-h6 text-azul-oscuro adventPro-regular q-mt-md" align="center">
                {{ $t('etqHaciaReg') }}
                <span class="cursor-pointer hover-underline-animation text-uppercase" @click="$emit('abrirRegistro')">
                    {{ $t('etqReg2') }}
                </span>
            </div>
        </q-form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import api from 'src/boot/httpSingleton';
import { useRouter } from 'vue-router';
import { useQuasar, QSpinnerGears } from 'quasar'
import { GoogleLogin, decodeCredential } from "vue3-google-login";


//Variables form
const correo = ref("")
const contra = ref("")
const correoErroneo = ref(false)
const contraErronea = ref(false)

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
function iniciarSesionConGoogle(datosGoogle) {
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
            } else {
                $q.notify({
                    message: "Llevándote hacia la plataforma educativa...",
                    color: "morado",
                    position: "top",
                    timeout: 1000,
                    progress: true,
                    spinner: QSpinnerGears,
                });

                localStorage.clear()
                localStorage.setItem("infoUsuario", JSON.parse(datos.usuario))
                localStorage.setItem("tokenPrivado", datos.token)

                setTimeout(function () {
                    router.push({ path: "/plataformaEducativa" })
                }, 2000)
            }
        })
}

function iniciarSesion() {
    correoErroneo.value = false
    contraErronea.value = false
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
            } else {
                $q.notify({
                    message: "Llevándote hacia la plataforma educativa...",
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
                    router.push({ path: "/plataformaEducativa" })
                }, 2000)
            }
        })
}
</script>

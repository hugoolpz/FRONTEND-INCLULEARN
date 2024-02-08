<template>
    <div class="row flex-center q-mt-xl q-pt-xl" key="form">
        <q-form @submit="iniciarSesion" class="q-gutter-y-md">
            <div class="text-h4 text-azul-oscuro adventPro-semiBold" align="center">
                INICIA SESIÓN
            </div>
            <div class="row q-gutter-x-md">
                <div class="col-2 flex flex-center">
                    <q-avatar size="130px">
                        <img class="rounded-borders" style="border: 1px solid #824b86;" alt="foto de perfil"
                            src="https://med.virginia.edu/diabetes-technology/wp-content/uploads/sites/265/2020/10/Blank-Avatar.png" />
                    </q-avatar>
                </div>
                <div class="col-6 q-gutter-md">
                    <q-input outlined rounded color="morado" class="adventPro-regular" v-model="correo" type="text"
                        label="Correo" style="width: 425px" />
                    <q-input outlined rounded color="morado" class="adventPro-regular" v-model="contra" type="password"
                        label="Contraseña" style="width: 425px" />
                </div>
            </div>
            <q-space class="q-mt-md" />
            <div class="column flex-center">
                <GoogleLogin :callback="callback" prompt />
                <q-space class="q-mt-md" />
                <q-btn label="INICIAR SESIÓN" rounded type="submit" size="lg" style="width: 300px" color="morado"
                    class="adventPro-regular text-weight-bold" />
            </div>
            <div class="text-h6 text-azul-oscuro adventPro-regular q-mt-md" align="center">
                ¿No tienes cuenta?
                <span class="cursor-pointer" @click="$emit('abrirRegistro')">
                    REGÍSTRATE
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
    correo.value = datosGoogle.email
}

//Funciones
function iniciarSesion() {
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
                $q.notify({
                    message: "¡Hubo un error al intentar iniciar sesión!",
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

                $q.notify({
                    message: "¡Has iniciado sesión correctamente!",
                    color: "positive",
                    position: "top",
                    timeout: 500,
                    progress: true,
                    icon: "fas fa-circle-check",
                });

                localStorage.clear()
                localStorage.setItem("infoUsuario", datos.usuario)
                localStorage.setItem("tokenPrivado", datos.token)

                setTimeout(function () {
                    router.push({ path: "/plataformaEducativa" })
                }, 2000)
            }
        })
}
</script>
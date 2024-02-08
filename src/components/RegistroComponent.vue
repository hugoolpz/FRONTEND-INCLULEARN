<template>
    <div class="row flex-center q-mt-md" key="form">
        <q-form @submit="registrarse" class="q-gutter-y-md">
            <div class="text-h4 text-azul-oscuro adventPro-semiBold" align="center">
                REGÍSTRATE
            </div>
            <div class="row flex-center">
                <q-input outlined rounded color="morado" class="adventPro-regular" v-model="nombre" type="text"
                    label="Nombre" style="width: 200px" />
                <q-space class="q-mx-sm" />
                <q-input outlined rounded color="morado" class="adventPro-regular" v-model="apellidos" type="text"
                    label="Apellidos" style="width: 360px" />
            </div>
            <q-input outlined rounded color="morado" class="adventPro-regular" v-model="correo" type="text" label="Correo"
                style="max-width: 600px" />
            <div class="row">
                <div class="col-3 flex flex-start">
                    <q-avatar size="130px">
                        <img style="border: 1px solid #824b86;" alt="foto de perfil"
                            src="https://med.virginia.edu/diabetes-technology/wp-content/uploads/sites/265/2020/10/Blank-Avatar.png" />
                    </q-avatar>
                </div>
                <div class="col q-gutter-md">
                    <div class="row">
                        <q-file outlined rounded color="morado" class="adventPro-regular" v-model="fotoPerfil" type="file"
                            label="Foto de perfil" style="width: 231px" @update:model-value="console.log(fotoPerfil)">
                            <template v-slot:append>
                                <q-icon name="fas fa-file-arrow-up" class="cursor-pointer" />
                            </template>
                        </q-file>
                        <q-space class="q-mx-sm" />
                        <q-input outlined rounded v-model="fecha" class="adventPro-regular" type="text"
                            label="Fecha de nacimiento" color="morado" style="width: 184px">
                            <template v-slot:append>
                                <q-icon name="fas fa-calendar-days" class="cursor-pointer">
                                    <q-popup-proxy cover transition-show="scale" transition-hide="scale"
                                        @show="ponerFechaActual()">
                                        <q-date v-model="fechaInput" color="morado"
                                            @update:model-value="quitarCeroDelMes(fechaInput)">
                                            <div class="row items-center justify-end">
                                                <q-btn v-close-popup label="Cerrar" color="secundario" flat />
                                            </div>
                                        </q-date>
                                    </q-popup-proxy>
                                </q-icon>
                            </template>
                        </q-input>
                    </div>
                    <q-input outlined rounded color="morado" class="adventPro-regular" v-model="contra" type="password"
                        label="Contraseña" />
                </div>
            </div>
            <q-space class="q-mt-md" />
            <div class="column flex-center">
                <GoogleLogin :callback="callback" prompt />
                <q-space class="q-mt-md" />
                <q-btn label="CREAR CUENTA" rounded type="submit" size="lg" style="width: 300px" color="morado"
                    class="adventPro-regular text-weight-bold" />
            </div>
            <div class="text-h6 text-azul-oscuro adventPro-regular q-mt-md" align="center">
                ¿Ya tienes cuenta?
                <span class="cursor-pointer" @click="$emit('abrirInicioSesion')">
                    INICIA SESIÓN
                </span>
            </div>
        </q-form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import api from 'src/boot/httpSingleton';
import { useQuasar } from 'quasar'
import { GoogleLogin, decodeCredential } from "vue3-google-login";

//Variables form
const nombre = ref("")
const apellidos = ref("")
const correo = ref("")
const fotoPerfil = ref()
const fecha = ref("")
const fechaInput = ref("")
const contra = ref("")

//URL de la API REST
const urlApi = api

//Notify
const $q = useQuasar()

//Emits
const emits = defineEmits(['abrirInicioSesion'])

const callback = (response) => {
    const datosGoogle = decodeCredential(response.credential)
    nombre.value = datosGoogle.given_name
    apellidos.value = datosGoogle.family_name
    correo.value = datosGoogle.email
}

//Funciones
function registrarse() {
    fetch(`${urlApi}/usuarios`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "nombre": nombre.value,
            "apellidos": apellidos.value,
            "correo": correo.value,
            "contra": contra.value,
            "rol": "Alumno",
            "fecha": fecha.value,
            "url_foto": "./"
        })
    })
        .then(respuesta => respuesta.json())
        .then(datos => {
            if (!datos.exito) {
                $q.notify({
                    message: "¡Hubo un error al intentar registrarte!",
                    color: "negative",
                    position: "top",
                    timeout: 500,
                    progress: true,
                    icon: "fas fa-circle-exclamation",
                });
            } else {
                $q.notify({
                    message: "¡Te has registrado correctamente!",
                    color: "positive",
                    position: "top",
                    timeout: 500,
                    progress: true,
                    icon: "fas fa-circle-check",
                });

                emits('abrirInicioSesion')
            }
        })
}

function ponerFechaActual() {
    let fechaNueva = new Date();
    let dia = fechaNueva.getDate();
    let mes = fechaNueva.getMonth() + 1;
    let ano = fechaNueva.getFullYear();
    let fechaActual = `${dia}/${mes}/${ano}`;
    fechaInput.value = fechaActual
}

function quitarCeroDelMes(fechaMandada) {
    let partes = fechaMandada.split('/');
    let ano = partes[0];
    let mes = partes[1];
    let dia = partes[2];

    mes = mes.startsWith('0') ? mes.substring(1) : mes;

    let fechaSinCero = `${dia}/${mes}/${ano}`;
    fecha.value = fechaSinCero
}
</script>
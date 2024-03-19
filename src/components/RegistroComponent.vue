<template>
  <div class="q-mt-lg">
    <div align="center" class="text-h4 text-azul-oscuro adventPro-semiBold text-uppercase">
      {{ $t('etqReg2') }}
    </div>
    <div class="column flex-center">
      <div class="row flex-center formReg q-mt-md">
        <div class="col">
          <q-form
            class="q-gutter-md row flex-center"
            @reset="onReset"
            @submit="registrarse">
            <div class="col-4">
              <q-input v-model="nombre" :label="$t('labNombre')" class="alumniSans-regular text-body1" color="morado" outlined
                       rounded
                       type="text"/>
            </div>
            <div class="col-6">
              <q-input v-model="apellidos" :label="$t('labApellidos')" class="alumniSans-regular text-body1" color="morado" outlined
                       rounded
                       type="text"/>
            </div>
            <div class="col-10">
              <q-input v-model="correo" :label="$t('labCorreo')" class="alumniSans-regular text-body1" color="morado" outlined
                       rounded
                       type="text"/>
            </div>
            <div class="col-2 q-mr-lg">
              <q-avatar class="avatar">
                <img alt="foto de perfil" src="https://med.virginia.edu/diabetes-technology/wp-content/uploads/sites/265/2020/10/Blank-Avatar.png"
                     style="border: 1px solid #824b86;"/>
              </q-avatar>
            </div>
            <div class="col-7">
              <q-file v-model="fotoPerfil" :label="$t('labFoto')" accept=".jpg,.png,.gif" class="alumniSans-regular text-body1" color="morado"
                      outlined rounded type="file"
                      use-chips @rejected="alRechazar" @update:model-value="console.log(fotoPerfil)">
                <template v-slot:append>
                  <q-icon class="cursor-pointer" name="fas fa-file-arrow-up"/>
                </template>
              </q-file>
              <q-space class="q-mt-md"></q-space>
              <q-input v-model="fecha" :label="$t('labFecha')" class="alumniSans-regular text-body1" color="morado" outlined
                       rounded type="text">
                <template v-slot:append>
                  <q-icon class="cursor-pointer" name="fas fa-calendar-days">
                    <q-popup-proxy cover transition-hide="scale" transition-show="scale"
                                   @show="ponerFechaActual()">
                      <q-date v-model="fechaInput" color="morado"
                              @update:model-value="quitarCeroDelMes(fechaInput)">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup color="morado" flat label="Cerrar"/>
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-10">
              <q-input v-model="contra" :label="$t('labContra')" class="alumniSans-regular text-body1" color="morado" outlined
                       rounded
                       type="password"/>
            </div>
            <div class="col-auto">
              <div align="center" class="text-h6 text-azul-oscuro adventPro-regular q-mb-sm">
                {{ $t('etqHaciaInic') }}
                <span class="cursor-pointer hover-underline-animation text-uppercase"
                      @click="$emit('abrirInicioSesion')">
                    {{ $t('etqInic2') }}
                </span>
              </div>
              <q-btn :label="$t('etqCrearCuenta')" :loading="cargando" class="adventPro-regular text-weight-bold" color="morado"
                     rounded size="lg"
                     style="width: 100%; letter-spacing: 0.10rem;" type="submit"/>
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
import {useQuasar} from 'quasar'

//Variables form
const nombre = ref("")
const apellidos = ref("")
const correo = ref("")
const fotoPerfil = ref()
const fecha = ref("")
const fechaInput = ref("")
const contra = ref("")
const cargando = ref(false)
//URL de la API REST
const urlApi = api

//Notify
const $q = useQuasar()

//Emits
const emits = defineEmits(['abrirInicioSesion'])

//Funciones
function registrarse() {
  cargando.value = true
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
        cargando.value = false
      } else {
        $q.notify({
          message: "¡Te has registrado correctamente!",
          color: "positive",
          position: "top",
          timeout: 500,
          progress: true,
          icon: "fas fa-circle-check",
        });
        cargando.value = false
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

function alRechazar(entries) {
  if (entries.length > 0) {
    switch (entries[0].failedPropValidation) {
      case 'max-file-size':
        this.$q.notify({
          position: 'top',
          type: 'negative',
          message: 'El archivo excede el límite de 5MB'
        })

        break
    }
  }
}
</script>

<style scoped>
@media screen and (max-width: 576px) {
  .formReg {
    width: 100%;
  }

  .avatar {
    font-size: 6rem;
  }
}

/* Estilos para pantallas medianas y grandes */
@media screen and (min-width: 577px) {
  .formReg {
    width: 50%;
  }

  .avatar {
    font-size: 8rem;
  }
}
</style>


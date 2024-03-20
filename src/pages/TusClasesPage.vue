<template>
<q-page>
  <div class="q-gutter-lg row q-mt-md flex-center">
    <div v-for="grupo in grupos">
      <tarjeta-equipo :nombre="grupo.nombre" @abandonar-grupo="abandonarGrupo(grupo._id)" @eliminar-grupo="eliminarGrupo(grupo._id)"></tarjeta-equipo>
    </div>
  </div>

  <q-dialog v-model="nuevoGrupo">
    <q-card style="width: 100%; max-width: 450px">
      <q-tabs
        v-model="tabGrupo"
        inline-label
        class="text-naranja-claro">
        <q-tab name="crear" icon="fas fa-plus" class="adventPro-semiBold" :label="$t('etiquetaCrear')" />
        <q-tab name="unirse" icon="fa fa-user-plus" class="adventPro-semiBold" label="UNIRSE" />

      </q-tabs>

      <q-tab-panels v-model="tabGrupo" animated>
        <q-tab-panel name="crear">
          <q-card-section>
            <q-form
              @submit="crearGrupo"
              @reset="onReset"
              class="q-gutter-lg">
              <q-input
                v-model="nombreGrupo"
                :rules="[ val => val && val.length > 0 || $t('campoReq')]"
                class="no-padding alumniSans-regular text-body1"
                color="morado"
                filled
                label="Nombre del grupo"
                lazy-rules
              />
              <q-input
                v-model="descripcionGrupo"
                :rules="[ val => val && val.length > 0 || $t('campoReq')]"
                autogrow
                class="no-padding alumniSans-regular text-body1"
                color="morado"
                filled
                label="Descripción del grupo"
                lazy-rules
              />
              <div align="right">
                <q-btn :label="$t('etiquetaCrear')" type="submit" color="naranja" class="adventPro-semiBold"/>
                <q-btn :label="$t('etiquetaCancelar')" type="reset" color="naranja-claro" flat class="q-ml-sm adventPro-semiBold" v-close-popup/>
              </div>
            </q-form>
          </q-card-section>
        </q-tab-panel>
        <q-tab-panel name="unirse">
          <q-card-section>
            <q-form
              @submit="onSubmit"
              @reset="onReset"
              class="q-gutter-lg">
              <q-input
                v-model="codigoGrupo"
                :rules="[ val => val && val.length > 0 || $t('campoReq')]"
                class="no-padding alumniSans-regular text-body1"
                color="morado"
                filled
                label="Código del grupo"
                lazy-rules
              />
              <div align="right">
                <q-btn label="UNIRSE" type="submit" color="naranja" class="adventPro-semiBold"/>
                <q-btn :label="$t('etiquetaCancelar')" type="reset" color="naranja-claro" flat class="q-ml-sm adventPro-semiBold" v-close-popup/>
              </div>
            </q-form>
          </q-card-section>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-dialog>
</q-page>
</template>

<script setup>
import TarjetaArchivoComponent from "components/TarjetaArchivoComponent.vue";
import TarjetaEquipo from "components/TarjetaEquipo.vue";
import {QSpinnerHourglass, useQuasar} from "quasar";
import api from "boot/httpSingleton";
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";

const localStorage = window.localStorage
let infoUsuario = null

if (localStorage.infoUsuario){
  infoUsuario = JSON.parse(localStorage.infoUsuario)
}

const router = useRouter()
const $q = useQuasar()
const urlApi = api
const grupos = ref([])

const nuevoGrupo = defineModel()
const tabGrupo = ref('crear')

//Formulario
const nombreGrupo = ref("")
const descripcionGrupo = ref("")
const codigoGrupo = ref("")

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
        } else {
          obtenerGrupos()
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
    await router.push({path: "/"})
  }
}

async function crearGrupo() {
  let codigoNuevo = ""
  mostrarCarga()
  await fetch("https://random-word-api.herokuapp.com/word?lang=es")
    .then(respuesta => respuesta.json())
    .then(datos => {
      codigoNuevo = datos[0]
    })

  await fetch(`${urlApi}/grupos`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'token-privado': localStorage.tokenPrivado
    },
    body: JSON.stringify({
      "creador": infoUsuario._id,
      "nombre": nombreGrupo.value,
      "descripcion": descripcionGrupo.value,
      "miembros": [infoUsuario._id],
      "codigo_acceso": codigoNuevo
    })
  })
    .then(respuesta => respuesta.json())
    .then(datos => {
      if (!datos.exito) {
        $q.notify({
          message: "¡Hubo un error al intentar crear el grupo!",
          color: "negative",
          position: "top",
          timeout: 1000,
          progress: true,
          icon: "fas fa-circle-exclamation",
        });
      } else {
        fetch(`${urlApi}/usuarios/${infoUsuario._id}`, {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json',
            'token-privado': localStorage.tokenPrivado
          },
          body: JSON.stringify({
            "grupos": datos.datos._id
          })
        })
          .then(respuesta => respuesta.json())
          .then(datos => {
            if (!datos.exito) {
              $q.notify({
                message: "¡Hubo un error al intentar crear el grupo!",
                color: "negative",
                position: "top",
                timeout: 1000,
                progress: true,
                icon: "fas fa-circle-exclamation",
              });
              console.log(datos)
              //TODO: Borrar el evento previamente creado
            } else {
              $q.notify({
                message: "¡Grupo creado con éxito!",
                color: "positive",
                position: "top",
                timeout: 1000,
                progress: true,
                icon: "fas fa-circle-check",
              });
              obtenerGrupos()
            }
          })
      }
    })
  nuevoGrupo.value = false
  $q.loading.hide()
}

async function obtenerGrupos() {
  grupos.value.length = 0
  mostrarCarga()
  await fetch(`${urlApi}/usuarios/${infoUsuario._id}`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'token-privado': localStorage.tokenPrivado
    }
  })
    .then(respuesta => respuesta.json())
    .then(datos => {
      console.log(datos)
      if (!datos.exito){
        $q.notify({
          message: "¡Hubo un error al intentar obtener tus grupos!",
          color: "negative",
          position: "top",
          timeout: 1000,
          progress: true,
          icon: "fas fa-circle-exclamation",
        });
      } else {
        if (datos.datos) {
          datos.datos.grupos.forEach((grupo) => {
            grupos.value.push(grupo)
          })
        } else {
          $q.notify({
            message: "¡No tienes grupos! Prueba a crear o unirte a uno",
            color: "negative",
            position: "top",
            timeout: 1000,
            progress: true,
            icon: "fas fa-circle-exclamation",
          });
        }
      }

    })
  $q.loading.hide()
}

async function abandonarGrupo(id){
  mostrarCarga()
  fetch(`${urlApi}/usuarios/pull/${infoUsuario._id}`, {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
      'token-privado': localStorage.tokenPrivado
    },
    body: JSON.stringify({
      "grupos": id
    })
  })
    .then(respuesta => respuesta.json())
    .then(datos => {
      if (!datos.exito) {
        $q.notify({
          message: "¡Hubo un error al intentar abandonar el grupo!",
          color: "negative",
          position: "top",
          timeout: 1000,
          progress: true,
          icon: "fas fa-circle-exclamation",
        });
      } else {
        fetch(`${urlApi}/grupos/pull/${id}`, {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json',
            'token-privado': localStorage.tokenPrivado
          },
          body: JSON.stringify({
            "miembros": infoUsuario._id
          })
        })
          .then(respuesta => respuesta.json())
          .then(datos => {
            if (!datos.exito) {
              $q.notify({
                message: "¡Hubo un error al intentar abandonar el grupo!",
                color: "negative",
                position: "top",
                timeout: 1000,
                progress: true,
                icon: "fas fa-circle-exclamation",
              });
            } else {
              $q.notify({
                message: "¡Abandonaste el grupo con éxito!",
                color: "positive",
                position: "top",
                timeout: 1000,
                progress: true,
                icon: "fas fa-circle-check",
              });
              obtenerGrupos()
            }
          })
      }
    })
  $q.loading.hide()
}

async function eliminarGrupo(id) {
  mostrarCarga()
  await fetch(`${urlApi}/grupos/${id}`, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json',
      'token-privado': localStorage.tokenPrivado
    },
  })
    .then(respuesta => respuesta.json())
    .then(datos => {
      if (!datos.exito) {
        $q.notify({
          message: "¡Hubo un error al intentar eliminar el grupo!",
          color: "negative",
          position: "top",
          timeout: 1000,
          progress: true,
          icon: "fas fa-circle-exclamation",
        });
      } else {
        $q.notify({
          message: "¡Se elimino el grupo con éxito!",
          color: "positive",
          position: "top",
          timeout: 1000,
          progress: true,
          icon: "fas fa-check",
        });
        obtenerGrupos()
      }
    })
  $q.loading.hide()
}

function mostrarCarga(){
  $q.loading.show({
    spinner: QSpinnerHourglass,
    spinnerColor: 'naranja',
    spinnerSize: 150,
    backgroundColor: 'morado',
    message: 'Reuniendo tus archivos...',
    messageColor: 'naranja-claro'
  })
}
</script>

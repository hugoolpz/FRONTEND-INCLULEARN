<template>
  <q-page padding>
    <div class="q-gutter-md row flex-center">
      <q-select :label="$t('tipoEtiqueta')" outlined color="morado" use-chips v-model="tipoElegido" :options="tipos"
        style="width: 18rem" @update:model-value="filtrarArchivos">
        <template v-slot:selected-item="scope">
          <q-chip removable @remove="scope.removeAtIndex(scope.index)" tabindex="0" outline color="morado"
            text-color="white">
            <q-avatar color="morado" text-color="white" :icon="scope.opt.icon" />
            {{ scope.opt.label }}
          </q-chip>
        </template>
      </q-select>

      <!--<q-select :label="$t('modificadoEtiqueta')" outlined color="morado" v-model="fechaElegida" use-chips
        :options="fechasMod" style="width: 18rem">
        <template v-slot:selected-item="scope">
          <q-chip removable @remove="scope.removeAtIndex(scope.index)" tabindex="0" outline color="morado"
            text-color="white">
            {{ scope.opt.label }}
          </q-chip>
        </template>
      </q-select>-->

      <q-uploader ref="archivo" :factory="factoryFn" field-name="filename" label="{{$t('subeArchivos')}}" color="morado"
        accept=".pdf, .docx, .csv, .ppt, image/*, .zip, .csb, video/*, audio/*" max-file-size="25000000"
        @uploaded="alSubir" @rejected="alRechazar" style="width: 18rem">

        <template v-slot:header="scope">
          <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
            <q-btn v-if="scope.queuedFiles.length > 0" icon="clear_all" @click="scope.removeQueuedFiles" round dense
              flat :aria-label="$t('borraTodos')">
              <q-tooltip class="bg-naranja-claro">{{ $t('borraTodos') }}</q-tooltip>
            </q-btn>
            <q-btn v-if="scope.uploadedFiles.length > 0" icon="done_all" @click="scope.removeUploadedFiles" round dense
              flat :aria-label="$t('quitarSubidos')">
              <q-tooltip class="bg-naranja-claro">{{ $t('quitarSubidos') }}</q-tooltip>
            </q-btn>
            <q-spinner v-if="scope.isUploading" class="q-uploader__spinner" />
            <div class="col">
              <div class="q-uploader__title">{{ $t('subeArchivos') }}</div>
              <div class="q-uploader__subtitle">{{ scope.uploadSizeLabel }} / {{ scope.uploadProgressLabel }}</div>
            </div>
            <q-btn v-if="scope.canAddFiles" type="a" icon="add_box" @click="scope.pickFiles" round dense flat
              :aria-label="$t('elegirArchivos')">
              <q-uploader-add-trigger />
              <q-tooltip class="bg-naranja-claro">{{ $t('elegirArchivos') }}</q-tooltip>
            </q-btn>
            <q-btn v-if="scope.canUpload" icon="cloud_upload" @click="scope.upload" round dense flat
              :aria-label="$t('subirArchivos')">
              <q-tooltip class="bg-naranja-claro">{{ $t('subirArchivos') }}</q-tooltip>
            </q-btn>

            <q-btn v-if="scope.isUploading" icon="clear" @click="scope.abort" round dense flat
              :aria-label="$t('cancelarSubida')">
              <q-tooltip class="bg-naranja-claro">{{ $t('cancelarSubida') }}</q-tooltip>
            </q-btn>
          </div>
        </template>
      </q-uploader>
    </div>

    <div class="q-gutter-lg row q-mt-md flex-center">
      <div v-for="archivo in archivos">
        <tarjeta-archivo-component :nombre="archivo.nombre" :ult-act="new Date(archivo.fechaAct).toLocaleDateString()"
          :url="archivo.url" :tipo="archivo.contentType" :size="archivo.tamano"
          @descargar="descargarArchivo(archivo.url)" @compartir="copiarUrl(archivo.url)"
          @borrar="abrirElim(archivo.nombre)"></tarjeta-archivo-component>
      </div>
    </div>

    <q-dialog v-model="confirmarElim" persistent>
      <q-card>
        <q-toolbar class="bg-warning text-white">
          <q-avatar>
            <q-icon name="fas fa-warning"></q-icon>
          </q-avatar>

          <q-toolbar-title>{{ $t('avisoElim') }}</q-toolbar-title>
        </q-toolbar>

        <q-card-section>
          {{ $t('confirmElim') }} <span class="text-weight-bold">{{ nomElim }}</span>?
        </q-card-section>

        <q-card-actions align="right">
          <q-btn v-close-popup color="positive" flat :label="$t('siEliminar')" @click="eliminarElegido()" />
          <q-btn v-close-popup color="negative" flat :label="$t('noConservar')" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>


<script setup>
import { onMounted, ref } from "vue";
import { today } from "@quasar/quasar-ui-qcalendar";
import { QSpinnerHourglass, useQuasar } from "quasar";
import api from "boot/httpSingleton";
import TarjetaArchivoComponent from "components/TarjetaArchivoComponent.vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n()

const localStorage = window.localStorage
let infoUsuario = null

if (localStorage.infoUsuario) {
  infoUsuario = JSON.parse(localStorage.infoUsuario)
}

const urlApi = api

const router = useRouter()

const $q = useQuasar()

const tipos = [
  {
    label: t('doc'),
    icon: "fas fa-file-lines"
  },
  {
    label: t('mult'),
    icon: "fas fa-file-image"
  },
  {
    label: t('comp'),
    icon: "fas fa-file-zipper"
  }
]
const tipoElegido = ref(null)

const fechasMod = [
  {
    label: t('hoy'),
  },
  {
    label: t('ult7'),
  },
  {
    label: t('ult30'),
  },
  {
    label: t('esteAnio') + " (" + new Date(today()).getFullYear() + ")",
  },
]
const fechaElegida = ref(null)

const archivo = ref(null)
const archivos = ref([])

const confirmarElim = ref(false)
const nomElim = ref()

onMounted(() => {
  comprobarSesion()
})

async function comprobarSesion() {
  if (localStorage.infoUsuario) {
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
          router.push({ path: "/" })
        } else {
          obtenerArchivos()
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
    router.push({ path: "/" })
  }
}

function alRechazar(rejectedEntries) {
  console.log(rejectedEntries)
}

function factoryFn() {
  return {
    url: 'http://localhost:3000/api/storage/' + JSON.parse(window.localStorage.getItem("infoUsuario"))._id,
    method: 'POST',
  }
}

function abrirElim(nombreElegido) {
  confirmarElim.value = true;
  nomElim.value = nombreElegido
}

function descargarArchivo(url) {
  window.open(url, "_blank")
}

function copiarUrl(url) {
  navigator.clipboard.writeText(url)

  $q.notify({
    message: '¡Se ha copiado al portapapeles la URL del archivo!',
    color: 'positive',
    position: 'bottom',
    timeout: 500,
    progress: true,
    icon: 'fas fa-circle-check',
  });
}

async function eliminarElegido() {
  await fetch(`${urlApi}/storage/${infoUsuario._id}/${nomElim.value}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      'token-privado': localStorage.tokenPrivado
    },
  })
    .then((res) => res.json())
    .then((datos) => {
      if (!datos.exito) {
        $q.notify({
          progress: true,
          message: "No se pudo eliminar el archivo " + nomElim.value,
          color: "negative",
          timeout: 1000,
        });
      } else {
        $q.notify({
          progress: true,
          message: "Se ha eliminado el archivo " + nomElim.value,
          color: "positive",
          timeout: 1000,
        });

        obtenerArchivos()
      }
    });
}

async function obtenerArchivos() {
  archivos.value.length = 0
  mostrarCarga()

  await fetch(`${urlApi}/storage/${infoUsuario._id}`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'token-privado': localStorage.tokenPrivado
    }
  })
    .then(respuesta => respuesta.json())
    .then(datos => {
      if (!datos.exito) {
        $q.notify({
          message: "¡Hubo un error al intentar obtener tus archivos!",
          color: "negative",
          position: "top",
          timeout: 1000,
          progress: true,
          icon: "fas fa-circle-exclamation",
        });

      } else {
        datos.files.forEach((archivo) => {
          let nuevoArchivo = {
            nombre: archivo.name,
            url: archivo.downloadURL,
            contentType: archivo.contentType,
            tamano: archivo.size,
            fechaCreacion: archivo.created,
            fechaAct: archivo.updated,
          }
          archivos.value.push(nuevoArchivo)
        })
      }

    })

  $q.loading.hide()
}

async function filtrarArchivos() {
  if (tipoElegido.value != null) {
    archivos.value.length = 0
    mostrarCarga()
    await fetch(`${urlApi}/storage/${infoUsuario._id}`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'token-privado': localStorage.tokenPrivado
      }
    })
      .then(respuesta => respuesta.json())
      .then(datos => {
        if (!datos.exito) {
          $q.notify({
            message: "¡Hubo un error al intentar obtener tus archivos!",
            color: "negative",
            position: "top",
            timeout: 1000,
            progress: true,
            icon: "fas fa-circle-exclamation",
          });
        } else {
          datos.files.forEach((archivo) => {
            switch (tipoElegido.value.label) {
              case "Documentos": {
                if (archivo.contentType.includes("word") || archivo.contentType.includes("pdf") || archivo.contentType.includes("csv")) {
                  let nuevoArchivo = {
                    nombre: archivo.name,
                    url: archivo.downloadURL,
                    contentType: archivo.contentType,
                    tamano: archivo.size,
                    fechaCreacion: archivo.created,
                    fechaAct: archivo.updated,
                  }
                  archivos.value.push(nuevoArchivo)
                }
                break;
              }
              case "Archivos multimedia": {
                if (archivo.contentType.includes("image") || archivo.contentType.includes("video") || archivo.contentType.includes("audio")) {
                  let nuevoArchivo = {
                    nombre: archivo.name,
                    url: archivo.downloadURL,
                    contentType: archivo.contentType,
                    tamano: archivo.size,
                    fechaCreacion: archivo.created,
                    fechaAct: archivo.updated,
                  }
                  archivos.value.push(nuevoArchivo)
                }
                break;
              }
              case "Archivos comprimidos": {
                if (archivo.contentType.includes("zip")) {
                  let nuevoArchivo = {
                    nombre: archivo.name,
                    url: archivo.downloadURL,
                    contentType: archivo.contentType,
                    tamano: archivo.size,
                    fechaCreacion: archivo.created,
                    fechaAct: archivo.updated,
                  }
                  archivos.value.push(nuevoArchivo)
                }
                break;
              }
              default: {
                obtenerArchivos()
                break;
              }
            }
          })
        }
      })
  } else {
    await obtenerArchivos()
  }
  $q.loading.hide()
}

function mostrarCarga() {
  $q.loading.show({
    spinner: QSpinnerHourglass,
    spinnerColor: 'naranja',
    spinnerSize: 150,
    backgroundColor: 'morado',
    message: 'Reuniendo tus archivos...',
    messageColor: 'naranja-claro'
  })
}

const alSubir = () => {
  $q.notify({
    message: '¡El archivo se subió correctamente!',
    color: 'positive',
    position: 'bottom',
    timeout: 500,
    progress: true,
    icon: 'fas fa-circle-check',
  });

  obtenerArchivos()

  setTimeout(function () {
    archivo.value.removeUploadedFiles()
  }, 500)
};
</script>

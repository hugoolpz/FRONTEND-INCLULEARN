<template>
  <q-page padding>
    <div class="q-gutter-md row">
      <q-select
        label="Tipo"
        outlined
        color="morado"
        use-chips
        v-model="tipoElegido"
        :options="tipos"
        style="width: 15rem"
      >
        <template v-slot:selected-item="scope">
          <q-chip
            removable
            @remove="scope.removeAtIndex(scope.index)"
            :tabindex="scope.tabindex"
            outline color="morado" text-color="white"
          >
            <q-avatar color="morado" text-color="white" :icon="scope.opt.icon" />
            {{ scope.opt.label }}
          </q-chip>
        </template>
      </q-select>

      <q-select
        label="Modificado"
        outlined
        color="morado"
        v-model="fechaElegida"
        use-chips
        :options="fechasMod"
        style="width: 15rem"
      >
        <template v-slot:selected-item="scope">
          <q-chip
            removable
            @remove="scope.removeAtIndex(scope.index)"
            :tabindex="scope.tabindex"
            outline color="morado" text-color="white"
          >
            {{ scope.opt.label }}
          </q-chip>
        </template>
      </q-select>

      <q-uploader
        ref="archivo"
        :factory="factoryFn"
        field-name="filename"
        label="Sube tus archivos"
        color="morado"
        accept=".pdf, .docx, .ppt, image/*, .zip, .csb, video/*, audio/*"
        max-file-size="25000000"
        @uploaded="onFileUploaded"
        @rejected="alRechazar"
      >

        <template v-slot:header="scope">
          <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
            <q-btn v-if="scope.queuedFiles.length > 0" icon="clear_all" @click="scope.removeQueuedFiles" round dense flat >
              <q-tooltip>Borrar todos</q-tooltip>
            </q-btn>
            <q-btn v-if="scope.uploadedFiles.length > 0" icon="done_all" @click="scope.removeUploadedFiles" round dense flat >
              <q-tooltip>Quitar archivos subidos</q-tooltip>
            </q-btn>
            <q-spinner v-if="scope.isUploading" class="q-uploader__spinner" />
            <div class="col">
              <div class="q-uploader__title">Subir tus archivos</div>
              <div class="q-uploader__subtitle">{{ scope.uploadSizeLabel }} / {{ scope.uploadProgressLabel }}</div>
            </div>
            <q-btn v-if="scope.canAddFiles" type="a" icon="add_box" @click="scope.pickFiles" round dense flat>
              <q-uploader-add-trigger />
              <q-tooltip>Elegir archivos</q-tooltip>
            </q-btn>
            <q-btn v-if="scope.canUpload" icon="cloud_upload" @click="scope.upload" round dense flat >
              <q-tooltip>Subir archivos</q-tooltip>
            </q-btn>

            <q-btn v-if="scope.isUploading" icon="clear" @click="scope.abort" round dense flat >
              <q-tooltip>Cancelar subida</q-tooltip>
            </q-btn>
          </div>
        </template>
      </q-uploader>
    </div>

    <div class="q-gutter-md row q-mt-md">
      <div v-for="archivo in archivos">
        <tarjeta-archivo-component :nombre="archivo.nombre" :ult-act="new Date(archivo.fechaAct).toLocaleDateString()" :url="archivo.url" :tipo="archivo.contentType"
                                   :size="archivo.tamano" @descargar="descargarArchivo(archivo.url)" @compartir="copiarUrl(archivo.url)" @borrar="abrirElim(archivo.nombre)"></tarjeta-archivo-component>
      </div>
    </div>

    <q-dialog v-model="confirmarElim" persistent>
      <q-card>
        <q-toolbar class="bg-warning text-white">
          <q-avatar>
            <q-icon name="fas fa-warning"></q-icon>
          </q-avatar>

          <q-toolbar-title>¡AVISO DE ELIMINACIÓN!</q-toolbar-title>
        </q-toolbar>

        <q-card-section>
          ¿Seguro que quieres borrar el archivo <span class="text-weight-bold">{{nomElim}}</span>?
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            v-close-popup
            color="positive"
            flat
            label="Sí, eliminar"
            @click="eliminarElegido()"
          />
          <q-btn v-close-popup color="negative" flat label="No, conservar"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {today} from "@quasar/quasar-ui-qcalendar";
import {useQuasar} from "quasar";
import api from "boot/httpSingleton";
import TarjetaArchivoComponent from "components/TarjetaArchivoComponent.vue";

const localStorage = window.localStorage
const infoUsuario = JSON.parse(localStorage.infoUsuario)
const urlApi = api

const $q = useQuasar()

const tipos = [
  {
    label: "Documentos",
    icon: "fas fa-file-lines"
  },
  {
    label: "Imágenes",
    icon: "fas fa-file-image"
  },
  {
    label: "Archivos compromidos",
    icon: "fas fa-file-zipper"
  }
]
const tipoElegido = ref()

const fechasMod = [
  {
    label: "Hoy",
  },
  {
    label: "Últimos 7 días",
  },
  {
    label: "Últimos 30 días",
  },
  {
    label: "Este año (" + new Date(today()).getFullYear() + ")",
  },
]
const fechaElegida = ref()

const archivo = ref(null)
const archivos = ref([])

const confirmarElim = ref(false)
const nomElim = ref()

onMounted(() => {
  obtenerArchivos()
})

function alRechazar(rejectedEntries){
  console.log(rejectedEntries)
}

function factoryFn () {
  return {
    url: 'http://localhost:3000/api/storage/' + JSON.parse(window.localStorage.getItem("infoUsuario"))._id,
    method: 'POST',
  }
}

function abrirElim(nombreElegido) {
  confirmarElim.value = true;
  nomElim.value = nombreElegido
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
async function obtenerArchivos() {
  archivos.value.length = 0
  await fetch(`${urlApi}/storage/${infoUsuario._id}`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'token-privado': localStorage.tokenPrivado
    }
  })
    .then(respuesta => respuesta.json())
    .then(datos => {
      if (!datos.exito){
        $q.notify({
          message: "¡Hubo un error al intentar obtener tus eventos!",
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
  console.log(archivos.value)
}

const onFileUploaded = () => {
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

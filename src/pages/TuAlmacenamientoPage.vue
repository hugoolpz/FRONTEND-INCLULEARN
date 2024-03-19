<template>
  <q-page padding>
    <div class="q-gutter-md row flex-center">
      <q-select
        :label="$t('tipoEtiqueta')"
        outlined
        color="morado"
        use-chips
        v-model="tipoElegido"
        :options="tipos"
        style="width: 18rem"
        @update:model-value="filtrarArchivos"
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
        :label="$t('modificadoEtiqueta')"
        outlined
        color="morado"
        v-model="fechaElegida"
        use-chips
        :options="fechasMod"
        style="width: 18rem"
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
        label="{{$t('subeArchivos')}}"
        color="morado"
        accept=".pdf, .docx, .csv, .ppt, image/*, .zip, .csb, video/*, audio/*"
        max-file-size="25000000"
        @uploaded="onFileUploaded"
        @rejected="alRechazar"
        style="width: 18rem"
      >

        <template v-slot:header="scope">
          <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
            <q-btn v-if="scope.queuedFiles.length > 0" icon="clear_all" @click="scope.removeQueuedFiles" round dense flat >
              <q-tooltip>{{$t('borraTodos')}}</q-tooltip>
            </q-btn>
            <q-btn v-if="scope.uploadedFiles.length > 0" icon="done_all" @click="scope.removeUploadedFiles" round dense flat >
              <q-tooltip>{{$t('quitarSubidos')}}</q-tooltip>
            </q-btn>
            <q-spinner v-if="scope.isUploading" class="q-uploader__spinner" />
            <div class="col">
              <div class="q-uploader__title">{{$t('subeArchivos')}}</div>
              <div class="q-uploader__subtitle">{{ scope.uploadSizeLabel }} / {{ scope.uploadProgressLabel }}</div>
            </div>
            <q-btn v-if="scope.canAddFiles" type="a" icon="add_box" @click="scope.pickFiles" round dense flat>
              <q-uploader-add-trigger />
              <q-tooltip>{{$t('elegirArchivos')}}</q-tooltip>
            </q-btn>
            <q-btn v-if="scope.canUpload" icon="cloud_upload" @click="scope.upload" round dense flat >
              <q-tooltip>{{$t('subirArchivos')}}</q-tooltip>
            </q-btn>

            <q-btn v-if="scope.isUploading" icon="clear" @click="scope.abort" round dense flat >
              <q-tooltip>{{$t('cancelarSubida')}}</q-tooltip>
            </q-btn>
          </div>
        </template>
      </q-uploader>
    </div>

    <div class="q-gutter-lg row q-mt-md flex-center">
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

          <q-toolbar-title>{{$t('avisoElim')}}</q-toolbar-title>
        </q-toolbar>

        <q-card-section>
          {{$t('confirmElim')}} <span class="text-weight-bold">{{nomElim}}</span>?
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            v-close-popup
            color="positive"
            flat
            label="{{$t('siEliminar')}}"
            @click="eliminarElegido()"
          />
          <q-btn v-close-popup color="negative" flat label="{{$t('noConservar')}}"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>


<script setup>
import {onMounted, ref} from "vue";
import {today} from "@quasar/quasar-ui-qcalendar";
import {QSpinnerHourglass, useQuasar} from "quasar";
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
    label: "Archivos multimedia",
    icon: "fas fa-file-image"
  },
  {
    label: "Archivos comprimidos",
    icon: "fas fa-file-zipper"
  }
]
const tipoElegido = ref(null)

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
const fechaElegida = ref(null)

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
      console.log(datos)
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

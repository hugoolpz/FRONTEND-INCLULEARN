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
        accept=".pdf, .docx, .ppt, image/*"
        max-file-size="10485760"
        @uploaded="onFileUploaded"
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
  </q-page>
</template>

<script setup>
import {ref} from "vue";
import {today} from "@quasar/quasar-ui-qcalendar";
import {useQuasar} from "quasar";

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

function factoryFn (files) {
  return {
    url: 'http://localhost:3000/api/storage/' + JSON.parse(window.localStorage.getItem("infoUsuario"))._id,
    method: 'POST',
  }
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
};
</script>

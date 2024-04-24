

<template>
  <q-card class="tarjeta-archivo cursor-pointer" flat bordered>
    <q-item style="height: 80px" class="bg-grey-2">
      <q-item-section>
        <q-item-label overline class="text-morado">{{bytesToMB(size)}}</q-item-label>
        <q-item-label class="text-weight-bold">{{acortarNombre()}}</q-item-label>
        <q-item-label caption>
          Últ. actualización: {{ultAct}}
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-separator/>

    <div class="flex flex-center q-pa-lg bg-white" style="max-height: 100px">
      <q-icon v-if="tipo === 'application/pdf'" size="xl" name="fas fa-file-lines" style="color: #EA4335"></q-icon>
      <q-icon v-if="tipo === 'text/csv'" size="xl" name="fas fa-file-csv" color="green"></q-icon>
      <q-icon v-else-if="tipo.includes('image')" size="xl" name="fas fa-file-image" style="color: #D93025"></q-icon>
      <q-icon v-else-if="tipo.includes('audio')" size="xl" name="fas fa-file-audio" color="morado"></q-icon>
      <q-icon v-else-if="tipo.includes('video')" size="xl" name="fas fa-file-video" color="naranja-claro"></q-icon>
      <q-icon v-else-if="tipo === 'application/x-zip-compressed'" size="xl" name="fas fa-file-zipper" color="grey"></q-icon>
      <q-icon v-else-if="tipo === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'" size="xl" name="fas fa-file-word" color="blue"></q-icon>
    </div>

    <q-separator/>

    <q-card-actions align="right">
      <q-btn flat round color="azul-oscuro" icon="fas fa-download" @click="$emit('descargar')" :aria-label="'Descargar' + nombre"/>
      <q-btn flat round color="morado" icon="fas fa-share-nodes" @click="$emit('compartir')" :aria-label="'Compartir' + nombre"/>
      <q-btn flat round color="negative" icon="fas fa-trash" @click="$emit('borrar')" :aria-label="'Borrar' + nombre"/>
    </q-card-actions>
  </q-card>
</template>

<script setup>
import {ref} from "vue";

const props = defineProps(['nombre', 'ultAct', 'url', 'tipo', 'size'])
const emits = defineEmits(['descargar', 'compartir', 'borrar'])
const icono = ref('fas fa-file-' + props.tipo)
function bytesToMB(bytes) {
  if (bytes === 0) return '0 MB';
  const megabytes = bytes / (1024 * 1024);
  return megabytes.toFixed(2) + ' MB';
}

function acortarNombre() {
  if (props.nombre.length <= 35) {
    return props.nombre;
  } else {
    return props.nombre.slice(0, 35) + "...";
  }
}
</script>

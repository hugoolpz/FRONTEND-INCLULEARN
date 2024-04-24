<script setup>
const props = defineProps(['nombre', 'tamano'])
const emits = defineEmits(['descargar', 'compartir', 'borrar'])
function bytesToMB(bytes) {
  if (bytes === 0) return '0 MB';
  const megabytes = bytes / (1024 * 1024);
  return megabytes.toFixed(2) + ' MB';
}
</script>

<template>
  <q-item v-ripple clickable>
    <q-item-section avatar top>
      <q-avatar color="naranja-claro" icon="fas fa-file" text-color="white"/>
    </q-item-section>

    <q-item-section>
      <q-item-label lines="1">{{nombre}}</q-item-label>
      <q-item-label caption>{{bytesToMB(tamano)}}</q-item-label>
    </q-item-section>

    <q-item-section side>
      <q-btn flat round color="azul-oscuro" icon="fas fa-download" @click="$emit('descargar')" :aria-label="'Descargar' + nombre"/>
    </q-item-section>
    <q-item-section side>
      <q-btn flat round color="morado" icon="fas fa-share-nodes" @click="$emit('compartir')" :aria-label="'Compartir' + nombre"/>
    </q-item-section>
    <q-item-section side>
      <q-btn flat round color="negative" icon="fas fa-trash" @click="$emit('borrar')" :aria-label="'Borrar' + nombre"/>
    </q-item-section>
  </q-item>
  <q-separator></q-separator>
</template>


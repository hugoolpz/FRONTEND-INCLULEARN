<script setup>
const props = defineProps(['color', 'contenido'])
const emits = defineEmits(['alClickar'])
</script>

<template>
  <q-chip clickable @click="$emit('alClickar')" :color="color" text-color="white">
    {{contenido}}
  </q-chip>
</template>

<style scoped>

</style>

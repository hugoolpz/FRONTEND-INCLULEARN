<script setup>
const props = defineProps(['color', 'contenido'])
const emits = defineEmits(['alClickar'])
</script>

<template>
  <q-chip :aria-description="'Color de evento ' + contenido" clickable @click="$emit('alClickar')" :color="color" text-color="white" class="alumniSans-regular text-body1">
    <q-icon
        name="fas fa-droplet"
        color="white"
        size="18px"
    />
  </q-chip>
</template>

<style scoped>

</style>

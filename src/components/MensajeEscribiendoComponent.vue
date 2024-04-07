<script setup>
const props = defineProps(['avatar', 'nombre'])
</script>

<template>
  <q-chat-message
    :name="nombre"
    :avatar="avatar"
    bg-color="naranja-claro"
    text-color="black"
    class="q-px-lg q-my-md text-center"
  >
    <q-spinner-dots size="2rem"/>
  </q-chat-message>
</template>

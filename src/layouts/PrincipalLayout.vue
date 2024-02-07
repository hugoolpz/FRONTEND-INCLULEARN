<template>
  <q-layout>
    <div class="absolute-top-right q-pa-md" style="z-index: 1;">
      <q-btn size="xl" padding="5px" flat round color="naranja" icon="img:src\assets\icons\person.svg" />
      <q-btn size="xl" padding="5px" flat round color="naranja" icon="img:src\assets\icons\globe.svg" />
    </div>
    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup>

</script>
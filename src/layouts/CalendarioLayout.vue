<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-naranja text-white">
      <q-toolbar>
        <q-btn icon="fas fa-left-long" label="Volver atrás" flat/>
        <q-separator vertical inset color="white" />
        <q-toolbar-title>
          Tu calendario
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
</script>

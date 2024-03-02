<template>
  <q-input v-model="hex" label="Color del evento" color="naranja-claro" filled>
    <template v-slot:append>
      <q-icon name="fas fa-eye-dropper" class="cursor-pointer">
        <q-popup-proxy v-model="mostrarSelector">
          <q-color v-model="hex" style="max-width: 250px" />
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script setup>
import {ref, watch} from "vue";

const hex = ref('')
const mostrarSelector = ref(false);
</script>

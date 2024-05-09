<template>
  <q-input v-model="hex" class="alumniSans-regular text-body1" :label="$t('colorGrupo')" color="naranja-claro" filled>
    <template v-slot:prepend v-if="hex !== ''">
      <q-icon name="fas fa-splotch" :style="{color: hex}"></q-icon>
    </template>
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

const hex = defineModel()
const mostrarSelector = ref(false);
</script>

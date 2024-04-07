<script setup>
import { ref, watch } from 'vue';
import { QIconPicker } from '@quasar/quasar-ui-qiconpicker/src/index'

// Definir el estado reactivo
const value = defineModel();
const showIconPicker = ref(false);
const pagination = ref({
  itemsPerPage: 35,
  page: 0
});

watch(value, () => {
  showIconPicker.value = false;
});
</script>


<template>
  <q-input v-model="value" class="alumniSans-regular text-body1" label="Icono del grupo" color="naranja-claro" filled readonly>
    <template v-slot:prepend v-if="value !== ''">
      <q-icon :name="value" color="naranja-claro"></q-icon>
    </template>
    <template v-slot:append>
      <q-icon name="extension" class="cursor-pointer">
        <q-popup-proxy v-model="showIconPicker">

          <q-icon-picker
            v-model="value"
            icon-set="fontawesome-v5"
            tooltips
            v-model:model-pagination="pagination"
            style="height: 300px; width: 300px; background-color: white;"
          />

        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

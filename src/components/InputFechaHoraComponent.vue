<template>
  <q-input :rules="[ val => val && val.length > 0 || $t('campoReq')]" lazy-rules filled :label="label" v-model="fechaHora" color="naranja-claro" class="no-padding alumniSans-regular text-body1">
    <template v-slot:prepend>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-date v-model="fechaHora" mask="YYYY-MM-DD HH:mm" color="naranja-claro">
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat tabindex="0"/>
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>

    <template v-slot:append>
      <q-icon name="access_time" class="cursor-pointer">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-time v-model="fechaHora" mask="YYYY-MM-DD HH:mm" format24h color="naranja-claro">
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat tabindex="0" />
            </div>
          </q-time>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script setup>
import {ref} from "vue";

const fechaHora = defineModel()
const props = defineProps(["label"])
</script>

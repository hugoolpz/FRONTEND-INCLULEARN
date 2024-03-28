<template>
  <q-page padding>
    <div class="row flex-center q-gutter-xl">
      <div class="col-xs-auto col-sm-auto col-md-auto col-lg-auto" v-for="usuario in usuarios">
        <div class="column flex-center">
          <q-avatar size="150px" color="red" text-color="white">
            <img :src="usuario.urlFoto !== './' ? usuario.urlFoto : 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg'" :class="'usuario-rtc-' + usuario.uidRtc">
          </q-avatar>
          <div class="q-mt-md text-h6">
            {{usuario.nombre}} ({{usuario.uid}})
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import {ref} from "vue";

const props = defineProps(['usuarios'])
</script>

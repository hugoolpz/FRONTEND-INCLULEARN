<template>
    <q-item :active="codIdioma === idioma" active-class="bg-naranja-claro text-white" clickable v-close-popup
        @click="$emit('alClickar')">
        <q-item-section avatar>
            <q-avatar>
                <img :src="urlFoto" alt="bandera">
            </q-avatar>
        </q-item-section>
        <q-item-section>
            <q-item-label class="alumniSans-regular text-h6">{{ titulo }}</q-item-label>
        </q-item-section>
    </q-item>
</template>

<script setup>
import { ref } from 'vue';
const props = defineProps(["titulo", "codBandera", "codIdioma", "idioma"])
const emits = defineEmits(['alClickar'])
const urlFoto = ref(`/banderas/${props.codBandera}.png`)
</script>

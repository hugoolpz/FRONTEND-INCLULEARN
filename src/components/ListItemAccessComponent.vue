<template>
    <q-item>
        <q-item-section top avatar>
            <q-avatar color="morado" text-color="white" :icon="props.icono" />
        </q-item-section>
        <q-item-section>
            <q-item-label>{{ tituloAjuste }}</q-item-label>
            <q-item-label caption>{{ subtAjuste }}</q-item-label>
        </q-item-section>
        <q-item-section side>
            <q-toggle v-model="valor" checked-icon="fas fa-check" color="naranja-claro" unchecked-icon="fas fa-xmark"
                @update:model-value="$emit('alActivar')" />
        </q-item-section>
    </q-item>
</template>

<script setup>
import { ref } from 'vue';
const valor = ref(false)
const props = defineProps(["tituloAjuste", "subtAjuste", "icono"])
const emits = defineEmits(["alActivar"])
</script>
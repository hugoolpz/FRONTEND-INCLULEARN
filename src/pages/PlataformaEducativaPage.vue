<template>
    <q-page padding>
        <div class="row q-mt-xl q-pt-lg">
            <div class="col">
                <q-card class="tarjeta-funcion-plat bg-image-logo cursor-pointer" v-ripple @mouseover="grupos = true"
                    @mouseleave="grupos = false" @click="">
                    <q-slide-transition appear duration="250">
                        <q-card-section v-show="grupos">
                            <q-list>
                                <q-item clickable v-ripple>
                                    <q-item-section avatar>
                                        <q-avatar rounded>
                                            <img src="https://cdn.quasar.dev/img/mountains.jpg">
                                        </q-avatar>
                                    </q-item-section>
                                    <q-item-section>Grupo 1 | 0 Miembros</q-item-section>
                                </q-item>

                                <q-separator spaced inset size="0.5px" />

                                <q-item clickable v-ripple>
                                    <q-item-section avatar>
                                        <q-avatar rounded>
                                            <img src="https://cdn.quasar.dev/img/mountains.jpg">
                                        </q-avatar>
                                    </q-item-section>
                                    <q-item-section>Grupo 1 | 0 Miembros</q-item-section>
                                </q-item>

                                <q-separator spaced inset size="0.5px" />

                                <q-item clickable v-ripple>
                                    <q-item-section avatar>
                                        <q-avatar rounded>
                                            <img src="https://cdn.quasar.dev/img/mountains.jpg">
                                        </q-avatar>
                                    </q-item-section>
                                    <q-item-section>Grupo 1 | 0 Miembros</q-item-section>
                                </q-item>

                                <q-separator spaced inset size="0.5px" />

                                <q-item clickable v-ripple>
                                    <q-item-section avatar>
                                        <q-avatar rounded>
                                            <img src="https://cdn.quasar.dev/img/mountains.jpg">
                                        </q-avatar>
                                    </q-item-section>
                                    <q-item-section>Grupo 1 | 0 Miembros</q-item-section>
                                </q-item>
                            </q-list>
                        </q-card-section>
                    </q-slide-transition>
                    <div class="text-h4 text-white q-my-sm q-ml-md adventPro-semiBold absolute-bottom text-left">
                        CLASES
                    </div>
                </q-card>
            </div>
            <div class="col">
                <q-card class="tarjeta-funcion-plat bg-image-logo" v-ripple>
                    <div class="text-h4 text-white q-my-sm q-ml-md adventPro-semiBold absolute-bottom text-left">
                        CALENDARIO
                    </div>
                </q-card>
            </div>
            <div class="col">
                <q-card class="tarjeta-funcion-plat bg-image-logo">
                    <div class="text-h4 text-white q-my-sm q-ml-md adventPro-semiBold absolute-bottom text-left">
                        ALMACENAMIENTO
                    </div>
                </q-card>
            </div>
        </div>
    </q-page>
</template>

<script setup>
import { ref } from 'vue'
const grupos = ref(false)
</script>
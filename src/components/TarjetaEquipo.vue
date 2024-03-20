<template>
<q-card bordered class="tarjeta-equipo cursor-pointer">
    <q-card-section class="row flex-center">
      <q-avatar square size="70px" color="naranja-claro" text-color="white" icon="fas fa-user-group" />
    </q-card-section>
    <q-separator dark color="morado"/>
    <q-card-actions class="row flex-center">
      <q-toolbar>
        <q-toolbar-title class="adventPro-semiBold">
          {{nombre}}
        </q-toolbar-title>

        <q-btn-dropdown flat dropdown-icon="none" auto-close rounded>
          <template v-slot:label>
            <div class="row absolute-center">
              <q-icon size="sm" name="fas fa-ellipsis" class="boton-mundo"/>
            </div>
          </template>
          <q-list>
            <q-item clickable v-close-popup @click="$emit('agregarMiembro')">
              <q-item-section>
                <q-item-label>Agregar miembro</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-icon name="fas fa-user-plus" />
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="$emit('agregarCanal')">
              <q-item-section>
                <q-item-label>Agregar canal</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-icon name="fas fa-comment-medical" />
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="$emit('abandonarGrupo')">
              <q-item-section>
                <q-item-label>Abandonar grupo</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-icon name="fas fa-door-open" />
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="$emit('eliminarGrupo')">
              <q-item-section>
                <q-item-label>Eliminar grupo</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-icon name="fas fa-trash" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-card-actions>
</q-card>

</template>

<script setup>
const props = defineProps(['nombre'])
const emits = defineEmits(['agregarMiembro', 'agregarCanal', 'abandonarGrupo', 'eliminarGrupo'])
</script>

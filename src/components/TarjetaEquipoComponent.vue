<template>
<q-card bordered class="tarjeta-equipo cursor-pointer">
    <q-card-section class="row flex-center" @click="$emit('alClickar')">
      <q-avatar rounded size="70px" :style="{backgroundColor: color}" text-color="white" :icon="icono" />
    </q-card-section>
    <q-separator dark color="morado"/>
    <q-card-actions class="row flex-center">
      <q-toolbar>
        <q-toolbar-title class="adventPro-semiBold text-body1">
          {{nombre}}
        </q-toolbar-title>

        <q-btn-dropdown flat dropdown-icon="none" auto-close rounded>
          <template v-slot:label>
            <div class="row absolute-center">
              <q-icon size="sm" name="fas fa-ellipsis" class="boton-mundo"/>
            </div>
          </template>
          <q-list>
            <q-item clickable v-close-popup @click="$emit('agregarMiembro')" :disable="!esCreador">
              <q-tooltip v-if="!esCreador" class="bg-negative">
                ¡No eres el creador de este grupo!
              </q-tooltip>
              <q-item-section>
                <q-item-label>Agregar miembro</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-icon name="fas fa-user-plus" />
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="$emit('agregarCanal')" :disable="!esCreador">
              <q-tooltip v-if="!esCreador" class="bg-negative">
                ¡No eres el creador de este grupo!
              </q-tooltip>
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

            <q-item clickable v-close-popup @click="$emit('eliminarGrupo')" :disable="!esCreador">
              <q-tooltip v-if="!esCreador" class="bg-negative">
              ¡No eres el creador de este grupo!
              </q-tooltip>
              <q-item-section>
                <q-item-label>Eliminar grupo</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-icon name="fas fa-trash" />
              </q-item-section>
            </q-item>

            <q-item v-close-popup clickable @click="$emit('copiarCodigo')">
              <q-item-section>
                <q-item-label>Copiar código del grupo</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-icon name="fas fa-key"/>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-card-actions>
</q-card>

</template>

<script setup>
const props = defineProps(['nombre', 'icono', 'color', 'esCreador'])
const emits = defineEmits(['alClickar', 'agregarMiembro', 'agregarCanal', 'abandonarGrupo', 'eliminarGrupo', 'copiarCodigo'])
</script>

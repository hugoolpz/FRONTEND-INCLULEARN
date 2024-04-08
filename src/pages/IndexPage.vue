<template>
  <q-page padding :class="!formAbierto ? 'bg-image-logo' : 'bg-image-forms'">
    <div class="row" v-if="!formAbierto" key="form">
      <div class="col-md-6 col-lg-6 col-sm-12 q-ml-xl q-pl-xl q-my-xl" style="border: 1px solid black">
          <div>
            <div class="column relative-position" style="left: 158px; top: 5px">
              <img src="/gorro-logo.png" style="width: 210px" alt="" />
            </div>
            <div class="text-azul-oscuro text-left text-h1 adventPro-semiBold" style="
              text-shadow: 0 3px 3px rgba(137, 137, 137, 0.75);
              letter-spacing: 0.21rem;
            ">
              INCL<span class="text-naranja">U | L</span>EARN
            </div>
          </div>
        <q-space class="q-mb-md" />
          <div style="font-size: 2rem;" class="text-morado text-left text-h4 q-ml-sm alumniSans-light">
            {{ $t('subtInicio') }}
          </div>
          <div>
            <div class="text-azul-oscuro text-h5 q-ml-sm text-justify alumniSans-regular"
              style="max-width: 530vw; line-height: 1.2em">
              {{ $t('resInicio') }}
            </div>
          </div>
      </div>
      <div class="col-md-6 col-lg-6 col-sm-12 q-gutter-y-xl q-mt-xl q-pt-xl">
          <div class="column flex-center">
            <q-btn color="naranja-claro" class="adventPro-regular" style="width: 300px; font-size: 28px" rounded size="xl"
              icon="mdi-plus" :label="$t('etqReg1')" @click="abrirRegistro" />
          </div>
          <div class="column flex-center">
            <q-btn color="naranja-claro" class="adventPro-regular" rounded style="width: 300px; font-size: 28px" size="xl"
              icon="mdi-login" :label="$t('etqInic1')" @click="abrirInicioSesion" />
          </div>
        </div>
    </div>

    <registro-component v-if="formAbierto && formRegistro"
                        @abrir-inicio-sesion="abrirInicioSesion"></registro-component>

    <inicio-sesion-component v-if="formAbierto && formInicio" @abrir-registro="abrirRegistro"></inicio-sesion-component>
  </q-page>
</template>

<script setup>
document.body.style.overflow = "hidden"
import InicioSesionComponent from "src/components/InicioSesionComponent.vue";
import RegistroComponent from "src/components/RegistroComponent.vue";
import { ref } from "vue";

//Forms
const formAbierto = ref(false);
const formRegistro = ref(false);
const formInicio = ref(false);

//Funciones
function abrirRegistro() {
  formInicio.value = false;
  formAbierto.value = true;
  formRegistro.value = true;
}

function abrirInicioSesion() {
  formRegistro.value = false;
  formAbierto.value = true;
  formInicio.value = true;
}
</script>

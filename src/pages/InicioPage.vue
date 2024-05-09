<template>
  <q-page :class="!formAbierto ? 'bg-image-logo' : 'bg-image-forms'" padding>
    <!--Inicio logo-->
    <div class="row flex-center" v-if="!formAbierto" style="z-index: 1;">
      <div class="column contenedor">
        <div class="col-md-12 col-sm-6">
          <div class="column flex-center">
            <img src="/gorro-logo.png" alt="logo" class="logo-inclu"/>
          </div>
          <div class="text-azul-oscuro text-center adventPro-semiBold texto-inclu" style="
              text-shadow: 0 3px 3px rgba(137, 137, 137, 0.75);
              letter-spacing: 0.20rem;
            ">
            INCL<span class="text-naranja">U | L</span>EARN
          </div>
        </div>

        <div class="col-md-12 col-sm-6">
          <div class="text-morado text-center alumniSans-light texto-sub1">
            {{ $t('subtInicio') }}
          </div>
        </div>

        <div class="col-md-12 col-sm-6">
          <div class="text-azul-oscuro text-center alumniSans-regular texto-sub2">
            {{ $t('resInicio') }}
          </div>
        </div>

        <q-space class="q-mt-md"></q-space>

        <div class="col-auto">
          <div class="row flex-center q-gutter-lg">
            <div class="col-auto">
              <q-btn :label="$t('etqReg1')" class="adventPro-regular" color="naranja-claro" icon="fas fa-plus"
                     rounded @click="abrirRegistro" size="lg"/>
            </div>
            <div class="col-auto">
              <q-btn :label="$t('etqInic1')" class="adventPro-regular" color="naranja-claro" icon="fas fa-right-to-bracket"
                     rounded @click="abrirInicioSesion" size="lg"/>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--Inicio logo-->
    <registro-component v-if="formAbierto && formRegistro" @abrir-inicio-sesion="abrirInicioSesion"></registro-component>
    <inicio-sesion-component v-if="formAbierto && formInicio" @abrir-registro="abrirRegistro"></inicio-sesion-component>
  </q-page>
</template>

<script setup>
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

<style scoped>
@media screen and (max-width: 576px) {
  .texto-inclu {
    font-size: 2.85rem;
  }

  .texto-sub1 {
    font-size: 1.3rem;
  }

  .texto-sub2 {
    font-size: 1.1rem;
  }

  .logo-inclu {
    width: 30%;
    position: relative;
    right: 11px;
    top: 20px
  }

  .contenedor {
    width: 85%;
  }
}

/* Estilos para pantallas medianas y grandes */
@media screen and (min-width: 577px) {
  .texto-inclu {
    font-size: 6rem;
  }

  .texto-sub1 {
    font-size: 2rem;
  }

  .texto-sub2 {
    font-size: 1.5rem;
    margin-bottom: .8rem;
  }

  .logo-inclu {
    width: 35%;
    position: relative;
    right: 22px;
    top: 30px
  }

  .contenedor {
    width: 50%;
  }
}
</style>


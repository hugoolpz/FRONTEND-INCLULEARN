<template>
  <q-page padding :class="!formAbierto ? 'bg-image-logo' : 'bg-image-forms'">
    <div class="row flex-center" v-if="!formAbierto" key="form">
      <div class="col-6 q-ml-xl q-pl-xl q-my-xl">
        <transition appear enter-from-class="animated zoomOutDown" enter-to-class="animated zoomInDown"
          enter-active-class="anim-dur-1s">
          <div>
            <div class="column relative-position" style="left: 158px; top: 5px">
              <img src="src\assets\gorro-logo.png" style="width: 210px" alt="" />
            </div>
            <div class="text-azul-oscuro text-left text-h1 adventPro-semiBold" style="
              text-shadow: 0 3px 3px rgba(137, 137, 137, 0.75);
              letter-spacing: 0.21rem;
            ">
              INCL<span class="text-naranja">U | L</span>EARN
            </div>
          </div>
        </transition>
        <q-space class="q-mb-md" />
        <transition appear enter-from-class="animated zoomOutDown" enter-to-class="animated zoomInDown"
          enter-active-class="anim-dur-1s">
          <div style="font-size: 40px;" class="text-morado text-left text-h4 q-ml-sm alumniSans-light">
            PLATAFORMA EDUCATIVA ADAPTADA PARA TODOS
          </div>
        </transition>
        <transition appear enter-from-class="animated zoomOutDown" enter-to-class="animated zoomInDown"
          enter-active-class="anim-dur-1s">
          <div>
            <div class="text-azul-oscuro text-h5 q-ml-sm text-justify alumniSans-regular"
              style="max-width: 530px; line-height: 1.2em">
              Aquí, creamos un mundo de aprendizaje donde la diversidad es
              celebrada y la accesibilidad es la norma. Imagina un espacio
              educativo que se adapta a cada individuo, sin importar sus
              habilidades, y que fomenta la conexión global entre estudiantes y
              educadores.
            </div>
          </div>
        </transition>
      </div>
      <transition appear enter-from-class="animated zoomInLeft" enter-to-class="animated zoomInRight"
        enter-active-class="anim-dur-1s">
        <div class="col q-gutter-y-xl q-mt-xl q-pt-xl">
          <div class="column flex-center">
            <q-btn color="naranja-claro" class="adventPro-regular" style="width: 300px; font-size: 28px" rounded size="xl"
              icon="mdi-plus" label="REGISTRARSE" @click="abrirRegistro" />
          </div>
          <div class="column flex-center">
            <q-btn color="naranja-claro" class="adventPro-regular" rounded style="width: 300px; font-size: 28px" size="xl"
              icon="mdi-login" label="INICIAR SESIÓN" @click="abrirInicioSesion" />
          </div>
        </div>
      </transition>
    </div>

    <transition appear enter-from-class="animated fadeOut" enter-to-class="animated fadeIn"
      enter-active-class="anim-dur-1s">
      <registro-component v-if="formAbierto && formRegistro"
        @abrir-inicio-sesion="abrirInicioSesion"></registro-component>
    </transition>

    <transition appear enter-from-class="animated fadeOut" enter-to-class="animated fadeIn"
      enter-active-class="anim-dur-1s">
      <inicio-sesion-component v-if="formAbierto && formInicio" @abrir-registro="abrirRegistro"></inicio-sesion-component>
    </transition>
  </q-page>
</template>

<script setup>
document.body.style.overflow = "hidden"
import InicioSesionComponent from "src/components/InicioSesionComponent.vue";
import RegistroComponent from "src/components/RegistroComponent.vue";
import { ref } from "vue";
const formAbierto = ref(false);
const formRegistro = ref(false);
const formInicio = ref(false);

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

console.log(window.localStorage)
</script>

<template>
  <div class="q-mt-lg">
    <div align="center" class="text-h4 text-azul-oscuro adventPro-semiBold text-uppercase">
      {{ $t('etqReg2') }}
    </div>
    <div class="column flex-center">
      <div class="row flex-center formReg q-mt-md">
        <div class="col">
          <q-form
            class="q-gutter-md row flex-center"
            @reset="onReset"
            @submit="registrarse">
            <div class="col-xs-4 col-md-4">
              <q-input v-model="nombre" :label="$t('labNombre')" :rules="[val => !!val]"
                       class="alumniSans-regular text-body1"
                       color="morado"
                       lazy-rules
                       outlined rounded type="text"/>
            </div>
            <div class="col-xs-6 col-md-6">
              <q-input v-model="apellidos" :label="$t('labApellidos')" :rules="[val => !!val]"
                       class="alumniSans-regular text-body1" color="morado"
                       lazy-rules
                       outlined rounded type="text"/>
            </div>
            <div class="col-xs-10 col-md-10 q-my-xs">
              <q-input v-model="correo" :label="$t('labCorreo')" :rules="[
                            (val) => validarEmail(val),
                        ]" class="alumniSans-regular text-body1"
                       color="morado"
                       lazy-rules
                       outlined rounded type="email"/>
            </div>
            <div class="col-xs-10 col-md-10 q-my-xs">
              <q-input v-model="contra" :rules="[
                            (val) => validarContrasena(val),
                        ]" :type="!esContra ? 'password' : 'text'" class="alumniSans-regular text-body1"
                       color="morado"
                       hint='Mínimo 1 mayúscula, minúscula, carácter especial, número y 8 caracteres'
                       :label="$t('labContra')" lazy-rules outlined rounded>
                <template v-slot:error>
                  Falta al menos
                  <span v-if="!tieneMinusculas">
                      1 minúscula.
                  </span>
                            <span v-if="!tieneMayusculas">
                      1 mayúscula.
                  </span>
                            <span v-if="!tieneNumeros">
                      1 número.
                  </span>
                            <span v-if="!tieneSimbolos">
                      1 carácter especial.
                  </span>
                            <span v-if="!tieneLongitud">
                      Una longitud de 8 caracteres.
                  </span>
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="esContra ? 'fas fa-eye' : 'fas fa-eye-slash'"
                    class="cursor-pointer"
                    @click="esContra = !esContra"
                  />
                </template>
              </q-input>
            </div>
            <div class="col-xs-1 col-md-1 q-mr-lg">
              <q-avatar class="avatar">
                <img alt="foto de perfil"
                     src="https://med.virginia.edu/diabetes-technology/wp-content/uploads/sites/265/2020/10/Blank-Avatar.png"
                     style="border: 1px solid #824b86;"/>
              </q-avatar>
            </div>
            <div class="col-xs-8 col-md-8">
              <q-file v-model="fotoPerfil" :label="$t('labFoto')" accept=".jpg,.png,.gif"
                      class="alumniSans-regular text-body1" color="morado"
                      outlined rounded type="file" aria-label="Foto de perfil"
                      use-chips @rejected="alRechazar">
                <template v-slot:append>
                  <q-icon class="cursor-pointer" name="fas fa-file-arrow-up"/>
                </template>
              </q-file>
            </div>
            <div class="col-auto">
              <div align="center" class="text-h6 text-azul-oscuro adventPro-regular q-mb-sm">
                <span class="q-mr-sm">{{ $t('etqHaciaInic') }}</span>
                <span aria-label="Hacia inicio de sesión" class="cursor-pointer hover-underline-animation text-uppercase"
                      @click="$emit('abrirInicioSesion')" tabindex="0">
                    {{ $t('etqInic2') }}
                </span>
              </div>
              <q-btn :label="$t('etqCrearCuenta')" :loading="cargando" class="adventPro-regular text-weight-bold"
                     color="morado"
                     rounded size="lg"
                     style="width: 100%; letter-spacing: 0.10rem;" type="submit"/>
            </div>
          </q-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import api from 'src/boot/httpSingleton';
import {useQuasar} from 'quasar'

//Variables form
const nombre = ref("")
const apellidos = ref("")
const correo = ref("")
const fotoPerfil = ref()
const fecha = ref("")
const fechaInput = ref("")
const contra = ref("")
const cargando = ref(false)
const tieneMinusculas = ref(false)
const tieneMayusculas = ref(false)
const tieneNumeros = ref(false)
const tieneSimbolos = ref(false)
const tieneLongitud = ref(false)
const esContra = ref(false)
//URL de la API REST
const urlApi = api

//Notify
const $q = useQuasar()

//Emits
const emits = defineEmits(['abrirInicioSesion'])

//Funciones
function registrarse() {
  cargando.value = true
  fetch(`${urlApi}/usuarios`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "nombre": nombre.value,
      "apellidos": apellidos.value,
      "correo": correo.value,
      "contra": contra.value,
      "rol": "Alumno",
      "url_foto": "./"
    })
  })
    .then(respuesta => respuesta.json())
    .then(datos => {
      if (!datos.exito) {
        $q.notify({
          message: "¡Hubo un error al intentar registrarte!",
          color: "negative",
          position: "top",
          timeout: 500,
          progress: true,
          icon: "fas fa-circle-exclamation",
        });
        cargando.value = false
      } else {
        $q.notify({
          message: "¡Te has registrado correctamente!",
          color: "positive",
          position: "top",
          timeout: 500,
          progress: true,
          icon: "fas fa-circle-check",
        });
        cargando.value = false
        emits('abrirInicioSesion')
      }
    })
}

/*function ponerFechaActual() {
  let fechaNueva = new Date();
  let dia = fechaNueva.getDate();
  let mes = fechaNueva.getMonth() + 1;
  let ano = fechaNueva.getFullYear();
  fechaInput.value = `${dia}/${mes}/${ano}`
}

function quitarCeroDelMes(fechaMandada) {
  let partes = fechaMandada.split('/');
  let ano = partes[0];
  let mes = partes[1];
  let dia = partes[2];

  mes = mes.startsWith('0') ? mes.substring(1) : mes;

  fecha.value = `${dia}/${mes}/${ano}`
}*/

function alRechazar(entries) {
  if (entries.length > 0) {
    switch (entries[0].failedPropValidation) {
      case 'max-file-size':
        this.$q.notify({
          position: 'top',
          type: 'negative',
          message: 'El archivo excede el límite de 5MB'
        })

        break
    }
  }
}

function validarEmail(correoElegido) {
  return /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(correoElegido);
}

function validarContrasena(contrasena) {
  let minusculas = /[a-z]/g;
  let mayusculas = /[A-Z]/g;
  let numeros = /[0-9]/g;
  let simbolos = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

  tieneMinusculas.value = !!contrasena.match(minusculas);

  tieneMayusculas.value = !!contrasena.match(mayusculas);

  tieneNumeros.value = !!contrasena.match(numeros);

  tieneSimbolos.value = !!contrasena.match(simbolos)

  tieneLongitud.value = contrasena.length >= 8

  return !!(contrasena.match(minusculas) &&
    contrasena.match(mayusculas) &&
    contrasena.match(numeros) &&
    contrasena.match(simbolos) &&
    contrasena.length >= 8);
}

</script>

<style scoped>
@media screen and (max-width: 576px) {
  .formReg {
    width: 100%;
  }

  .avatar {
    font-size: 4rem;
  }
}

/* Estilos para pantallas medianas y grandes */
@media screen and (min-width: 577px) {
  .formReg {
    width: 50%;
  }

  .avatar {
    font-size: 5rem;
  }
}
</style>


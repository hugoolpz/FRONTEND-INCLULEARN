<template>
  <q-page>
    <div v-if="$route.params.grupo === ''">
      <div class="q-gutter-lg row q-mt-md flex-center">
        <div v-for="grupo in grupos">
          <tarjeta-equipo :color="grupo.color" :es-creador="grupo.creador === infoUsuario._id" :icono="grupo.icono"
                          :nombre="grupo.nombre"
                          @al-clickar="entrarEnGrupo(grupo.codigo_acceso)"
                          @agregar-miembro="abrirDialogoMiembro(grupo._id)"
                          @agregar-canal="abrirDialogoCanal(grupo._id)"
                          @abandonar-grupo="abandonarGrupo(grupo._id)"
                          @eliminar-grupo="eliminarGrupo(grupo._id)"></tarjeta-equipo>
        </div>
      </div>

      <q-dialog v-model="nuevoMiembro">
        <q-card style="width: 100%; max-width: 400px">
          <q-card-section>
            <div class="text-h5 text-center adventPro-semiBold">Escribe el correo de la persona que deseas agregar:
            </div>
          </q-card-section>

          <q-card-section>
            <q-form
              class="q-gutter-lg"
              @reset="onReset"
              @submit="agregarMiembro">
              <q-input
                v-model="correoMiembro"
                :rules="[ val => val && val.length > 0 || $t('campoReq')]"
                class="no-padding alumniSans-regular text-body1"
                color="morado"
                filled
                label="Correo del miembro"
                lazy-rules
              />
              <div align="right">
                <q-btn class="adventPro-semiBold" color="naranja" label="Agregar" type="submit"/>
                <q-btn v-close-popup :label="$t('etiquetaCancelar')" class="q-ml-sm adventPro-semiBold"
                       color="naranja-claro"
                       flat type="reset"/>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-dialog v-model="nuevoGrupo">
        <q-card style="width: 100%; max-width: 450px">
          <q-tabs
            v-model="tabGrupo"
            class="text-naranja-claro"
            inline-label>
            <q-tab :label="$t('etiquetaCrear')" class="adventPro-semiBold" icon="fas fa-plus" name="crear"/>
            <q-tab class="adventPro-semiBold" icon="fa fa-user-plus" label="UNIRSE" name="unirse"/>
          </q-tabs>

          <q-tab-panels v-model="tabGrupo" animated>
            <q-tab-panel name="crear">
              <q-card-section>
                <q-form
                  class="q-gutter-lg"
                  @reset="onReset"
                  @submit="crearGrupo">
                  <div class="text-h5 adventPro-semiBold">Crear un grupo:</div>
                  <q-input
                    v-model="nombreGrupo"
                    :rules="[ val => val && val.length > 0 || $t('campoReq')]"
                    class="no-padding alumniSans-regular text-body1"
                    color="morado"
                    filled
                    label="Nombre del grupo"
                    lazy-rules
                  />
                  <q-input
                    v-model="descripcionGrupo"
                    :rules="[ val => val && val.length > 0 || $t('campoReq')]"
                    autogrow
                    class="no-padding alumniSans-regular text-body1"
                    color="morado"
                    filled
                    label="Descripción del grupo"
                    lazy-rules
                  />
                  <input-iconos-component v-model="iconoGrupo"></input-iconos-component>
                  <input-color-component v-model="colorGrupo"></input-color-component>
                  <div align="right">
                    <q-btn :label="$t('etiquetaCrear')" class="adventPro-semiBold" color="naranja" type="submit"/>
                    <q-btn v-close-popup :label="$t('etiquetaCancelar')" class="q-ml-sm adventPro-semiBold"
                           color="naranja-claro"
                           flat type="reset"/>
                  </div>
                </q-form>
              </q-card-section>
            </q-tab-panel>
            <q-tab-panel name="unirse">
              <q-card-section>
                <q-form
                  class="q-gutter-lg"
                  @reset="onReset"
                  @submit="unirsePorCodigo">
                  <div class="text-h5 adventPro-semiBold">¡Introduce el código de un grupo y únete!</div>
                  <q-input
                    v-model="codigoGrupo"
                    :rules="[ val => val && val.length > 0 || $t('campoReq')]"
                    class="no-padding alumniSans-regular text-body1"
                    color="morado"
                    filled
                    label="Código del grupo"
                    lazy-rules
                  />
                  <div align="right">
                    <q-btn class="adventPro-semiBold" color="naranja" label="UNIRSE" type="submit"/>
                    <q-btn v-close-popup :label="$t('etiquetaCancelar')" class="q-ml-sm adventPro-semiBold"
                           color="naranja-claro"
                           flat type="reset"/>
                  </div>
                </q-form>
              </q-card-section>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </q-dialog>

      <q-dialog v-model="nuevoCanal">
        <q-card style="width: 100%; max-width: 450px">
          <q-card-section>
            <q-form
              class="q-gutter-lg"
              @reset="onReset"
              @submit="crearCanal">
              <div class="text-h5 adventPro-semiBold">Crear un canal:</div>
              <q-input
                v-model="nombreCanal"
                :rules="[ val => val && val.length > 0 || $t('campoReq')]"
                class="no-padding alumniSans-regular text-body1"
                color="morado"
                filled
                label="Nombre del canal"
                lazy-rules
              />
              <q-input
                v-model="descripcionCanal"
                :rules="[ val => val && val.length > 0 || $t('campoReq')]"
                autogrow
                class="no-padding alumniSans-regular text-body1"
                color="morado"
                filled
                label="Descripción del canal"
                lazy-rules
              />
              <div align="right">
                <q-btn :label="$t('etiquetaCrear')" class="adventPro-semiBold" color="naranja" type="submit"/>
                <q-btn v-close-popup :label="$t('etiquetaCancelar')" class="q-ml-sm adventPro-semiBold"
                       color="naranja-claro"
                       flat type="reset"/>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
    <div v-else>
      <vista-equipo-component :grupo-actual="grupoActual" :ver-canales="verCanales" :key="componentKey" :es-creador="grupoActual.creador._id === infoUsuario._id"
                              @agregar-miembro="abrirDialogoMiembro(grupoActual._id)"
                              @agregar-canal="abrirDialogoCanal(grupoActual._id)"
                              @abandonar-grupo="abandonarGrupo(grupoActual._id)"
                              @eliminar-grupo="eliminarGrupo(grupoActual._id)">
      </vista-equipo-component>

      <q-dialog v-model="nuevoMiembro">
        <q-card style="width: 100%; max-width: 400px">
          <q-card-section>
            <div class="text-h5 text-center adventPro-semiBold">Escribe el correo de la persona que deseas agregar:
            </div>
          </q-card-section>

          <q-card-section>
            <q-form
              class="q-gutter-lg"
              @reset="onReset"
              @submit="agregarMiembroDesdeGrupo">
              <q-input
                v-model="correoMiembro"
                :rules="[ val => val && val.length > 0 || $t('campoReq')]"
                class="no-padding alumniSans-regular text-body1"
                color="morado"
                filled
                label="Correo del miembro"
                lazy-rules
              />
              <div align="right">
                <q-btn class="adventPro-semiBold" color="naranja" label="Agregar" type="submit"/>
                <q-btn v-close-popup :label="$t('etiquetaCancelar')" class="q-ml-sm adventPro-semiBold"
                       color="naranja-claro"
                       flat type="reset"/>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-dialog v-model="nuevoGrupo">
        <q-card style="width: 100%; max-width: 450px">
          <q-tabs
            v-model="tabGrupo"
            class="text-naranja-claro"
            inline-label>
            <q-tab :label="$t('etiquetaCrear')" class="adventPro-semiBold" icon="fas fa-plus" name="crear"/>
            <q-tab class="adventPro-semiBold" icon="fa fa-user-plus" label="UNIRSE" name="unirse"/>
          </q-tabs>

          <q-tab-panels v-model="tabGrupo" animated>
            <q-tab-panel name="crear">
              <q-card-section>
                <q-form
                  class="q-gutter-lg"
                  @reset="onReset"
                  @submit="crearGrupo">
                  <div class="text-h5 adventPro-semiBold">Crear un grupo:</div>
                  <q-input
                    v-model="nombreGrupo"
                    :rules="[ val => val && val.length > 0 || $t('campoReq')]"
                    class="no-padding alumniSans-regular text-body1"
                    color="morado"
                    filled
                    label="Nombre del grupo"
                    lazy-rules
                  />
                  <q-input
                    v-model="descripcionGrupo"
                    :rules="[ val => val && val.length > 0 || $t('campoReq')]"
                    autogrow
                    class="no-padding alumniSans-regular text-body1"
                    color="morado"
                    filled
                    label="Descripción del grupo"
                    lazy-rules
                  />
                  <input-iconos-component v-model="iconoGrupo"></input-iconos-component>
                  <input-color-component v-model="colorGrupo"></input-color-component>
                  <div align="right">
                    <q-btn :label="$t('etiquetaCrear')" class="adventPro-semiBold" color="naranja" type="submit"/>
                    <q-btn v-close-popup :label="$t('etiquetaCancelar')" class="q-ml-sm adventPro-semiBold"
                           color="naranja-claro"
                           flat type="reset"/>
                  </div>
                </q-form>
              </q-card-section>
            </q-tab-panel>
            <q-tab-panel name="unirse">
              <q-card-section>
                <q-form
                  class="q-gutter-lg"
                  @reset="onReset"
                  @submit="unirsePorCodigo">
                  <div class="text-h5 adventPro-semiBold">¡Introduce el código de un grupo y únete!</div>
                  <q-input
                    v-model="codigoGrupo"
                    :rules="[ val => val && val.length > 0 || $t('campoReq')]"
                    class="no-padding alumniSans-regular text-body1"
                    color="morado"
                    filled
                    label="Código del grupo"
                    lazy-rules
                  />
                  <div align="right">
                    <q-btn class="adventPro-semiBold" color="naranja" label="UNIRSE" type="submit"/>
                    <q-btn v-close-popup :label="$t('etiquetaCancelar')" class="q-ml-sm adventPro-semiBold"
                           color="naranja-claro"
                           flat type="reset"/>
                  </div>
                </q-form>
              </q-card-section>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </q-dialog>

      <q-dialog v-model="nuevoCanal">
        <q-card style="width: 100%; max-width: 450px">
          <q-card-section>
            <q-form
              class="q-gutter-lg"
              @reset="onReset"
              @submit="crearCanalDesdeGrupo">
              <div class="text-h5 adventPro-semiBold">Crear un canal:</div>
              <q-input
                v-model="nombreCanal"
                :rules="[ val => val && val.length > 0 || $t('campoReq')]"
                class="no-padding alumniSans-regular text-body1"
                color="morado"
                filled
                label="Nombre del canal"
                lazy-rules
              />
              <q-input
                v-model="descripcionCanal"
                :rules="[ val => val && val.length > 0 || $t('campoReq')]"
                autogrow
                class="no-padding alumniSans-regular text-body1"
                color="morado"
                filled
                label="Descripción del canal"
                lazy-rules
              />
              <div align="right">
                <q-btn :label="$t('etiquetaCrear')" class="adventPro-semiBold" color="naranja" type="submit"/>
                <q-btn v-close-popup :label="$t('etiquetaCancelar')" class="q-ml-sm adventPro-semiBold"
                       color="naranja-claro"
                       flat type="reset"/>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import TarjetaArchivoComponent from "components/TarjetaArchivoComponent.vue";
import TarjetaEquipo from "components/TarjetaEquipoComponent.vue";
import {QSpinnerHourglass, useQuasar} from "quasar";
import api from "boot/httpSingleton";
import {onMounted, onUpdated, ref, watch} from "vue";
import {useRouter, useRoute, onBeforeRouteUpdate} from "vue-router";
import InputIconosComponent from "components/InputIconosComponent.vue";
import InputColorComponent from "components/InputColorComponent.vue";
import VistaEquipoComponent from "components/VistaEquipoComponent.vue";

document.body.style.overflow = "scroll"
const localStorage = window.localStorage
let infoUsuario = null

if (localStorage.infoUsuario) {
  infoUsuario = JSON.parse(localStorage.infoUsuario)
}

const router = useRouter()
const route = useRoute()
const $q = useQuasar()
const urlApi = api
const grupos = ref([])

const nuevoGrupo = defineModel()
const nuevoMiembro = ref(false)
const nuevoCanal = ref(false)
const verCanales = ref(true)
const tabGrupo = ref('crear')
const componentKey = ref(0)

//Formulario
const nombreGrupo = ref("")
const descripcionGrupo = ref("")
const nombreCanal = ref("")
const descripcionCanal = ref("")
const iconoGrupo = ref("fas fa-user-group")
const colorGrupo = ref("")
const codigoGrupo = ref("")
const correoMiembro = ref("")
const grupoElegido = ref("")

const grupoActual = ref()

onMounted(() => {
  comprobarSesion()
})

onBeforeRouteUpdate(async (to, from) => {
  if (to.params.grupo !== '') {
    await obtenerInfoGrupo(to.params.grupo);
  } else {
    await obtenerGrupos()
  }
})

async function comprobarSesion() {
  if (localStorage.infoUsuario) {
    await fetch(`${urlApi}/usuarios/${infoUsuario._id}`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(respuesta => respuesta.json())
      .then(datos => {
        if (!datos.datos) {
          $q.notify({
            message: "Este usuario no existe",
            color: "negative",
            position: "top",
            timeout: 1000,
            progress: true,
            icon: "fas fa-xmark"
          });
          router.push({path: "/"})
        } else {
          if (route.params.grupo === ''){
            obtenerGrupos()
          }
        }
      })
  } else {
    $q.notify({
      message: "No tienes permisos para entrar ahí",
      color: "negative",
      position: "top",
      timeout: 1000,
      progress: true,
      icon: "fas fa-xmark"
    });
    await router.push({path: "/"})
  }
}

async function crearGrupo() {
  let codigoNuevo = ""
  mostrarCarga()
  await fetch("https://random-word-api.herokuapp.com/word?lang=es")
    .then(respuesta => respuesta.json())
    .then(datos => {
      codigoNuevo = datos[0]
    })

  if (iconoGrupo.value === "") {
    iconoGrupo.value = "fas fa-user-group"
  }

  if (colorGrupo.value === "") {
    colorGrupo.value = "#824b86"
  }

  await fetch(`${urlApi}/grupos`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'token-privado': localStorage.tokenPrivado
    },
    body: JSON.stringify({
      "creador": infoUsuario._id,
      "nombre": nombreGrupo.value,
      "descripcion": descripcionGrupo.value,
      "miembros": [infoUsuario._id],
      "codigo_acceso": codigoNuevo,
      "icono": iconoGrupo.value,
      "color": colorGrupo.value,
    })
  })
    .then(respuesta => respuesta.json())
    .then(datos => {
      if (!datos.exito) {
        $q.notify({
          message: "¡Hubo un error al intentar crear el grupo!",
          color: "negative",
          position: "top",
          timeout: 1000,
          progress: true,
          icon: "fas fa-circle-exclamation",
        });
      } else {
        fetch(`${urlApi}/usuarios/${infoUsuario._id}`, {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json',
            'token-privado': localStorage.tokenPrivado
          },
          body: JSON.stringify({
            "grupos": datos.datos._id
          })
        })
          .then(respuesta => respuesta.json())
          .then(datos => {
            if (!datos.exito) {
              $q.notify({
                message: "¡Hubo un error al intentar crear el grupo!",
                color: "negative",
                position: "top",
                timeout: 1000,
                progress: true,
                icon: "fas fa-circle-exclamation",
              });
              console.log(datos)
              //TODO: Borrar el evento previamente creado
            } else {
              $q.notify({
                message: "¡Grupo creado con éxito!",
                color: "positive",
                position: "top",
                timeout: 1000,
                progress: true,
                icon: "fas fa-circle-check",
              });
              obtenerGrupos()
            }
          })
      }
    })
  nuevoGrupo.value = false
  $q.loading.hide()
}

async function crearCanal() {
  mostrarCarga()

  await fetch(`${urlApi}/canales`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'token-privado': localStorage.tokenPrivado
    },
    body: JSON.stringify({
      "creador": infoUsuario._id,
      "nombre": nombreCanal.value,
      "descripcion": descripcionCanal.value,
    })
  })
    .then(respuesta => respuesta.json())
    .then(datos => {
      if (!datos.exito) {
        $q.notify({
          message: "¡Hubo un error al intentar crear el canal!",
          color: "negative",
          position: "top",
          timeout: 1000,
          progress: true,
          icon: "fas fa-circle-exclamation",
        });
      } else {
        fetch(`${urlApi}/grupos/${grupoElegido.value}`, {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json',
            'token-privado': localStorage.tokenPrivado
          },
          body: JSON.stringify({
            "canales": datos.datos._id
          })
        })
          .then(respuesta => respuesta.json())
          .then(datos => {
            if (!datos.exito) {
              $q.notify({
                message: "¡Hubo un error al intentar crear el canal!",
                color: "negative",
                position: "top",
                timeout: 1000,
                progress: true,
                icon: "fas fa-circle-exclamation",
              });
              console.log(datos)
              //TODO: Borrar el canal previamente creado
            } else {
              $q.notify({
                message: "¡Canal creado con éxito!",
                color: "positive",
                position: "top",
                timeout: 1000,
                progress: true,
                icon: "fas fa-circle-check",
              });
            }
          })
      }
    })
  nuevoCanal.value = false
  $q.loading.hide()
}

async function crearCanalDesdeGrupo() {
  mostrarCarga()

  await fetch(`${urlApi}/canales`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'token-privado': localStorage.tokenPrivado
    },
    body: JSON.stringify({
      "creador": infoUsuario._id,
      "nombre": nombreCanal.value,
      "descripcion": descripcionCanal.value,
    })
  })
    .then(respuesta => respuesta.json())
    .then(datos => {
      if (!datos.exito) {
        $q.notify({
          message: "¡Hubo un error al intentar crear el canal!",
          color: "negative",
          position: "top",
          timeout: 1000,
          progress: true,
          icon: "fas fa-circle-exclamation",
        });
      } else {
        fetch(`${urlApi}/grupos/${grupoActual.value._id}`, {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json',
            'token-privado': localStorage.tokenPrivado
          },
          body: JSON.stringify({
            "canales": datos.datos._id
          })
        })
          .then(respuesta => respuesta.json())
          .then(datos => {
            if (!datos.exito) {
              $q.notify({
                message: "¡Hubo un error al intentar crear el canal!",
                color: "negative",
                position: "top",
                timeout: 1000,
                progress: true,
                icon: "fas fa-circle-exclamation",
              });
              //TODO: Borrar el canal previamente creado
            } else {
              $q.notify({
                message: "¡Canal creado con éxito!",
                color: "positive",
                position: "top",
                timeout: 1000,
                progress: true,
                icon: "fas fa-circle-check",
              });
              obtenerInfoGrupo(grupoActual.value.codigo_acceso)
              componentKey.value++
            }
          })
      }
    })
  nuevoCanal.value = false
  $q.loading.hide()
}

async function obtenerGrupos() {
  grupos.value.length = 0
  mostrarCarga()
  await fetch(`${urlApi}/usuarios/${infoUsuario._id}`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'token-privado': localStorage.tokenPrivado
    }
  })
    .then(respuesta => respuesta.json())
    .then(datos => {
      if (!datos.exito) {
        $q.notify({
          message: "¡Hubo un error al intentar obtener tus grupos!",
          color: "negative",
          position: "top",
          timeout: 1000,
          progress: true,
          icon: "fas fa-circle-exclamation",
        });
      } else {
        if (datos.datos) {
          datos.datos.grupos.forEach((grupo) => {
            grupos.value.push(grupo)
          })
        } else {
          $q.notify({
            message: "¡No tienes grupos! Prueba a crear o unirte a uno",
            color: "negative",
            position: "top",
            timeout: 1000,
            progress: true,
            icon: "fas fa-circle-exclamation",
          });
        }
      }

    })
  $q.loading.hide()
}

function abrirDialogoMiembro(id) {
  nuevoMiembro.value = true;
  grupoElegido.value = id
}

function abrirDialogoCanal(id) {
  nuevoCanal.value = true;
  grupoElegido.value = id
}

async function agregarMiembro() {
  await fetch(`${urlApi}/usuarios/correo/${correoMiembro.value}`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'token-privado': localStorage.tokenPrivado
    },
  })
    .then(respuesta => respuesta.json())
    .then(datos => {
      if (!datos.exito) {
        $q.notify({
          message: "¡Hubo un error al intentar agregar al miembro al grupo!",
          color: "negative",
          position: "top",
          timeout: 1000,
          progress: true,
          icon: "fas fa-circle-exclamation",
        });
      } else {
        if (datos.datos) {
          let idMiembro = datos.datos._id
          let nombreMiembro = datos.datos.nombre + " " + datos.datos.apellidos
          fetch(`${urlApi}/usuarios/${idMiembro}`, {
            method: "PUT",
            headers: {
              'Content-Type': 'application/json',
              'token-privado': localStorage.tokenPrivado
            },
            body: JSON.stringify({
              "grupos": grupoElegido.value
            })
          })
            .then(respuesta => respuesta.json())
            .then(datos => {
              if (!datos.exito) {
                $q.notify({
                  message: "¡Hubo un error al intentar agregar al miembro al grupo!",
                  color: "negative",
                  position: "top",
                  timeout: 1000,
                  progress: true,
                  icon: "fas fa-circle-exclamation",
                });
              } else {
                fetch(`${urlApi}/grupos/${grupoElegido.value}`, {
                  method: "PUT",
                  headers: {
                    'Content-Type': 'application/json',
                    'token-privado': localStorage.tokenPrivado
                  },
                  body: JSON.stringify({
                    "miembros": idMiembro
                  })
                })
                  .then(respuesta => respuesta.json())
                  .then(datos => {
                    if (!datos.exito) {
                      $q.notify({
                        message: "¡Hubo un error al intentar agregar al miembro al grupo!",
                        color: "negative",
                        position: "top",
                        timeout: 1000,
                        progress: true,
                        icon: "fas fa-circle-exclamation",
                      });
                    } else {
                      $q.notify({
                        message: "¡Se agregó a " + nombreMiembro + " con éxito!",
                        color: "positive",
                        position: "top",
                        timeout: 1000,
                        progress: true,
                        icon: "fas fa-circle-check",
                      });
                      nuevoMiembro.value = false
                    }
                  })
              }
            })
        } else {
          $q.notify({
            message: "¡No tenemos registros de una cuenta con ese correo!",
            color: "negative",
            position: "top",
            timeout: 1000,
            progress: true,
            icon: "fas fa-circle-exclamation",
          });
        }
      }
    })
}

async function agregarMiembroDesdeGrupo() {
  await fetch(`${urlApi}/usuarios/correo/${correoMiembro.value}`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'token-privado': localStorage.tokenPrivado
    },
  })
    .then(respuesta => respuesta.json())
    .then(datos => {
      if (!datos.exito) {
        $q.notify({
          message: "¡Hubo un error al intentar agregar al miembro al grupo!",
          color: "negative",
          position: "top",
          timeout: 1000,
          progress: true,
          icon: "fas fa-circle-exclamation",
        });
      } else {
        if (datos.datos) {
          let idMiembro = datos.datos._id
          let nombreMiembro = datos.datos.nombre + " " + datos.datos.apellidos
          fetch(`${urlApi}/usuarios/${idMiembro}`, {
            method: "PUT",
            headers: {
              'Content-Type': 'application/json',
              'token-privado': localStorage.tokenPrivado
            },
            body: JSON.stringify({
              "grupos": grupoActual.value._id
            })
          })
            .then(respuesta => respuesta.json())
            .then(datos => {
              if (!datos.exito) {
                $q.notify({
                  message: "¡Hubo un error al intentar agregar al miembro al grupo!",
                  color: "negative",
                  position: "top",
                  timeout: 1000,
                  progress: true,
                  icon: "fas fa-circle-exclamation",
                });
              } else {
                fetch(`${urlApi}/grupos/${grupoActual.value._id}`, {
                  method: "PUT",
                  headers: {
                    'Content-Type': 'application/json',
                    'token-privado': localStorage.tokenPrivado
                  },
                  body: JSON.stringify({
                    "miembros": idMiembro
                  })
                })
                  .then(respuesta => respuesta.json())
                  .then(datos => {
                    if (!datos.exito) {
                      $q.notify({
                        message: "¡Hubo un error al intentar agregar al miembro al grupo!",
                        color: "negative",
                        position: "top",
                        timeout: 1000,
                        progress: true,
                        icon: "fas fa-circle-exclamation",
                      });
                    } else {
                      $q.notify({
                        message: "¡Se agregó a " + nombreMiembro + " con éxito!",
                        color: "positive",
                        position: "top",
                        timeout: 1000,
                        progress: true,
                        icon: "fas fa-circle-check",
                      });
                      nuevoMiembro.value = false
                      entrarEnGrupo(grupoActual.value.codigo_acceso)
                      componentKey.value++
                    }
                  })
              }
            })
        } else {
          $q.notify({
            message: "¡No tenemos registros de una cuenta con ese correo!",
            color: "negative",
            position: "top",
            timeout: 1000,
            progress: true,
            icon: "fas fa-circle-exclamation",
          });
        }
      }
    })
}

async function unirsePorCodigo() {
  await fetch(`${urlApi}/grupos/codigo/${codigoGrupo.value}`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'token-privado': localStorage.tokenPrivado
    },
  })
    .then(respuesta => respuesta.json())
    .then(datos => {
      if (!datos.exito) {
        $q.notify({
          message: "¡Hubo un error al intentar unirse al grupo!",
          color: "negative",
          position: "top",
          timeout: 1000,
          progress: true,
          icon: "fas fa-circle-exclamation",
        });
      } else {
        let idGrupo = datos.datos._id
        let nombre = datos.datos.nombre
        if (datos.datos) {
          fetch(`${urlApi}/usuarios/${infoUsuario._id}`, {
            method: "PUT",
            headers: {
              'Content-Type': 'application/json',
              'token-privado': localStorage.tokenPrivado
            },
            body: JSON.stringify({
              "grupos": idGrupo
            })
          })
            .then(respuesta => respuesta.json())
            .then(datos => {
              if (!datos.exito) {
                $q.notify({
                  message: "¡Hubo un error al intentar unirse al grupo!",
                  color: "negative",
                  position: "top",
                  timeout: 1000,
                  progress: true,
                  icon: "fas fa-circle-exclamation",
                });
              } else {
                fetch(`${urlApi}/grupos/${idGrupo}`, {
                  method: "PUT",
                  headers: {
                    'Content-Type': 'application/json',
                    'token-privado': localStorage.tokenPrivado
                  },
                  body: JSON.stringify({
                    "miembros": infoUsuario._id
                  })
                })
                  .then(respuesta => respuesta.json())
                  .then(datos => {
                    if (!datos.exito) {
                      $q.notify({
                        message: "¡Hubo un error al intentar unirse al grupo!",
                        color: "negative",
                        position: "top",
                        timeout: 1000,
                        progress: true,
                        icon: "fas fa-circle-exclamation",
                      });
                    } else {
                      $q.notify({
                        message: "¡Te uniste al grupo '" + nombre + "' con éxito!",
                        color: "positive",
                        position: "top",
                        timeout: 1000,
                        progress: true,
                        icon: "fas fa-circle-check",
                      });
                      obtenerGrupos()
                      nuevoGrupo.value = false
                    }
                  })
              }
            })
        } else {
          $q.notify({
            message: "¡El código introducido es incorrecto!",
            color: "negative",
            position: "top",
            timeout: 1000,
            progress: true,
            icon: "fas fa-circle-exclamation",
          });
        }
      }
    })
}

async function abandonarGrupo(id) {
  mostrarCarga()
  fetch(`${urlApi}/usuarios/pull/${infoUsuario._id}`, {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
      'token-privado': localStorage.tokenPrivado
    },
    body: JSON.stringify({
      "grupos": id
    })
  })
    .then(respuesta => respuesta.json())
    .then(datos => {
      if (!datos.exito) {
        $q.notify({
          message: "¡Hubo un error al intentar abandonar el grupo!",
          color: "negative",
          position: "top",
          timeout: 1000,
          progress: true,
          icon: "fas fa-circle-exclamation",
        });
      } else {
        fetch(`${urlApi}/grupos/pull/${id}`, {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json',
            'token-privado': localStorage.tokenPrivado
          },
          body: JSON.stringify({
            "miembros": infoUsuario._id
          })
        })
          .then(respuesta => respuesta.json())
          .then(datos => {
            if (!datos.exito) {
              $q.notify({
                message: "¡Hubo un error al intentar abandonar el grupo!",
                color: "negative",
                position: "top",
                timeout: 1000,
                progress: true,
                icon: "fas fa-circle-exclamation",
              });
            } else {
              $q.notify({
                message: "¡Abandonaste el grupo con éxito!",
                color: "positive",
                position: "top",
                timeout: 1000,
                progress: true,
                icon: "fas fa-circle-check",
              });
              router.push('/tus-clases')
            }
          })
      }
    })
  $q.loading.hide()
}

async function eliminarGrupo(id) {
  mostrarCarga()
  await fetch(`${urlApi}/grupos/${id}`, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json',
      'token-privado': localStorage.tokenPrivado
    },
  })
    .then(respuesta => respuesta.json())
    .then(datos => {
      if (!datos.exito) {
        $q.notify({
          message: "¡Hubo un error al intentar eliminar el grupo!",
          color: "negative",
          position: "top",
          timeout: 1000,
          progress: true,
          icon: "fas fa-circle-exclamation",
        });
      } else {
        $q.notify({
          message: "¡Se elimino el grupo con éxito!",
          color: "positive",
          position: "top",
          timeout: 1000,
          progress: true,
          icon: "fas fa-check",
        });
        router.push('/tus-clases')
      }
    })
  $q.loading.hide()
}

function entrarEnGrupo(id) {
  router.push({
    name: 'TusClases',
    params: {grupo: id},
  })
  localStorage.setItem('ultimoGrupo', id)
}

async function obtenerInfoGrupo(id) {
  await fetch(`${urlApi}/grupos/codigo/${id}`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'token-privado': localStorage.tokenPrivado
    },
  })
    .then(respuesta => respuesta.json())
    .then(datos => {
      if (!datos.exito) {
        $q.notify({
          message: "¡Hubo un error al intentar entrar al grupo!",
          color: "negative",
          position: "top",
          timeout: 1000,
          progress: true,
          icon: "fas fa-circle-exclamation",
        });
      } else {
        grupoActual.value = datos.datos
      }
    })
}

function mostrarCarga() {
  $q.loading.show({
    spinner: QSpinnerHourglass,
    spinnerColor: 'naranja',
    spinnerSize: 150,
    backgroundColor: 'morado',
    message: 'Reuniendo tus grupos...',
    messageColor: 'naranja-claro'
  })
}
</script>

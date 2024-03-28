const routes = [
  {
    path: "/",
    component: () => import("layouts/InicioLayout.vue"),
    children: [{path: "", component: () => import("pages/InicioPage.vue")}],
  },
  {
    path: "/plataforma-educativa",
    component: () => import("layouts/PlataformaLayout.vue"),
    children: [
      {
        path: "",
        name: "PlataformaEducativa",
        component: () => import("pages/PlataformaEducativaPage.vue"),
      },
    ],
  },
  {
    path: "/tu-calendario",
    component: () => import("layouts/CalendarioLayout.vue"),
    children: [
      {
        path: "",
        name: "TuCalendario",
        component: () => import("pages/TuCalendarioPage.vue"),
      },
    ],
  },
  {
    path: "/tus-archivos",
    component: () => import("layouts/AlmacenamientoLayout.vue"),
    children: [
      {
        path: "",
        name: "TusArchivos",
        component: () => import("pages/TuAlmacenamientoPage.vue"),
      },
    ],
  },
  {
    path: "/tus-clases/:grupo?",
    component: () => import("layouts/ClasesLayout.vue"),
    children: [
      {
        path: "",
        name: "TusClases",
        component: () => import("pages/TusClasesPage.vue"),
      },
    ],
  },
  {
    path: "/llamada/:canal?",
    component: () => import("layouts/LlamadaLayout.vue"),
    children: [
      {
        path: "",
        name: "Llamada",
        component: () => import("pages/LlamadaPage.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;

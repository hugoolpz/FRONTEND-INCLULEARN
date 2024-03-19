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
        component: () => import("pages/TuCalendarioPage.vue"),
      },
    ],
  },
  {
    path: "/tu-almacenamiento",
    component: () => import("layouts/AlmacenamientoLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/TuAlmacenamientoPage.vue"),
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

const routes = [
  {
    path: "/",
    component: () => import("layouts/PrincipalLayout.vue"),
    children: [{path: "", component: () => import("pages/IndexPage.vue")}],
  },
  {
    path: "/plataformaEducativa",
    component: () => import("layouts/PrincipalLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/PlataformaEducativaPage.vue"),
      },
    ],
  },
  {
    path: "/calendario",
    component: () => import("layouts/CalendarioLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/TuCalendarioPage.vue"),
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

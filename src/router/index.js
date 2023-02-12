import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "LandingPage",
      component: () =>
        import(
          /* webpackChunkName: "LandingPage" */ "../views/LandingPage.vue"
        ),
    },
    {
      path: "/edit",
      name: "EditPage",
      component: () =>
        import(/* webpackChunkName: "LandingPage" */ "../views/EditPage.vue"),
    },
  ],
});

export default router;

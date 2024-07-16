import { createRouter, createWebHistory } from "vue-router"

import home from "../pages/HomePage"
import auth from "../pages/AuthPage"
import admin from "../pages/AdminPage"

const routes = [
  {
    path: "/:id?",
    name: "home",
    component: home,
  },
  {
    path: "/auth",
    name: "auth",
    component: auth,
  },
  {
    path: "/admin/:id?",
    name: "admin",
    component: admin,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  base: '/new_funnels/',
  routes,
  linkActiveClass: 'active-link',
})


// router.beforeEach(async (to, from, next) => {
//   if (to.name === "auth") {
//     next();
//     return;
//   }

//   if (to.name === "admin") {
//     const response = await fetch("https://stat.owen.ru/funnels_api/user/check_admin_auth", {
//       method: "GET",
//       credentials: "same-origin"
//     });

//     if (response.ok) {
//       next();
//     } else {
//       next({ name: "home" });
//     }
//   }

//   try {
//     const response = await fetch("https://stat.owen.ru/funnels_api/user/check_auth", {
//       method: "GET",
//       credentials: "same-origin"
//     });

//     if (response.ok) {
//       next();
//     } else {
//       next({ name: "auth" });
//     }
//   } catch (e) {
//     next({ name: "auth" });
//   }
// });


export default router
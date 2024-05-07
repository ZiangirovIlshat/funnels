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
    path: "/admin:id?",
    name: "admin",
    component: admin,
  },
]


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: 'active-link',
})


export default router

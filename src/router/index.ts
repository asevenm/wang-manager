import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/product',
      name: 'product',
      component: () => import('../views/Product/index.vue')
    },
    {
      path: '/agent',
      name: 'agent',
      component: () => import('../views/Agent.vue')
    },
    {
      path: '/reagent',
      name: 'reagent',
      component: () => import('../views/Reagent.vue')
    },
    {
      path: '/tech',
      name: 'tech',
      component: () => import('../views/Tech.vue')
    },
    {
      path: '/user',
      name: 'user',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/User.vue')
    },
    {
      path: '/bill',
      name: 'bill',
      component: () => import('../views/Bill.vue')
    },
    {
      path: '/chart',
      name: 'chart',
      component: () => import('../views/Chart.vue')
    },
  ]
})

export default router

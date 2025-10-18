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
      path: '/product/add',
      name: 'product-add',
      component: () => import('../views/Product/Add.vue')
    },
    {
      path: '/product/edit/:id',
      name: 'product-edit',
      component: () => import('../views/Product/Edit.vue')
    },
    {
      path: '/agent',
      name: 'agent',
      component: () => import('../views/Agent.vue')
    },
    {
      path: '/agent/add',
      name: 'agent-add',
      component: () => import('../views/Agent/Add.vue')
    },
    {
      path: '/agent/edit/:id',
      name: 'agent-edit',
      component: () => import('../views/Agent/Edit.vue')
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
    {
      path: '/message',
      name: 'message',
      component: () => import('../views/MessageList.vue'),
    },
    {
      path: '/services',
      name: 'services',
      component: () => import('../views/Services.vue'),
    },
    {
      path: '/services/categories/add',
      name: 'service-category-add',
      component: () => import('../views/ServiceCategoryEdit.vue')
    },
    {
      path: '/services/categories/edit/:id',
      name: 'service-category-edit',
      component: () => import('../views/ServiceCategoryEdit.vue')
    },
    {
      path: '/services/add',
      name: 'service-add',
      component: () => import('../views/ServiceEdit.vue')
    },
    {
      path: '/services/edit/:id',
      name: 'service-edit',
      component: () => import('../views/ServiceEdit.vue')
    },
    {
      path: '/company',
      name: 'company',
      component: () => import('../views/Company.vue'),
    },
  ]
})

export default router

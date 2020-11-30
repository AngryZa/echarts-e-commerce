import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  {
    path: '/sellerPage',
    name: 'SellerPage',
    component: resolve =>require(['../views/SellerPage'],resolve)
  },
  {
    path: '/trendPage',
    name: 'TrendPage',
    component: resolve =>require(['../views/TrendPage'],resolve)
  },
  {
    path: '/mapPage',
    name: 'MapPage',
    component: resolve =>require(['../views/MapPage'],resolve)
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

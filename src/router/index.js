import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginPage from '@/views/LoginPage.vue'
import RegisterPage from '@/views/RegisterPage.vue'
import HomePage from '@/views/HomePage.vue'
import DetectPage from '@/views/DetectPage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterPage
  },
  {
    path: '/home',
    name: 'home',
    component: HomePage
  },
  {
    path: '/detect',
    name: 'detect',
    component: DetectPage
  }
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

export default router

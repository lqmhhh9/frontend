import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginPage from '@/views/LoginPage.vue'
import RegisterPage from '@/views/RegisterPage.vue'
import HomePage from '@/views/HomePage.vue'
import DetectPage from '@/views/DetectPage.vue'
import ProfilePage from '@/views/ProfilePage.vue'
import ProfileResultPage from '@/views/ProfileResultPage.vue'
import { getCurrentUsername } from '@/utils/auth'

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
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfilePage
  },
  {
    path: '/profile/result/:imageId',
    name: 'profile-result',
    component: ProfileResultPage
  }
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

router.beforeEach((to, from, next) => {
  const username = getCurrentUsername()
  const requiresAuth = to.path.startsWith('/home')
    || to.path.startsWith('/detect')
    || to.path.startsWith('/profile')
  const guestOnly = ['/login', '/register'].includes(to.path)

  if (requiresAuth && !username) {
    next('/login')
    return
  }

  if (guestOnly && username) {
    next('/home')
    return
  }

  next()
})

export default router

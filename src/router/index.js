import { createRouter, createWebHistory } from 'vue-router'
import useUserStore from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('@/views/HomeView.vue'),
      beforeEnter: async (to, from, next) => {
        const userStore = useUserStore()
        if (userStore.isLoggedIn) {
          await userStore.fetchUser()
        }
        return next()
      },
    },
    {
      path: '/explore',
      name: 'explore',
      component: () => import('@/views/ExploreView.vue'),
      beforeEnter: async (to, from, next) => {
        const userStore = useUserStore()
        if (userStore.isLoggedIn) {
          await userStore.fetchUser()
          return next()
        } else return next('/login')
      },
    },
    // Authentication routes
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/logout',
      name: 'logout',
      component: () => import('../views/HomeView.vue'),
      beforeEnter: async (to, from, next) => {
        const userStore = useUserStore()
        await userStore.logout()
        return next()
      },
    },
    // TODO: Forgot Password and Reset Password
    // Social Routes
    {
      path: '/social/me',
      name: 'account-home',
      component: () => import('../views/Account/HomeView.vue'),
      beforeEnter: async (to, from, next) => {
        const userStore = useUserStore()
        if (userStore.isLoggedIn) {
          await userStore.fetchUser()
          return next()
        } else return next('/login')
      },
    },
    {
      path: '/social/@:handle',
      name: 'account-profile',
      component: () => import('../views/Account/ProfileView.vue'),
      beforeEnter: async (to, from, next) => {
        const userStore = useUserStore()
        if (userStore.isLoggedIn) {
          await userStore.fetchUser()
          return next()
        } else return next('/login')
      },
    },
    {
      path: '/user-not-found',
      name: 'user-not-found',
      component: () => import('@/views/Account/UserNotFoundView.vue'),
    },
    // Learn Routes
    {
      path: '/learn',
      name: 'learn-home',
      component: () => import('@/views/Learn/HomeView.vue'),
      beforeEnter: async (to, from, next) => {
        const userStore = useUserStore()
        if (userStore.isLoggedIn) {
          await userStore.fetchUser()
        }
        return next()
      },
    },
    {
      path: '/learn/join-meeting',
      name: 'learn-join-meeting',
      component: () => import('@/views/Learn/JoinMeetingView.vue'),
      beforeEnter: async (to, from, next) => {
        const userStore = useUserStore()
        if (userStore.isLoggedIn) {
          await userStore.fetchUser()
          return next()
        } else return next('/login')
      },
    },
    // Teach routes
    {
      path: '/teach',
      name: 'teach-home',
      component: () => import('@/views/Teach/HomeView.vue'),
      beforeEnter: async (to, from, next) => {
        const userStore = useUserStore()
        if (userStore.isLoggedIn) {
          await userStore.fetchUser()
        }
        return next()
      },
    },
    {
      path: '/teach/new-meeting',
      name: 'teach-new-meeting',
      component: () => import('@/views/Teach/NewMeetingView.vue'),
      beforeEnter: async (to, from, next) => {
        const userStore = useUserStore()
        if (userStore.isLoggedIn) {
          await userStore.fetchUser()
          return next()
        } else return next('/login')
      },
    },
  ],
})

export default router

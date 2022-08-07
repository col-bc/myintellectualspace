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
        } else return next('/login?next=/explore')
      },
    },

    // # Authorization routes
    // /register
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
    },
    // /login
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    // /logout
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
    // /verify
    // {
    //   path: '/verify/:token',
    //   name: 'verify',
    //   component: () => import('../views/VerifyView.vue'),
    //   beforeEnter: async (to, from, next) => {
    //   }
    // },
    // TODO: Forgot Password and Reset Password

    // # Social Routes
    // /social/me
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
    // /social/@:handle
    {
      path: '/social/@:handle',
      name: 'account-profile',
      component: () => import('../views/Account/ProfileView.vue'),
      beforeEnter: async (to, from, next) => {
        const userStore = useUserStore()
        if (userStore.isLoggedIn) {
          await userStore.fetchUser()
          return next()
        } else return next('/login?next=/social/@:handle')
      },
    },
    // /user-not-found
    {
      path: '/user-not-found',
      name: 'user-not-found',
      component: () => import('@/views/Account/UserNotFoundView.vue'),
    },

    // # Learn Routes
    // /learn
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
    // /learn/join-meeting
    {
      path: '/learn/join-meeting',
      name: 'learn-join-meeting',
      component: () => import('@/views/Learn/JoinMeetingView.vue'),
      beforeEnter: async (to, from, next) => {
        const userStore = useUserStore()
        if (userStore.isLoggedIn) {
          await userStore.fetchUser()
          return next()
        } else return next('/login>?next=/learn/join-meeting')
      },
    },

    // # Teach Routes
    // /teach
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
    // /teach/new-meeting
    {
      path: '/teach/new-meeting',
      name: 'teach-new-meeting',
      component: () => import('@/views/Teach/NewMeetingView.vue'),
      beforeEnter: async (to, from, next) => {
        const userStore = useUserStore()
        if (userStore.isLoggedIn) {
          await userStore.fetchUser()
          return next()
        } else return next('/login?next=/teach/new-meeting')
      },
    },
    
    // # Other Routes
    // /getting-started
    {
      path: '/getting-started',
      name: 'getting-started',
      component: () => import('@/views/Account/GettingStartedView.vue'),
      beforeEnter: async (to, from, next) => {
        const userStore = useUserStore()
        if (userStore.isLoggedIn) {
          await userStore.fetchUser()
          return next()
        } else return next('/login?next=/getting-started')
      },
    },
    // /verify-email
    {
      path: '/verify-email',
      name: 'verify-email',
      component: () => import('@/views/Account/VerifyEmailView.vue'),
    },
    // /messages
    {
      path: '/messages',
      name: 'messages',
      component: () => import('@/views/MessagesView.vue'),
      beforeEnter: async (to, from, next) => {
        const userStore = useUserStore()
        if (userStore.isLoggedIn) {
          await userStore.fetchUser()
          return next()
        } else return next('/login?next=/messages')
      },
    },
  ],
})

export default router

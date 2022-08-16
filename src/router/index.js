import { createRouter, createWebHistory } from 'vue-router'
import useUserStore from '@/stores/user'
import axios from 'axios'

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
      }
    },

    // # Authorization routes
    // /register
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    },
    // /login
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
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
      }
    },
    // /verify
    {
      path: '/verify/:token',
      name: 'verify',
      beforeEnter: async (to, from, next) => {
        // Verify the token
        try {
          const response = await axios.get(
            '/api/auth/verify/' + to.params.token
          )
          if (response.data.success) {
            return next('/login?verified=true')
          }
        } catch (error) {
          return next('/login?verified=false')
        }
      }
    },
    // TODO: Forgot Password and Reset Password

    // # Social Routes
    // /social/me
    {
      path: '/social/me',
      name: 'my-profile',
      beforeEnter: async (to, from, next) => {
        const userStore = useUserStore()
        await userStore.fetchUser()
        if (userStore.isLoggedIn) {
          next({
            name: 'profile',
            params: { handle: userStore.getHandle }
          })
        } else return next('/login')
      }
    },
    // /social/@:handle
    //     - /@:handle/about
    //     - /@:handle/likes
    //     - /@:handle/comments
    {
      path: '/social/@:handle',
      name: 'profile',
      params: {
        handle: {
          type: String,
          required: true
        }
      },
      component: () => import('@/views/Account/ProfileView.vue'),
      beforeEnter: async (to, from, next) => {
        const userStore = useUserStore()
        if (userStore.isLoggedIn) {
          await userStore.fetchUser()
          return next()
        } else return next('/login?next=/social/@:handle')
      },
      children: [
        {
          path: 'about',
          name: 'profile-about',
          component: () => import('@/views/Account/ProfileView.vue')
        },
        {
          path: 'comments',
          name: 'profile-comments',
          component: () => import('@/views/Account/ProfileView.vue')
        },
        {
          path: 'comments',
          name: 'profile-likes',
          component: () => import('@/views/Account/ProfileView.vue')
        }
      ]
    },
    // /user-not-found
    {
      path: '/user-not-found',
      name: 'user-not-found',
      component: () => import('@/views/Account/UserNotFoundView.vue')
    },
    // # Explore Routes
    // /explore
    //  - /explore/network
    //  - /explore/interest
    //  - /explore/education
    // - /explore/all
    {
      path: '/explore',
      name: 'explore',
      children: [
        {
          path: 'network',
          name: 'explore-network',
          component: () => import('@/views/Explore/HomeView.vue')
        },
        {
          path: 'interests',
          name: 'explore-interests',
          component: () => import('@/views/Explore/HomeView.vue')
        },
        {
          path: 'education',
          name: 'explore-education',
          component: () => import('@/views/Explore/HomeView.vue')
        },
        {
          path: 'all',
          name: 'explore-all',
          component: () => import('@/views/Explore/HomeView.vue')
        }
      ],
      beforeEnter: async (to, from, next) => {
        const userStore = useUserStore()
        if (userStore.isLoggedIn) {
          await userStore.fetchUser()
          if (to.name === 'explore')
            return next({
              name: 'explore-all'
            })

          return next()
        } else return next('/login?next=/explore')
      }
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
      }
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
      }
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
      }
    },
    // /teach/create-course
    {
      path: '/teach/new-course',
      name: 'teach-create-course',
      component: () => import('@/views/Teach/NewCourseView.vue'),
      beforeEnter: async (to, from, next) => {
        const userStore = useUserStore()
        if (userStore.isLoggedIn) {
          await userStore.fetchUser()
          return next()
        } else return next('/login?next=/teach/create-course')
      }
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
      }
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
      }
    },
    // /verify-email
    {
      path: '/verify-email',
      name: 'verify-email',
      component: () => import('@/views/Account/VerifyEmailView.vue')
    },
    // /messages
    {
      path: '/messages',
      name: 'messages',
      component: () => import('@/views/Account/MessagesView.vue'),
      beforeEnter: async (to, from, next) => {
        const userStore = useUserStore()
        if (userStore.isLoggedIn) {
          await userStore.fetchUser()
          return next()
        } else return next('/login?next=/messages')
      }
    }
  ]
})

export default router

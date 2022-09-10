import { createRouter, createWebHistory } from 'vue-router'
import useUserStore from '@/stores/user'
import axios from 'axios'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('../views/IndexView.vue'),
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
      component: () => import('../views/IndexView.vue'),
      beforeEnter: async (to, from, next) => {
        const userStore = useUserStore()
        await userStore.logout()
        return next('/?logout=true')
      }
    },
    // /verify/:token
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
    // /verify-email
    {
      path: '/verify-email',
      name: 'verify-email',
      component: () => import('@/views/Account/VerifyEmailView.vue')
    },

    // # Social Routes
    // /social/me
    // /social/@:handle
    //  - /about
    //  - /comments
    //  - /likes
    //  - D/connections
    // /social/not-found
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
          path: 'likes',
          name: 'profile-likes',
          component: () => import('@/views/Account/ProfileView.vue')
        },
        {
          path: 'connections',
          name: 'profile-connections',
          component: () => import('@/views/Account/ProfileView.vue')
        }
      ],
      beforeEnter: async (to, from, next) => {
        const userStore = useUserStore()
        if (userStore.isLoggedIn) {
          await userStore.fetchUser()
          return next()
        } else return next('/login?next=/social/@:handle')
      }
    },
    {
      path: '/not-found',
      name: 'not-found',
      component: () => import('@/views/Account/UserNotFoundView.vue')
    },

    // # Explore Routes
    // /explore
    //  - /network
    //  - /interest
    //  - /education
    // - /all
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
    //  - /learn/:id
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
    {
      path: '/learn/:id',
      name: 'learn-course',
      params: {
        name: {
          type: Number,
          required: true
        }
      },
      component: () => import('@/views/Learn/CourseView.vue'),
      beforeEnter: async (to, from, next) => {
        const userStore = useUserStore()
        if (userStore.isLoggedIn) {
          await userStore.fetchUser()
        }
        return next()
      }
    },

    // # Teach Routes
    // /teach
    // /teach/new-course
    // /teach/:id/dashboard
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
    {
      path: '/teach/new-course',
      name: 'teach-new-course',
      component: () => import('@/views/Teach/NewCourseView.vue'),
      beforeEnter: async (to, from, next) => {
        const userStore = useUserStore()
        if (userStore.isLoggedIn) {
          await userStore.fetchUser()
          return next()
        } else return next('/login?next=/teach/create-course')
      }
    },
    {
      path: '/teach/:id/dashboard',
      name: 'teach-course-dashboard',
      params: {
        id: {
          type: String,
          required: true
        }
      },
      component: () => import('@/views/Teach/CourseDashboardView.vue'),
      beforeEnter: async (to, from, next) => {
        const userStore = useUserStore()
        if (userStore.isLoggedIn) {
          await userStore.fetchUser()
          return next()
        } else return next('/login?next=/teach/:id/dashboard')
      }
    },

    // # Meeting Routes
    // /meetings
    {
      path: '/meetings',
      name: 'meetings',
      component: () => import('@/views/Account/MeetingsView.vue')
    },
    {
      path: '/meetings/new',
      name: 'new-meeting',
      component: () => import('@/views/Account/NewMeetingView.vue')
    },
    {
      path: '/meetings/:id',
      name: 'meeting',
      params: {
        id: {
          type: String,
          required: true
        }
      }
    },

    // # Other Routes
    {
      path: '/my-courses',
      name: 'my-courses',
      component: () => import('@/views/Account/MyCoursesView.vue'),
      beforeEnter: async (to, from, next) => {
        const userStore = useUserStore()
        if (userStore.isLoggedIn) {
          await userStore.fetchUser()
          return next()
        } else return next('/login?next=/my-courses')
      }
    },
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
    },
    // /settings
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/Account/SettingsView.vue'),
      beforeEnter: async (to, from, next) => {
        const userStore = useUserStore()
        if (userStore.isLoggedIn) {
          await userStore.fetchUser()
          return next()
        } else return next('/login?next=/settings')
      }
    },
    // /settings/2fa
    {
      path: '/settings/2fa',
      name: 'settings-2fa',
      component: () => import('@/views/Account/Settings2FAView.vue'),
      beforeEnter: async (to, from, next) => {
        const userStore = useUserStore()
        if (userStore.isLoggedIn) {
          await userStore.fetchUser()
          return next()
        } else return next('/login?next=/settings/2fa')
      }
    },

    // # 404 Route
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/404View.vue')
    }
  ]
})

export default router

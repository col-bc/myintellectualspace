import { createRouter, createWebHistory } from 'vue-router'
import useUserStore from '@/stores/user'

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
      component: () => import('../views/IndexView.vue')
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
      beforeEnter: (to, from, next) => {
        const auth = getAuth()
        auth.signOut()
        next('/?logout=true')
      }
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
      meta: { requiresAuth: true },
      beforeEnter: (to, from, next) => {
        const user = useUserStore()
        next(`/social/@${user.handle}`)
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
      meta: { requiresAuth: true }
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
      meta: { requiresAuth: true }
    },

    // # Learn Routes
    // /learn
    //  - /learn/:id
    {
      path: '/learn',
      name: 'learn-home',
      component: () => import('@/views/Learn/HomeView.vue')
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
      component: () => import('@/views/Learn/CourseView.vue')
    },

    // # Teach Routes
    // /teach
    // /teach/new-course
    // /teach/:id/dashboard
    // /teach/:id/create-assessment
    {
      path: '/teach',
      name: 'teach-home',
      component: () => import('@/views/Teach/HomeView.vue')
    },
    {
      path: '/teach/new-course',
      name: 'teach-new-course',
      component: () => import('@/views/Teach/NewCourseView.vue'),
      meta: { requiresAuth: true }
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
      meta: { requiresAuth: true }
    },
    {
      path: '/teach/:id/create-assessment',
      name: 'teach-create-assessment',
      params: {
        id: {
          type: String,
          required: true
        }
      },
      component: () => import('@/views/Teach/CreateAssessmentView.vue')
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
      meta: { requiresAuth: true }
    },
    // /getting-started
    {
      path: '/getting-started',
      name: 'getting-started',
      component: () => import('@/views/Account/GettingStartedView.vue'),
      meta: { requiresAuth: true }
    },
    // /messages
    {
      path: '/messages',
      name: 'messages',
      component: () => import('@/views/Account/MessagesView.vue'),
      meta: { requiresAuth: true }
    },
    // /settings
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/Account/SettingsView.vue'),
      meta: { requiresAuth: true }
    },

    // # 404 Route
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/404View.vue')
    }
  ]
})

// requires auth guard
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const user = useUserStore()
    if (user.isAuthenticated) {
      next()
      return
    }
    next(`/login?next=${to.path}`)
  }
  next()
})

export default router

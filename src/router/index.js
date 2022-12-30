import { createRouter, createWebHistory } from 'vue-router'
import useUserStore from '@/stores/user'
import { getAuth } from 'firebase/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    if (to.name !== from.name) {
      return { top: 0 }
    } else {
      if (to.hash) {
        return { el: to.hash }
      } else {
        return savedPosition || { top: 0 }
      }
    }
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
        const user = useUserStore()
        user.logout()
        next('/?logout=true')
      }
    },

    // # Social Routes
    // /social/@:handle
    //  - /about
    //  - /comments
    //  - /likes
    //  - /connections
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
    // /messages
    {
      path: '/messages',
      name: 'messages',
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'messages-home',
          component: () => import('@/views/Account/MessagesView.vue')
        },
        {
          path: ':roomId',
          name: 'messages-room',
          component: () => import('@/views/Account/MessagesView.vue'),
          params: {
            roomId: {
              type: String,
              required: true
            }
          }
        },
        {
          path: 'compose/:to',
          name: 'messages-compose',
          component: () => import('@/views/Account/MessagesView.vue'),
          query: {
            to: {
              type: String,
              required: false,
              default: null
            }
          }
        }
      ]
    },

    // # Explore Routes
    // /explore
    // - /all
    // - /network
    // - /education
    // - /interests
    {
      path: '/feed',
      name: 'feed',
      children: [
        {
          path: 'all',
          name: 'feed-all',
          component: () => import('@/views/Feed/HomeView.vue')
        },
        {
          path: 'network',
          name: 'feed-network',
          component: () => import('@/views/Feed/HomeView.vue')
        },
        {
          path: 'education',
          name: 'feed-education',
          component: () => import('@/views/Feed/HomeView.vue')
        },
        {
          path: 'interests',
          name: 'feed-interests',
          redirect: '/unavailable'
        }
      ],
      meta: { requiresAuth: true }
    },

    // # Learn Routes - TODO
    // /learn
    //  - /learn/:id
    {
      path: '/learn',
      name: 'learn-home',
      redirect: '/unavailable'
      // component: () => import('@/views/Learn/HomeView.vue')
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
      redirect: '/unavailable'
      // component: () => import('@/views/Learn/CourseView.vue')
    },

    // # Teach Routes - TODO
    // /teach
    // /teach/new-course
    // /teach/:id/dashboard
    // /teach/:id/create-assessment
    {
      path: '/teach',
      name: 'teach-home',
      redirect: '/unavailable'
      // component: () => import('@/views/Teach/HomeView.vue')
    },
    {
      path: '/teach/new-course',
      name: 'teach-new-course',
      redirect: '/unavailable',
      // component: () => import('@/views/Teach/NewCourseView.vue'),
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
      redirect: '/unavailable',
      // component: () => import('@/views/Teach/CourseDashboardView.vue'),
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
      redirect: '/unavailable'
      // component: () => import('@/views/Teach/CreateAssessmentView.vue')
    },

    // # Meeting Routes - TODO
    {
      path: '/meetings',
      name: 'meetings',
      redirect: '/unavailable'
      // component: () => import('@/views/Account/MeetingsView.vue')
    },
    {
      path: '/meetings/new',
      name: 'new-meeting',
      redirect: '/unavailable'
      // component: () => import('@/views/Account/NewMeetingView.vue')
    },
    {
      path: '/meetings/:id',
      name: 'meeting',
      params: {
        id: {
          type: String,
          required: true
        }
      },
      redirect: '/unavailable'
    },

    // # Other Routes
    // /getting-started
    {
      path: '/getting-started',
      name: 'getting-started',
      component: () => import('@/views/Account/GettingStartedView.vue'),
      meta: { requiresAuth: true }
    },
    // /community-guidelines
    {
      path: '/community-guidelines',
      name: 'community-guidelines',
      component: () => import('@/views/GuidelinesView.vue')
    },
    // /terms
    {
      path: '/terms',
      name: 'terms',
      component: () => import('@/views/TermsView.vue')
    },
    // /privacy
    {
      path: '/privacy',
      name: 'privacy'
    },
    // /support
    {
      path: '/support',
      children: [
        {
          path: '',
          name: 'support-home',
          component: () => import('@/views/Support/HomeView.vue')
        },
        {
          path: 'contact',
          name: 'support-contact'
          // component: () => import('@/views/Support/ContactView.vue')
        },
        {
          path: 'bug-report',
          name: 'support-bug-report',
          component: () => import('@/views/Support/BugReportView.vue')
        }
      ]
    },
    // /settings
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/Account/SettingsView.vue'),
      meta: { requiresAuth: true }
    },

    // /unavailable
    {
      path: '/unavailable',
      name: 'unavailable',
      component: () => import('@/views/UnavailableView.vue')
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

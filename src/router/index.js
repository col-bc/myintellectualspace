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
      name: 'user-not-found',
      component: () => import('@/views/Account/UserNotFoundView.vue'),
      query: {
        handle: {
          type: String,
          required: true
        }
      }
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

    // # Feed Routes
    // /feed
    // - /all
    // - /network
    // - /education
    // - /interests
    {
      path: '/feed',
      name: 'feed',
      children: [
        {
          path: '',
          redirect: { name: 'feed-all' }
        },
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

    // # Meeting Routes
    // /meeting/host/:channel
    // /meeting/join/:channel
    // /my-meetings
    {
      path: '/meeting',
      name: 'meeting',
      params: {
        channel: {
          type: String,
          required: true
        }
      },
      children: [
        {
          path: '',
          name: 'meetings-home',
          redirect: { name: 'my-meetings' }
        },
        {
          path: 'host/:channel',
          name: 'host-meeting',
          params: {
            channel: {
              type: String,
              required: true
            }
          },
          component: () => import('@/views/Account/VideoMeetingView.vue')
        },
        {
          path: 'join/:channel',
          name: 'join-meeting',
          params: {
            channel: {
              type: String,
              required: true
            }
          },
          component: () => import('@/views/Account/VideoMeetingView.vue')
        }
      ],
      meta: { requiresAuth: true }
    },
    {
      path: '/my-meetings',
      name: 'my-meetings',
      component: () => import('@/views/Account/MyMeetingsView.vue')
    },

    // # Learn Routes - TODO
    // /learn
    {
      path: '/learn',
      name: 'learn-home',
      // component: () => import('@/views/Learn/HomeView.vue')
      redirect: '/unavailable'
    },

    // # Teach Routes - TODO
    // /teach
    {
      path: '/teach',
      name: 'teach-home',
      // component: () => import('@/views/Teach/HomeView.vue')
      redirect: '/unavailable'
    },

    // # Jobs Routes
    // /jobs
    // - /
    // - /new
    // - /:jobId/apply
    // - /:jobId/manage
    // - /:jobId/candidates
    // - /resume
    // - /hiring
    {
      path: '/jobs',
      children: [
        {
          path: '',
          name: 'jobs-home',
          component: () => import('@/views/Jobs/HomeView.vue')
        },
        {
          path: '/new',
          name: 'jobs-new',
          component: () => import('@/views/Jobs/JobView.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: ':jobId/apply',
          name: 'jobs-apply',
          component: () => import('@/views/Jobs/JobView.vue'),
          params: {
            jobId: {
              type: String,
              required: true
            }
          },
          meta: { requiresAuth: true }
        },
        {
          path: ':jobId/manage',
          name: 'jobs-manage',
          component: () => import('@/views/Jobs/JobView.vue'),
          params: {
            jobId: {
              type: String,
              required: true
            }
          },
          meta: { requiresAuth: true }
        },
        {
          path: ':jobId/candidates',
          name: 'jobs-candidates',
          component: () => import('@/views/Jobs/CandidatesView,.vue'),
          params: {
            jobId: {
              type: String,
              required: true
            }
          },
          meta: { requiresAuth: true }
        },
        {
          path: 'resume',
          name: 'jobs-resume',
          component: () => import('@/views/Jobs/JobView.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'hiring',
          name: 'jobs-hiring',
          component: () => import('@/views/Jobs/HiringView.vue'),
          meta: { requiresAuth: true }
        }
      ]
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
      name: 'privacy',
      component: () => import('@/views/PrivacyView.vue')
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
    next(`/login?redirect=${to.path}`)
  }
  next()
})

export default router

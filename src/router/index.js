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
    // /forgot-password
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../views/ForgotPasswordView.vue')
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
        },
        {
          path: 'lectures',
          name: 'profile-lectures',
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

    // # Lectures Routes
    // /lectures
    // - /new
    // - /:lectureId
    {
      path: '/lectures',
      children: [
        {
          path: '',
          name: 'lectures-home',
          component: () => import('@/views/Lectures/HomeView.vue')
        },
        {
          path: 'reels',
          name: 'lectures-reels',
          component: () => import('@/views/Lectures/HomeView.vue')
        },
        {
          path: 'new',
          name: 'lectures-new',
          component: () => import('@/views/Lectures/LectureView.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: ':lectureId',
          name: 'lectures-lecture',
          component: () => import('@/views/Lectures/LectureView.vue'),
          params: {
            lectureId: {
              type: String,
              required: true
            }
          }
        },
        {
          path: ':lectureId/edit',
          name: 'lectures-edit-lecture',
          component: () => import('@/views/Lectures/LectureView.vue'),
          params: {
            lectureId: {
              type: String,
              required: true
            }
          }
        },
        {
          path: 'creator-dashboard',
          name: 'lectures-creator-dashboard',
          component: () => import('@/views/Lectures/CreatorDashboardView.vue'),
          meta: { requiresAuth: true }
        }
      ]
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
          path: 'new',
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
          name: 'support-contact',
          component: () => import('@/views/Support/ContactView.vue')
        }
      ]
    },
    // /admin
    {
      path: '/admin',
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'admin-home',
          component: () => import('@/views/Admin/AdminView.vue')
        },
        {
          path: 'users',
          name: 'admin-users',
          component: () => import('@/views/Admin/AdminView.vue')
        },
        {
          path: 'posts',
          name: 'admin-posts',
          component: () => import('@/views/Admin/AdminView.vue')
        },
        {
          path: 'lectures',
          name: 'admin-lectures',
          component: () => import('@/views/Admin/AdminView.vue')
        },
        {
          path: 'jobs',
          name: 'admin-jobs',
          component: () => import('@/views/Admin/AdminView.vue')
        },
        {
          path: 'reports',
          name: 'admin-reports',
          component: () => import('@/views/Admin/AdminView.vue')
        }
      ],
      beforeEnter: async (to, from, next) => {
        const userStore = useUserStore()
        const isAdmin = await userStore.isAdmin(userStore.user.uid)
        if (isAdmin) {
          next()
        } else {
          next({ name: 'forbidden' })
        }
      }
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
    // /forbidden
    {
      path: '/forbidden',
      name: 'forbidden',
      component: () => import('../views/403View.vue')
    },
    // # 404
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
    next({ name: 'login', query: { then: to.fullPath } })
  }
  next()
})

export default router

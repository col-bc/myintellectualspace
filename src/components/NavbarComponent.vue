<script setup>
import { reactive, ref, onMounted, watch } from 'vue'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import useUserStore from '@/stores/user'

const userStore = useUserStore()

const user = reactive({
  isLoggedIn: false,
})
onMounted(() => {
  user.data = userStore.getUser
  user.isLoggedIn = userStore.isLoggedIn
})

const showUserMenu = ref(false)
const searchText = ref('')
const searchResults = ref([])
const menuOpen = ref(false)
const isMobile = ref(false)
const darkMode = ref(false)

const viewportWidth = ref(window.innerWidth)
window.addEventListener('resize', () => {
  viewportWidth.value = window.innerWidth
  if (window.innerWidth < 768) {
    isMobile.value = true
  } else {
    isMobile.value = false
  }
})
onMounted(() => {
  viewportWidth.value = window.innerWidth
  if (window.innerWidth < 768) {
    isMobile.value = true
  } else {
    isMobile.value = false
  }
  // Dark mode
  if (localStorage.getItem('color-theme') === 'dark') {
    document.documentElement.classList.add('dark');
    darkMode.value = true
  } else {
    document.documentElement.classList.remove('dark')
    darkMode.value = false
  }
})
watch(darkMode, (value) => {
  if (value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('color-theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.removeItem('color-theme')
  }
})

</script>

<template>
  <nav class="bg-white px-2 sm:px-4 py-2.5 dark:bg-slate-800">
    <div class="container flex items-center mx-auto">
      <router-link to="/"
                   class="flex items-center mr-auto md:mr-0 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400">
        <svg xmlns="http://www.w3.org/2000/svg"
             class="stroke-gray-900 dark:stroke-white h-8 w-8 mr-2"
             width="24"
             height="24"
             viewBox="0 0 24 24"
             stroke-width="2"
             stroke="currentColor"
             fill="none"
             stroke-linecap="round"
             stroke-linejoin="round">
          <path stroke="none"
                d="M0 0h24v24H0z"
                fill="none"></path>
          <path d="M5.931 6.936l1.275 4.249m5.607 5.609l4.251 1.275"></path>
          <path d="M11.683 12.317l5.759 -5.759"></path>
          <circle cx="5.5"
                  cy="5.5"
                  r="1.5"></circle>
          <circle cx="18.5"
                  cy="5.5"
                  r="1.5"></circle>
          <circle cx="18.5"
                  cy="18.5"
                  r="1.5"></circle>
          <circle cx="8.5"
                  cy="15.5"
                  r="4.5"></circle>
        </svg>
        <span class="hidden self-center text-3xl font-bold whitespace-nowrap">
          Intellectual Space
        </span>
        <span class="self-center text-3xl font-bold whitespace-nowrap">MIS</span>
      </router-link>
      <!-- Actions -->
      <div class="flex items-center gap-2 md:order-2">
        <!-- Search -->
        <div class="relative">
          <input type="text"
                 v-model="searchText"
                 class=" bg-gray-50 w-full max-w-xm border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                 placeholder="Search" />
          <div v-if="searchText"
               class="absolute z-10 w-full bg-white border border-gray-200 rounded divide-y divide-gray-100 shadow dark:bg-gray-700 mt-2">
            <ul class="py-1 text-sm text-gray-700 dark:text-gray-200 ">
              <li>
                <router-link :to="'/social/@' + searchText"
                             class="inline-flex items-center gap-3 w-full py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg"
                       class="h-6 w-6"
                       fill="none"
                       viewBox="0 0 24 24"
                       stroke="currentColor"
                       stroke-width="2">
                    <path stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {{ searchText }}
                </router-link>
              </li>
              <li>
                <router-link :to="''"
                             class="inline-flex items-center  gap-3 w-full py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg"
                       class="h-6 w-6"
                       fill="none"
                       viewBox="0 0 24 24"
                       stroke="currentColor"
                       stroke-width="2">
                    <path stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {{ searchText }}
                </router-link>
              </li>
            </ul>
          </div>
        </div>
        <!-- Toggle theme -->
        <button type="button"
                @click="darkMode = !darkMode"
                class="p-2.5  text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">

          <svg v-if="!darkMode"
               xmlns="http://www.w3.org/2000/svg"
               class="h-6 w-6"
               fill="none"
               viewBox="0 0 24 24"
               stroke="currentColor"
               stroke-width="2">
            <path stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          <svg v-if="darkMode"
               xmlns="http://www.w3.org/2000/svg"
               class="h-6 w-6"
               fill="none"
               viewBox="0 0 24 24"
               stroke="currentColor"
               stroke-width="2">
            <path stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </button>
        <!-- User menu -->
        <div class="relative">
          <button type="button"
                  @click="
                    user.isLoggedIn
                      ? (showUserMenu = !showUserMenu)
                      : $router.push('/login')
                  "
                  class="py-2.5 px-5 flex items-center gap-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
            <svg v-if="!user.isLoggedIn"
                 xmlns="http://www.w3.org/2000/svg"
                 class="h-6 w-6"
                 fill="none"
                 viewBox="0 0 24 24"
                 stroke="currentColor"
                 stroke-width="2">
              <path stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            <svg v-else
                 xmlns="http://www.w3.org/2000/svg"
                 class="h-6 w-6"
                 fill="none"
                 viewBox="0 0 24 24"
                 stroke="currentColor"
                 stroke-width="2">
              <path stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span v-if="!user.isLoggedIn">Login</span>
            <span v-else>Profile</span>
          </button>
          <div v-if="showUserMenu"
               class="absolute mt-3 right-0 z-10 w-64 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600 border border-gray-200 dark:border-gray-700">
            <div class="flex items-center gap-3 py-3 px-4 text-sm bg-gradient-to-br from-blue-300 to-purple-300 rounded-t text-gray-900">
              <img :src="user.data.avatar_uri"
                   class="h-10 w-10 rounded-sm" />
              <div class="flex flex-col gap-0.5">
                <h6 class="font-semibold">@{{ user.data.handle }}</h6>
                <p class="font-medium truncate">
                  {{ user.data.first_name + ' ' + user.data.last_name }}
                </p>
              </div>
            </div>
            <ul class="py-1 text-sm text-gray-700 dark:text-gray-200">
              <li>
                <router-link to="/social/me"
                             class="flex items-center gap-3 py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg"
                       class="h-4 w-4"
                       fill="none"
                       viewBox="0 0 24 24"
                       stroke="currentColor"
                       stroke-width="2">
                    <path stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  My Profile
                </router-link>
              </li>
              <li>
                <router-link to="/messages"
                             class="flex items-center gap-3 py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg"
                       class="h-4 w-4"
                       fill="none"
                       viewBox="0 0 24 24"
                       stroke="currentColor"
                       stroke-width="2">
                    <path stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                  Messages
                </router-link>
              </li>
              <li>
                <a href="#"
                   class="flex items-center gap-3 py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg"
                       class="h-4 w-4"
                       fill="none"
                       viewBox="0 0 24 24"
                       stroke="currentColor"
                       stroke-width="2">
                    <path stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Connections</a>
              </li>
              <li>
                <a href="#"
                   class="flex items-center gap-3 py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg"
                       class="h-4 w-4"
                       fill="none"
                       viewBox="0 0 24 24"
                       stroke="currentColor"
                       stroke-width="2">
                    <path stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Meetings</a>
              </li>
              <li>
                <a href="#"
                   class="flex items-center gap-3 py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg"
                       class="h-4 w-4"
                       fill="none"
                       viewBox="0 0 24 24"
                       stroke="currentColor"
                       stroke-width="2">
                    <path stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings</a>
              </li>
            </ul>
            <div class="py-1">
              <router-link to="/logout"
                           class="flex items-center gap-3 py-2 px-4 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg"
                     class="h-4 w-4"
                     fill="none"
                     viewBox="0 0 24 24"
                     stroke="currentColor"
                     stroke-width="2">
                  <path stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </router-link>
            </div>
          </div>
        </div>
        <button type="button"
                v-if="isMobile"
                @click="menuOpen = !menuOpen"
                class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                aria-controls="navbar-default"
                aria-expanded="false">
          <span class="sr-only">Open main menu</span>
          <svg class="w-6 h-6"
               aria-hidden="true"
               fill="currentColor"
               viewBox="0 0 20 20"
               xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>
      <!-- Links -->
      <div v-show="!isMobile || (isMobile && menuOpen)"
           class="w-full sm:mr-auto md:flex-1 md:mx-6">
        <ul class="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
          <li>
            <router-link :to="{ name: 'index' }"
                         :class="[
                           $route.path === '/'
                             ? 'block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white'
                             : 'block py-2 px-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700',
                         ]"
                         aria-current="page">Home</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'learn-home' }"
                         :class="[
                           $route.path.includes('learn')
                             ? 'block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white'
                             : 'block py-2 px-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700',
                         ]">Learn</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'teach-home' }"
                         :class="[
                           $route.path.startsWith('/teach')
                             ? 'block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white'
                             : 'block py-2 px-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700',
                         ]">Teach</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'explore' }"
                         :class="[
                           $route.path === '/explore'
                             ? 'block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white'
                             : 'block py-2 px-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700',
                         ]">Explore</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

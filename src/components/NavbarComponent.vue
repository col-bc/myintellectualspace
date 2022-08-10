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
  <nav class="px-2 sm:px-4 py-2.5">
    <div class="container flex flex-wrap md:flex-nowrap items-center mx-auto">
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
      <div class="flex flex-shrink items-center gap-2 md:order-2">
        <!-- Search -->
        <div class="relative">
          <input type="text"
                 v-model="searchText"
                 class="bg-white shadow-sm w-full max-w-xm border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                class="shadow-sm p-2.5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">

          <svg v-if="!darkMode"
               class="w-5 h-5 fill-current"
               xmlns="http://www.w3.org/2000/svg"
               viewBox="0 0 24 24"
               width="24"
               height="24">
            <path fill="none"
                  d="M0 0h24v24H0z" />
            <path d="M11.38 2.019a7.5 7.5 0 1 0 10.6 10.6C21.662 17.854 17.316 22 12.001 22 6.477 22 2 17.523 2 12c0-5.315 4.146-9.661 9.38-9.981z" />
          </svg>
          <svg v-if="darkMode"
               class="fill-current h-5 w-5"
               xmlns="http://www.w3.org/2000/svg"
               viewBox="0 0 24 24"
               width="24"
               height="24">
            <path fill="none"
                  d="M0 0h24v24H0z" />
            <path d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z" />
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
                  class="shadow-sm p-2.5 flex items-center gap-2.5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
            <svg v-if="!user.isLoggedIn"
                 class="fill-current h-5 w-5"
                 xmlns="http://www.w3.org/2000/svg"
                 viewBox="0 0 24 24"
                 width="24"
                 height="24">
              <path fill="none"
                    d="M0 0h24v24H0z" />
              <path d="M10 11H4V3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8h6v3l5-4-5-4v3z" />
            </svg>
            <svg v-else
                 xmlns="http://www.w3.org/2000/svg"
                 class="fill-current h-5 w-5"
                 viewBox="0 0 24 24"
                 width="24"
                 height="24">
              <path fill="none"
                    d="M0 0h24v24H0z" />
              <path d="M4 22a8 8 0 1 1 16 0H4zm8-9c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6z" />
            </svg>
            <span v-if="!user.isLoggedIn"
                  class="hidden md:inline-flex">Login</span>
            <span v-else
                  class="hidden md:inline-flex">Profile</span>
          </button>
          <div v-if="showUserMenu"
               class="absolute mt-3 right-0 z-10 w-64 bg-white rounded border  border-gray-200 divide-y divide-gray-100 shadow-xl dark:bg-gray-800 dark:divide-gray-700 dark:border-gray-700">
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
                             class="flex items-center gap-3 py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg"
                       class="h-4 w-4 fill-current"
                       viewBox="0 0 24 24"
                       width="24"
                       height="24">
                    <path fill="none"
                          d="M0 0h24v24H0z" />
                    <path d="M4 22a8 8 0 1 1 16 0H4zm8-9c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6z" />
                  </svg>
                  My Profile
                </router-link>
              </li>
              <li>
                <router-link to="/messages"
                             class="flex items-center gap-3 py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg"
                       class="h-4 w-4 fill-current"
                       viewBox="0 0 24 24"
                       width="24"
                       height="24">
                    <path fill="none"
                          d="M0 0h24v24H0z" />
                    <path d="M6.455 19L2 22.5V4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6.455zM7 10v2h2v-2H7zm4 0v2h2v-2h-2zm4 0v2h2v-2h-2z" />
                  </svg>
                  Messages
                </router-link>
              </li>
              <li>
                <a href="#"
                   class="flex items-center gap-3 py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg"
                       class="h-4 w-4 fill-current"
                       viewBox="0 0 24 24"
                       width="24"
                       height="24">
                    <path fill="none"
                          d="M0 0h24v24H0z" />
                    <path d="M10 19.748V16.4c0-1.283.995-2.292 2.467-2.868A8.482 8.482 0 0 0 9.5 13c-1.89 0-3.636.617-5.047 1.66A8.017 8.017 0 0 0 10 19.748zm8.88-3.662C18.485 15.553 17.17 15 15.5 15c-2.006 0-3.5.797-3.5 1.4V20a7.996 7.996 0 0 0 6.88-3.914zM9.55 11.5a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5zm5.95 1a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                  </svg>
                  Connections</a>
              </li>
              <li>
                <a href="#"
                   class="flex items-center gap-3 py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg"
                       class="h-4 w-4 fill-current"
                       viewBox="0 0 24 24"
                       width="24"
                       height="24">
                    <path fill="none"
                          d="M0 0h24v24H0z" />
                    <path d="M17 9.2l5.213-3.65a.5.5 0 0 1 .787.41v12.08a.5.5 0 0 1-.787.41L17 14.8V19a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v4.2zM5 8v2h2V8H5z" />
                  </svg>
                  Meetings</a>
              </li>
              <li>
                <a href="#"
                   class="flex items-center gap-3 py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg"
                       class="h-4 w-4 fill-current"
                       viewBox="0 0 24 24"
                       width="24"
                       height="24">
                    <path fill="none"
                          d="M0 0h24v24H0z" />
                    <path d="M2.132 13.63a9.942 9.942 0 0 1 0-3.26c1.102.026 2.092-.502 2.477-1.431.385-.93.058-2.004-.74-2.763a9.942 9.942 0 0 1 2.306-2.307c.76.798 1.834 1.125 2.764.74.93-.385 1.457-1.376 1.43-2.477a9.942 9.942 0 0 1 3.262 0c-.027 1.102.501 2.092 1.43 2.477.93.385 2.004.058 2.763-.74a9.942 9.942 0 0 1 2.307 2.306c-.798.76-1.125 1.834-.74 2.764.385.93 1.376 1.457 2.477 1.43a9.942 9.942 0 0 1 0 3.262c-1.102-.027-2.092.501-2.477 1.43-.385.93-.058 2.004.74 2.763a9.942 9.942 0 0 1-2.306 2.307c-.76-.798-1.834-1.125-2.764-.74-.93.385-1.457 1.376-1.43 2.477a9.942 9.942 0 0 1-3.262 0c.027-1.102-.501-2.092-1.43-2.477-.93-.385-2.004-.058-2.763.74a9.942 9.942 0 0 1-2.307-2.306c.798-.76 1.125-1.834.74-2.764-.385-.93-1.376-1.457-2.477-1.43zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                  </svg>
                  Settings</a>
              </li>
            </ul>
            <div class="py-1">
              <router-link to="/logout"
                           @click="user.isLoggedIn = !user.isLoggedIn"
                           class="flex items-center gap-3 py-2 px-4 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg"
                     class="h-4 w-4 fill-current"
                     viewBox="0 0 24 24"
                     width="24"
                     height="24">
                  <path fill="none"
                        d="M0 0h24v24H0z" />
                  <path d="M5 22a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H5zm10-6l5-4-5-4v3H9v2h6v3z" />
                </svg>
                Logout
              </router-link>
            </div>
          </div>
        </div>
        <!-- Mobile menu toggle -->
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
           class="sm:mr-auto md:flex-1 md:mx-8">
        <ul class="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
          <li>
            <router-link :to="{ name: 'index' }"
                         :class="[
                           $route.path === '/'
                             ? 'block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white'
                             : 'block py-2 px-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700',
                         ]">Home</router-link>
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

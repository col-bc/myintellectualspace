<script setup>
import { reactive, ref, onMounted } from 'vue'
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
})
</script>

<template>
  <nav class="bg-white border-b px-2 sm:px-4 py-2.5">
    <div class="container flex flex-wrap items-center mx-auto">
      <router-link to="/"
                   class="flex items-center mr-auto md:mr-0 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
        <img src="@/assets/logo.svg"
             alt="logo"
             class="h-8 mr-3" />
        <span class="hidden self-center text-3xl font-bold whitespace-nowrap">
          Intellectual Space
        </span>
        <span class="self-center text-3xl font-bold whitespace-nowrap">MIS</span>
      </router-link>
      <!-- Actions -->
      <div class="flex items-center gap-3 md:order-2">
        <div class="relative">
          <input type="text"
                 v-model="searchText"
                 class=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-52 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
        <div class="relative">
          <button type="button"
                  @click="
                    user.isLoggedIn
                      ? (showUserMenu = !showUserMenu)
                      : $router.push('/login')
                  "
                  class="flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            <svg v-if="!user.isLoggedIn"
                 xmlns="http://www.w3.org/2000/svg"
                 class="h-6 w-6 mr-3"
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
                 class="h-5 w-5 mr-3"
                 viewBox="0 0 20 20"
                 fill="currentColor">
              <path fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                    clip-rule="evenodd" />
            </svg>
            <span v-if="!user.isLoggedIn">Login</span>
            <span v-else>Profile</span>
          </button>
          <div v-if="showUserMenu"
               class="absolute mt-3 right-0 z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600 border border-gray-200 dark:border-gray-700">
            <div @click="$router.push('/social/me'), (showUserMenu = false)"
                 class="cursor-pointer py-3 px-4 text-sm bg-gradient-to-br from-blue-300 to-purple-300 hover:from-purple-300 hover:to-blue-300 rounded-t-sm text-gray-900 dark:text-white">
              <h6 class="font-semibold">@{{ user.data.handle }}</h6>
              <p class="font-medium truncate">
                {{ user.data.first_name + ' ' + user.data.last_name }}
              </p>
            </div>
            <ul class="py-1 text-sm text-gray-700 dark:text-gray-200">
              <li>
                <a href="#"
                   class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Connections</a>
              </li>
              <li>
                <a href="#"
                   class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Meetings</a>
              </li>
              <li>
                <a href="#"
                   class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings</a>
              </li>
            </ul>
            <div class="py-1">
              <router-link to="/logout"
                           class="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Logout</router-link>
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
           class="w-full md:ml-8 md:flex-1 md:w-auto">
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

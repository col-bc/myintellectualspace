<script setup>
import { reactive, ref, onMounted, watch, onBeforeUnmount } from 'vue'
import useUserStore from '@/stores/user'

const userStore = useUserStore()

const user = reactive({
  isLoggedIn: false
})
onMounted(() => {
  user.data = userStore.getUser
  user.isLoggedIn = userStore.isLoggedIn
})

const showUserMenu = ref(false)
const searchText = ref('')
const searchResults = ref([])
const menuOpen = ref(false)
const drawerOpen = ref(false)
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
    document.documentElement.classList.add('dark')
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
watch(drawerOpen, (value) => {
  if (value) {
    document.querySelector('body').classList.add('overflow-y-hidden')
  } else {
    document.querySelector('body').classList.remove('overflow-y-hidden')
  }
})
onBeforeUnmount(() => {
  document.querySelector('body').classList.remove('overflow-y-hidden')
})
</script>

<template>
  <div
    v-if="drawerOpen"
    @click="drawerOpen = false"
    class="cursor-pointer absolute z-40 top-0 right-0 w-full h-full bg-black bg-opacity-60"
  ></div>
  <Transition>
    <div
      v-if="drawerOpen"
      class="absolute z-50 right-0 top-0 flex flex-col h-full w-80 shadow-xl p-4 overflow-y-auto bg-white border-l border-gray-300 dark:border-gray-700 dark:bg-gray-800"
      tabindex="-1"
    >
      <div
        class="flex items-center gap-3 py-3 px-4 text-sm bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 hover: rounded-lg text-white dark:text-gray-900"
      >
        <img :src="user.data.avatar_uri" class="h-12 w-12 rounded-md" />
        <div class="flex flex-1 flex-col gap-0.5">
          <h6 class="font-semibold">@{{ user.data.handle }}</h6>
          <p class="font-medium truncate">
            {{ user.data.first_name + ' ' + user.data.last_name }}
          </p>
        </div>
        <button
          type="button"
          @click="drawerOpen = false"
          class="text-white bg-gray-900 bg-opacity-0 hover:bg-opacity-30 rounded-lg p-1.5 dark:text-gray-900"
        >
          <svg
            class="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <span class="sr-only">Close menu</span>
        </button>
      </div>
      <ul class="py-2.5 text-sm text-gray-700 dark:text-gray-200">
        <li>
          <router-link
            to="/social/me"
            class="flex items-center gap-3 py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
              width="
                       24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            My Profile
          </router-link>
        </li>
        <li>
          <router-link
            to="/my-courses"
            class="flex items-center gap-3 py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path
                d="M19 4v16h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12z"
              ></path>
              <path d="M19 16h-12a2 2 0 0 0 -2 2"></path>
              <path d="M9 8h6"></path>
            </svg>
            My Courses
          </router-link>
        </li>
        <li>
          <router-link
            to="/messages"
            class="flex items-center gap-3 py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
              />
            </svg>
            Messages
          </router-link>
        </li>
        <li>
          <router-link
            :to="{
              name: 'profile-connections',
              params: { handle: userStore.getHandle }
            }"
            class="flex items-center gap-3 py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Connections</router-link
          >
        </li>
        <li>
          <a
            href="#"
            class="flex items-center gap-3 py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
            Meetings</a
          >
        </li>
      </ul>
      <ul
        class="mt-auto py-2.5 border-t border-gray-700 text-gray-700 dark:text-gray-300 dark:border-gray-300"
      >
        <li>
          <router-link
            :to="{ name: 'settings' }"
            class="flex items-center gap-3 py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path
                d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
              />
            </svg>
            Settings</router-link
          >
        </li>
        <li>
          <router-link
            to="/logout"
            @click="
              ;(user.isLoggedIn = !user.isLoggedIn),
                (showUserMenu = !showUserMenu)
            "
            class="flex items-center gap-3 py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </router-link>
        </li>
      </ul>
    </div>
  </Transition>
  <!-- Navbar -->
  <nav class="px-2 sm:px-4 py-2.5">
    <div class="container flex flex-wrap md:flex-nowrap items-center mx-auto">
      <router-link
        to="/"
        class="flex items-center mr-auto md:mr-0 text-gray-900 dark:text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="fill-current h-8 w-8 mr-3"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path fill="none" d="M0 0H24V24H0z" />
          <path
            d="M11 2c4.068 0 7.426 3.036 7.934 6.965l2.25 3.539c.148.233.118.58-.225.728L19 14.07V17c0 1.105-.895 2-2 2h-1.999L15 22H6v-3.694c0-1.18-.436-2.297-1.244-3.305C3.657 13.631 3 11.892 3 10c0-4.418 3.582-8 8-8zm0 5c-.552 0-1 .448-1 1v.999L9 9c-.552 0-1 .448-1 1s.448 1 1 1l1-.001V12c0 .552.448 1 1 1s1-.448 1-1v-1h1c.552 0 1-.448 1-1s-.448-1-1-1h-1V8c0-.552-.448-1-1-1z"
          />
        </svg>
        <span class="self-center text-xl font-bold whitespace-nowrap"
          >Intellectual Space</span
        >
      </router-link>
      <!-- Actions -->
      <div class="flex flex-shrink items-center gap-2 md:order-2">
        <!-- Search -->
        <div class="relative hidden lg:inline-flex">
          <input
            type="text"
            v-model="searchText"
            class="bg-gray-50 w-full max-w-xm border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search"
          />
          <div
            v-if="searchText"
            class="absolute z-10 w-full bg-white border border-gray-200 rounded divide-y divide-gray-100 shadow-xl dark:bg-gray-700 mt-2"
          >
            <ul class="py-1 text-sm text-gray-700 dark:text-gray-200">
              <li>
                <router-link
                  :to="{ name: 'profile', params: { handle: searchText } }"
                  class="inline-flex items-center gap-3 w-full py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  {{ searchText }}
                </router-link>
              </li>
              <li>
                <router-link
                  :to="''"
                  class="inline-flex items-center gap-3 w-full py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  {{ searchText }}
                </router-link>
              </li>
            </ul>
          </div>
        </div>
        <!-- Toggle theme -->
        <button
          type="button"
          @click="darkMode = !darkMode"
          class="p-2.5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        >
          <svg
            v-if="!darkMode"
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
          <svg
            v-if="darkMode"
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        </button>
        <!-- Toggle user drawer -->
        <button
          type="button"
          @click="
            user.isLoggedIn
              ? (drawerOpen = !drawerOpen)
              : $router.push('/login')
          "
          class="p-2.5 flex items-center gap-2.5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        >
          <svg
            v-if="!user.isLoggedIn"
            class="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
          <span v-if="!user.isLoggedIn" class="hidden md:inline-flex"
            >Login</span
          >

          <svg
            v-if="user.isLoggedIn"
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span v-if="user.isLoggedIn" class="hidden md:inline-flex"
            >Profile</span
          >
        </button>
        <!-- Mobile menu toggle -->
        <button
          type="button"
          v-if="isMobile"
          @click="menuOpen = !menuOpen"
          class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span class="sr-only">Open main menu</span>
          <svg
            class="w-6 h-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
      <!-- Links -->
      <Transition name="nav">
        <div
          v-show="!isMobile || (isMobile && menuOpen)"
          class="w-full md:flex-1"
        >
          <ul
            class="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:mr-8 md:text-sm md:font-medium"
          >
            <!-- Search -->
            <div class="relative block md:hidden mb-2">
              <input
                type="text"
                v-model="searchText"
                class="bg-gray-50 w-full max-w-xm border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search"
              />
              <div
                v-if="searchText"
                class="absolute z-10 w-full bg-white border border-gray-200 rounded divide-y divide-gray-100 shadow-xl dark:bg-gray-700 mt-2"
              >
                <ul class="py-1 text-sm text-gray-700 dark:text-gray-200">
                  <li>
                    <router-link
                      :to="{ name: 'profile', params: { handle: searchText } }"
                      class="inline-flex items-center gap-3 w-full py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      {{ searchText }}
                    </router-link>
                  </li>
                  <li>
                    <router-link
                      :to="''"
                      class="inline-flex items-center gap-3 w-full py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                      {{ searchText }}
                    </router-link>
                  </li>
                </ul>
              </div>
            </div>
            <li>
              <router-link
                :to="{ name: 'index' }"
                :class="[
                  $route.path === '/'
                    ? 'block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white'
                    : 'block py-2 px-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'
                ]"
                >Home</router-link
              >
            </li>
            <li>
              <router-link
                :to="{ name: 'learn-home' }"
                :class="[
                  $route.path.includes('learn')
                    ? 'block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white'
                    : 'block py-2 px-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'
                ]"
                >Learn</router-link
              >
            </li>
            <li>
              <router-link
                :to="{ name: 'teach-home' }"
                :class="[
                  $route.path.startsWith('/teach')
                    ? 'block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white'
                    : 'block py-2 px-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'
                ]"
                >Teach</router-link
              >
            </li>
            <li>
              <router-link
                :to="{ name: 'explore-all' }"
                :class="[
                  $route.path.startsWith('/explore')
                    ? 'block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white'
                    : 'block py-2 px-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'
                ]"
                >Explore</router-link
              >
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  </nav>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.25s ease-in-out;
  right: 0px;
}

.v-enter-from,
.v-leave-to {
  right: -320px;
}

.nav-enter-active,
.nav-leave-active {
  transition: all 0.25s ease-in-out;
  opacity: 1;
}

.nav-enter-from,
.nav-leave-to {
  opacity: 0;
}
</style>

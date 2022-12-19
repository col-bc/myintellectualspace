<script setup>
import useInterface from '@/stores/interface'
import useUserStore from '@/stores/user'
import { onBeforeUnmount, onUpdated, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Menu, MenuButton, MenuItems } from '@headlessui/vue'

const user = useUserStore()
const router = useRouter()
const route = useRoute()
const ui = useInterface()

const state = reactive({
  showUserMenu: false,
  showDrawer: false,
  showNotifications: false,
  searchQuery: '',
  searchResults: [],
  notifications: [
    {
      id: 1,
      message:
        'Example notification. Something happened that requires your attention.',
      createdAt: '2021-07-01T12:00:00.000Z',
      read: false
    }
  ]
})

function logout() {
  user.logout()
  state.showDrawer = false
  router.push('/')
}
function closeDrawer() {
  if (state.showDrawer) {
    state.showDrawer = false
  } else if (state.showNotifications) {
    state.showNotifications = false
  }
}

watch(route.path, () => {
  // close drawer/notifications when route changes
  state.showDrawer = false
  state.showNotifications = false
})
watch(
  () => [state.showDrawer, state.showNotifications],
  () => {
    // prevent scrolling when drawer or notifications are open
    if (state.showDrawer || state.showNotifications) {
      document.querySelector('body').classList.add('overflow-y-hidden')
    } else {
      document.querySelector('body').classList.remove('overflow-y-hidden')
    }
    // close notifications when drawer is opened
    if (state.showDrawer) {
      state.showNotifications = false
    }
    // close drawer when notifications are opened
    if (state.showNotifications) {
      state.showDrawer = false
    }
  }
)

onBeforeUnmount(() => {
  document.querySelector('body').classList.remove('overflow-y-hidden')
})
</script>

<template>
  <div
    v-if="state.showDrawer || state.showNotifications"
    @click="closeDrawer"
    class="cursor-pointer absolute z-40 top-0 right-0 w-full h-full bg-black bg-opacity-60 transition-all duration-200"
  ></div>
  <!-- Profile drawer -->
  <Transition>
    <div
      v-if="user.isAuthenticated && state.showDrawer"
      class="absolute z-50 right-0 top-0 flex flex-col h-full w-80 shadow-xl p-4 overflow-y-auto bg-white border-l border-gray-300 dark:border-gray-700 dark:bg-gray-800"
      tabindex="-1"
    >
      <div
        class="flex items-center gap-3 py-3 px-4 text-sm bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 hover: rounded-lg text-white dark:text-gray-900"
      >
        <img :src="user.user.avatarUrl" class="h-12 w-12 rounded-md" />
        <div class="flex flex-1 flex-col gap-0.5">
          <h6 class="font-semibold">@{{ user.user.handle }}</h6>
          <p class="font-medium truncate">
            {{ user.user.fullName }}
          </p>
        </div>
        <button
          type="button"
          @click="closeDrawer"
          class="text-white bg-gray-900 bg-opacity-0 hover:bg-opacity-25 rounded-md p-1.5 dark:text-gray-900"
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
        </button>
      </div>
      <ul class="py-2.5 text-sm text-gray-700 dark:text-gray-200">
        <li>
          <router-link
            :to="{ name: 'profile', params: { handle: user.user.handle } }"
            class="flex items-center gap-3 py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="w-5 h-5 fill-current"
              width="24"
              height="24"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path
                d="M20 22h-2v-2a3 3 0 0 0-3-3H9a3 3 0 0 0-3 3v2H4v-2a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v2zm-8-9a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
              />
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
              viewBox="0 0 24 24"
              class="w-5 h-5 fill-current"
              width="24"
              height="24"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path
                d="M21 18H6a1 1 0 0 0 0 2h15v2H6a3 3 0 0 1-3-3V4a2 2 0 0 1 2-2h16v16zM5 16.05c.162-.033.329-.05.5-.05H19V4H5v12.05zM16 9H8V7h8v2z"
              />
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
              viewBox="0 0 24 24"
              class="w-5 h-5 fill-current"
              width="24"
              height="24"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path
                d="M14 22.5L11.2 19H6a1 1 0 0 1-1-1V7.103a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1V18a1 1 0 0 1-1 1h-5.2L14 22.5zm1.839-5.5H21V8.103H7V17H12.161L14 19.298 15.839 17zM2 2h17v2H3v11H1V3a1 1 0 0 1 1-1z"
              />
            </svg>
            Messages
          </router-link>
        </li>
        <li>
          <router-link
            :to="{
              name: 'profile-connections',
              params: { handle: user.user.handle }
            }"
            class="flex items-center gap-3 py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="w-5 h-5 fill-current"
              width="24"
              height="24"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path
                d="M2 22a8 8 0 1 1 16 0h-2a6 6 0 1 0-12 0H2zm8-9c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm8.284 3.703A8.002 8.002 0 0 1 23 22h-2a6.001 6.001 0 0 0-3.537-5.473l.82-1.824zm-.688-11.29A5.5 5.5 0 0 1 21 8.5a5.499 5.499 0 0 1-5 5.478v-2.013a3.5 3.5 0 0 0 1.041-6.609l.555-1.943z"
              />
            </svg>
            Connections</router-link
          >
        </li>
        <li>
          <router-link
            to="/meetings"
            class="flex items-center gap-3 py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="w-5 h-5 fill-current"
              width="24"
              height="24"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path
                d="M17 9.2l5.213-3.65a.5.5 0 0 1 .787.41v12.08a.5.5 0 0 1-.787.41L17 14.8V19a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v4.2zm0 3.159l4 2.8V8.84l-4 2.8v.718zM3 6v12h12V6H3zm2 2h2v2H5V8z"
              />
            </svg>
            Meetings</router-link
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
              viewBox="0 0 24 24"
              class="w-5 h-5 fill-current"
              width="24"
              height="24"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path
                d="M3.34 17a10.018 10.018 0 0 1-.978-2.326 3 3 0 0 0 .002-5.347A9.99 9.99 0 0 1 4.865 4.99a3 3 0 0 0 4.631-2.674 9.99 9.99 0 0 1 5.007.002 3 3 0 0 0 4.632 2.672c.579.59 1.093 1.261 1.525 2.01.433.749.757 1.53.978 2.326a3 3 0 0 0-.002 5.347 9.99 9.99 0 0 1-2.501 4.337 3 3 0 0 0-4.631 2.674 9.99 9.99 0 0 1-5.007-.002 3 3 0 0 0-4.632-2.672A10.018 10.018 0 0 1 3.34 17zm5.66.196a4.993 4.993 0 0 1 2.25 2.77c.499.047 1 .048 1.499.001A4.993 4.993 0 0 1 15 17.197a4.993 4.993 0 0 1 3.525-.565c.29-.408.54-.843.748-1.298A4.993 4.993 0 0 1 18 12c0-1.26.47-2.437 1.273-3.334a8.126 8.126 0 0 0-.75-1.298A4.993 4.993 0 0 1 15 6.804a4.993 4.993 0 0 1-2.25-2.77c-.499-.047-1-.048-1.499-.001A4.993 4.993 0 0 1 9 6.803a4.993 4.993 0 0 1-3.525.565 7.99 7.99 0 0 0-.748 1.298A4.993 4.993 0 0 1 6 12c0 1.26-.47 2.437-1.273 3.334a8.126 8.126 0 0 0 .75 1.298A4.993 4.993 0 0 1 9 17.196zM12 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0-2a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
              />
            </svg>
            Settings</router-link
          >
        </li>
        <li>
          <button
            @click="logout"
            class="w-full flex items-center gap-3 py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="w-5 h-5 fill-current"
              width="24"
              height="24"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path
                d="M5 22a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v3h-2V4H6v16h12v-2h2v3a1 1 0 0 1-1 1H5zm13-6v-3h-7v-2h7V8l5 4-5 4z"
              />
            </svg>
            Logout
          </button>
        </li>
      </ul>
    </div>
  </Transition>
  <!-- Notifications -->
  <Transition>
    <div
      v-if="state.showNotifications"
      class="absolute z-50 right-0 top-0 flex flex-col h-full w-80 shadow-xl p-4 overflow-y-auto bg-white border-l border-gray-300 dark:border-gray-700 dark:bg-gray-800"
      tabindex="-1"
    >
      <div
        class="flex items-center justify-between py-3 px-4 text-sm bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 hover: rounded-lg text-white dark:text-gray-900"
      >
        <h3 class="text-lg font-semibold">Notifications</h3>
        <button
          type="button"
          @click="closeDrawer"
          class="text-white bg-gray-900 bg-opacity-0 hover:bg-opacity-25 rounded-md p-1.5 dark:text-gray-900"
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
        </button>
      </div>
      <ul class="py-2.5 text-sm text-gray-700 dark:text-gray-200">
        <li
          v-for="notification of state.notifications"
          :key="notification.id"
          class="cursor-pointer"
        >
          <p class="font-medium mb-2">
            {{ notification.message }}
          </p>
          <span class="text-sm text-gray-700 dark:text-gray-300">
            {{ new Date(notification.createdAt).toLocaleDateString('en-us') }} @
            {{ new Date(notification.createdAt).toLocaleTimeString('en-us') }}
          </span>
        </li>
      </ul>
    </div>
  </Transition>
  <!-- Navbar -->
  <nav
    class="container flex flex-wrap md:flex-nowrap items-center mx-auto px-2 sm:px-4 py-2.5"
  >
    <router-link
      to="/"
      class="flex items-center mr-auto md:mr-6 text-gray-900 dark:text-white"
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
        @click="ui.toggleTheme"
        class="p-2.5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
      >
        <svg
          v-if="ui.getIsDark"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          class="h-6 w-6 fill-current"
          width="24"
          height="24"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path
            d="M10 7a7 7 0 0 0 12 4.9v.1c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2h.1A6.979 6.979 0 0 0 10 7zm-6 5a8 8 0 0 0 15.062 3.762A9 9 0 0 1 8.238 4.938 7.999 7.999 0 0 0 4 12z"
          />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          class="w-6 h-6 fill-current"
          width="24"
          height="24"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path
            d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z"
          />
        </svg>
      </button>
      <!-- Notifications -->
      <div class="relative" v-if="user.isAuthenticated">
        <button
          type="button"
          @click="state.showNotifications = !state.showNotifications"
          class="p-2.5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="h-6 w-6 fill-current"
            width="24"
            height="24"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path
              d="M22 20H2v-2h1v-6.969C3 6.043 7.03 2 12 2s9 4.043 9 9.031V18h1v2zM5 18h14v-6.969C19 7.148 15.866 4 12 4s-7 3.148-7 7.031V18zm4.5 3h5a2.5 2.5 0 1 1-5 0z"
            />
          </svg>
        </button>
        <div
          v-if="state.notifications.length"
          class="inline-flex absolute -top-2 -right-2 justify-center items-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-white dark:border-gray-900"
        >
          {{ state.notifications.length }}
        </div>
      </div>
      <!-- Toggle user drawer -->
      <button
        type="button"
        @click="
          user.isAuthenticated
            ? (state.showDrawer = !state.showDrawer)
            : $router.push('/login')
        "
        class="p-2.5 flex items-center gap-2.5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
      >
        <template v-if="!user.isAuthenticated">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="w-6 h-6 fill-current"
            width="24"
            height="24"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path
              d="M4 15h2v5h12V4H6v5H4V3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6zm6-4V8l5 4-5 4v-3H2v-2h8z"
            />
          </svg>
          <span class="hidden md:inline-flex">Login</span>
        </template>
        <template v-else>
          <img :src="user.user.avatarUrl" class="w-6 h-6 rounded-full" />
          <span class="hidden lg:inline-flex">Profile</span>
        </template>
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
      <div v-show="true" class="w-full md:flex-1">
        <ul
          class="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:mx-4 md:text-sm md:font-medium"
        >
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

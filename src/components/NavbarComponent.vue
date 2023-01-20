<script setup>
import useInterface from '@/stores/interface'
import useUserStore from '@/stores/user'
import { onBeforeUnmount, onMounted, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Menu, MenuButton, MenuItems } from '@headlessui/vue'
import { Timestamp } from '@firebase/firestore'
import {
  mdiHeadCogOutline,
  mdiLoginVariant,
  mdiWeatherSunny,
  mdiWeatherNight,
  mdiBellOutline,
  mdiMenu,
  mdiClose,
  mdiAccountCircleOutline,
  mdiBookOpenOutline,
  mdiChatOutline,
  mdiAccountGroupOutline,
  mdiVideoOutline,
  mdiCogOutline,
  mdiLogoutVariant,
  mdiAccountPlusOutline,
  mdiHeartPlusOutline,
  mdiMessagePlusOutline,
  mdiChatPlusOutline
} from '@mdi/js'

const user = useUserStore()
const router = useRouter()
const route = useRoute()
const ui = useInterface()

const state = reactive({
  showLinks: false,
  showUserMenu: false,
  showDrawer: false,
  showNotifications: false,
  searchQuery: '',
  searchResults: [],
  notifications: []
})

onMounted(async () => {
  if (user.isAuthenticated) {
    state.notifications = await user.fetchNotifications()
  }
})

function logout() {
  user.logout()
  state.showDrawer = false
  router.push('/logout')
}
function closeDrawer() {
  if (state.showDrawer) {
    state.showDrawer = false
  } else if (state.showNotifications) {
    state.showNotifications = false
  }
}
function dismissAllNotifications() {
  user.dismissAllNotifications()
  state.notifications = []
  state.showNotifications = false
}
async function notificationClick(n) {
  return
  if (n.type === 'follow') {
    const user = await user.fetchUserByUid(n.recordId)
    user.dismissNotification(n)
    state.notifications = state.notifications.filter((x) => x !== n)
    router.push({ name: 'user', params: { handle: user.handle } })
  } else if (n.type === 'like') {
    const post = await user.fetchPostByUid(n.recordId)
    user.dismissNotification(n)
    state.notifications = state.notifications.filter((x) => x !== n)
    router.push({ name: 'post', params: { id: post.id } })
  } else if (n.type === 'comment') {
    const post = await user.fetchPostByUid(n.recordId)
    user.dismissNotification(n)
    state.notifications = state.notifications.filter((x) => x !== n)
    router.push({ name: 'post', params: { id: post.id } })
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
      class="absolute z-50 right-0 top-0 flex flex-col h-full w-96 shadow-xl p-4 overflow-y-auto bg-white border-l border-gray-300 dark:border-gray-700 dark:bg-gray-800"
      tabindex="-1"
    >
      <div
        class="flex items-center gap-4 py-3 px-4 text-sm bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 rounded-lg text-white dark:text-gray-900 shadow-lg shadow-purple-400/30"
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
          class="text-white bg-black bg-opacity-0 hover:bg-opacity-25 rounded-md p-2.5 dark:text-gray-900"
        >
          <svg-icon :path="mdiClose" type="mdi" />
        </button>
      </div>
      <ul class="py-2.5 text-sm text-gray-800 dark:text-gray-100">
        <li>
          <router-link
            :to="{ name: 'profile', params: { handle: user.user.handle } }"
            class="group flex items-center gap-4 font-medium py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <div
              class="flex-shrink-0 flex items-center justify-center p-2.5 rounded-full bg-gray-200 dark:bg-gray-700 bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 dark:group-hover:from-blue-400 dark:group-hover:to-purple-400 group-hover:text-white dark:group-hover:text-gray-900 transition-colors duration-200 ease-in-out"
            >
              <svg-icon :path="mdiAccountCircleOutline" type="mdi" />
            </div>
            Your Profile
          </router-link>
        </li>
        <li>
          <router-link
            to="/my-courses"
            class="group flex items-center gap-4 font-medium py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <div
              class="flex-shrink-0 flex items-center justify-center p-2.5 rounded-full bg-gray-200 dark:bg-gray-700 bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 dark:group-hover:from-blue-400 dark:group-hover:to-purple-400 group-hover:text-white dark:group-hover:text-gray-900 transition-colors duration-200 ease-in-out"
            >
              <svg-icon :path="mdiBookOpenOutline" type="mdi" />
            </div>
            Your Courses
          </router-link>
        </li>
        <li>
          <router-link
            to="/messages"
            class="group flex items-center gap-4 font-medium py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <div
              class="flex-shrink-0 flex items-center justify-center p-2.5 rounded-full bg-gray-200 dark:bg-gray-700 bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 dark:group-hover:from-blue-400 dark:group-hover:to-purple-400 group-hover:text-white dark:group-hover:text-gray-900 transition-colors duration-200 ease-in-out"
            >
              <svg-icon :path="mdiChatOutline" type="mdi" />
            </div>
            Messages
          </router-link>
        </li>
        <li>
          <router-link
            :to="{
              name: 'profile-connections',
              params: { handle: user.user.handle }
            }"
            class="group flex items-center gap-4 font-medium py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <div
              class="flex-shrink-0 flex items-center justify-center p-2.5 rounded-full bg-gray-200 dark:bg-gray-700 bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 dark:group-hover:from-blue-400 dark:group-hover:to-purple-400 group-hover:text-white dark:group-hover:text-gray-900 transition-colors duration-200 ease-in-out"
            >
              <svg-icon :path="mdiAccountGroupOutline" type="mdi" />
            </div>
            Connections
          </router-link>
        </li>
        <li>
          <router-link
            to="/my-meetings"
            class="group flex items-center gap-4 font-medium py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <div
              class="flex-shrink-0 flex items-center justify-center p-2.5 rounded-full bg-gray-200 dark:bg-gray-700 bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 dark:group-hover:from-blue-400 dark:group-hover:to-purple-400 group-hover:text-white dark:group-hover:text-gray-900 transition-colors duration-200 ease-in-out"
            >
              <svg-icon :path="mdiVideoOutline" type="mdi" />
            </div>
            Meetings
          </router-link>
        </li>
      </ul>
      <ul
        class="mt-auto py-2.5 border-t border-gray-700 text-gray-700 dark:text-gray-300 dark:border-gray-300"
      >
        <li>
          <router-link
            :to="{ name: 'settings' }"
            class="group flex items-center gap-4 py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <div
              class="flex-shrink-0 flex items-center justify-center p-2.5 rounded-full bg-gray-200 dark:bg-gray-700 bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 dark:group-hover:from-blue-400 dark:group-hover:to-purple-400 group-hover:text-white dark:group-hover:text-gray-900 transition-colors duration-200 ease-in-out"
            >
              <svg-icon :path="mdiCogOutline" type="mdi" />
            </div>
            Settings
          </router-link>
        </li>
        <li>
          <button
            type="button"
            @click="logout"
            class="w-full group flex items-center gap-4 py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <div
              class="flex-shrink-0 flex items-center justify-center p-2.5 rounded-full bg-gray-200 dark:bg-gray-700 bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 dark:group-hover:from-blue-400 dark:group-hover:to-purple-400 group-hover:text-white dark:group-hover:text-gray-900 transition-colors duration-200 ease-in-out"
            >
              <svg-icon :path="mdiLogoutVariant" type="mdi" />
            </div>
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
      class="absolute z-50 right-0 top-0 flex flex-col h-full w-96 shadow-xl p-4 overflow-y-auto bg-white border-l border-gray-300 dark:border-gray-700 dark:bg-gray-800"
      tabindex="-1"
    >
      <div
        class="flex items-center justify-between py-3 px-4 text-sm bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 hover: rounded-lg text-white dark:text-gray-900 shadow-lg shadow-purple-400/30"
      >
        <h3 class="text-lg font-semibold">Notifications</h3>
        <button
          type="button"
          @click="closeDrawer"
          class="text-white bg-black bg-opacity-0 hover:bg-opacity-25 rounded-md p-2.5 dark:text-gray-900"
        >
          <svg-icon :path="mdiClose" type="mdi" />
        </button>
      </div>
      <div v-if="state.notifications.length === 0" class="py-4 text-center">
        <p class="text-gray-700 dark:text-gray-300">
          No notifications. You're all caught up.
        </p>
      </div>
      <ul
        class="py-2.5 text-sm text-gray-700 dark:text-gray-200 divide-y divide-gray-200 dark:divide-gray-700"
      >
        <li
          v-for="(notification, idx) of state.notifications"
          @click="notificationClick(notification)"
          :key="idx"
          class="py-4"
        >
          <div class="group flex items-center gap-4">
            <div
              class="flex-shrink-0 flex items-center justify-center p-2.5 rounded-full bg-gray-200 dark:bg-gray-700 text-white dark:text-gray-900 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400"
            >
              <svg-icon
                v-if="notification.type === 'follow'"
                :path="mdiAccountPlusOutline"
                type="mdi"
              />
              <svg-icon
                v-else-if="notification.type === 'like'"
                :path="mdiHeartOutline"
                type="mdi"
              />
              <svg-icon
                v-else-if="notification.type === 'comment'"
                :path="mdiMessagePlusOutline"
                type="mdi"
              />
              <svg-icon
                v--else-if="notification.type === 'message'"
                :path="mdiChatPlusOutline"
                type="mdi"
              />
            </div>
            <div class="flex flex-col gap-1 flex-1">
              <p class="font-medium">
                {{ notification.message }}
                <br />
              </p>
              <span class="text-xs text-gray-700 dark:text-gray-300">
                {{ new Date(notification.created).toLocaleDateString('en-us') }}
                @
                {{ new Date(notification.created).toLocaleTimeString('en-us') }}
              </span>
            </div>
            <button
              type="button"
              @click="user.dismissNotification(idx)"
              class="p-2.5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="fill-current h-4 w-4 text-gray-700 dark:text-gray-300"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path fill="none" d="M0 0h24v24H0z" />
                <path
                  d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"
                />
              </svg>
            </button>
          </div>
        </li>
      </ul>
      <button
        type="button"
        v-if="state.notifications.length > 0"
        @click="dismissAllNotifications"
        class="py-2.5 px-5 text-sm w-full flex items-center justify-center gap-2.5 font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="fill-current w-6 h-6"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path
            d="M11.602 13.76l1.412 1.412 8.466-8.466 1.414 1.414-9.88 9.88-6.364-6.364 1.414-1.414 2.125 2.125 1.413 1.412zm.002-2.828l4.952-4.953 1.41 1.41-4.952 4.953-1.41-1.41zm-2.827 5.655L7.364 18 1 11.636l1.414-1.414 1.413 1.413-.001.001 4.951 4.951z"
          />
        </svg>
        Clear all notifications
      </button>
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
      <svg-icon :path="mdiHeadCogOutline" class="h-8 w-8 mr-3" type="mdi" />
      <span
        class="hidden md:block self-center text-xl font-bold whitespace-nowrap"
        >Intellectual Space</span
      >
      <span
        class="block md:hidden self-center text-xl font-bold whitespace-nowrap"
        >MIS</span
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
                class="inline-flex items-center gap-4 w-full py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
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
                class="inline-flex items-center gap-4 w-full py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
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
        class="p-2.5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg shadow-sm border border-gray-300 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
      >
        <svg-icon v-if="!ui.getIsDark" type="mdi" :path="mdiWeatherNight" />
        <svg-icon v-else type="mdi" :path="mdiWeatherSunny" />
      </button>
      <!-- Notifications -->
      <div class="relative" v-if="user.isAuthenticated">
        <button
          type="button"
          @click="state.showNotifications = !state.showNotifications"
          class="p-2.5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg shadow-sm border border-gray-300 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        >
          <svg-icon type="mdi" :path="mdiBellOutline" />
        </button>
        <div
          v-if="state.notifications?.length"
          class="inline-flex absolute -top-2 -right-2 justify-center items-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-white dark:border-gray-900"
        >
          {{ state.notifications?.length }}
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
        class="p-2.5 flex items-center gap-2.5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg shadow-sm border border-gray-300 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
      >
        <template v-if="!user.isAuthenticated">
          <svg-icon :path="mdiLoginVariant" type="mdi" />
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
        @click="state.showLinks = !state.showLinks"
        class="block md:hidden p-2.5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg shadow-sm border border-gray-300 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
      >
        <span class="sr-only">Open main menu</span>
        <svg-icon :path="mdiMenu" type="mdi" />
      </button>
    </div>
    <!-- Links -->
    <Transition name="nav">
      <div
        v-if="
          ((ui.getViewportPrefix === 'md' || ui.getViewportPrefix === 'sm') &&
            state.showLinks) ||
          (ui.getViewportPrefix !== 'sm' && ui.getViewportPrefix !== 'md')
        "
        class="w-full md:flex-1"
      >
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
              :to="{ name: 'feed-all' }"
              :class="[
                $route.path.startsWith('/feed')
                  ? 'block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white'
                  : 'block py-2 px-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'
              ]"
              >Feed</router-link
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

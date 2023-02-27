<script setup>
import useInterface from '@/stores/interface'
import useUserStore from '@/stores/user'
import SearchComponent from '@/components/SearchComponent.vue'
import { onBeforeUnmount, onMounted, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Menu, MenuButton, MenuItems, Dialog } from '@headlessui/vue'
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
  mdiChatPlusOutline,
  mdiBriefcaseOutline,
  mdiMagnify,
  mdiCheck,
  mdiCheckAll
} from '@mdi/js'

const user = useUserStore()
const router = useRouter()
const route = useRoute()
const ui = useInterface()
const state = reactive({
  showLinks: false,
  showUserDrawer: false,
  showDrawer: false,
  showNotifications: false,
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
    v-if="state.showDrawer || state.showNotifications || ui.getShowSearch"
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
              <!-- Follow -->
              <svg-icon
                v-if="notification.type === 'follow'"
                :path="mdiAccountPlusOutline"
                type="mdi"
              />
              <!-- Like -->
              <svg-icon
                v-if="notification.type === 'like'"
                :path="mdiHeartPlusOutline"
                type="mdi"
              />
              <!-- Comment -->
              <svg-icon
                v-if="notification.type === 'comment'"
                :path="mdiMessagePlusOutline"
                type="mdi"
              />
              <!-- Message -->
              <svg-icon
                v-if="notification.type === 'message'"
                :path="mdiChatPlusOutline"
                type="mdi"
              />
              <!-- Job application -->
              <svg-icon
                v-if="notification.type === 'job_application'"
                :path="mdiBriefcaseOutline"
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
              <svg-icon :path="mdiCheck" type="mdi" />
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
        <svg-icon :path="mdiCheckAll" type="mdi" />
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
      class="flex items-center mr-auto text-gray-900 dark:text-white"
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
      <div class="flex-1">
        <button
          type="button"
          @click="ui.toggleSearch"
          class="p-2 flex items-center gap-2.5 w-auto md:w-full md:max-w-lg text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg shadow-sm border border-gray-300 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        >
          <svg-icon
            :path="mdiMagnify"
            type="mdi"
            class="text-gray-900 dark:text-white"
          />
          <span
            class="hidden lg:inline-flex text-gray-500 dark:text-gray-400 pr-2.5"
            >Search</span
          >
          <kbd
            class="hidden lg:block px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500"
            >Ctrl + K</kbd
          >
        </button>
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
        class="flex-shrink-0 p-2.5 flex items-center gap-2.5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg shadow-sm border border-gray-300 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
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
          class="flex flex-col mt-4 md:flex-row md:gap-x-8 md:mt-0 md:text-sm md:font-medium md:px-6"
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
              :to="{ name: 'lectures-home' }"
              :class="[
                $route.path.includes('lectures')
                  ? 'block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white'
                  : 'block py-2 px-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'
              ]"
              >Lectures</router-link
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
          <li>
            <router-link
              :to="{ name: 'jobs-home' }"
              :class="[
                $route.path.startsWith('/jobs')
                  ? 'block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white'
                  : 'block py-2 px-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'
              ]"
              >Jobs</router-link
            >
          </li>
        </ul>
      </div>
    </Transition>
  </nav>

  <!-- Search Dialog -->
  <Dialog
    :open="ui.getShowSearch"
    @close="ui.toggleSearch"
    class="relative z-50"
  >
    <div class="fixed inset-0 overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4">
        <div
          class="w-full max-w-lg flex flex-col bg-white rounded-lg shadow dark:bg-gray-700"
        >
          <SearchComponent />
        </div>
      </div>
    </div>
  </Dialog>
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

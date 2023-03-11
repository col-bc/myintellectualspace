<script setup>
import AlertComponent from '@/components/AlertComponent.vue'
import LoaderComponent from '@/components/LoaderComponent.vue'
import NavbarComponent from '@/components/NavbarComponent.vue'
import useJobStore from '@/stores/job'
import useLectureStore from '@/stores/lecture'
import usePostStore from '@/stores/post'
import useUserStore from '@/stores/user'
import useReportStore from '@/stores/report'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import {
  mdiAccountCircleOutline,
  mdiHomeVariantOutline,
  mdiAccountOutline,
  mdiBriefcaseOutline,
  mdiChevronDown,
  mdiFlagOutline,
  mdiMagnify,
  mdiShieldLockOutline,
  mdiTextBoxOutline,
  mdiVideoOutline,
  mdiAlertCircleOutline,
  mdiClose,
  mdiDatabaseOutline,
  mdiClockOutline,
  mdiCheckCircleOutline
} from '@mdi/js'
import { getAuth } from 'firebase/auth'
import { computed, onMounted, onUpdated, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const auth = getAuth()
const userStore = useUserStore()
const postStore = usePostStore()
const jobStore = useJobStore()
const lectureStore = useLectureStore()
const reportStore = useReportStore()

const state = reactive({
  users: [],
  posts: [],
  jobs: [],
  lectures: [],
  reports: [],
  loading: true,
  userSearch: '',
  postSearch: '',
  lectureSearch: '',
  jobSearch: '',
  selectedUser: null,
  sessionExpiration: null
})

onMounted(async () => {
  if (!userStore.isAdmin(userStore.user.uid)) {
    router.push({ name: 'forbidden' })
  }
  // prompt for credentials if last login exceeds 30 minutes
  if (auth.currentUser) {
    const lastLogin = new Date(auth.currentUser.metadata.lastSignInTime)
    const now = new Date()
    const diff = now.getTime() - lastLogin.getTime()
    const minutes = Math.floor(diff / 1000 / 60)
    if (minutes > 30) {
      await auth.signOut()
      router.push({
        name: 'login',
        query: {
          then: route.path,
          message: 'Please reauthenticate to continue to the admin panel.'
        }
      })
    }
  }
  const expiration =
    new Date(auth.currentUser.metadata.lastSignInTime).getTime() +
    30 * 60 * 1000
  state.sessionExpiration = new Date(expiration)

  state.users = await userStore.listUsers()
  state.posts = await postStore.fetchAllPosts()
  state.jobs = await jobStore.fetchJobs()
  state.lectures = await lectureStore.fetchLectures()
  state.reports = await reportStore.fetchReports()

  state.loading = false
})
onUpdated(async () => {
  if (!userStore.isAdmin(userStore.user.uid)) {
    router.push({ name: 'forbidden' })
  }

  state.loading = false
})

const filteredUsers = computed(() => {
  if (state.userSearch === '') return state.users
  return state.users.filter((user) => {
    return user.fullName.toLowerCase().includes(state.userSearch.toLowerCase())
  })
})
const filteredPosts = computed(() => {
  if (state.selectedUser) {
    return state.posts
      .filter((post) => {
        return post.author.handle === state.selectedUser.handle
      })
      .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
  } else {
    if (state.postSearch === '') return state.posts
    return state.posts
      .filter((post) => {
        return post.content
          .toLowerCase()
          .includes(state.postSearch.toLowerCase())
      })
      .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
  }
})
const filteredLectures = computed(() => {
  if (state.selectedUser) {
    return state.lectures
      .filter((lecture) => {
        return lecture.author === state.selectedUser.id
      })
      .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
  } else {
    if (state.lectureSearch === '') return state.lectures
    return state.lectures
      .filter((lecture) => {
        return lecture.content
          .toLowerCase()
          .includes(state.postSearch.toLowerCase())
      })
      .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
  }
})
const filteredJobs = computed(() => {
  if (state.selectedUser) {
    return state.jobs
      .filter((job) => {
        return job.ownerUid === state.selectedUser.id
      })
      .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
  } else {
    if (state.jobSearch === '') return state.jobs
    return state.jobs
      .filter((job) => {
        return job.content.toLowerCase().includes(state.jobSearch.toLowerCase())
      })
      .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
  }
})

function extendSession() {
  auth.currentUser.getIdToken(true)
  const expiration =
    new Date(auth.currentUser.metadata.lastSignInTime).getTime() +
    30 * 60 * 1000
  state.sessionExpiration = new Date(expiration)
}

async function updateReportStatus(reportId) {
  const reportObj = state.reports.find((report) => report.id === reportId)
  reportObj.status = reportObj.status === 'pending' ? 'resolved' : 'pending'
  await reportStore.updateReport(reportObj.id, reportObj)
  console.log(reportObj)
}
</script>

<template>
  <main class="bg-white min-h-screen dark:bg-slate-800">
    <div class="min-h-screen flex flex-col max-w-screen-xl mx-auto mb-12">
      <NavbarComponent />
      <div
        class="mt-6 container mx-auto flex-1 flex flex-col md:flex-row items-stretch h-full w-full"
      >
        <nav
          class="bg-gray-100 w-full md:w-80 dark:bg-gray-700 rounded-lg p-4"
          tabindex="-1"
        >
          <h5
            class="text-base font-semibold text-gray-700 uppercase dark:text-gray-300"
          >
            Admin Panel
          </h5>
          <div class="py-4 overflow-y-auto">
            <ul class="space-y-2">
              <li>
                <router-link
                  :to="{ name: 'admin-home' }"
                  class="flex items-center p-2 text-base font-medium rounded-lg hover:bg-gray-200 hover:text-blue-700 dark:hover:bg-gray-600"
                  :class="[
                    $route.name === 'admin-home'
                      ? 'text-blue-700 dark:text-blue-400'
                      : 'text-gray-900 dark:text-white'
                  ]"
                >
                  <svg-icon :path="mdiHomeVariantOutline" type="mdi" />
                  <span class="ml-3">Home</span>
                </router-link>
              </li>
              <li>
                <router-link
                  :to="{ name: 'admin-users' }"
                  class="flex items-center p-2 text-base font-medium rounded-lg hover:bg-gray-200 hover:text-blue-700 dark:hover:bg-gray-600"
                  :class="[
                    $route.name === 'admin-users'
                      ? 'text-blue-700 dark:text-blue-400'
                      : 'text-gray-900 dark:text-white'
                  ]"
                >
                  <svg-icon :path="mdiAccountOutline" type="mdi" />
                  <span class="ml-3">Users</span>
                </router-link>
              </li>
              <li>
                <a
                  href="https://console.cloud.google.com/customer-identity/users?authuser=0&hl=en&project=my-intellectual-space"
                  target="_blank"
                  class="flex items-center p-2 text-base font-medium rounded-lg text-gray-900 dark:text-white hover:bg-gray-200 hover:text-blue-700 dark:hover:bg-gray-600"
                >
                  <svg-icon :path="mdiShieldLockOutline" type="mdi" />
                  <span class="ml-3">Authentication</span>
                </a>
              </li>
              <li>
                <router-link
                  :to="{ name: 'admin-posts' }"
                  class="flex items-center p-2 text-base font-medium rounded-lg hover:bg-gray-200 hover:text-blue-700 dark:hover:bg-gray-600"
                  :class="[
                    $route.name === 'admin-posts'
                      ? 'text-blue-700 dark:text-blue-400'
                      : 'text-gray-900 dark:text-white'
                  ]"
                >
                  <svg-icon :path="mdiTextBoxOutline" type="mdi" />
                  <span class="ml-3">Posts</span>
                </router-link>
              </li>
              <li>
                <router-link
                  :to="{ name: 'admin-lectures' }"
                  class="flex items-center p-2 text-base font-medium rounded-lg hover:bg-gray-200 hover:text-blue-700 dark:hover:bg-gray-600"
                  :class="[
                    $route.name === 'admin-lectures'
                      ? 'text-blue-700 dark:text-blue-400'
                      : 'text-gray-900 dark:text-white'
                  ]"
                >
                  <svg-icon :path="mdiVideoOutline" type="mdi" />
                  <span class="ml-3">Lectures</span>
                </router-link>
              </li>
              <li>
                <router-link
                  :to="{ name: 'admin-jobs' }"
                  class="flex items-center p-2 text-base font-medium rounded-lg hover:bg-gray-200 hover:text-blue-700 dark:hover:bg-gray-600"
                  :class="[
                    $route.name === 'admin-jobs'
                      ? 'text-blue-700 dark:text-blue-400'
                      : 'text-gray-900 dark:text-white'
                  ]"
                >
                  <svg-icon :path="mdiBriefcaseOutline" type="mdi" />
                  <span class="ml-3">Jobs</span>
                </router-link>
              </li>
              <li>
                <router-link
                  :to="{ name: 'admin-reports' }"
                  class="flex items-center p-2 text-base font-medium rounded-lg hover:bg-gray-200 hover:text-blue-700 dark:hover:bg-gray-600"
                  :class="[
                    $route.name === 'admin-reports'
                      ? 'text-blue-700 dark:text-blue-400'
                      : 'text-gray-900 dark:text-white'
                  ]"
                >
                  <svg-icon :path="mdiFlagOutline" type="mdi" />
                  <span class="ml-3">Reports</span>
                </router-link>
              </li>
            </ul>
          </div>
        </nav>
        <dlv class="flex-1 h-full">
          <div
            ref="sessionAlert"
            class="flex p-4 mx-4 nmd:mx-6 text-sm text-gray-800 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"
            role="alert"
          >
            <svg-icon
              :path="mdiClockOutline"
              type="mdi"
              aria-hidden="true"
              class="flex-shrink-0 inline w-5 h-5 mr-3"
            />
            <span class="sr-only">Info</span>
            <div class="flex-1">
              Your session expires at
              {{ state.sessionExpiration?.toLocaleTimeString('en-us') }} on
              {{ state.sessionExpiration?.toLocaleDateString('en-us') }}
            </div>
            <button
              type="button"
              @click="extendSession"
              class="text-gray-800 bg-transparent border border-gray-700 hover:bg-gray-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center dark:border-gray-600 dark:hover:bg-gray-600 dark:focus:ring-gray-800 dark:text-gray-300 dark:hover:text-white"
            >
              Extend
            </button>
            <button
              type="button"
              @click="$refs.sessionAlert.remove()"
              class="ml-2 bg-gray-50 text-gray-500 rounded-lg focus:ring-2 focus:ring-gray-400 p-1.5 hover:bg-gray-200 inline-flex h-8 w-8 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span class="sr-only">Dismiss</span>
              <svg-icon :path="mdiClose" type="mdi" class="w-5 h-5" />
            </button>
          </div>
          <template v-if="state.loading">
            <div
              class="grid place-items-center h-full text-gray-900 dark:text-white"
            >
              <LoaderComponent size="lg" />
            </div>
          </template>
          <template v-else-if="$route.name === 'admin-home'">
            <div
              class="relative h-full overflow-x-auto sm:rounded-lg px-4 lg:px-6"
            >
              <h1
                class="mt-6 text-5xl font-black text-gray-900 dark:text-white mb-12"
              >
                Select a module
              </h1>
              <div
                class="grid grid-cols-1 md:grid-cols-2 w-full gap-6 md:gap-12"
              >
                <router-link
                  :to="{ name: 'admin-users' }"
                  class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                >
                  <h5
                    class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white inline-flex items-center gap-4"
                  >
                    <svg-icon
                      :path="mdiAccountOutline"
                      type="mdi"
                      class="w-8 h-8"
                    />
                    User Management
                  </h5>
                  <p class="font-normal text-gray-700 dark:text-gray-400">
                    Manage {{ state.users.length }} users and their attributes
                  </p>
                </router-link>
                <a
                  href="https://console.cloud.google.com/customer-identity/users?authuser=0&hl=en&project=my-intellectual-space"
                  target="_blank"
                  class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                >
                  <h5
                    class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white inline-flex items-center gap-4"
                  >
                    <svg-icon
                      :path="mdiShieldLockOutline"
                      type="mdi"
                      class="w-8 h-8"
                    />
                    Authentication
                  </h5>
                  <p class="font-normal text-gray-700 dark:text-gray-400">
                    Manage passwords and authentication methods
                  </p>
                </a>
                <router-link
                  :to="{ name: 'admin-posts' }"
                  class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                >
                  <h5
                    class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white inline-flex items-center gap-4"
                  >
                    <svg-icon
                      :path="mdiTextBoxOutline"
                      type="mdi"
                      class="w-8 h-8"
                    />
                    Posts
                  </h5>
                  <p class="font-normal text-gray-700 dark:text-gray-400">
                    Manage {{ state.posts.length }} posts
                  </p>
                </router-link>
                <router-link
                  :to="{ name: 'admin-lectures' }"
                  class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                >
                  <h5
                    class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white inline-flex items-center gap-4"
                  >
                    <svg-icon
                      :path="mdiVideoOutline"
                      type="mdi"
                      class="w-8 h-8"
                    />
                    Lectures
                  </h5>
                  <p class="font-normal text-gray-700 dark:text-gray-400">
                    Manage {{ state.lectures.length }} lecture data and
                    attributes.
                  </p>
                </router-link>
                <router-link
                  :to="{ name: 'admin-jobs' }"
                  class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                >
                  <h5
                    class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white inline-flex items-center gap-4"
                  >
                    <svg-icon
                      :path="mdiBriefcaseOutline"
                      type="mdi"
                      class="w-8 h-8"
                    />
                    Jobs
                  </h5>
                  <p class="font-normal text-gray-700 dark:text-gray-400">
                    Manage {{ state.jobs.length }} jobs data and attributes.
                  </p>
                </router-link>
                <router-link
                  :to="{ name: 'admin-reports' }"
                  class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                >
                  <h5
                    class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white inline-flex items-center gap-4"
                  >
                    <svg-icon
                      :path="mdiFlagOutline"
                      type="mdi"
                      class="w-8 h-8"
                    />
                    Reported Content
                  </h5>
                  <p class="font-normal text-gray-700 dark:text-gray-400">
                    Respond to {{ state.reports.length }} reports
                  </p>
                </router-link>
              </div>
            </div>
          </template>
          <template v-else-if="$route.name === 'admin-users'">
            <div
              class="relative h-full overflow-x-auto sm:rounded-lg p-4 lg:p-6"
            >
              <div class="flex items-center justify-end pb-4">
                <label for="table-search" class="sr-only">Search</label>
                <div class="relative">
                  <div
                    class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
                  >
                    <svg-icon
                      :path="mdiMagnify"
                      type="mdi"
                      class="w-5 h-5 text-gray-500 dark:text-gray-400"
                    />
                  </div>
                  <input
                    type="search"
                    v-model="state.userSearch"
                    class="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Search for users"
                  />
                </div>
              </div>
              <table
                class="w-full text-sm text-left text-gray-500 dark:text-gray-400"
              >
                <thead
                  class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
                >
                  <tr>
                    <th scope="col" class="px-6 py-3">Name</th>
                    <th scope="col" class="px-6 py-3">Field Count</th>
                    <th scope="col" class="px-6 py-3">Last Login</th>
                    <th scope="col" class="px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="user in filteredUsers"
                    :key="user.id"
                    class="bg-white border-b dark:bg-transparent dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td
                      scope="row"
                      class="h-full flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      <img
                        class="flex-shrink-0 border dark:border-gray-400 w-10 h-10 rounded-full"
                        :src="user.avatarUrl"
                        alt="Avatar image"
                      />
                      <div class="pl-3">
                        <div class="text-base font-semibold">
                          {{ user.fullName }}
                        </div>
                        <div class="font-normal text-gray-500">
                          @{{ user.handle }}
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4">{{ Object.keys(user).length }}</td>
                    <td class="px-6 py-4">
                      {{ user.lastActive.toDate().toLocaleDateString() }}
                    </td>
                    <td class="px-6 py-4">
                      <a
                        :href="`https://console.cloud.google.com/firestore/databases/-default-/data/panel/users/${user.id}?project=my-intellectual-space`"
                        target="_blank"
                        class="block mb-1 font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        Manage Data
                      </a>
                      <a
                        href="https://console.cloud.google.com/customer-identity/users?authuser=0&hl=en&project=my-intellectual-space"
                        target="_blank"
                        class="block font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        Manage Password
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
          <template v-else-if="$route.name === 'admin-posts'">
            <div
              class="relative h-full overflow-x-auto sm:rounded-lg p-4 lg:p-6"
            >
              <div class="flex items-center justify-between pb-4">
                <Menu as="div" class="relative">
                  <MenuButton
                    class="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                    type="button"
                  >
                    <svg-icon
                      v-if="!state.selectedUser"
                      :path="mdiAccountCircleOutline"
                      type="mdi"
                    />
                    <img
                      :src="state.selectedUser.avatarUrl"
                      class="flex-shrink-0 w-6 h-6 border dark:border-gray-400 rounded-full"
                      v-else
                    />
                    <span class="mx-2">{{
                      state.selectedUser
                        ? state.selectedUser.fullName
                        : 'All Users'
                    }}</span>
                    <svg-icon :path="mdiChevronDown" type="mdi" />
                  </MenuButton>
                  <MenuItems
                    class="absolute z-10 mt-2 w-48 h-64 overflow-y-auto bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 text-sm text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700"
                  >
                    <MenuItem
                      as="div"
                      class="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
                      @click="state.selectedUser = null"
                    >
                      <svg-icon
                        :path="mdiAccountCircleOutline"
                        type="mdi"
                        class="w-6 h-6 mr-2 text-gray-500 dark:text-gray-400"
                      />
                      All Users
                    </MenuItem>
                    <MenuItem
                      as="div"
                      v-for="user of state.users"
                      @click="state.selectedUser = user"
                      class="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      <img
                        :src="user.avatarUrl"
                        class="flex-shrink-0 w-6 h-6 rounded-full mr-2 border dark:border-gray-400"
                      />
                      {{ user.fullName }}
                    </MenuItem>
                  </MenuItems>
                </Menu>
                <label for="table-search" class="sr-only">Search</label>
                <div class="relative">
                  <div
                    class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
                  >
                    <svg-icon
                      :path="mdiMagnify"
                      type="mdi"
                      class="w-5 h-5 text-gray-500 dark:text-gray-400"
                    />
                  </div>
                  <input
                    type="search"
                    v-model="state.postSearch"
                    class="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Search for posts"
                  />
                </div>
              </div>
              <table
                class="w-full text-sm text-left text-gray-500 dark:text-gray-400"
              >
                <thead
                  class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
                >
                  <tr>
                    <th scope="col" class="px-6 py-3">Author</th>
                    <th scope="col" class="px-6 py-3">Body</th>
                    <th scope="col" class="px-6 py-3">Created</th>
                    <th scope="col" class="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="post in filteredPosts"
                    :key="post.id"
                    class="bg-white border-b dark:bg-transparent dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td
                      scope="row"
                      class="h-full flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      <img
                        class="flex-shrink-0 border dark:border-gray-400 w-10 h-10 rounded-full"
                        :src="post.author.avatarUrl"
                        alt="Avatar image"
                      />
                      <div class="pl-3">
                        <div class="text-base font-semibold">
                          {{ post.author.fullName }}
                        </div>
                        <div class="font-normal text-gray-500">
                          @{{ post.author.handle }}
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <template v-if="post.content.length > 100">
                        {{ post.content.substring(0, 100) }}...
                      </template>
                      <template v-else>
                        {{ post.content }}
                      </template>
                    </td>
                    <td class="px-6 py-4">
                      {{ post.createdAt.toDate().toLocaleDateString() }}
                    </td>
                    <td class="px-6 py-4">
                      <a
                        :href="`https://console.cloud.google.com/firestore/databases/-default-/data/panel/posts/${post.id}?project=my-intellectual-space`"
                        target="_blank"
                        class="block mb-1 font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        Manage
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
          <template v-else-if="$route.name === 'admin-lectures'">
            <div
              class="relative h-full overflow-x-auto sm:rounded-lg p-4 lg:p-6"
            >
              <div class="flex items-center justify-between pb-4">
                <Menu as="div" class="relative">
                  <MenuButton
                    class="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                    type="button"
                  >
                    <svg-icon
                      v-if="!state.selectedUser"
                      :path="mdiAccountCircleOutline"
                      type="mdi"
                    />
                    <img
                      :src="state.selectedUser.avatarUrl"
                      class="flex-shrink-0 w-6 h-6 border dark:border-gray-400 rounded-full"
                      v-else
                    />
                    <span class="mx-2">{{
                      state.selectedUser
                        ? state.selectedUser.fullName
                        : 'All Users'
                    }}</span>
                    <svg-icon :path="mdiChevronDown" type="mdi" />
                  </MenuButton>
                  <MenuItems
                    class="absolute z-10 mt-2 w-48 h-64 overflow-y-auto bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 text-sm text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700"
                  >
                    <MenuItem
                      as="div"
                      class="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
                      @click="state.selectedUser = null"
                    >
                      <svg-icon
                        :path="mdiAccountCircleOutline"
                        type="mdi"
                        class="w-6 h-6 mr-2 text-gray-500 dark:text-gray-400"
                      />
                      All Users
                    </MenuItem>
                    <MenuItem
                      as="div"
                      v-for="user of state.users"
                      @click="state.selectedUser = user"
                      class="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      <img
                        :src="user.avatarUrl"
                        class="flex-shrink-0 w-6 h-6 rounded-full mr-2 border dark:border-gray-400"
                      />
                      {{ user.fullName }}
                    </MenuItem>
                  </MenuItems>
                </Menu>
                <label for="table-search" class="sr-only">Search</label>
                <div class="relative">
                  <div
                    class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
                  >
                    <svg-icon
                      :path="mdiMagnify"
                      type="mdi"
                      class="w-5 h-5 text-gray-500 dark:text-gray-400"
                    />
                  </div>
                  <input
                    type="search"
                    v-model="state.lectureSearch"
                    class="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Search for lectures"
                  />
                </div>
              </div>
              <table
                class="w-full text-sm text-left text-gray-500 dark:text-gray-400"
              >
                <thead
                  class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
                >
                  <tr>
                    <th scope="col" class="px-6 py-3">Author</th>
                    <th scope="col" class="px-6 py-3">Title</th>
                    <th scope="col" class="px-6 py-3">Resource</th>
                    <th scope="col" class="px-6 py-3">Created</th>
                    <th scope="col" class="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="lecture in filteredLectures"
                    :key="lecture.id"
                    class="bg-white border-b dark:bg-transparent dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td
                      scope="row"
                      class="h-full flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      <img
                        class="flex-shrink-0 border dark:border-gray-400 w-10 h-10 rounded-full"
                        :src="
                          state.users.find((user) => user.id === lecture.author)
                            .avatarUrl
                        "
                        alt="Avatar image"
                      />
                      <div class="pl-3">
                        <div class="text-base font-semibold">
                          {{
                            state.users.find(
                              (user) => user.id === lecture.author
                            ).fullName
                          }}
                        </div>
                        <div class="font-normal text-gray-500">
                          @{{
                            state.users.find(
                              (user) => user.id === lecture.author
                            ).handle
                          }}
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      {{ lecture.title }}
                    </td>
                    <td class="px-6 py-4">
                      <a
                        :href="lecture.video"
                        target="_blank"
                        class="block text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500"
                      >
                        <svg-icon
                          :path="mdiDatabaseOutline"
                          type="mdi"
                          class="w-5 h-5"
                        />
                      </a>
                    </td>
                    <td class="px-6 py-4">
                      {{ lecture.createdAt.toDate().toLocaleDateString() }}
                    </td>
                    <td class="px-6 py-4">
                      <a
                        :href="`https://console.cloud.google.com/firestore/databases/-default-/data/panel/lectures/${lecture.id}?project=my-intellectual-space`"
                        target="_blank"
                        class="block mb-1 font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        Manage
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
          <template v-else-if="$route.name === 'admin-jobs'">
            <div
              class="relative h-full overflow-x-auto sm:rounded-lg p-4 lg:p-6"
            >
              <div class="flex items-center justify-end pb-4">
                <label for="table-search" class="sr-only">Search</label>
                <div class="relative">
                  <div
                    class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
                  >
                    <svg-icon
                      :path="mdiMagnify"
                      type="mdi"
                      class="w-5 h-5 text-gray-500 dark:text-gray-400"
                    />
                  </div>
                  <input
                    type="search"
                    v-model="state.jobSearch"
                    class="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Search for jobs"
                  />
                </div>
              </div>
              <table
                class="w-full text-sm text-left text-gray-500 dark:text-gray-400"
              >
                <thead
                  class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
                >
                  <tr>
                    <th scope="col" class="px-6 py-3">Organization</th>
                    <th scope="col" class="px-6 py-3">Job Title</th>
                    <th scope="col" class="px-6 py-3">Open</th>
                    <th scope="col" class="px-6 py-3">Created</th>
                    <th scope="col" class="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="job in filteredJobs"
                    :key="job.id"
                    class="bg-white border-b dark:bg-transparent dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td
                      scope="row"
                      class="h-full flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      <img
                        class="flex-shrink-0 border dark:border-gray-400 w-10 h-10 rounded-full"
                        :src="job.companyProfile.logo"
                        alt="Company Logo"
                      />
                      <div class="pl-3">
                        <div class="text-base font-semibold">
                          {{ job.companyProfile.name }}
                        </div>
                        <div class="font-normal text-gray-500">
                          {{ job.companyProfile.city }}
                          {{ job.companyProfile.state }}
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      {{ job.title }}
                    </td>
                    <td class="px-6 py-4">
                      <svg-icon
                        v-if="job.acceptApplications"
                        :path="mdiCheckCircleOutline"
                        type="mdi"
                        class="w-5 h-5 text-green-500 dark:text-green-400"
                      />
                    </td>
                    <td class="px-6 py-4">
                      {{ job.created.toDate().toLocaleDateString() }}
                    </td>
                    <td class="px-6 py-4">
                      <a
                        :href="`https://console.cloud.google.com/firestore/databases/-default-/data/panel/jobs/${job.id}?project=my-intellectual-space`"
                        target="_blank"
                        class="block mb-1 font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        Manage
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
          <template v-else-if="$route.name === 'admin-reports'">
            <div
              class="relative h-full overflow-x-auto sm:rounded-lg p-4 lg:p-6"
            >
              <table
                class="w-full text-sm text-left text-gray-500 dark:text-gray-400"
              >
                <thead
                  class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
                >
                  <tr>
                    <th scope="col" class="px-6 py-3">Reported Content Path</th>
                    <th scope="col" class="px-6 py-3">Status</th>
                    <th scope="col" class="px-6 py-3">Updated</th>
                    <th scope="col" class="px-6 py-3">Created</th>
                    <th scope="col" class="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="report in state.reports"
                    :key="report.id"
                    class="bg-white border-b dark:bg-transparent dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td
                      scope="row"
                      class="h-full px-6 py-4 text-gray-900 font-medium whitespace-nowrap dark:text-white"
                    >
                      {{ report.path }}
                    </td>
                    <td class="px-6 py-4 flex-shrink-0">
                      <select
                        v-mode="report.status"
                        @change="updateReportStatus(report.id)"
                        class="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                        <option
                          value="pending"
                          :selected="report.status === 'pending'"
                        >
                          Pending
                        </option>
                        <option
                          value="resolved"
                          :selected="report.status === 'resolved'"
                        >
                          Resolved
                        </option>
                      </select>
                    </td>
                    <td class="px-6 py-4">
                      {{ report.updated.toDate().toLocaleDateString() }}
                    </td>
                    <td class="px-6 py-4">
                      {{ report.created.toDate().toLocaleDateString() }}
                    </td>
                    <td class="px-6 py-4">
                      <a
                        :href="`https://console.cloud.google.com/firestore/databases/-default-/data/panel/reports/${report.id}?project=my-intellectual-space`"
                        target="_blank"
                        class="block mb-1 font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        Manage
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
        </dlv>
      </div>
    </div>
  </main>
</template>

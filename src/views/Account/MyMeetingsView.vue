<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import LoaderComponent from '@/components/LoaderComponent.vue'
import NavbarComponent from '@/components/NavbarComponent.vue'
import useUserStore from '@/stores/user'
import { useRouter } from 'vue-router'
import { generate } from '@vue/compiler-core'

const user = useUserStore()
const router = useRouter()
const state = reactive({
  loading: false,
  meetingId: '',
  error: null,
  recentMeetings: null
})

watch(
  () => state.meetingId,
  (val) => {
    if (state.error) {
      state.error = null
    }
    // match 4-4-4
    if (val.match(/^[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}$/)) {
      state.error = null
    } else {
      state.error = 'Meeting ID is invalid. IDs are in the format XXX-XXX-XXXX'
    }
    // dynamically add hyphens to the input
    if (val.length === 4) {
      state.meetingId += '-'
    }
    if (val.length === 9) {
      state.meetingId += '-'
    }
  }
)
watch(
  () => state.recentMeetings,
  (val) => {
    if (val.length > 5) {
      state.recentMeetings = val.slice(0, 5)
    }
  },
  { deep: true }
)

onMounted(() => {
  state.loading = true
  // get recent meetings from local storage
  const recentMeetings = localStorage.getItem('recentMeetings')
  if (recentMeetings) {
    state.recentMeetings = JSON.parse(recentMeetings)
  }
  state.loading = false
})

function generateId() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let id = ''
  for (let i = 0; i < 4; i++) {
    id += chars[Math.floor(Math.random() * chars.length)]
  }
  id += '-'
  for (let i = 0; i < 4; i++) {
    id += chars[Math.floor(Math.random() * chars.length)]
  }
  id += '-'
  for (let i = 0; i < 4; i++) {
    id += chars[Math.floor(Math.random() * chars.length)]
  }
  return id
}
function validateMeeting() {
  state.error = null
  // match 4-4-4
  if (state.meetingId.match(/^[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}$/)) {
    // update history
    state.recentMeetings.push({
      id: state.meetingId,
      date: new Date().toISOString()
    })
    const routeData = router.resolve({
      name: 'host-meeting',
      params: { channel: state.meetingId }
    })
    window.open(routeData.href, '_blank')
  } else {
    state.error = 'Meeting ID is invalid. IDs are in the format XXX-XXX-XXXX'
  }
}
function createMeeting() {
  state.meetingId = generateId()
  // update history
  state.recentMeetings.push({
    id: state.meetingId,
    date: new Date().toISOString()
  })
  const routeData = router.resolve({
    name: 'host-meeting',
    params: { channel: state.meetingId }
  })
  window.open(routeData.href, '_blank')
}
function openMeeting(id) {
  const routeData = router.resolve({
    name: 'host-meeting',
    params: { channel: id }
  })
  window.open(routeData.href, '_blank')
}
</script>

<template>
  <main class="bg-white min-h-screen dark:bg-slate-800">
    <div class="max-w-screen-xl mx-auto h-full flex flex-col">
      <NavbarComponent />
      <div
        v-if="state.loading"
        class="h-screen flex items-center justify-center"
      >
        <LoaderComponent size="lg" class="text-gray-900 dark:text-white" />
      </div>
      <div
        v-else
        class="flex-1 container mx-auto flex flex-col-reverse md:flex-row md:items-start py-12 px-2 md:px-4"
      >
        <div class="flex-1 flex flex-col mb-12">
          <h1
            class="text-5xl font-black leading-loose text-gray-900 dark:text-white mb-12"
          >
            My Meetings
          </h1>

          <h6 class="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Upcoming Meetings
          </h6>
          <p class="text-gray-700 dark:text-gray-400 mb-12">
            You don't have any upcoming meetings.
          </p>
          <h6 class="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Recent Meetings
          </h6>
          <ul
            v-if="state.recentMeetings?.length"
            class="divide-y divide-gray-300 dark:divide-gray-700 mb-12"
          >
            <li
              v-for="m of state.recentMeetings"
              :key="m.id"
              class="py-2 px-4 flex items-center justify-between text-gray-700 dark:text-gray-400"
            >
              <strong
                class="font-mono text-lg text-gray-800 dark:text-white font-medium uppercase"
              >
                {{ m.id }}
              </strong>
              <span class="text-gray-500 dark:text-gray-500">
                {{ new Date(m.date).toLocaleString('en-us') }}
              </span>
              <button
                type="button"
                @click="openMeeting(m.id)"
                class="px-3 py-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                Join
              </button>
            </li>
          </ul>
        </div>
        <div class="flex-1 flex items-center justify-center">
          <div
            class="bg-white dark:bg-gray-800 border rounded-lg shadow-md border-gray-300 dark:border-gray-700 p-6 w-full max-w-lg mx-auto mb-12"
          >
            <h4 class="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Join or Create a Video Meeting
            </h4>
            <div class="mb-6">
              <div class="relative w-full shadow-sm rounded-lg">
                <input
                  type="text"
                  id="meetingId-input"
                  v-model="state.meetingId"
                  @keyup.enter="validateMeeting"
                  class="block w-full p-4 font-mono text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Enter a meeting ID (XXX-XXX-XXXX) to join"
                />
                <button
                  type="button"
                  v-if="!!state.meetingId"
                  @click="validateMeeting"
                  class="absolute inset-y-2 right-2 px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Join
                </button>
              </div>
              <p
                v-if="state.error"
                class="mt-2 text-sm text-red-700 dark:text-red-400"
              >
                {{ state.error }}
              </p>
            </div>
            <div class="flex items-center justify-center mb-6">
              <div class="w-1/3 border-b dark:border-gray-600"></div>
              <div class="mx-4 text-gray-500 dark:text-gray-400">or</div>
              <div class="w-1/3 border-b dark:border-gray-600"></div>
            </div>
            <div
              class="flex flex-col-reverse md:flex-row items-center justify-center gap-6"
            >
              <button
                type="button"
                @click="createMeeting"
                class="w-full flex items-center justify-center gap-2.5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5 fill-current"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path fill="none" d="M0 0H24V24H0z" />
                  <path
                    d="M16 4c.552 0 1 .448 1 1v4.2l5.213-3.65c.226-.158.538-.103.697.124.058.084.09.184.09.286v12.08c0 .276-.224.5-.5.5-.103 0-.203-.032-.287-.09L17 14.8V19c0 .552-.448 1-1 1H2c-.552 0-1-.448-1-1V5c0-.552.448-1 1-1h14zm-1 2H3v12h12V6zM8 8h2v3h3v2H9.999L10 16H8l-.001-3H5v-2h3V8zm13 .841l-4 2.8v.718l4 2.8V8.84z"
                  />
                </svg>
                Start a Meeting
              </button>
              <button
                type="button"
                class="w-full flex items-center justify-center gap-2.5 py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5 fill-current"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path
                    d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-8h4v2h-6V7h2v5z"
                  />
                </svg>
                Schedule for later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

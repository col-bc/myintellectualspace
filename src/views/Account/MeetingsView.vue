<script setup>
import { ref, reactive } from 'vue'
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
  error: null
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
    router.push({
      name: 'join-meeting',
      params: { channel: state.meetingId }
    })
  } else {
    state.error = 'Meeting id is invalid'
  }
}
function createMeeting() {
  state.meetingId = generateId()
  router.push({
    name: 'host-meeting',
    params: { channel: state.meetingId }
  })
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
        class="flex-1 container mx-auto flex flex-col py-12 px-2 md:px-4"
      >
        <div class="flex flex-col mb-12">
          <h1
            class="text-5xl font-black leading-loose text-gray-900 dark:text-white mb-12"
          >
            Video Meetings
          </h1>
          <div
            class="flex flex-1 w-full max-w-xl items-start p-4 bg-white dark:bg-gray-800 border rounded-lg shadow-lg border-gray-300 dark:border-gray-700 mb-6"
          >
            <div class="w-full mr-4">
              <label
                class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                >Meeting Id</label
              >
              <div class="relative w-full">
                <div
                  class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 fill-gray-500 dark:fill-gray-400"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path
                      d="M17 9.2l5.213-3.65a.5.5 0 0 1 .787.41v12.08a.5.5 0 0 1-.787.41L17 14.8V19a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v4.2zm0 3.159l4 2.8V8.84l-4 2.8v.718zM3 6v12h12V6H3zm2 2h2v2H5V8z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  v-model="state.meetingId"
                  @keyup.enter="validateMeeting"
                  class="block w-full p-4 pl-10 text-lg text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Enter meeting id"
                />
                <button
                  type="button"
                  @click="validateMeeting"
                  v-if="!!state.meetingId"
                  class="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Join
                </button>
              </div>
              <p class="text-red-500 text-sm mt-2" v-if="state.error">
                {{ state.error }}
              </p>
            </div>
            <button
              type="button"
              @click="createMeeting"
              class="mt-4 flex items-center justify-center gap-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 fill-current"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path fill="none" d="M0 0h24v24H0z" />
                <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z" />
              </svg>
              Create
            </button>
          </div>
          <h6 class="text-xl font-bold text-gray-900 dark:text-white">
            Upcoming Meetings
          </h6>
        </div>
      </div>
    </div>
  </main>
</template>

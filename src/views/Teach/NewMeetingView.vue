<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import axios from 'axios'

import useUserStore from '@/stores/user'
import NavbarComponent from '@/components/NavbarComponent.vue'
import VideoComponent from '@/components/VideoComponent.vue'

const userStore = useUserStore()
const route = useRoute()
const zak = ref('')
const step = ref(0) // 0 - oauth, 2 - meeting details, 3 - meeting created

function startOAuth() {
  window.location.href = 'https://zoom.us/oauth/authorize?client_id=F1fIs_DTjW41L2RIAoi3A&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fteach%2Fnew-meeting'
}
async function oAuthCallback(code) {
  // getch zak token with oauth code
  try {
    const response = await axios.get(`/api/meetings/zak/${code}`, {
      headers: {
        Authorization: userStore.getBearerToken,
      },
    })
    zak.value = response.data.access_token
    step.value = 1
  } catch (error) {
    console.log(error)
  }
}

// Call oauth callback if code is in url
onMounted(() => {
  if (route.query.code) {
    oAuthCallback(route.query.code)
  }
})

const meeting = reactive({
  name: '',
  start_time: '',
  duration: '60',
  agenda: '',
  password: '',
  data: {} //  for response data
})

async function createMeeting() {
  try {
    const response = await axios.post('/api/meetings/',
      {
        zak: zak.value,
        name: meeting.name,
        start_time: meeting.start_time,
        duration: meeting.duration,
        agenda: meeting.agenda,
        password: meeting.password,
      }, {
      headers: {
        Authorization: userStore.getBearerToken,
      },
    })
    console.log(response.data)
    meeting.data = response.data
    step.value = 2
  } catch (err) {
    console.log(err)
  }
}

const jwt = ref('')
async function getJWT() {
  let url = `/api/meetings/jwt`
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: userStore.getBearerToken,
      },
    })
    jwt.value = response.data.jwt
  } catch (err) {
    console.log(err)
  }
}
</script>

<template>
  <main>
    <NavbarComponent />
    <div v-if="!accessToken"
         class="f-full max-w-xl mx-auto flex flex-col items-center my-12">
      <!-- Start OAuth flow -->
      <div v-if="step === 0">
        <svg xmlns="http://www.w3.org/2000/svg"
             class="h-24 w-24 text-white mb-12 mx-auto p-3 rounded-full bg-gradient-to-b from-blue-400 to-purple-400"
             fill="none"
             viewBox="0 0 24 24"
             stroke="currentColor"
             stroke-width="2">
          <path stroke-linecap="round"
                stroke-linejoin="round"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        <h1 class="text-4xl font-bold text-center leading-relaxed mb-12">
          Set up your meeting
        </h1>
        <p class="font-medium text-center text-lg mb-6">
          To get started, you will need to authorize us to access your Zoom account. This will allow us to create and manage meetings on your behalf.
        </p>
        <button type="button"
                @click="startOAuth()"
                class="w-auto mx-auto flex items-center justify-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Start OAuth Authorization
          <svg aria-hidden="true"
               class="ml-2 -mr-1 w-4 h-4"
               fill="currentColor"
               viewBox="0 0 20 20"
               xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>
      <!-- Meeting details -->
      <div v-if="step === 1">
        <svg xmlns="http://www.w3.org/2000/svg"
             class="h-24 w-24 text-white mb-12 mx-auto p-3 rounded-full bg-gradient-to-b from-blue-400 to-purple-400"
             fill="none"
             viewBox="0 0 24 24"
             stroke="currentColor"
             stroke-width="2">
          <path stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <h1 class="text-4xl font-bold text-center leading-relaxed mb-12">
          Configure your meeting
        </h1>
        <form @submit.prevent="createMeeting()"
              class="flex flex-col gap-6">
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Meeting name</label>
            <input type="text"
                   v-model="meeting.name"
                   class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                   required>
          </div>

          <div>
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Start time</label>
            <input type="datetime-local"
                   v-model="meeting.start_time"
                   class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                   required>
          </div>

          <div>
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Duration</label>
            <input type="number"
                   v-model="meeting.duration"
                   class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                   required>
          </div>

          <div>
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Agenda</label>
            <input type="text"
                   v-model="meeting.agenda"
                   class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                   required>
          </div>

          <div>
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Password <small class="ml-1">(optional)</small></label>
            <input type="number"
                   v-model="meeting.password"
                   class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          </div>

          <button type="submit"
                  class="w-full flex items-center justify-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Create Meeting
            <svg aria-hidden="true"
                 class="ml-2 -mr-1 w-4 h-4"
                 fill="currentColor"
                 viewBox="0 0 20 20"
                 xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clip-rule="evenodd"></path>
            </svg>
          </button>
        </form>

      </div>
      <div v-if="step === 2">
        <svg xmlns="http://www.w3.org/2000/svg"
             class="h-24 w-24 text-white mb-12 mx-auto p-3 rounded-full bg-gradient-to-b from-blue-400 to-purple-400"
             fill="none"
             viewBox="0 0 24 24"
             stroke="currentColor"
             stroke-width="2">
          <path stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h1 class="text-4xl font-bold text-center leading-relaxed mb-12">
          Your meeting is ready!
        </h1>
        <h5 class="text-xl font-bold">Meeting ID</h5>
        <div class="rounded-md bg-gray-800 text-white font-mono p-1 mb-6 text-medium select-all whitespace-nowrap">
          <code>{{ meeting.data.id }}</code>
        </div>

        <h5 class="text-xl font-bold">Join Link</h5>
        <div class="rounded-md bg-gray-800 text-white font-mono p-1 mb-6 text-medium select-all whitespace-nowrap">
          <code>{{ meeting.data.join_url }}</code>
        </div>

        <h5 class="text-xl font-bold">Password</h5>
        <div class="rounded-md bg-gray-800 text-white font-mono p-1 mb-12 text-medium select-all whitespace-nowrap">
          <code>{{ meeting.data.password }}</code>
        </div>

        <a :href="meeting.data.join_url"
           target="_blank"
           class="w-auto mx-auto flex items-center justify-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Open Meeting
        </a>
      </div>
    </div>
    <div v-else>
      <VideoComponent :accessToken="accessToken" />
    </div>
  </main>
</template>

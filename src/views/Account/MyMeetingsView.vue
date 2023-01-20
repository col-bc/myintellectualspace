<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import LoaderComponent from '@/components/LoaderComponent.vue'
import NavbarComponent from '@/components/NavbarComponent.vue'
import useUserStore from '@/stores/user'
import useMeetingStore from '../../stores/meeting'
import { useRouter } from 'vue-router'
import { Dialog } from '@headlessui/vue'
import {
  mdiVideoPlusOutline,
  mdiClockTimeFiveOutline,
  mdiRefresh,
  mdiTrashCanOutline
} from '@mdi/js'

const user = useUserStore()
const meetingStore = useMeetingStore()
const router = useRouter()
const state = reactive({
  loading: false,
  meetingId: '',
  error: null,
  recentMeetings: [],
  myMeetings: [],
  showScheduleDialog: false
})
const scheduleMeeting = reactive({
  error: null,
  new: true,
  id: '',
  date: '',
  time: '',
  duration: 30,
  notes: '',
  invitees: []
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

onMounted(async () => {
  state.loading = true
  // get recent meetings from local storage
  const recentMeetings = localStorage.getItem('recentMeetings')
  if (recentMeetings) {
    state.recentMeetings = JSON.parse(recentMeetings)
  }
  await meetingStore.fetchMeetings()
  state.myMeetings = meetingStore.meetings
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
async function onScheduleMeeting() {
  // validate form
  if (!scheduleMeeting.id) {
    scheduleMeeting.error = 'Meeting ID is required'
    return
  }
  if (!scheduleMeeting.date) {
    scheduleMeeting.error = 'Date is required'
    return
  }
  if (!scheduleMeeting.time) {
    scheduleMeeting.error = 'Time is required'
    return
  }
  if (!scheduleMeeting.duration) {
    scheduleMeeting.error = 'Duration is required'
    return
  }

  if (scheduleMeeting.new) {
    // create meeting
    await meetingStore.addMeeting({
      id: scheduleMeeting.id,
      date: scheduleMeeting.date,
      time: scheduleMeeting.time,
      duration: scheduleMeeting.duration,
      notes: scheduleMeeting.notes,
      invitees: scheduleMeeting.invitees
    })
  } else {
    // update meeting
    await meetingStore.updateMeeting({
      id: scheduleMeeting.id,
      date: scheduleMeeting.date,
      time: scheduleMeeting.time,
      duration: scheduleMeeting.duration,
      notes: scheduleMeeting.notes,
      invitees: scheduleMeeting.invitees
    })
  }
}
async function modifyScheduledMeeting(m) {
  state.showScheduleDialog = true
  scheduleMeeting.new = false
  scheduleMeeting.id = m.id
  scheduleMeeting.date = m.date
  scheduleMeeting.time = m.time
  scheduleMeeting.duration = m.duration
  scheduleMeeting.notes = m.notes
  scheduleMeeting.invitees = m.invitees
}
async function deleteScheduledMeeting(id) {
  await meetingStore.removeMeeting(id)
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
          <p
            v-if="!state.myMeetings"
            class="text-gray-700 dark:text-gray-400 mb-12"
          >
            You don't have any upcoming meetings.
          </p>
          <ul
            v-if="state.myMeetings"
            class="divide-y divide-gray-300 dark:divide-gray-700 mb-12"
          >
            <li
              v-for="m of state.myMeetings"
              :key="m.id"
              class="py-2 px-4 flex items-center gap-4 text-gray-700 dark:text-gray-400"
            >
              <strong
                class="font-mono text-lg text-gray-800 dark:text-white font-medium uppercase"
              >
                {{ m.id }}
              </strong>
              <span class="text-gray-500 dark:text-gray-500">
                {{ new Date(m.date).toLocaleString('en-us') }}
                @ {{ m.time }}
              </span>
              <router-link
                :to="{
                  name: 'host-meeting',
                  params: { channel: m.id }
                }"
                target="_blank"
                class="ml-auto px-3 py-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                Join
              </router-link>
              <button
                type="button"
                @click="modifyScheduledMeeting(m)"
                class="px-3 py-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                Modify
              </button>
            </li>
          </ul>
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
        <div class="flex-1">
          <div
            class="bg-white dark:bg-gray-800 border rounded-lg shadow-md border-gray-300 dark:border-gray-700 p-6 w-full max-w-lg md:ml-auto mb-12"
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
                <svg-icon :path="mdiVideoPlusOutline" type="mdi" />
                Start a Meeting
              </button>
              <button
                type="button"
                @click="
                  () => {
                    state.showScheduleDialog = true
                    scheduleMeeting.new = true
                  }
                "
                class="w-full flex items-center justify-center gap-2.5 py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                <svg-icon
                  :path="mdiClockTimeFiveOutline"
                  type="mdi"
                  class="w-5 h-5 fill-current"
                />
                Schedule for Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  <Dialog
    :open="state.showScheduleDialog"
    @close="state.showScheduleDialog = false"
    class="relative z-10"
  >
    <div class="fixed inset-0 bg-black bg-opacity-60" />
    <div class="fixed inset-0 overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4">
        <div
          class="w-full max-w-lg flex flex-col p-6 bg-white rounded-lg shadow dark:bg-gray-700"
        >
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
              <template v-if="!scheduleMeeting.new"> Update Meeting </template>
              <template v-else> Schedule a Meeting </template>
            </h2>
            <button
              type="button"
              v-if="!scheduleMeeting.new"
              @click="deleteScheduledMeeting(scheduleMeeting.id)"
              class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm p-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            >
              <svg-icon :path="mdiTrashCanOutline" type="mdi" />
            </button>
          </div>

          <form
            @submit.prevent="onScheduleMeeting"
            class="flex flex-col gap-4 mb-6"
          >
            <div>
              <label
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Meeting ID</label
              >
              <div class="relative w-full">
                <input
                  type="text"
                  disabled
                  :value="scheduleMeeting.id"
                  class="uppercase font-mono bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
                <button
                  type="button"
                  @click="scheduleMeeting.id = generateId()"
                  class="absolute inset-y-0 right-0 flex items-center justify-center px-3 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:text-gray-300 dark:focus:ring-blue-500 rounded-r-lg"
                >
                  <svg-icon
                    :path="mdiRefresh"
                    type="mdi"
                    class="w-5 h-5 fill-current"
                  />
                </button>
              </div>
            </div>
            <div>
              <label
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Date</label
              >
              <input
                type="date"
                v-model="scheduleMeeting.date"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Time</label
              >
              <input
                type="time"
                v-model="scheduleMeeting.time"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Duration <small>(minutes)</small></label
              >
              <input
                type="number"
                v-model="scheduleMeeting.duration"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Notes</label
              >
              <textarea
                v-model="scheduleMeeting.notes"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                rows="5"
              ></textarea>
            </div>
            <div>
              <label
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Invite participants</label
              >
              <input
                type="text"
                v-model="scheduleMeeting.participants"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
            <div
              class="flex flex-col-reverse md:flex-row items-center justify-center gap-4"
            >
              <button
                type="submit"
                class="w-full text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg px-5 py-2.5 text-center mr-2"
              >
                <template v-if="scheduleMeeting.new">
                  Schedule Meeting
                </template>
                <template v-else> Update Meeting </template>
              </button>
              <button
                type="reset"
                @click="state.showScheduleDialog = false"
                class="w-full text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Dialog>
</template>

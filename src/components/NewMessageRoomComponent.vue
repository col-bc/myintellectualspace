<script setup>
import useUserStore from '@/stores/user'
import useMessageStore from '@/stores/message'
import LoaderComponent from '@/components/LoaderComponent.vue'
import { computed, defineEmits, reactive } from 'vue'

const user = useUserStore()
const message = useMessageStore()

const emit = defineEmits(['room-created', 'cancel'])
const state = reactive({
  roomName: '',
  recipients: {},
  recipientSearch: '',
  loadingRecipient: false,
  error: {}
})

function recipientPreview() {
  const allUsers = user.user.following
  const results = allUsers?.filter((user) => {
    return (
      user.handle.toLowerCase().includes(state.recipientSearch.toLowerCase()) ||
      user.fullName.toLowerCase().includes(state.recipientSearch.toLowerCase())
    )
  })
  return results
}
function toggleRecipient(r) {
  if (isAdded(r)) {
    delete state.recipients[r.uid]
  } else {
    state.recipients[r.uid] = {
      handle: r.handle,
      fullName: r.fullName,
      avatarUrl: r.avatarUrl
    }
  }
}
function isAdded(r) {
  return state.recipients[r.uid] ? true : false
}
async function createRoom() {
  // validate
  if (!state.roomName) {
    state.error = {
      message: 'Room name is required',
      type: 'error'
    }
    return
  }
  if (state.recipients.length === 0) {
    state.error = {
      message: 'At least one recipient is required',
      type: 'error'
    }
    return
  }
  // create room
  const room = await message.createRoom(state.roomName, state.recipients)
  emit('room-created', room)
}
</script>

<template>
  <div
    class="text-white mb-6 block w-auto mx-auto p-4 rounded-full shadow-lg shadow-purple-400/30 bg-gradient-to-br from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 dark:text-gray-800"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="w-24 h-24 fill-current"
      viewBox="0 0 24 24"
      width="24"
      height="24"
    >
      <path fill="none" d="M0 0h24v24H0z" />
      <path
        d="M14 3v2H4v13.385L5.763 17H20v-7h2v8a1 1 0 0 1-1 1H6.455L2 22.5V4a1 1 0 0 1 1-1h11zm5 0V0h2v3h3v2h-3v3h-2V5h-3V3h3z"
      />
    </svg>
  </div>
  <h2 class="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
    Create a new message room
  </h2>
  <form @submit.prevent="createRoom" class="flex flex-col gap-6">
    <AlertComponent type="error" :message="state.error.message" />
    <div>
      <label
        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Room name</label
      >
      <input
        type="text"
        v-model="state.roomName"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
    </div>
    <div>
      <label
        for="first_name"
        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Recipients</label
      >
      <div class="group relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5 absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-700 dark:text-gray-400 fill-current"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path
            d="M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z"
          />
        </svg>
        <input
          type="text"
          v-model="state.recipientSearch"
          @change="recipientPreview"
          class="peer pl-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <div
          class="hidden peer-focus:block hover:block absolute w-full top-full mt-2 h-24 border bg-white dark:bg-gray-800 rounded-lg shadow-md border-gray-300 dark:border-gray-700"
        >
          <template v-if="state.loadingRecipient">
            <div class="w-full h-full p-4 flex items-center justify-center">
              <LoaderComponent size="md" />
            </div>
          </template>
          <template v-else-if="recipientPreview()?.length !== 0">
            <ul class="overflow-y-auto h-full">
              <li v-for="recp in recipientPreview()" :key="recp">
                <div class="flex items-center gap-4 w-full px-4 py-2">
                  <img
                    :src="recp.avatarUrl"
                    class="w-8 h-8 rounded-full object-cover"
                  />
                  <div class="flex flex-1 flex-col">
                    <span
                      class="text-sm font-medium text-gray-900 dark:text-white"
                      >{{ recp.fullName }}</span
                    >
                    <span class="text-xs text-gray-500 dark:text-gray-400"
                      >@{{ recp.handle }}</span
                    >
                  </div>
                  <div>
                    <input
                      @click="toggleRecipient(recp)"
                      :checked="isAdded(recp)"
                      type="checkbox"
                      class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                </div>
              </li>
            </ul>
          </template>
          <template v-else>
            <p class="p-4 text-gray-500 dark:text-gray-400">
              No users found matching your search
            </p>
          </template>
        </div>
      </div>
    </div>
    <template v-if="state.recipients !== 0">
      <div v-for="recp in state.recipients" :key="recp">
        <div class="flex items-center gap-4 w-full px-4 py-2">
          <img
            :src="recp.avatarUrl"
            class="w-8 h-8 rounded-full object-cover"
          />
          <div class="flex flex-1 flex-col">
            <span class="text-sm font-medium text-gray-900 dark:text-white">{{
              recp.fullName
            }}</span>
            <span class="text-xs text-gray-500 dark:text-gray-400"
              >@{{ recp.handle }}</span
            >
          </div>
          <div>
            <button
              type="button"
              @click="toggleRecipient(recp)"
              class="py-2 px-3 text-xs font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </template>
    <div
      class="flex flex-col-reverse md:flex-row items-center justify-center gap-4 mt-4"
    >
      <button
        type="submit"
        class="w-full text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2"
      >
        Create Room
      </button>
      <button
        type="reset"
        @click="emit('cancel')"
        class="w-full text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
      >
        Cancel
      </button>
    </div>
  </form>
</template>

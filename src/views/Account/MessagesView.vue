<script setup>
import axios from 'axios'
import { reactive, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useUserStore from '@/stores/user.js'
import useMessageStore from '@/stores/message.js'
import NavbarComponent from '@/components/NavbarComponent.vue'
import AlertComponent from '@/components/AlertComponent.vue'
import LoaderComponent from '@/components/LoaderComponent.vue'
import NewMessageRoomComponent from '@/components/NewMessageRoomComponent.vue'

const user = useUserStore()
const message = useMessageStore()
const route = useRoute()
const router = useRouter()

const state = reactive({
  loading: false,
  messageRooms: [],
  activeRoom: null,
  messageContent: '',
  showNewMessageDialog: false
})
onMounted(async () => {
  state.loading = true
  await message.fetchMessageRooms()
  if (route.params.roomId) {
    const room = message.rooms.find((room) => room.id === route.params.roomId)
    if (room) {
      state.activeRoom = room
    }
  }
  state.loading = false
})

watch(
  () => route.params.roomId,
  async (roomId) => {
    if (roomId) {
      const room = message.rooms.find((room) => room.id === roomId)
      if (room) {
        state.activeRoom = room
      }
    } else {
      state.activeRoom = null
    }
  },
  { immediate: true }
)

async function sendMessage() {
  state.activeRoom.messages = await message.sendMessage(
    state.activeRoom.id,
    state.messageContent
  )
  state.messageContent = ''
}
function getAvatarByUid(uid) {
  var u = undefined
  if (state.activeRoom.owner.uid === uid) {
    u = state.activeRoom.owner
  } else {
    // get nested user object from recipient object where index matches uid
    u = state.activeRoom.recipient[uid]
  }
  return u.avatarUrl
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
        <div
          class="flex flex-col md:flex-row md:items-center md:justify-between mb-12"
        >
          <h1
            class="text-5xl font-black leading-loose text-gray-900 dark:text-white"
          >
            Messages
          </h1>
          <button
            type="button"
            @click="state.showNewMessageDialog = true"
            class="inline-flex items-center justify-center w-auto gap-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-7 py-3.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-80 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 focus:shadow-sm focus:translate-y-0.5 transition duration-200 ease-in-out"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-6 h-6 fill-current"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path
                d="M14 3v2H4v13.385L5.763 17H20v-7h2v8a1 1 0 0 1-1 1H6.455L2 22.5V4a1 1 0 0 1 1-1h11zm5 0V0h2v3h3v2h-3v3h-2V5h-3V3h3z"
              />
            </svg>
            Create New Message
          </button>
        </div>

        <div
          class="flex-1 flex flex-col md:flex-row md:items-stretch bg-white dark:bg-gray-800 border rounded-lg shadow-lg border-gray-300 dark:border-gray-700 mb-12 h-96"
        >
          <!-- Message rooms -->
          <div
            class="h-full w-full md:max-w-sm bg-gray-50 dark:bg-gray-800 rounded-l-lg"
          >
            <h5 class="text-lg font-bold text-gray-900 dark:text-white p-4">
              Message List
            </h5>
            <template v-if="message.rooms?.length !== 0">
              <ul class="mb-12 relative overflow-y-auto h-full">
                <li
                  v-for="room in message.rooms"
                  :key="room"
                  class="py-2 px-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                  :class="{
                    'bg-gray-200 dark:bg-gray-700':
                      state.activeRoom?.id === room.id
                  }"
                  @click="
                    router.push({
                      name: 'messages',
                      params: { roomId: room.id }
                    })
                  "
                >
                  <div class="flex items-center gap-4">
                    <div class="flex -space-x-4">
                      <img
                        v-for="recipient in room.recipient"
                        :key="recipient.uid"
                        class="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800"
                        :src="recipient.avatarUrl"
                      />
                    </div>
                    <h4
                      class="flex-1 text-gray-700 text-lg dark:text-gray-300 font-medium"
                    >
                      {{ room.name }}
                    </h4>
                    <p class="text-gray-500 dark:text-gray-400 text-sm">
                      {{
                        new Date(room.updated.seconds * 1000).toLocaleString(
                          'en-US'
                        )
                      }}
                    </p>
                  </div>
                </li>
              </ul>
            </template>
            <template v-else>
              <p class="px-4 mb-12 text-gray-700 dark:text-gray-300">
                You don't have any message room yet.
              </p>
            </template>
          </div>

          <!-- Message content -->
          <div
            class="relative flex-1 flex flex-col border-t md:border-t-0 md:border-l border-gray-300 dark:border-gray-700"
          >
            <div
              class="flex items-center gap-4 h-14 px-4 shadow rounded-t-lg border-b border-gray-300 dark:border-gray-700"
            >
              <h5
                class="flex-1 text-lg font-bold text-gray-900 dark:text-white"
              >
                {{ state.activeRoom?.name || 'Select a message room' }}
              </h5>
              <button
                v-if="!!state.activeRoom"
                type="button"
                @click="deleteRoom"
                class="text-gray-900 bg-white focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg p-2 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600"
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
                    d="M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3zm1 2H6v12h12V8zm-4.586 6l1.768 1.768-1.414 1.414L12 15.414l-1.768 1.768-1.414-1.414L10.586 14l-1.768-1.768 1.414-1.414L12 12.586l1.768-1.768 1.414 1.414L13.414 14zM9 4v2h6V4H9z"
                  />
                </svg>
              </button>
              <button
                v-if="!!state.activeRoom"
                type="button"
                @click="deleteRoom"
                class="text-gray-900 bg-white focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg p-2 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600"
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
                    d="M2 22a8 8 0 1 1 16 0h-2a6 6 0 1 0-12 0H2zm8-9c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm8.284 3.703A8.002 8.002 0 0 1 23 22h-2a6.001 6.001 0 0 0-3.537-5.473l.82-1.824zm-.688-11.29A5.5 5.5 0 0 1 21 8.5a5.499 5.499 0 0 1-5 5.478v-2.013a3.5 3.5 0 0 0 1.041-6.609l.555-1.943z"
                  />
                </svg>
              </button>
              <button
                v-if="!!state.activeRoom"
                type="button"
                @click="deleteRoom"
                class="text-gray-900 bg-white focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg p-2 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600"
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
                    d="M8.686 4l2.607-2.607a1 1 0 0 1 1.414 0L15.314 4H19a1 1 0 0 1 1 1v3.686l2.607 2.607a1 1 0 0 1 0 1.414L20 15.314V19a1 1 0 0 1-1 1h-3.686l-2.607 2.607a1 1 0 0 1-1.414 0L8.686 20H5a1 1 0 0 1-1-1v-3.686l-2.607-2.607a1 1 0 0 1 0-1.414L4 8.686V5a1 1 0 0 1 1-1h3.686zM6 6v3.515L3.515 12 6 14.485V18h3.515L12 20.485 14.485 18H18v-3.515L20.485 12 18 9.515V6h-3.515L12 3.515 9.515 6H6zm6 10a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
                  />
                </svg>
              </button>
              <button
                v-if="!!state.activeRoom"
                type="button"
                @click="router.push({ name: 'messages' })"
                class="text-gray-900 bg-white focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg p-2 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600"
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
                    d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"
                  />
                </svg>
              </button>
            </div>
            <template v-if="state.activeRoom">
              <div class="flex-1 py-6 p-6">
                <template v-for="msg in state.activeRoom.messages" :key="msg">
                  <div
                    class="w-full max-w-xs items-center gap-4 mb-4 rounded-lg p-2"
                    :class="[
                      msg.uid === user.user.uid
                        ? 'justify-  flex flex-row-reverse ml-auto bg-blue-200 dark:bg-blue-400 rounded-br-none'
                        : 'justify-start flex bg-gray-200 dark:bg-gray-700 rounded-bl-none'
                    ]"
                  >
                    <img
                      class="w-10 h-10 rounded-full"
                      :src="getAvatarByUid(msg.uid)"
                    />
                    <div class="flex-1 flex flex-col">
                      <p class="text-gray-900 dark:text-gray-200">
                        {{ msg.message }}
                      </p>
                      <p
                        class="text-xs mt-2"
                        :class="[
                          msg.uid === user.user.uid
                            ? 'text-gray-600 dark:text-white'
                            : 'text-gray-600 dark:text-gray-400'
                        ]"
                      >
                        {{
                          new Date(msg.created.seconds * 1000).toLocaleString(
                            'en-US'
                          )
                        }}
                      </p>
                    </div>
                  </div>
                </template>
              </div>
              <div class="flex items-center py-4 rounded-lg p-4">
                <textarea
                  rows="1"
                  v-model="state.messageContent"
                  @keydown.enter.prevent="sendMessage"
                  class="block shadow-sm mr-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Your message..."
                ></textarea>
                <button
                  type="submit"
                  @click="sendMessage"
                  class="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-6 h-6 fill-current"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path
                      d="M3 13h6v-2H3V1.846a.5.5 0 0 1 .741-.438l18.462 10.154a.5.5 0 0 1 0 .876L3.741 22.592A.5.5 0 0 1 3 22.154V13z"
                    />
                  </svg>
                  <span class="sr-only">Send message</span>
                </button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </main>

  <Dialog
    :open="state.showNewMessageDialog"
    @close="state.showNewMessageDialog = false"
    class="relative z-10"
  >
    <div class="fixed inset-0 bg-black bg-opacity-60" />
    <div class="fixed inset-0 overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4">
        <div
          class="w-full max-w-lg flex flex-col p-6 bg-white rounded-lg shadow dark:bg-gray-700"
        >
          <NewMessageRoomComponent
            @cancel="state.showNewMessageDialog = false"
            @room-created="(data) => (state.showNewMessageDialog = false)"
          />
        </div>
      </div>
    </div>
  </Dialog>
</template>

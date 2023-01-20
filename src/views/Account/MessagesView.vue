<script setup>
import LoaderComponent from '@/components/LoaderComponent.vue'
import NavbarComponent from '@/components/NavbarComponent.vue'
import NewMessageRoomComponent from '@/components/NewMessageRoomComponent.vue'
import useMessageStore from '@/stores/message.js'
import useUserStore from '@/stores/user.js'
import { onMounted, onUpdated, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  mdiChatPlusOutline,
  mdiTrashCanOutline,
  mdiAccountGroupOutline,
  mdiCogOutline,
  mdiClose,
  mdiSend
} from '@mdi/js'

const user = useUserStore()
const message = useMessageStore()
const route = useRoute()
const router = useRouter()

const state = reactive({
  loading: false,
  messageRooms: [],
  activeRoom: null,
  messageContent: '',
  showNewMessageDialog: false,
  composerTo: null
})
onMounted(async () => {
  state.loading = true
  await message.fetchMessageRooms()
  if (route.params.roomId) {
    const room = message.rooms.find((room) => room.id === route.params.roomId)
    if (room) {
      state.activeRoom = room
    } else {
      router.push({ name: 'messages-home' })
    }
  }
  if (route.name === 'messages-compose') {
    state.showNewMessageDialog = true
    state.composerTo = route.params.to
  }
  state.loading = false
})
onUpdated(async () => {
  if (route.name === 'messages-home' && state.activeRoom) {
    state.activeRoom = null
  } else if (route.name === 'messages-room' && !state.activeRoom) {
    const room = message.rooms.find((room) => room.id === route.params.roomId)
    if (room) {
      state.activeRoom = room
    } else {
      router.push({ name: 'messages-home' })
    }
  }
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
        <div class="flex items-center justify-between mb-12 gap-6">
          <h1
            class="text-5xl font-black leading-loose text-gray-900 dark:text-white"
          >
            Messages
          </h1>
          <button
            type="button"
            @click="state.showNewMessageDialog = true"
            class="inline-flex items-center justify-center w-auto gap-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg p-4 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-80 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 focus:shadow-sm focus:translate-y-0.5 transition transform duration-200 ease-in-out"
          >
            <svg-icon
              :path="mdiChatPlusOutline"
              type="mdi"
              class="w-8 h-8 fill-current"
            />
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
                      name: 'messages-room',
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
                <svg-icon
                  :path="mdiTrashCanOutline"
                  type="mdi"
                  class="w-5 h-5 fill-current"
                />
              </button>
              <button
                v-if="!!state.activeRoom"
                type="button"
                @click="updateRecipients"
                class="text-gray-900 bg-white focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg p-2 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <svg-icon
                  :path="mdiAccountGroupOutline"
                  type="mdi"
                  class="w-5 h-5 fill-current"
                />
              </button>
              <button
                v-if="!!state.activeRoom"
                type="button"
                @click="updateSettings"
                class="text-gray-900 bg-white focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg p-2 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <svg-icon
                  :path="mdiCogOutline"
                  type="mdi"
                  class="w-5 h-5 fill-current"
                />
              </button>
              <button
                v-if="!!state.activeRoom"
                type="button"
                @click="router.push({ name: 'messages-home' })"
                class="text-gray-900 bg-white focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg p-2 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <svg-icon :path="mdiClose" type="mdi" />
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
                  <svg-icon
                    :path="mdiSend"
                    type="mdi"
                    class="w-6 h-6 text-current"
                  />
                  <span class="sr-only">Send message</span>
                </button>
              </div>
            </template>
          </div>
        </div>
      </div>
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
                :to="state.composerTo ? state.composerTo : null"
              />
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  </main>
</template>

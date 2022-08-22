<script setup>
import axios from 'axios'
import { reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import useUserStore from '../../stores/user.js'
import NavbarComponent from '@/components/NavbarComponent.vue'
import AlertComponent from '@/components/AlertComponent.vue'

const userStore = useUserStore()
const route = useRoute()

const data = reactive({
  sent: [],
  received: [],
  archive: [],
  folder: 'inbox', // inbox, sent, archive
  openMessage: null,
  newMessage: false,
  loading: false,
  searching: false,
  search: '',
  searchResults: [],
  error: null
})
onMounted(async () => {
  data.loading = true
  try {
    const response = await axios.get('/api/message', {
      headers: {
        Authorization: userStore.getBearerToken
      }
    })
    data.sent = response.data.sent
    data.received = response.data.received
  } catch (error) {
    data.error = error
  } finally {
    data.loading = false
  }
})

function newMessage() {
  data.openMessage = {
    sender: ''
  }
  data.newMessage = true
}
function openMessage(message) {
  data.openMessage = message
  data.newMessage = false
}
</script>

<template>
  <main class="min-h-screen bg-white dark:bg-slate-800">
    <div class="container max-w-screen-lg mx-auto sm:px-2">
      <NavbarComponent />

      <div class="flex items-center justify-between pt-12 mb-6">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-white">
          Messages
        </h1>
        <button
          @click="newMessage()"
          type="button"
          class="py-3 px-5 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Send Message
        </button>
      </div>

      <div class="flex items-start pb-12 gap-12">
        <!-- Folders -->
        <div
          class="w-48 text-gray-900 divide-y dark:text-gray-200 divide-gray-300 dark:divide-gray-600"
        >
          <button
            @click="data.folder = 'inbox'"
            type="button"
            class="inline-flex relative items-center py-2 px-4 w-full text-sm font-medium hover:bg-white hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
            :class="{
              'text-blue-700 dark:text-white': data.folder === 'inbox'
            }"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4 mr-3"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
              <path
                d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"
              />
            </svg>
            Inbox
          </button>
          <button
            @click="data.folder = 'sent'"
            type="button"
            class="inline-flex relative items-center py-2 px-4 w-full text-sm font-medium hover:bg-white hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
            :class="{ 'text-blue-700 dark:text-white': data.folder === 'sent' }"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4 mr-3"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
            Sent
          </button>
          <button
            @click="data.folder = 'archive'"
            type="button"
            class="inline-flex relative items-center py-2 px-4 w-full text-sm font-medium hover:bg-white hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
            :class="{
              'text-blue-700 dark:text-white': data.folder === 'archive'
            }"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4 mr-3"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="21 8 21 21 3 21 3 8" />
              <rect x="1" y="3" width="22" height="5" />
              <line x1="10" y1="12" x2="14" y2="12" />
            </svg>
            Archived
          </button>
        </div>

        <div class="flex-1">
          <div v-if="data.loading" class="text-center" role="status">
            <svg
              class="inline mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span class="sr-only">Loading...</span>
          </div>

          <div v-if="!data.loading" class="flex items-start w-full gap-12">
            <!-- Message List -->
            <ul
              v-if="data.folder === 'inbox'"
              class="flex-1 max-w-screen-lg flex flex-col rounded-lg bg-white shadow-sm border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
            >
              <li
                v-for="message of data.received"
                :key="message"
                class="flex items-center cursor-pointer p-2 rounded-lg hover:bg-white dark:hover:bg-gray-800"
                @click="openMessage(message)"
              >
                <img
                  :src="message.sender.avatar_uri"
                  class="w-12 h-12 rounded-full mr-4"
                />
                <p class="mr-4 dark:text-gray-300">
                  {{ message.sender.handle }}
                </p>
                <div class="flex-1 text-left font-medium dark:text-white">
                  {{ message.subject }}
                </div>
              </li>
              <li
                v-if="data.received.length === 0"
                class="flex items-center justify-center p-2 rounded-lg"
              >
                <p class="text-center text-gray-500">No messages found.</p>
              </li>
            </ul>
            <ul
              v-if="data.folder === 'sent'"
              class="flex-1 max-w-screen-lg flex flex-col rounded-lg bg-white shadow-sm border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
            >
              <li
                v-for="message of data.sent"
                :key="message"
                class="flex items-center cursor-pointer p-2 rounded-lg hover:bg-white dark:hover:bg-gray-800"
                @click="openMessage(message)"
              >
                <img
                  :src="message.recipient.avatar_uri"
                  class="w-12 h-12 rounded-full mr-4"
                />
                <p class="mr-4 dark:text-gray-300">
                  {{ message.recipient.handle }}
                </p>
                <div class="flex-1 text-left font-medium dark:text-white">
                  {{ message.subject }}
                </div>
              </li>
              <li
                v-if="data.sent.length === 0"
                class="flex items-center justify-center p-2 rounded-lg"
              >
                <p class="text-center text-gray-500">No messages found.</p>
              </li>
            </ul>
            <ul
              v-if="data.folder === 'archive'"
              class="flex-1 max-w-screen-lg flex flex-col rounded-lg bg-white shadow-sm border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
            >
              <li
                v-for="message of data.archive"
                :key="message"
                class="flex items-center cursor-pointer p-2 rounded-lg hover:bg-white dark:hover:bg-gray-800"
                @click="openMessage(message)"
              >
                <img
                  :src="message.sender.avatar_uri"
                  class="w-12 h-12 rounded-full mr-4"
                />
                <p class="mr-4 dark:text-gray-300">
                  {{ message.sender.handle }}
                </p>
                <div class="flex-1 text-left font-medium dark:text-white">
                  {{ message.subject }}
                </div>
              </li>
              <li
                v-if="data.archive.length === 0"
                class="flex items-center justify-center p-2 rounded-lg"
              >
                <p class="text-center text-gray-500">No messages found.</p>
              </li>
            </ul>
            <!-- New Message -->
            <div
              v-if="data.newMessage"
              class="flex-1 flex flex-col p-4 rounded-lg bg-white shadow-md border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
            >
              <div class="flex justify-between items-center w-full mb-6">
                <h3 class="text-lg font-bold dark:text-white">New Message</h3>
                <button
                  type="button"
                  @click="data.newMessage = false"
                  class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    aria-hidden="true"
                    class="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span class="sr-only">Close</span>
                </button>
              </div>
              <form class="flex flex-col gap-6" @submit.prevent="null">
                <div class="flex">
                  <span
                    class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 rounded-l-md border border-r-0 border-gray-300 dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600"
                  >
                    @
                  </span>
                  <input
                    type="text"
                    disabled
                    v-model="userStore.getHandle"
                    class="rounded-none cursor-not-allowed rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Your handle"
                  />
                </div>
                <div class="flex">
                  <span
                    class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 rounded-l-md border border-r-0 border-gray-300 dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600"
                  >
                    @
                  </span>
                  <input
                    type="text"
                    v-model="data.openMessage.to"
                    @blur="searchUsers()"
                    class="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Recipient's handle"
                  />
                </div>
                <input
                  type="text"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Subject"
                />
                <textarea
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Message"
                  rows="4"
                ></textarea>
                <div>
                  <button
                    type="submit"
                    class="w-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
            <!-- Read Message -->
            <div
              v-if="data.openMessage"
              class="flex-1 flex flex-col p-4 rounded-lg bg-white shadow-md border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
            >
              <div class="flex justify-end items-center w-full mb-6">
                <button
                  type="button"
                  @click="data.openMessage = null"
                  class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-toggle="defaultModal"
                >
                  <svg
                    aria-hidden="true"
                    class="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span class="sr-only">Close</span>
                </button>
              </div>
              <form class="flex flex-col gap-6" @submit.prevent="null">
                <div>
                  <label
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >From</label
                  >
                  <input
                    type="text"
                    disabled
                    v-model="data.openMessage.sender.handle"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="From"
                  />
                </div>
                <div>
                  <label
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >To</label
                  >
                  <input
                    type="text"
                    disabled
                    v-model="data.openMessage.recipient.handle"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Recipient"
                  />
                </div>
                <div>
                  <label
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >Subject</label
                  >
                  <input
                    type="text"
                    disabled
                    v-model="data.openMessage.subject"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Subject"
                  />
                </div>
                <div>
                  <label
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >Message</label
                  >
                  <textarea
                    disabled
                    v-model="data.openMessage.body"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Message"
                    rows="4"
                  ></textarea>
                </div>
                <div>
                  <button
                    type="submit"
                    class="w-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Reply
                  </button>
                  <button
                    type="button"
                    class="py-2.5 px-5 ml-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-white hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  >
                    Delete
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

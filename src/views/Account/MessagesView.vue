<script setup>
import axios from 'axios';
import { ref, reactive, onMounted } from 'vue';

import useUserStore from '../../stores/user.js';
import NavbarComponent from '@/components/NavbarComponent.vue'
import AlertComponent from '@/components/AlertComponent.vue';

const userStore = useUserStore();

const data = reactive({
    sent: [],
    received: [],
    archive: [],
    folder: 'inbox', // inbox, sent, archive
    openMessage: null,
    newMessage: false,
    loading: false,
    error: null,
});
onMounted(async () => {
    data.loading = true;
    try {
        const response = await axios.get('/api/message', {
            headers: {
                Authorization: userStore.getBearerToken,
            },
        });
        data.sent = response.data.sent;
        data.received = response.data.received;
    } catch (error) {
        data.error = error;
    } finally {
        data.loading = false;
    }
})

function newMessage() {
    data.openMessage = {
        to: '',
        subject: '',
        body: '',
    }
    data.newMessage = true
    data.openMessage = null
}
function openMessage(message) {
    data.openMessage = message;
    data.newMessage = false;
}
async function sendMessage() {
    data.error = null
    if (data.openMessage.to === '' || data.openMessage.subject === '' || data.openMessage.body === '') {
        data.error = 'All fields are required';
        return;
    }
    try {
        const response = axios.post(`/api/message/${data.openMessage.to}`, data.openMessage, {
            headers: {
                Authorization: userStore.getBearerToken,
            },
        });
        if (response.data) { }
    } catch (error) {
        data.error = error.response.data.error;
    }
}
</script>

<template>
    <main class="min-h-screen bg-gray-100 dark:bg-slate-800">
        <div class="  max-w-screen-xl mx-auto sm:px-2">
            <NavbarComponent />

            <div class="flex items-center justify-between pt-12 mb-6">
                <h1 class="text-3xl font-bold text-gray-800 dark:text-white">Messages</h1>
                <button @click="newMessage()"
                        type="button"
                        class="py-3 px-5 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Send Message</button>
            </div>

            <div class="flex items-start pb-12 gap-12">
                <!-- Folders -->
                <div class="w-48 text-gray-900 divide-y dark:text-gray-200 divide-gray-300 dark:divide-gray-600">
                    <button @click="data.folder = 'inbox'"
                            type="button"
                            class="inline-flex relative items-center py-2 px-4 w-full text-sm font-medium hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
                            :class="{ 'text-blue-700 dark:text-white': data.folder === 'inbox' }">
                        <svg xmlns="http://www.w3.org/2000/svg"
                             class="mr-2 w-4 h-4 fill-current"
                             viewBox="0 0 24 24"
                             width="24"
                             height="24">
                            <path fill="none"
                                  d="M0 0h24v24H0z" />
                            <path d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm6 9a3 3 0 0 0 6 0h5V5H4v7h5z" />
                        </svg>
                        Inbox
                    </button>
                    <button @click="data.folder = 'sent'"
                            type="button"
                            class="inline-flex relative items-center py-2 px-4 w-full text-sm font-medium hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700  dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
                            :class="{ 'text-blue-700 dark:text-white': data.folder === 'sent' }">
                        <svg xmlns="http://www.w3.org/2000/svg"
                             class="mr-2 w-4 h-4 fill-current"
                             viewBox="0 0 24 24"
                             width="24"
                             height="24">
                            <path fill="none"
                                  d="M0 0h24v24H0z" />
                            <path d="M2 5.5V3.993A1 1 0 0 1 2.992 3h18.016c.548 0 .992.445.992.993v16.014a1 1 0 0 1-.992.993H2.992A.993.993 0 0 1 2 20.007V19h18V7.3l-8 7.2-10-9zM0 10h5v2H0v-2zm0 5h8v2H0v-2z" />
                        </svg>
                        Sent
                    </button>
                    <button @click="data.folder = 'archive'"
                            type="button"
                            class="inline-flex relative items-center py-2 px-4 w-full text-sm font-medium hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
                            :class="{ 'text-blue-700 dark:text-white': data.folder === 'archive' }">
                        <svg xmlns="http://www.w3.org/2000/svg"
                             class="mr-2 w-4 h-4 fill-current"
                             viewBox="0 0 24 24"
                             width="24"
                             height="24">
                            <path fill="none"
                                  d="M0 0h24v24H0z" />
                            <path d="M4 3h16l2 4v13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.004L4 3zm9 11v-4h-2v4H8l4 4 4-4h-3zm6.764-7l-1-2H5.237l-1 2h15.527z" />
                        </svg>
                        Archived
                    </button>
                </div>

                <div class="flex-1">
                    <div v-if="data.loading"
                         class="text-center"
                         role="status">
                        <svg class="inline mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                             viewBox="0 0 100 101"
                             fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                  fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                  fill="currentFill" />
                        </svg>
                        <span class="sr-only">Loading...</span>
                    </div>

                    <div v-if="!data.loading"
                         class="flex items-start w-full gap-12">
                        <!-- Message List -->
                        <ul v-if="data.folder === 'inbox'"
                            class="flex-1 max-w-screen-lg flex flex-col rounded-lg bg-white shadow-sm border border-gray-300 dark:border-gray-700 dark:bg-gray-800">
                            <li v-for="message of data.received"
                                :key="message"
                                class="flex items-center cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                                @click="openMessage(message)">
                                <img :src="message.sender.avatar_uri"
                                     class="w-12 h-12 rounded-full mr-4" />
                                <p class="mr-4 dark:text-gray-300">
                                    {{ message.sender.handle }}
                                </p>
                                <div class="flex-1 text-left font-medium dark:text-white">
                                    {{ message.subject }}
                                </div>
                            </li>
                            <li v-if="data.received.length === 0"
                                class="flex items-center justify-center p-2 rounded-lg">
                                <p class="text-center text-gray-500">
                                    No messages found.
                                </p>
                            </li>
                        </ul>
                        <ul v-if="data.folder === 'sent'"
                            class="flex-1 max-w-screen-lg flex flex-col rounded-lg bg-white shadow-sm border border-gray-300 dark:border-gray-700 dark:bg-gray-800">
                            <li v-for="message of data.sent"
                                :key="message"
                                class="flex items-center cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                                @click="openMessage(message)">
                                <img :src="message.recipient.avatar_uri"
                                     class="w-12 h-12 rounded-full mr-4" />
                                <p class="mr-4 dark:text-gray-300">
                                    {{ message.recipient.handle }}
                                </p>
                                <div class="flex-1 text-left font-medium dark:text-white">
                                    {{ message.subject }}
                                </div>
                            </li>
                            <li v-if="data.sent.length === 0"
                                class="flex items-center justify-center p-2 rounded-lg">
                                <p class="text-center text-gray-500">
                                    No messages found.
                                </p>
                            </li>
                        </ul>
                        <ul v-if="data.folder === 'archive'"
                            class="flex-1 max-w-screen-lg flex flex-col rounded-lg bg-white shadow-sm border border-gray-300 dark:border-gray-700 dark:bg-gray-800">
                            <li v-for="message of data.archive"
                                :key="message"
                                class="flex items-center cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                                @click="openMessage(message)">
                                <img :src="message.sender.avatar_uri"
                                     class="w-12 h-12 rounded-full mr-4" />
                                <p class="mr-4 dark:text-gray-300">
                                    {{ message.sender.handle }}
                                </p>
                                <div class="flex-1 text-left font-medium dark:text-white">
                                    {{ message.subject }}
                                </div>
                            </li>
                            <li v-if="data.archive.length === 0"
                                class="flex items-center justify-center p-2 rounded-lg">
                                <p class="text-center text-gray-500">
                                    No messages found.
                                </p>
                            </li>
                        </ul>
                        <!-- New Message -->
                        <div v-if="data.newMessage"
                             class="flex-1 flex flex-col p-4 rounded-lg bg-white shadow-md border border-gray-300 dark:border-gray-700 dark:bg-gray-800 ">
                            <div class="flex justify-between items-center w-full  mb-6">
                                <h3 class="text-lg font-bold dark:text-white">New Message</h3>
                                <button type="button"
                                        @click="data.newMessage = false"
                                        class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                        data-modal-toggle="defaultModal">
                                    <svg aria-hidden="true"
                                         class="w-5 h-5"
                                         fill="currentColor"
                                         viewBox="0 0 20 20"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd"
                                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                              clip-rule="evenodd"></path>
                                    </svg>
                                    <span class="sr-only">Close</span>
                                </button>
                            </div>
                            <form class="flex flex-col gap-6"
                                  @submit.prevent="null">
                                <input type="text"
                                       disabled
                                       v-model="userStore.getHandle"
                                       class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                       placeholder="From" />
                                <input type="text"
                                       class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                       placeholder="Recipient">
                                <input type="text"
                                       class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                       placeholder="Subject">
                                <textarea class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                          placeholder="Message"
                                          rows="4"></textarea>
                                <div>
                                    <button type="submit"
                                            class="w-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                                </div>
                            </form>
                        </div>
                        <!-- Read Message -->
                        <div v-if="data.openMessage"
                             class="flex-1 flex flex-col p-4 rounded-lg bg-white shadow-md border border-gray-300 dark:border-gray-700 dark:bg-gray-800 ">
                            <div class="flex justify-end items-center w-full  mb-6">
                                <button type="button"
                                        @click="data.openMessage = null"
                                        class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                        data-modal-toggle="defaultModal">
                                    <svg aria-hidden="true"
                                         class="w-5 h-5"
                                         fill="currentColor"
                                         viewBox="0 0 20 20"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd"
                                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                              clip-rule="evenodd"></path>
                                    </svg>
                                    <span class="sr-only">Close</span>
                                </button>
                            </div>
                            <form class="flex flex-col gap-6"
                                  @submit.prevent="null">
                                <div>
                                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">From</label>
                                    <input type="text"
                                           disabled
                                           v-model="data.openMessage.sender.handle"
                                           class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                           placeholder="From" />
                                </div>
                                <div>
                                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">To</label>
                                    <input type="text"
                                           disabled
                                           v-model="data.openMessage.recipient.handle"
                                           class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                           placeholder="Recipient">
                                </div>
                                <div>
                                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Subject</label>
                                    <input type="text"
                                           disabled
                                           v-model="data.openMessage.subject"
                                           class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                           placeholder="Subject">
                                </div>
                                <div>
                                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Message</label>
                                    <textarea disabled
                                              v-model="data.openMessage.body"
                                              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                              placeholder="Message"
                                              rows="4"></textarea>
                                </div>
                                <div>
                                    <button type="submit"
                                            class="w-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Reply</button>
                                    <button type="button"
                                            class="py-2.5 px-5 ml-3  text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Delete</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </main>
</template>
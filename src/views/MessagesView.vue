<script setup>
import axios from 'axios';
import { ref, reactive, onMounted } from 'vue';

import useUserStore from '../stores/user.js';
import NavbarComponent from '@/components/NavbarComponent.vue'
import AlertComponent from '@/components/AlertComponent.vue';

const userStore = useUserStore();

const data = reactive({
    messages: [],
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
        data.messages = response.data;
    } catch (error) {
        data.error = error;
    }
})
function newMessage() {
    data.openMessage = {
        to: '',
        subject: '',
        body: '',
    };
    data.newMessage = true;
}

</script>

<template>
    <main class="min-h-screen bg-white dark:bg-slate-800">
        <NavbarComponent />
        <div class="container mx-auto flex flex-col items-start sm:px-2 gap-12 py-12">
            <div class="flex w-full items-center justify-between">
                <h1 class="text-3xl font-bold dark:text-white">Message Center</h1>
                <button type="button"
                        @click="newMessage()"
                        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Compose message</button>
            </div>

            <div class="flex items-start w-full gap-12">
                <!-- Message List -->
                <ul class="flex-1 max-w-screen-lg flex flex-col p-4 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800">
                </ul>
                <!-- New Message -->
                <div v-if="data.newMessage"
                     class="flex-1 flex flex-col p-4 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 ">
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
            </div>

        </div>
    </main>

</template>
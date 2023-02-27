<script setup>
import NavbarComponent from '@/components/NavbarComponent.vue'
import AlertComponent from '@/components/AlertComponent.vue'
import useUserStore from '@/stores/user'
import { reactive, onMounted } from 'vue'

const user = useUserStore()
const state = reactive({
  name: '',
  email: '',
  uid: '',
  url: '',
  message: '',
  error: null
})

onMounted(() => {
  state.uid = user.user?.uid || ''
})

function onSubmit() {
  state.error = null
  if (!validate()) return
  console.log('submit')
}
function validate() {
  if (!state.name) {
    state.error = {
      message: 'Please enter your name',
      type: 'error'
    }
    return false
  }
  if (!state.email) {
    state.error = {
      message: 'Please enter your email',
      type: 'error'
    }
    return false
  }
  if (!state.message) {
    state.error = {
      message: 'Please enter your message',
      type: 'error'
    }
    return false
  }
  return true
}
</script>

<template>
  <main class="bg-white min-h-screen dark:bg-slate-800">
    <div class="max-w-screen-xl mx-auto">
      <NavbarComponent />
      <div
        class="h-full container mx-auto flex flex-col gap-6 md:gap-12 lg:gap-16 py-12 px-2 md:px-4"
      >
        <h1
          class="text-center text-5xl font-black leading-loose text-gray-900 dark:text-white"
        >
          Contact Us
        </h1>

        <form
          @submit.prevent="onSubmit"
          class="flex flex-col gap-4 w-full md:max-w-xl mx-auto"
        >
          <p
            class="text-lg leading-loose text-gray-700 dark:text-gray-300 mb-12"
          >
            Please fill out the form below to get in touch with us. We will get
            back to you as soon as possible. Be sure to include as much detail
            as possible about your issue. Thank you!
          </p>
          <AlertComponent
            v-if="state.error"
            :message="state.error.message"
            :type="state.error.type"
          />
          <div>
            <label
              for="name"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Your name</label
            >
            <input
              type="text"
              name="name"
              id="name"
              v-model="state.name"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label
              for="email"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Your email</label
            >
            <input
              type="email"
              name="email"
              id="email"
              v-model="state.email"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="yourname@example.com"
            />
          </div>
          <div>
            <label
              for="uid"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your account identifier <small>(optional)</small>
            </label>
            <input
              type="text"
              name="uid"
              id="uid"
              v-model="state.uid"
              disabled
              class="cursor-not-allowed bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
              This will be automatically filled if you are logged in.
            </p>
          </div>
          <div>
            <label
              for="url"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Page URL <small>(optional)</small></label
            >
            <input
              type="text"
              name="url"
              id="url"
              v-model="state.url"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="https://my-intellectual-space.firebaseapp.com/path-to-page"
            />
          </div>
          <div>
            <label
              for="message"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Message</label
            >
            <textarea
              id="message"
              name="message"
              rows="4"
              v-model="state.message"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            ></textarea>
          </div>
          <div>
            <label
              for="attachments"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Attachments <small>(optional)</small>
            </label>
            <input
              class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              id="attachments"
              type="file"
              accept="image/*, .pdf, .doc, .docx, .txt"
            />
          </div>
          <div class="mt-4">
            <button
              type="button"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

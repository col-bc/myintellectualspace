<script setup>
import NavbarComponent from '@/components/NavbarComponent.vue'
import AlertComponent from '@/components/AlertComponent.vue'
import { reactive } from 'vue'
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from '@firebase/firestore'
import useUserStore from '@/stores/user'

const user = useUserStore()

const form = reactive({
  isSubmitted: false,
  submissionId: '',
  error: null,
  email: '',
  contactConsent: 'default',
  subject: '',
  category: 'default',
  description: '',
  log: ''
})

async function submitForm() {
  // validate form
  form.error = null
  if (!form.email) {
    form.error = {
      type: 'error',
      message: 'Email address is required'
    }
    return
  }
  if (!form.contactConsent || form.contactConsent === 'default') {
    form.error = {
      type: 'error',
      message: 'Please accept or decline contact consent'
    }
    return
  }
  if (!form.category || form.category === 'default') {
    form.error = {
      type: 'error',
      message: 'Please select a category'
    }
    return
  }
  if (!form.subject) {
    form.error = {
      type: 'error',
      message: 'Subject is required'
    }
    return
  }
  if (!form.description) {
    form.error = {
      type: 'error',
      message: 'Description is required'
    }
    return
  }

  // submit form
  const db = getFirestore()
  const docRef = doc(db, 'support')
  const createdDoc = await setDoc(docRef, {
    email: form.email,
    contactConsent: form.contactConsent,
    category: form.category,
    subject: form.subject,
    description: form.description,
    log: form.log,
    user: {
      uid: user.user.uid || null,
      email: user.user.email || null,
      phone: user.user.phoneNumber || null,
      name: user.user.fullName || null
    },
    createdAt: serverTimestamp(),
    status: 'new'
  })
  form.isSubmitted = true
  form.submissionId = createdDoc.id
}
function resetForm() {
  form.isSubmitted = false
  form.submissionId = ''
  form.error = null
  form.email = ''
  form.contactConsent = 'default'
  form.subject = ''
  form.category = 'default'
  form.description = ''
  form.log = ''
}
</script>

<template>
  <main class="bg-white min-h-screen dark:bg-slate-800">
    <div class="max-w-screen-xl mx-auto">
      <NavbarComponent />
      <div
        class="relative h-full container mx-auto flex flex-col gap-6 md:gap-12 py-12 px-2 md:px-4"
      >
        <h2
          class="text-3xl font-bold text-center leading-loose text-gray-900 dark:text-white"
        >
          Submit a Bug Report
        </h2>
        <form
          v-if="!form.isSubmitted"
          @submit.prevent="submitForm"
          class="w-full max-w-md mx-auto space-y-6"
        >
          <AlertComponent
            v-if="!!form.error"
            :message="form.error.message"
            :type="form.error.type"
          />
          <!-- Email address -->
          <div>
            <span
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Email address
            </span>
            <input
              type="text"
              v-model="form.email"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="yourname@example.com"
            />
          </div>
          <!-- Contact consent -->
          <div>
            <span
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              May we contact you at this email address if we need more
              information about your report?
            </span>
            <select
              v-model="form.contactConsent"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="default" disabled>Select a response</option>
              <option value="accept">Yes. You may contact me.</option>
              <option value="decline">No. Please do not contact me.</option>
            </select>
          </div>
          <!-- Category -->
          <div>
            <span
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Category
            </span>
            <select
              v-model="form.category"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="default" disabled>Select a category</option>
              <option value="login">Login or account problems</option>
              <option value="broken">Something's not working</option>
              <option value="feature">I have a feature request</option>
              <option value="other">Other</option>
            </select>
          </div>
          <!-- Subject -->
          <div>
            <span
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Subject
            </span>
            <input
              type="text"
              v-model="form.subject"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="I can't login to my account."
            />
          </div>
          <!-- Description -->
          <div>
            <span
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Describe your problem. Please be as detailed as possible.
            </span>
            <textarea
              v-model="form.description"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              rows="6"
            ></textarea>
          </div>
          <!-- Log -->
          <div>
            <span
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Copy and paste the log from the console here.
            </span>
            <span class="block mb-2 text-sm text-gray-500 dark:text-gray-400">
              You can open the console by pressing F12 on Windows or
              Command+Option+I on Mac. If you're on mobile, you can ignore this.
            </span>
            <textarea
              v-model="form.log"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              rows="6"
            ></textarea>
          </div>
          <div>
            <button
              type="submit"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Submit Report
            </button>
          </div>
        </form>

        <div
          v-else
          class="w-full max-w-sm mx-auto p-6 shadow-md bg-white dark:bg-gray-800 border rounded-lg border-gray-300 dark:border-gray-700"
        >
          <div class="flex flex-col items-center gap-6">
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
                  d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-.997-4L6.76 11.757l1.414-1.414 2.829 2.829 5.656-5.657 1.415 1.414L11.003 16z"
                />
              </svg>
            </div>
            <div class="text-2xl font-bold text-gray-900 dark:text-white">
              We received your report
            </div>
            <div class="leading-loose text-gray-500 dark:text-gray-400">
              Thanks for helping us improve. Your report has been submitted.
              Your report ID is
              <span
                class="font-mono my-2 p-2 text-center block rounded-md bg-gray-900 text-white"
                >{{ form.submissionId }}</span
              >Please include this ID in any follow-up messages.
            </div>
            <button
              type="reset"
              @click="resetForm"
              class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Submit Another Report
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import AlertComponent from '@/components/AlertComponent.vue'
import { mdiHeadCogOutline } from '@mdi/js'
import { reactive } from 'vue'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'

const state = reactive({
  email: '',
  error: null
})

async function onSubmit() {
  state.error = null
  if (state.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) === null) {
    state.error = {
      message: 'Please enter a valid email address.',
      type: 'error'
    }
    state.email = ''
    return
  }
  const auth = getAuth()
  sendPasswordResetEmail(auth, state.email)
    .then(() => {
      console.log('email sent')
    })
    .catch((error) => {
      //TODO: remove
      console.log(error)
      return
    })
    .finally(() => {
      state.error = {
        message:
          'If the email address you entered is associated with an account, you will receive an email with a link to reset your password.',
        type: 'success'
      }
    })
}
</script>

<template>
  <main class="min-h-screen flex items-stretch bg-white dark:bg-slate-800">
    <div class="flex-1 max-w-md mx-auto flex flex-col justify-center px-4">
      <router-link
        to="/"
        class="flex items-center justify-center mb-6 text-gray-900 dark:text-white"
      >
        <svg-icon
          :path="mdiHeadCogOutline"
          type="mdi"
          class="fill-current h-8 w-8 mr-3"
        />
        <span class="self-center text-2xl font-bold whitespace-nowrap"
          >Intellectual Space</span
        >
      </router-link>
      <h1
        class="text-3xl font-bold text-center text-gray-900 mb-12 dark:text-white"
      >
        Password Recovery
      </h1>
      <p class="text-gray-600 mb-6 dark:text-gray-400">
        If you've forgotten your password, enter your email address used to
        create your account and we'll send you an email wil instructions to
        reset your password.
      </p>
      <form class="w-full flex flex-col gap-6 mb-6" @submit.prevent="onSubmit">
        <AlertComponent
          v-if="state.error"
          :message="state.error.message"
          :type="state.error.type"
        />
        <div>
          <label class="mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Email</label
          >
          <input
            type="text"
            v-model="state.email"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Email address"
          />
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="inline-flex items-center text-base justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 uppercase"
        >
          <LoaderComponent v-if="loading" />
          <span v-else> REQUEST RECOVERY EMAIL </span>
        </button>
      </form>
      <div
        class="flex items-center justify-between divide-x dark:divide-gray-600"
      >
        <router-link
          to="/login"
          class="text-blue-600 hover:underline dark:text-blue-400 flex-1 text-center"
          >Login</router-link
        >
        <router-link
          to="/support"
          class="text-blue-600 hover:underline dark:text-blue-400 flex-1 text-center"
          >Support Center</router-link
        >
      </div>
    </div>
  </main>
</template>

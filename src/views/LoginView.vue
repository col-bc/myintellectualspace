<script setup>
import AlertComponent from '@/components/AlertComponent.vue'
import useUserStore from '@/stores/user'
import axios from 'axios'
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

onMounted(() => {
  // Dark mode
  if (localStorage.getItem('color-theme') === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
})

const router = useRouter()
const route = useRoute()

const userStore = useUserStore()

const form = reactive({
  email: '',
  password: '',
  remember: false
})
const alert = ref('')
const loading = ref(false)

async function verifyForm() {
  alert.value = ''
  if (!form.email || !form.password) {
    alert.value = 'Both email and password are required.'
    form.password = ''
    return
  }
  // verify email is valid
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    alert.value = 'Please enter a valid email address'
    form.password = ''
    return
  }
  login()
}
async function login() {
  // Request jwt from server with email and password
  loading.value = true
  try {
    const response = await axios.post('/api/auth/login', {
      email: form.email,
      password: form.password
    })
    /*
      Types of login responses:
      token: jwt token issued, no restrictions
      first_login: jwt token issued, user must complete onboarding
      verify_email: no token issued, user must verify email
    */
    if (response.data.token) {
      userStore.setToken(response.data.token)
      await userStore.fetchUser()
      if (response.data.first_login) {
        // redirect to onboarding
        router.push('/getting-started')
      } else {
        // redirect to requested page or social home
        router.push(route.query.next || '/social/me')
      }
    } else if (response.data.verify_email) {
      // redirect to verify email page
      router.push('/verify-email')
    }
  } catch (error) {
    console.log(error.response)
    if (error.response.status < 500) {
      alert.value = error.response.data.error
    } else {
      alert.value = 'Something went wrong. Please try again later.'
    }
  } finally {
    loading.value = false
    form.password = ''
  }
}
</script>

<template>
  <main class="min-h-screen flex items-stretch bg-white dark:bg-slate-800">
    <div class="flex-1 max-w-md mx-auto flex flex-col justify-center px-4">
      <h1
        class="text-3xl font-bold text-center text-gray-800 mb-6 dark:text-white"
      >
        Welcome back to
      </h1>
      <router-link
        to="/"
        class="flex w-auto justify-center items-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-gray-900 dark:stroke-white h-8 w-8 mr-2"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M5.931 6.936l1.275 4.249m5.607 5.609l4.251 1.275"></path>
          <path d="M11.683 12.317l5.759 -5.759"></path>
          <circle cx="5.5" cy="5.5" r="1.5"></circle>
          <circle cx="18.5" cy="5.5" r="1.5"></circle>
          <circle cx="18.5" cy="18.5" r="1.5"></circle>
          <circle cx="8.5" cy="15.5" r="4.5"></circle>
        </svg>
        <span class="self-center text-3xl font-bold whitespace-nowrap">
          Intellectual Space
        </span>
      </router-link>
      <p class="text-lg font-semibold mb-6 dark:text-white">
        Login to continue
      </p>
      <div class="flex flex-col gap-4 mb-6">
        <AlertComponent
          v-if="$route.query.registered"
          message="You have successfully registered. Please verify your email address to log in."
          type="success"
          :dismissible="false"
        />

        <AlertComponent
          v-if="$route.query.verified === 'true'"
          message="You have successfully verified your email address. Please log in."
          type="success"
          :dismissible="false"
        />
        <AlertComponent
          v-if="$route.query.verified === 'false'"
          message="Your email address could not be verified. Please try again."
          type="error"
          :dismissible="false"
        />
      </div>
      <form
        class="w-full flex flex-col gap-6 mb-6"
        @submit.prevent="verifyForm()"
      >
        <AlertComponent
          v-if="!!alert"
          :message="alert"
          :show="!!alert"
          type="error"
        />
        <input
          type="text"
          v-model="form.email"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Email address"
        />
        <input
          type="password"
          v-model="form.password"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Password"
        />
        <label
          class="flex items-center cursor-pointer w-full text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          <input
            type="checkbox"
            v-model="form.remember"
            class="w-4 h-4 mr-3 text-blue-600 bg-white rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          Keep me logged in</label
        >

        <button
          type="submit"
          :disabled="loading"
          class="col-span-2 inline-flex items-center text-base justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 uppercase"
        >
          <div role="status" v-if="loading">
            <svg
              aria-hidden="true"
              class="mr-2 w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
          <span v-else> Continue </span>
        </button>
      </form>
      <p class="mb-8 dark:text-white">
        Need an account?
        <router-link
          to="/register"
          class="text-blue-500 hover:underline dark:text-blue-400"
          >Create one here.</router-link
        >
      </p>
    </div>
  </main>
</template>

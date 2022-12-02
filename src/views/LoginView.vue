<script setup>
import AlertComponent from '@/components/AlertComponent.vue'
import useUserStore from '@/stores/user'
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth'

const provider = new GoogleAuthProvider()
const auth = getAuth()

onMounted(() => {
  auth.languageCode = 'it'
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
  password: ''
})

const alert = ref('')
const loading = ref(false)

function validateForm() {
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
function login() {}
function loginWithGoogle() {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user
      userStore.setUser(user)
      if (route.params.next && route.params.next !== '/login') {
        router.push(route.params.next)
      } else {
        router.push('/')
      }
      router.push('/')
    })
    .catch((error) => {
      alert.value = error.message
    })
}
</script>

<template>
  <main class="min-h-screen flex items-stretch bg-white dark:bg-slate-800">
    <div class="flex-1 max-w-md mx-auto flex flex-col justify-center px-4">
      <h1
        class="text-3xl font-bold text-center text-gray-900 mb-4 dark:text-white"
      >
        Welcome back to
      </h1>
      <router-link
        to="/"
        class="flex items-center justify-center mb-12 text-gray-900 dark:text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="fill-current h-8 w-8 mr-3"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path fill="none" d="M0 0H24V24H0z" />
          <path
            d="M11 2c4.068 0 7.426 3.036 7.934 6.965l2.25 3.539c.148.233.118.58-.225.728L19 14.07V17c0 1.105-.895 2-2 2h-1.999L15 22H6v-3.694c0-1.18-.436-2.297-1.244-3.305C3.657 13.631 3 11.892 3 10c0-4.418 3.582-8 8-8zm0 5c-.552 0-1 .448-1 1v.999L9 9c-.552 0-1 .448-1 1s.448 1 1 1l1-.001V12c0 .552.448 1 1 1s1-.448 1-1v-1h1c.552 0 1-.448 1-1s-.448-1-1-1h-1V8c0-.552-.448-1-1-1z"
          />
        </svg>
        <span class="self-center text-2xl font-bold whitespace-nowrap"
          >Intellectual Space</span
        >
      </router-link>

      <button
        type="button"
        @click="loginWithGoogle()"
        class="py-2.5 px-5 flex items-center justify-center gap-4 mb-4 font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          class="w-5 h-5 fill-current"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path
            d="M3.064 7.51A9.996 9.996 0 0 1 12 2c2.695 0 4.959.99 6.69 2.605l-2.867 2.868C14.786 6.482 13.468 5.977 12 5.977c-2.605 0-4.81 1.76-5.595 4.123-.2.6-.314 1.24-.314 1.9 0 .66.114 1.3.314 1.9.786 2.364 2.99 4.123 5.595 4.123 1.345 0 2.49-.355 3.386-.955a4.6 4.6 0 0 0 1.996-3.018H12v-3.868h9.418c.118.654.182 1.336.182 2.045 0 3.046-1.09 5.61-2.982 7.35C16.964 21.105 14.7 22 12 22A9.996 9.996 0 0 1 2 12c0-1.614.386-3.14 1.064-4.49z"
          />
        </svg>
        Continue with Google
      </button>
      <button
        type="button"
        class="py-2.5 px-5 flex items-center justify-center gap-4 mb-6 font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          class="w-5 h-5 fill-current"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path
            d="M11.624 7.222c-.876 0-2.232-.996-3.66-.96-1.884.024-3.612 1.092-4.584 2.784-1.956 3.396-.504 8.412 1.404 11.172.936 1.344 2.04 2.856 3.504 2.808 1.404-.06 1.932-.912 3.636-.912 1.692 0 2.172.912 3.66.876 1.512-.024 2.472-1.368 3.396-2.724 1.068-1.56 1.512-3.072 1.536-3.156-.036-.012-2.94-1.128-2.976-4.488-.024-2.808 2.292-4.152 2.4-4.212-1.32-1.932-3.348-2.148-4.056-2.196-1.848-.144-3.396 1.008-4.26 1.008zm3.12-2.832c.78-.936 1.296-2.244 1.152-3.54-1.116.048-2.46.744-3.264 1.68-.72.828-1.344 2.16-1.176 3.432 1.236.096 2.508-.636 3.288-1.572z"
          />
        </svg>
        Continue with Apple
      </button>

      <div class="flex items-center justify-center mb-6">
        <div class="w-1/3 border-b dark:border-gray-600"></div>
        <div class="mx-4 text-gray-500 dark:text-gray-400">or</div>
        <div class="w-1/3 border-b dark:border-gray-600"></div>
      </div>

      <form
        class="w-full flex flex-col gap-6 mb-6"
        @submit.prevent="validateForm()"
      >
        <!-- Alerts -->
        <div
          v-if="
            $route.query.registered ||
            $route.query.verified === 'true' ||
            $route.query.verified === 'false' ||
            !!alert
          "
          class="flex flex-col gap-y-2"
        >
          <AlertComponent
            v-if="$route.query.registered"
            message="You have successfully registered. Please login to continue."
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
          <AlertComponent
            v-if="!!alert"
            :message="alert"
            :show="!!alert"
            type="error"
          />
        </div>
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
        <button
          type="submit"
          :disabled="loading"
          class="inline-flex items-center text-base justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 uppercase"
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
          class="text-blue-600 hover:underline dark:text-blue-400"
          >Create one here.</router-link
        >
      </p>
    </div>
  </main>
</template>

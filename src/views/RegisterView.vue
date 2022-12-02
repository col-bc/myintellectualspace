<script setup>
import AlertComponent from '@/components/AlertComponent.vue'
import axios from 'axios'
import { onMounted, reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword
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

const form = reactive({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: false
})
const alert = ref(null)
const loading = ref(false)
const requirements = computed(() => {
  return {
    length: form.password.length >= 8,
    uppercase: /[A-Z]/.test(form.password),
    digit: /[0-9]/.test(form.password)
  }
})

function verifyForm() {
  alert.value = null
  // check if form is filled out
  if (
    !form.fullName ||
    !form.email ||
    !form.password ||
    !form.confirmPassword
  ) {
    alert.value = 'Please fill out all fields'
    return
  }
  // check if email is valid
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    alert.value = 'Please enter a valid email address'
    return
  }
  // check if passwords match
  if (form.password !== form.confirmPassword) {
    alert.value = 'Passwords do not match.'
    return
  }
  // check if password is at least 8 characters long and contains at least one number and one uppercase letter
  if (
    form.password.length < 8 ||
    !/\d/.test(form.password) ||
    !/[a-z]/.test(form.password) ||
    !/[A-Z]/.test(form.password)
  ) {
    alert.value =
      'Password must be at least 8 characters long and contain at least one number and one uppercase letter.'
    return
  }
  // check if terms are checked
  if (!form.terms) {
    alert.value = 'Please agree to the terms and privacy policy.'
    return
  }
  registerWithEmail()
}
function registerWithEmail() {
  // create a user with email and password in firebase
  loading.value = true
  createUserWithEmailAndPassword(auth, form.email, form.password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user

      router.push('/login?registered=true')
    })
    .catch((error) => {
      alert.value = error.message
    })
    .finally(() => {
      loading.value = false
    })
}

function registerWithGoogle() {
  // send post request to create user
  loading.value = true
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result)
      const token = credential.accessToken
      const user = result.user

      router.push('/login?registered=true')
    })
    .catch((error) => {
      alert.value = error.error.message
    })
    .finally(() => {
      loading.value = false
    })
}
</script>

<template>
  <main class="min-h-screen flex items-stretch bg-white dark:bg-slate-800">
    <div class="flex-1 max-w-md mx-auto flex flex-col justify-center px-4">
      <router-link
        to="/"
        class="flex items-center justify-center mb-4 text-gray-900 dark:text-white"
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
      <h1
        class="text-3xl font-bold text-center text-gray-900 mb-12 dark:text-white"
      >
        Create your free account
      </h1>

      <button
        type="button"
        @click="registerWithGoogle()"
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
        @submit.prevent="verifyForm"
      >
        <AlertComponent
          v-if="!!alert"
          :message="alert"
          type="error"
          class="col-span-2"
        />
        <input
          type="text"
          v-model="form.fullName"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Full name"
        />
        <input
          type="email"
          v-model="form.email"
          class="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Email"
        />
        <div class="relative">
          <input
            type="password"
            v-model="form.password"
            class="peer col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Password"
          />
          <div
            class="hidden peer-focus-within:block absolute w-full top-full mt-1 p-4 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700"
          >
            <h5
              class="mb-2 text-base font-semibold text-gray-900 dark:text-white"
            >
              Password requirements:
            </h5>
            <ul
              class="space-y-1 max-w-md list-inside text-gray-500 dark:text-gray-400"
            >
              <li class="flex items-center">
                <svg
                  v-if="requirements.length"
                  class="w-4 h-4 mr-1.5 text-green-500 dark:text-green-400 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <svg
                  v-else
                  class="w-4 h-4 mr-1.5 text-gray-400 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                At least 8 characters
              </li>
              <li class="flex items-center">
                <svg
                  v-if="requirements.uppercase"
                  class="w-4 h-4 mr-1.5 text-green-500 dark:text-green-400 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <svg
                  v-else
                  class="w-4 h-4 mr-1.5 text-gray-400 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                At least one uppercase letter
              </li>
              <li class="flex items-center">
                <svg
                  v-if="requirements.digit"
                  class="w-4 h-4 mr-1.5 text-green-500 dark:text-green-400 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <svg
                  v-else
                  class="w-4 h-4 mr-1.5 text-gray-400 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                At least one number
              </li>
            </ul>
          </div>
        </div>
        <input
          type="password"
          v-model="form.confirmPassword"
          class="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Confirm Password"
        />
        <div class="flex items-center">
          <input
            type="checkbox"
            v-model="form.terms"
            class="w-4 h-4 text-blue-600 bg-white rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label
            class="ml-2 w-full text-sm font-medium text-gray-900 dark:text-gray-300"
            >I have read and agree to the
            <a href="#" class="text-blue-600 hover:underline dark:text-blue-40"
              >terms</a
            >
            and
            <a href="#" class="text-blue-600 hover:underline dark:text-blue-40"
              >privacy policy</a
            >.</label
          >
        </div>
        <button
          type="button"
          @click="verifyForm"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 uppercase"
        >
          Create my account
        </button>
      </form>

      <p class="mb-8 dark:text-white">
        Already have an account?
        <router-link
          to="/login"
          class="text-blue-600 hover:underline dark:text-blue-40"
          >Login here.</router-link
        >
      </p>
    </div>
  </main>
</template>

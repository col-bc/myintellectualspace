<script setup>
import AlertComponent from '@/components/AlertComponent.vue'
import axios from 'axios'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

onMounted(() => {
  // Dark mode
  if (localStorage.getItem('color-theme') === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
})

const router = useRouter()

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  handle: '',
  educationLevel: 'initial',
  accountType: 'initial',
  password: '',
  confirmPassword: '',
  terms: false
})
const alert = ref(null)

async function verifyForm() {
  alert.value = null
  // check if form is filled out
  if (
    !form.firstName ||
    !form.lastName ||
    !form.email ||
    !form.handle ||
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
  // check is handle is valid. no spaces, no special characters, no numbers, no length less than 3
  if (!/^[a-zA-Z0-9]+$/.test(form.handle) || form.handle.length < 3) {
    alert.value =
      'Handles must be at least 3 characters long and contain only letters and numbers.'
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
  // check if handle is taken
  try {
    /// /api/auth/check-handle/<handle>
    const response = await axios.get(`/api/auth/check-handle/${form.handle}`)
    if (response.status === 200) {
      if (response.data.available) {
        registerUser()
      } else {
        alert.value = 'Handle is not available.'
        return
      }
    }
  } catch (error) {
    console.log(error)
  }
}
async function registerUser() {
  // send post request to create user
  try {
    const response = await axios.post('/api/auth/register', {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      handle: form.handle,
      educationLevel: form.educationLevel,
      profileType: form.accountType,
      password: form.password
    })
    if (response.status === 201) {
      router.push('/login?registered=true')
    }
  } catch (error) {
    console.log(error.response)
    if (error.response.status < 500) {
      alert.value = error.response.data.error
    } else {
      alert.value = 'Something went wrong. Please try again later.'
    }
  }
}
</script>

<template>
  <main class="min-h-screen flex items-stretch dark:bg-slate-800">
    <div class="flex-1 flex flex-col justify-center py-12">
      <router-link
        to="/"
        class="flex items-center justify-center mb-6 text-gray-900 dark:text-white"
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
        class="text-3xl font-bold text-center text-gray-800 mb-6 dark:text-white"
      >
        Create your free account
      </h1>

      <form
        class="w-full max-w-lg mx-auto grid grid-cols-2 gap-6 p-6"
        @submit.prevent
      >
        <AlertComponent
          v-if="!!alert"
          :message="alert"
          type="error"
          class="col-span-2"
        />
        <input
          type="text"
          v-model="form.firstName"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="First name"
        />
        <input
          type="text"
          v-model="form.lastName"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Last name"
        />
        <input
          type="email"
          v-model="form.email"
          class="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Email"
        />
        <input
          type="text"
          v-model="form.handle"
          class="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Handle"
        />
        <select
          v-model="form.accountType"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="initial" selected>Choose account type</option>
          <option value="learner">Learner</option>
          <option value="educator">Educator</option>
          <option value="employer">Employer</option>
        </select>
        <select
          v-model="form.educationLevel"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="initial">Choose education level</option>
          <option value="hs">High School</option>
          <option value="aa">Associate's</option>
          <option value="ba">Bachelor's</option>
          <option value="ma">Masters's</option>
          <option value="phd">Doctorate</option>
        </select>
        <input
          type="password"
          v-model="form.password"
          class="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Password"
        />
        <input
          type="password"
          v-model="form.confirmPassword"
          class="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Confirm Password"
        />
        <div class="col-span-2 flex items-center">
          <input
            type="checkbox"
            v-model="form.terms"
            class="w-4 h-4 text-blue-600 bg-white rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label
            class="ml-2 w-full text-sm font-medium text-gray-900 dark:text-gray-300"
            >I have read and agree to the
            <a href="#" class="text-blue-500 hover:underline dark:text-blue-40"
              >terms</a
            >
            and
            <a href="#" class="text-blue-500 hover:underline dark:text-blue-40"
              >privacy policy</a
            >.</label
          >
        </div>
        <button
          type="button"
          @click="verifyForm"
          class="col-span-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 uppercase"
        >
          Create my account
        </button>
      </form>
      <p class="text-center mb-8 dark:text-white">
        Already have an account?
        <router-link
          to="/login"
          class="text-blue-500 hover:underline dark:text-blue-40"
          >Login here.</router-link
        >
      </p>
    </div>
  </main>
</template>

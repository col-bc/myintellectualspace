<script setup>
import { ref, reactive } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import AlertComponent from '../components/AlertComponent.vue'

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
  terms: false,
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
    alert.value = 'Please enter a valid handle'
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
        alert.value = 'Handle is already taken.'
        return
      }
    }
  } catch (error) {
    console.log(error)
  }
}
async function registerUser() {
  // send post request to create user
  // /api/auth/register
  try {
    const response = await axios.post('/api/auth/register', {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      handle: form.handle,
      educationLevel: form.educationLevel,
      profileType: form.accountType,
      password: form.password,
    })
    if (response.status === 201) {
      router.push('/login?registered=true')
      return
    }
  } catch (error) {
    alert.value = 'Error creating account.'
    return
  }
}
</script>

<template>
  <main class="min-h-screen flex items-stretch">
    <div class="flex-1 flex flex-col justify-center">
      <h1 class="text-3xl font-bold text-center text-gray-800 mb-6">
        Getting Started
      </h1>
      <router-link
        to="/"
        class="flex items-center w-auto mx-auto text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500"
      >
        <img src="@/assets/logo.svg" alt="logo" class="h-8 mr-3" />
        <span class="self-center text-xl font-semibold whitespace-nowrap"
          > Intellectual Space</span
        >
      </router-link>

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
            class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label
            class="ml-2 w-full text-sm font-medium text-gray-900 dark:text-gray-300"
            >I have read and agree to the
            <a href="#" class="text-blue-500 hover:underline">terms</a>
            and
            <a href="#" class="text-blue-500 hover:underline">privacy policy</a
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
      <p class="text-center mb-8">
        Already have an account?
        <router-link to="/login" class="text-blue-500 hover:underline"
          >Login here.</router-link
        >
      </p>
    </div>
    <div
      class="hidden md:flex flex-col flex-1 justify-center items-center p-12 bg-gradient-to-b from-blue-200 to-purple-200"
    >
      <!-- <lottie-player
        src="https://assets5.lottiefiles.com/packages/lf20_pkanqwys.json"
        background="transparent"
        class="max-w-lg mb-12"
        speed="1"
        loop
        autoplay
      ></lottie-player> -->
      <h1
        class="text-center text-4xl font-bold drop-shadow-md text-gray-800 mb-12"
      >
        We're glad you're here!
      </h1>
      <p
        class="text-gray-700 drop-shadow text-center text-lg font-medium leading-loose"
      >
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Deserunt nemo
        similique voluptatibus quasi molestias eius incidunt, cupiditate non
        eaque fugiat, officiis nihil consequuntur facere sequi asperiores
        recusandae pariatur accusantium magnam.
      </p>
    </div>
  </main>
</template>

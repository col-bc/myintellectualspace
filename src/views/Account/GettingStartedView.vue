<script setup>
import AlertComponent from '@/components/AlertComponent.vue'
import useUserStore from '@/stores/user'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs
} from '@firebase/firestore'

const db = getFirestore()
const router = useRouter()
const user = useUserStore()
const error = ref(null)

const EDUCATION_LEVELS = [
  'High School',
  'Associate Degree',
  'Bachelor Degree',
  'Master Degree',
  'Doctorate Degree'
]

const form = reactive({
  handle: '',
  fullName: '',
  phone: '',
  location: '',
  bio: '',
  educationLevel: 'default',
  educationInstitution: '',
  educationMajor: ''
})

onMounted(() => {
  // populate form with user data
  if (user.user) {
    form.handle = user.user.handle
    form.fullName = user.user.fullName
    form.phone = user.user.phone
    form.location = user.user.location
    form.bio = user.user.bio
    form.educationLevel = user.user.educationLevel
    form.educationInstitution = user.user.educationInstitution
    form.educationMajor = user.user.educationMajor
  }
})

async function usernameAvailable() {
  if (form.handle.length < 3) {
    error.value = 'Username must be at least 3 characters'
    return false
  }
  // query firestore for handle
  const usersRef = collection(db, 'users')
  const q = query(usersRef, where('handle', '==', form.handle))
  const querySnapshot = await getDocs(q)
  return querySnapshot.empty
}
async function saveUser() {
  alert.value = null
  // check if handle and full name are filled
  if (!form.handle || !form.fullName) {
    error.value = 'Handle and Full Name are required'
    return
  }
  // check handle
  if (!(await usernameAvailable())) {
    alert.value = 'Username is not available'
    return
  }
  // save user data
  await user.updateUser(form)
  router.push({ name: 'profile', params: { handle: user.user.handle } })
  return
}
</script>

<template>
  <main class="min-h-screen bg-white py-12 dark:bg-slate-800">
    <div class="max-w-screen-md mx-auto flex flex-col">
      <h1
        class="text-3xl font-bold text-center text-gray-800 mb-6 dark:text-white"
      >
        Almost there!
      </h1>
      <p class="text-lg text-center text-gray-700 dark:text-gray-300 mb-6">
        Welcome toIntellectual Space. Help other's get tp know you by adding
        information to your profile. You can update or remove these details at
        any time by visiting your profile page.
      </p>
      <form @submit.prevent="saveUser" class="flex flex-col gap-6">
        <AlertComponent v-if="!!error" :message="error" type="error" />
        <!-- Handle -->
        <div class="flex items-center">
          <span
            class="font-semibold mr-2 uppercase text-sm w-64 dark:text-gray-300"
            >Handle</span
          >
          <input
            type="text"
            v-model="form.handle"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder=""
          />
        </div>
        <!-- Name -->
        <div class="flex items-center">
          <span
            class="font-semibold mr-2 uppercase text-sm w-64 dark:text-gray-300"
            >Name</span
          >
          <input
            type="text"
            v-model="form.fullName"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder=""
          />
        </div>
        <!-- Phone -->
        <div class="flex items-center">
          <span
            class="font-semibold mr-2 uppercase text-sm w-64 dark:text-gray-300"
            >Phone Number</span
          >
          <input
            type="text"
            v-model="form.phone"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder=""
          />
        </div>
        <!-- Location -->
        <div class="flex items-center">
          <span
            class="font-semibold mr-2 uppercase text-sm w-64 dark:text-gray-300"
            >Location</span
          >
          <div class="w-full">
            <input
              type="text"
              v-model="form.location"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder=""
            />
            <span class="text-gray-500 text-sm mt-2 dark:text-gray-400"
              >Eg. Atlanta, Georgia. Never share your full address</span
            >
          </div>
        </div>
        <!-- Bio -->
        <div class="flex items-start">
          <span
            class="font-semibold mr-2 uppercase text-sm w-64 dark:text-gray-300"
            >Bio</span
          >
          <textarea
            v-model="form.bio"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder=""
            rows="4"
          ></textarea>
        </div>
        <!-- Education Level -->
        <div class="flex items-center">
          <span
            class="font-semibold mr-2 uppercase text-sm w-64 dark:text-gray-300"
            >Education Level</span
          >
          <select
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            v-model="form.educationLevel"
          >
            <option value="default" disabled>Select an option</option>
            <template v-for="level in EDUCATION_LEVELS" :key="level">
              <option :value="level">
                {{ level }}
              </option>
            </template>
          </select>
        </div>
        <!-- Education institution -->
        <div class="flex items-center">
          <span
            class="font-semibold mr-2 uppercase text-sm w-64 dark:text-gray-300"
            >Education Institution</span
          >
          <input
            type="text"
            v-model="form.educationInstitution"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder=""
          />
        </div>
        <!-- Education major -->
        <div class="flex items-center">
          <span
            class="font-semibold mr-2 uppercase text-sm w-64 dark:text-gray-300"
            >Education Major</span
          >
          <input
            type="text"
            v-model="form.educationMajor"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder=""
          />
        </div>
        <!-- Occupation -->
        <div class="flex items-center">
          <span
            class="font-semibold mr-2 uppercase text-sm w-64 dark:text-gray-300"
            >Occupation</span
          >
          <input
            type="text"
            v-model="form.occupation"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder=""
          />
        </div>
        <!-- Interests -->
        <div class="flex items-start">
          <span
            class="font-semibold mr-2 uppercase text-sm w-64 dark:text-gray-300"
            >Interests</span
          >
          <textarea
            v-model="form.interests"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder=""
            rows="4"
          ></textarea>
        </div>
        <div class="w-full flex gap-4 justify-end">
          <button
            type="submit"
            :disabled="loading"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            <div v-if="loading" role="status">
              <svg
                class="inline mr-2 w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
            <span v-else>Save and Continue</span>
          </button>
        </div>
      </form>
    </div>
  </main>
</template>

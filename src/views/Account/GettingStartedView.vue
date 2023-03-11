<script setup>
import useUserStore from '@/stores/user'
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where
} from '@firebase/firestore'
import { onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import AlertComponent from '@/components/AlertComponent.vue'
import { v4 as uuidv4 } from 'uuid'
import {
  mdiEyeOffOutline,
  mdiHomeOffOutline,
  mdiArrowRightThin,
  mdiAt
} from '@mdi/js'

const db = getFirestore()
const router = useRouter()
const user = useUserStore()

const EDUCATION_LEVELS = [
  'High School',
  'Associate Degree',
  'Bachelor Degree',
  'Master Degree',
  'Doctorate Degree'
]
const DEFAULT_AVATAR =
  'https://firebasestorage.googleapis.com/v0/b/my-intellectual-space.appspot.com/o/avatars%2Favatar.png?alt=media&token=de2d4a8a-ae3e-48f1-b8c7-3620b1eb3b69'

const form = reactive({
  error: null,
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
    form.occupation = user.user.occupation
    form.educationLevel = user.user.educationLevel
    form.educationInstitution = user.user.educationInstitution
    form.educationMajor = user.user.educationMajor
  }
})
watch(
  () => form.error,
  (error) => {
    if (error) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
)

async function usernameAvailable() {
  if (form.handle?.length < 3) {
    state.error = {
      message: 'Username must be at least 3 characters',
      type: 'error'
    }
    return false
  } else if (form.handle === user.user.handle) {
    return true
  }

  // query firestore for handle
  const usersRef = collection(db, 'users')
  const q = query(usersRef, where('handle', '==', form.handle))
  const querySnapshot = await getDocs(q)
  return querySnapshot.empty
}
async function saveUser() {
  form.error = null
  // check if handle and full name are filled
  if (!form.handle) {
    form.error = {
      message: 'Please enter a handle',
      type: 'error'
    }
    return
  }
  if (!form.fullName) {
    form.error = {
      message: 'Please enter your full name',
      type: 'error'
    }
    return
  }
  if (form.bio?.length > 250) {
    form.error = {
      message: 'Bio must be less than 250 characters',
      type: 'error'
    }
    return
  }
  // check if handle has non alphanumeric characters
  if (!/^[a-zA-Z0-9]+$/.test(form.handle)) {
    form.error = {
      message: 'Username can only contain alphanumeric characters',
      type: 'error'
    }
    return
  }
  // check handle availability
  if (!(await usernameAvailable())) {
    form.error = {
      message: 'Handle is not available',
      type: 'error'
    }
    return
  }
  // save user data
  await user.updateUser(form)
  router.push({ name: 'profile', params: { handle: user.user.handle } })
  return
}
async function changeAvatar() {
  // show file picker
  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.accept = 'image/*'
  fileInput.onchange = async (e) => {
    const file = e.target.files[0]
    if (!file) {
      return
    }
    const reader = new FileReader()
    reader.onload = async (e) => {
      const result = e.target.result
      const blob = await fetch(result).then((r) => r.blob())
      const file = new File([blob], uuidv4(), {
        type: 'image/png'
      })
      // upload file
      await user.uploadAvatar(file)
      // refresh user data
      state.profileData = await user.fetchUserByHandle(route.params.handle)
      state.profileAlert = {
        type: 'success',
        message: 'Avatar updated successfully'
      }
    }
    reader.readAsDataURL(file)
  }
  fileInput.click()
}
</script>

<template>
  <main class="bg-white min-h-screen dark:bg-slate-800">
    <div class="max-w-screen-xl mx-auto">
      <div
        class="relative h-full container mx-auto flex flex-col gap-6 py-12 mb-12 px-2 md:px-4"
      >
        <h1
          class="text-5xl font-black text-center text-gray-900 mb-12 dark:text-white"
        >
          Almost there!
        </h1>
        <form
          @submit.prevent="saveUser"
          class="max-w-lg mx-auto flex flex-col gap-6"
        >
          <p class="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            Welcome to My Intellectual Space. Help other's get tp know you by
            adding information to your profile. You can update or remove these
            details at any time by visiting your profile page.
          </p>
          <AlertComponent
            v-if="!!form.error"
            :message="form.error.message"
            :type="form.error.type"
          />
          <!-- Avatar -->
          <div
            @click="changeAvatar"
            class="cursor-pointer sm:flex-1 w-full max-w-sm mx-auto relative group bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <img
              :src="user.user.avatarUrl || DEFAULT_AVATAR"
              class="rounded-lg w-full h-auto md:max-w-sm aspect-square object-fit"
            />
            <button
              type="button"
              @click="changeAvatar"
              class="w-full text-center hover:underline mt-1"
            >
              Change Avatar
            </button>
          </div>
          <!-- Handle -->
          <div>
            <span
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Handle<span class="align-super text-xs text-red-500"
                >*</span
              ></span
            >
            <div class="w-full relative group">
              <svg-icon
                :path="mdiAt"
                type="mdi"
                class="absolute top-2 left-2 text-gray-500 dark:text-gray-400 group-focus-within:text-gray-900"
              />
              <input
                type="text"
                v-model="form.handle"
                class="bg-gray-50 pl-9 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder=""
              />
            </div>
          </div>
          <!-- Name -->
          <div>
            <span
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Name<span class="align-super text-xs text-red-500">*</span></span
            >
            <input
              type="text"
              v-model="form.fullName"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder=""
            />
          </div>
          <!-- Phone -->
          <div>
            <span
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Phone Number</span
            >
            <input
              type="text"
              v-model="form.phoneNumber"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder=""
            />
            <span
              class="flex items-center gap-2 text-gray-500 text-sm mt-1 dark:text-gray-400"
            >
              <svg-icon
                :path="mdiEyeOffOutline"
                type="mdi"
                class="h-4 w-4 fill-current flex-shrink-0"
              />
              Your phone number is always private</span
            >
          </div>
          <!-- Location -->
          <div>
            <span
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Location</span
            >
            <div class="w-full">
              <input
                type="text"
                v-model="form.location"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder=""
              />
              <span
                class="flex items-center gap-2 text-gray-500 text-sm mt-1 dark:text-gray-400"
              >
                <svg-icon
                  :path="mdiHomeOffOutline"
                  type="mdi"
                  class="h-4 w-4 fill-current flex-shrink-0"
                />
                Eg. Atlanta, Georgia. Never share your full address</span
              >
            </div>
          </div>
          <!-- Bio -->
          <div>
            <span
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Bio</span
            >
            <textarea
              v-model="form.bio"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              :class="{
                'border-red-500 focus:border-red-500 focus:ring-red-500 outline-0':
                  form.bio?.length > 250
              }"
              placeholder=""
              rows="4"
            ></textarea>
            <span
              class="text-gray-500 text-sm mt-1 dark:text-gray-400"
              :class="{
                'text-red-500': form.bio?.length > 250
              }"
              >{{ form.bio?.length || 0 }}/250</span
            >
          </div>
          <!-- Education Level -->
          <div>
            <span
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
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
          <div>
            <span
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
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
          <div>
            <span
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
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
          <div>
            <span
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
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
          <div>
            <span
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
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
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
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
              <span v-else>
                Save and Continue
                <svg-icon
                  :path="mdiArrowRightThin"
                  type="mdi"
                  class="inline mr-2 w-6 h-6 text-gray-200 dark:text-gray-600 fill-blue-600"
                />
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

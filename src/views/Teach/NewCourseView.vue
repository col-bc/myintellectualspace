<script setup>
import { reactive, ref } from '@vue/reactivity'
import useUserStore from '@/stores/user'
import { useRouter } from 'vue-router'
import NavbarComponent from '@/components/NavbarComponent.vue'
import AlertComponent from '@/components/AlertComponent.vue'
import axios from 'axios'

const userStore = useUserStore()
const router = useRouter()

const form = ref()
const error = ref('')
const imagePreview = ref('')

const state = reactive({
  nameLoading: false,
  nameAvailable: true,
  nameError: null
})

function handleFileChange() {
  // read the file
  const file = form.value.image.files[0]
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    imagePreview.value = reader.result
  }
}
async function checkCourseName() {
  state.nameLoading = true
  state.nameError = null

  if (!form.value.nameX) {
    state.nameLoading = false
    state.nameAvailable = true
    return
  }

  try {
    const response = await axios.get(`/api/course/name/${form.name}`, {
      headers: {
        Authorization: userStore.getBearerToken
      }
    })
    if (response.data.exists) {
      state.nameError = 'A course with this name already exists.'
    }
  } catch (error) {
    console.log(error)
    if (!error.response.data.exists) {
      state.nameAvailable = true
    } else {
      state.nameError = 'An error occurred.'
    }
  } finally {
    state.nameLoading = false
  }
}
async function createCourse() {
  error.value = null
  var formData = new FormData(form.value)

  if (!formData.get('name')) {
    error.value = 'Please enter a name for the course.'
    window.scroll({ top: 0, left: 0, behavior: 'smooth' })
    return
  }
  if (!formData.get('price')) {
    error.value = 'Please enter a price for the course.'
    window.scroll({ top: 0, left: 0, behavior: 'smooth' })
    return
  }
  if (formData.get('category') == 'initial') {
    error.value = 'Please select a category for the course.'
    window.scroll({ top: 0, left: 0, behavior: 'smooth' })
    return
  }
  if (formData.get('difficulty') == 'initial') {
    error.value = 'Please select a difficulty for the course.'
    window.scroll({ top: 0, left: 0, behavior: 'smooth' })
    return
  }
  if (!formData.get('duration')) {
    error.value = 'Please select an duration for the course.'
    window.scroll({ top: 0, left: 0, behavior: 'smooth' })
    return
  }

  try {
    const response = await axios.post('/api/course', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: userStore.getBearerToken
      }
    })
    if (response.status === 201) {
      router.push({
        name: 'course',
        params: { name: response.data.course.name }
      })
    }
  } catch (error) {
    console.log(error)
    error.value = error.response.error
    window.scroll({ top: 0, left: 0, behavior: 'smooth' })
  }
}
</script>

<template>
  <main class="bg-white min-h-screen dark:bg-slate-800">
    <div class="max-w-screen-xl mx-auto">
      <NavbarComponent />
      <div class="container mx-auto px-2 py-12">
        <div
          v-if="
            !userStore.user.education_level ||
            !userStore.user.education_institution ||
            !userStore.user.education_major
          "
          class="flex flex-col items-start gap-6"
        >
          <div
            class="text-white mb-6 mx-auto p-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400"
          >
            <svg
              viewBox="0 0 24 24"
              class="h-24 w-24"
              width="24"
              height="24"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h1
            class="w-full text-3xl md:text-center font-bold text-gray-900 dark:text-white"
          >
            Missing Information
          </h1>
          <p class="text-lg max-w-lg mx-auto text-gray-700 dark:text-gra-300">
            You must complete more of your profile before you can create a
            course. Instructor profiles must include an
            <span class="font-medium"
              >education level, institution, and major</span
            >. Even if you don't have a formal education, you must still list
            your High School or General Education on your profile.
          </p>
          <div class="w-full flex justify-center">
            <button
              type="button"
              @click="
                router.push({
                  name: 'profile-about',
                  params: { handle: userStore.getHandle }
                })
              "
              class="mx-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Complete My Profile
            </button>
          </div>
        </div>
        <div v-else class="flex flex-col items-start gap-6">
          <div
            class="text-white mb-6 mx-auto p-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400"
          >
            <svg
              viewBox="0 0 24 24"
              class="h-24 w-24"
              width="24"
              height="24"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
          </div>
          <h1
            class="w-full text-3xl md:text-center font-bold text-gray-900 dark:text-white"
          >
            Your Course Details
          </h1>
          <p
            class="max-w-xl mx-auto md:text-center text-gray-700 dark:text-gray-300 mb-6"
          >
            Course names must be unique and descriptive. You can add a short
            description to help people understand what your course is about.
          </p>
          <form
            @submit.prevent="createCourse()"
            ref="form"
            class="flex w-full max-w-xl mx-auto flex-col gap-4 mb-12"
          >
            <AlertComponent
              v-if="!!error"
              type="error"
              :message="error"
              :dismissible="false"
            />
            <div class="relative w-full">
              <label
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >Name</label
              >
              <input
                type="text"
                name="name"
                @blur="checkCourseName()"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              <p
                v-if="state.nameError"
                class="text-xs text-red-700 dark:text-red-400"
              >
                {{ state.nameError }}
              </p>
              <div
                role="status"
                class="flex items-center absolute top-9 right-2"
              >
                <svg
                  v-if="state.nameLoading"
                  class="inline w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
                <svg
                  v-if="!state.nameLoading && !state.nameAvailable"
                  viewBox="0 0 24 24"
                  class="w-6 h-6 text-red-500 dark:text-red-400"
                  width="24"
                  height="24"
                  stroke="currentColor"
                  stroke-width="2"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <svg
                  v-if="!state.nameLoading && state.nameAvailable"
                  viewBox="0 0 24 24"
                  class="w-6 h-6 text-green-500 dark:text-green-400"
                  width="24"
                  height="24"
                  stroke="currentColor"
                  stroke-width="2"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
            </div>
            <div>
              <label
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >Description</label
              >
              <textarea
                name="description"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                rows="3"
              ></textarea>
            </div>
            <div class="w-full">
              <label
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                for="file_input"
                >Image</label
              >

              <div class="flex justify-center items-center w-full">
                <label
                  for="dropzone-file"
                  class="flex flex-col justify-center items-center w-full h-64 p-4 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                >
                  <div
                    v-if="!imagePreview"
                    class="flex flex-col justify-center items-center pt-5 pb-6"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      class="mb-3 w-10 h-10 text-gray-400"
                      width="24"
                      height="24"
                      stroke="currentColor"
                      stroke-width="2"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <polyline points="16 16 12 12 8 16"></polyline>
                      <line x1="12" y1="12" x2="12" y2="21"></line>
                      <path
                        d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"
                      ></path>
                      <polyline points="16 16 12 12 8 16"></polyline>
                    </svg>
                    <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span class="font-semibold">Click to upload</span> or drag
                      and drop
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      SVG, PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                  </div>
                  <img v-else :src="imagePreview" class="w-full h-full" />
                  <input
                    id="dropzone-file"
                    @change="handleFileChange()"
                    type="file"
                    class="hidden"
                    name="image"
                  />
                </label>
              </div>
            </div>
            <div>
              <label
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >Cost</label
              >
              <div class="flex">
                <span
                  class="inline-flex items-center px-3 text-gray-900 bg-gray-200 rounded-l-md border border-r-0 border-gray-300 dark:bg-gray-600 dark:text-white dark:border-gray-600"
                >
                  $
                </span>
                <input
                  type="number"
                  name="price"
                  min="0"
                  step="0.01"
                  class="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="0.00"
                  e
                />
              </div>
              <p class="mt-1 text-xs text-gray-700 dark:text-gray-300">
                Enter 0.00 to make your course free
              </p>
            </div>
            <div>
              <label
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >Category</label
              >
              <select
                name="category"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option selected value="initial">Choose a country</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Digital Art">Digital Art / Design</option>
                <option value="English">English</option>
                <option value="Finance">Finance</option>
                <option value="History">History</option>
                <option value="Literature">Literature</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Sciences">Sciences</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >Difficulty Level</label
              >
              <select
                name="difficulty"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option selected value="initial">Choose a country</option>
                <option value="Introductory">Introductory</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Difficult">Difficult</option>
              </select>
            </div>
            <div>
              <label
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >Length</label
              >
              <input
                type="text"
                name="duration"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="4 hours"
              />
            </div>
            <div>
              <button
                type="submit"
                class="inline-flex items-center gap-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                <svg
                  viewBox="0 0 24 24"
                  class="w-4 h-4"
                  width="24"
                  height="24"
                  stroke="currentColor"
                  stroke-width="2"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"
                  ></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Save and Create
              </button>
              <button
                type="button"
                class="py-2.5 px-5 ml-4 text-sm font-medium text-gray-900 focus:outline-none bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                See Preview
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>

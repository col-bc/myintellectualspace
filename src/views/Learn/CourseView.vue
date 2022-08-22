<script setup>
import { onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavbarComponent from '../../components/NavbarComponent.vue'
import useUserStore from '../../stores/user'
import axios from 'axios'

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()

const state = reactive({
  loading: true
})
const course = reactive({
  data: null
})

onMounted(async () => {
  state.loading = true
  try {
    const { data } = await axios.get(`/api/course/name/${route.params.name}`, {
      headers: {
        Authorization: userStore.getBearerToken
      }
    })
    course.data = data
  } catch (error) {
    console.log(error)
    if (error.response.status === 404) {
      router.push({ name: 'not-found' })
    }
  } finally {
    state.loading = false
  }
})
</script>

<template>
  <main class="bg-white dark:bg-slate-800">
    <div class="min-h-screen">
      <NavbarComponent />
      <!-- Loading State -->
      <div v-if="state.loading" class="text-center">
        <div role="status">
          <svg
            class="inline mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
      </div>

      <img
        v-if="!state.loading && !!course.data"
        :src="course.data.image_uri"
        alt="course image"
        class="w-full h-72 object-cover"
      />

      <div
        v-if="!state.loading && !!course.data"
        class="container max-screen-xl mx-auto flex flex-col md:flex-row gap-12 mb-6 lg:gap-16 px-4 sm:px-2 my-6"
      >
        <div class="flex-1 flex flex-col gap-6">
          <h1
            class="text-3xl font-black drop-shadow-xl leading-loose text-gray-900 dark:text-white"
          >
            {{ course.data.name }}
          </h1>
          <p class="text-gray-700 leading-loose dark:text-gray-300">
            {{ course.data.description }}
          </p>
          <p class="flex items-center gap-2 flex-wrap">
            <span
              class="bg-blue-300 text-blue-800 font-medium px-2.5 py-0.5 rounded dark:bg-blue-300 dark:text-blue-900"
              >{{
                course.data.price === 0.0 ? 'FREE' : `$${course.data.price}`
              }}</span
            >
            <span
              class="bg-blue-300 text-blue-800 font-medium px-2.5 py-0.5 rounded dark:bg-blue-300 dark:text-blue-900"
              >{{ course.data.difficulty }}
            </span>
            <span
              class="bg-blue-300 text-blue-800 font-medium px-2.5 py-0.5 rounded dark:bg-blue-300 dark:text-blue-900"
              >{{ course.data.category }}
            </span>
          </p>
          <p class="flex items-center text-gray-700 dark:text-gray-300">
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="w-5 h-5 mr-3"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            {{ !!course.participants ? course.participants.length : 0 }}
            participants
          </p>
          <p
            class="text-sm inline-flex items-center text-gray-700 dark:text-gray-300"
          >
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="w-5 h-5 mr-1"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span class="font-medium ml-2">
              {{ course.data.duration }} to complete</span
            >
          </p>
          <div class="flex items-center text-gray-700 dark:text-gray-300">
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="w-6 h-6"
            >
              <polygon
                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
              ></polygon>
            </svg>
            <p class="ml-3 text-sm font-bold text-gray-900 dark:text-white">
              4.95
            </p>
            <span
              class="w-1 h-1 mx-1.5 bg-gray-500 rounded-full dark:bg-gray-400"
            ></span>
            <a
              href="#"
              class="text-sm font-medium text-gray-900 underline hover:no-underline dark:text-white"
              >73 reviews</a
            >
          </div>
        </div>
        <div class="flex-1 flex flex-col gap-6">
          <button
            type="button"
            class="shadow-lg py-3 px-5 text-base font-semibold text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <span
              class="bg-gray-100 text-gray-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300"
            >
              {{ course.data.price === 0.0 ? 'FREE' : `$${course.data.price}` }}
            </span>
            Join Course
          </button>
          <h4
            class="text-xl font-black drop-shadow-xl leading-loose text-gray-900 dark:text-white"
          >
            Meet Your Instructor
          </h4>
          <div
            class="flex items-start gap-4 p-4 bg-white shadow-sm rounded-lg border border-gray-300 dark:bg-gray-800 dark:border-gray-600"
          >
            <img
              :src="course.data.instructor.avatar_uri"
              class="w-12 h-12 rounded-full flex-shrink-0"
              alt="instructor image"
            />
            <div class="flex-1 flex flex-col">
              <h6 class="text-lg font-bold text-gray-900 dark:text-white">
                @{{ course.data.instructor.handle }}
              </h6>
              <p class="text-gray-700 text-sm mb-4 dark:text-gray-300">
                {{ course.data.instructor.name }}
              </p>
              <p class="text-gray-800 text-base mb-4 dark:text-gray-200">
                {{ course.data.instructor.bio }}
              </p>
              <p
                class="text-gray-700 text-sm flex mb-2 items-center gap-2 dark:text-gray-300"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  stroke="currentColor"
                  stroke-width="2"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="w-5 h-5"
                >
                  <path
                    d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                  ></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                {{ course.data.instructor.location }}
              </p>
              <p
                class="text-gray-700 text-sm flex mb-2 items-center gap-2 dark:text-gray-300"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  stroke="currentColor"
                  stroke-width="2"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="w-5 h-5"
                >
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path
                    d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
                  ></path>
                </svg>
                <span v-if="course.data.instructor.education_level === 'Hs'">
                  Self-taught
                </span>
                <span v-if="course.data.instructor.education_level === 'Aa'">
                  Associate's</span
                >
                <span v-if="course.data.instructor.education_level === 'Ba'">
                  Bachelor's
                </span>
                <span v-if="course.data.instructor.education_level === 'Ma'">
                  Master's
                </span>
                <span v-if="course.data.instructor.education_level === 'Phd'">
                  Doctorate
                </span>
                in
                {{ course.data.instructor.education_major }}
              </p>
              <p
                class="text-gray-700 text-sm flex mb-6 items-center gap-2 dark:text-gray-300"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  stroke="currentColor"
                  stroke-width="2"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="w-5 h-5"
                >
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
                {{ course.data.instructor.occupation }}
              </p>
              <div class="w-full flex justify-end">
                <button
                  @click="
                    $router.push({
                      name: 'profile-about',
                      params: { handle: course.data.instructor.handle }
                    })
                  "
                  type="button"
                  class="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  View Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import useUserStore from '../../stores/user'
import axios from 'axios'
import NavbarComponent from '../../components/NavbarComponent.vue'

const userStore = useUserStore()

const state = reactive({
  loading: true,
  dropdown: false
})
const courses = reactive({
  data: null
})

onMounted(async () => {
  state.loading = true
  try {
    const { data } = await axios.get(`/api/course/me`, {
      headers: {
        Authorization: userStore.getBearerToken
      }
    })
    courses.data = data
  } catch (error) {
    console.log(error)
  } finally {
    state.loading = false
  }
})
</script>

<template>
  <main class="bg-white dark:bg-slate-800">
    <div class="min-h-screen max-w-screen-xl mx-auto">
      <NavbarComponent />
      <div class="container mx-auto px-4 sm:px-2">
        <h1
          class="text-3xl font-black drop-shadow-xl leading-loose text-gray-900 dark:text-white mb-12"
        >
          My Courses
        </h1>

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
        <div
          v-if="!state.loading && !!courses.data"
          class="flex flex-col gap-4 divide-y divide-gray-300 dark:divide-gray-700"
        >
          <div
            v-for="course of courses.data"
            :key="course.id"
            @click="
              $router.push({
                name: 'teach-course-dashboard',
                params: { id: course.id }
              })
            "
            class="cursor-pointer flex items-center justify-between hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700 px-4 py-2 first:rounded-t-lg last:rounded-b-lg"
          >
            <div class="flex items-center">
              <img
                :src="course.image_uri"
                class="w-24 h-24 rounded-full mr-8"
              />
              <span class="text-lg font-medium text-gray-900 dark:text-white">{{
                course.name
              }}</span>
            </div>
            <span class="text-gray-700 text-sm dark:text-gray-300">
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                stroke="currentColor"
                stroke-width="2"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-4 h-4 inline-block mr-3"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              {{ course.participants.length }} participants
            </span>
            <span class="text-gray-700 text-sm dark:text-gray-300">
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                stroke="currentColor"
                stroke-width="2"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-4 h-4 inline-block mr-3"
              >
                <path
                  d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                ></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              {{ !!course.content ? course.content.length : '0' }} pages
            </span>
            <div class="relative">
              <button
                @click.stop="state.dropdown = !state.dropdown"
                type="button"
                class="inline-flex items-center p-2 text-sm text-gray-700 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:ring-gray-400"
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
                  class="w-4 h-4 inline-block"
                >
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="12" cy="5" r="1"></circle>
                  <circle cx="12" cy="19" r="1"></circle>
                </svg>
              </button>
              <div
                v-if="state.dropdown"
                class="absolute mt-2 right-0 z-10 w-52 bg-white rounded shadow-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              >
                <ul class="py-1 text-sm text-gray-700 dark:text-gray-200">
                  <li>
                    <button
                      type="button"
                      @click.stop="
                        $router.push({
                          name: 'learn-course',
                          params: {
                            name: course.name
                          }
                        })
                      "
                      class="block w-full text-start py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Goto Course Page
                    </button>
                  </li>
                  <li>
                    <a
                      href="#"
                      class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >Message Participants</a
                    >
                  </li>
                  <li>
                    <a
                      href="#"
                      class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >Delete Course</a
                    >
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <!-- Empty State -->
        <div v-if="!state.loading && !courses.data">
          <h2 class="text-xl font-medium text-gray-900 dark:text-white mb-12">
            You have no courses yet.
          </h2>
          <router-link
            :to="{ name: 'teach-new-course' }"
            class="mb-12 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Create a course
          </router-link>
        </div>
      </div>
    </div>
  </main>
</template>

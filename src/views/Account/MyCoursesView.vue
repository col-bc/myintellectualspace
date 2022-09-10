<script setup>
import axios from 'axios'
import { onMounted, reactive } from 'vue'
import LoaderComponent from '../../components/LoaderComponent.vue'
import NavbarComponent from '../../components/NavbarComponent.vue'
import useUserStore from '../../stores/user'

const userStore = useUserStore()

const state = reactive({
  loading: true,
  tab: 0
})
const courses = reactive({
  teaching: null,
  learning: null
})

onMounted(async () => {
  state.loading = true
  try {
    const { data } = await axios.get(`/api/course/me`, {
      headers: {
        Authorization: userStore.getBearerToken
      }
    })
    courses.teaching = data.teaching
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
      <div class="container mx-auto px-4">
        <h1
          class="text-3xl font-black drop-shadow-xl leading-loose text-gray-900 dark:text-white my-6"
        >
          My Courses
        </h1>

        <!-- Loading State -->
        <LoaderComponent v-if="state.loading" />

        <div
          class="w-full mb-12 p-1 bg-white shadow-sm rounded-lg border border-gray-300 flex items-center gap-4 overflow-x-auto text-sm font-medium text-center text-gray-700 dark:text-gray-400 dark:border-gray-700 dark:bg-gray-800"
        >
          <button
            type="button"
            @click="state.tab = 0"
            class="inline-flex flex-1 py-1.5 px-5 justify-center rounded-md text-sm"
            :class="[
              state.tab === 0
                ? 'text-white bg-blue-600 active shadow'
                : 'hover:text-gray-900 hover:bg-white dark:hover:bg-gray-800 dark:hover:text-white'
            ]"
          >
            Learning
          </button>
          <button
            type="button"
            @click="state.tab = 1"
            class="inline-flex flex-1 py-1.5 px-5 justify-center rounded-md text-sm"
            :class="[
              state.tab === 1
                ? 'text-white bg-blue-600 active shadow'
                : 'hover:text-gray-900 hover:bg-white dark:hover:bg-gray-800 dark:hover:text-white'
            ]"
          >
            Teaching
          </button>
        </div>

        <div v-if="state.tab === 0">
          <!-- Empty State -->
          <div v-if="!state.loading && !courses.learning">
            <h2 class="text-xl font-medium text-gray-900 dark:text-white mb-12">
              You are not learning any courses.
            </h2>
            <router-link
              :to="{ name: 'learn-home' }"
              class="mb-12 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Explore Courses
            </router-link>
          </div>
        </div>
        <div v-if="state.tab === 1">
          <div
            v-if="!state.loading && !!courses.teaching"
            class="flex flex-col gap-4 mb-12 divide-y divide-gray-300 dark:divide-gray-700"
          >
            <div
              v-for="course of courses.teaching"
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
                <span
                  class="text-lg font-medium text-gray-900 dark:text-white"
                  >{{ course.name }}</span
                >
              </div>
              <div
                class="flex md:flex-1 flex-col md:flex-row items-start gap-2 justify-start md:justify-around"
              >
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
                  {{ !!course.content ? course.content.length : '0' }}
                  lessons
                </span>
              </div>
              <div class="relative">
                <button
                  @click.stop="state.dropdown = !state.dropdown"
                  type="button"
                  class="inline-flex items-center p-4 text-sm text-gray-700 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:text-gray-300 dark:hover:bg-slate-600 dark:focus:ring-gray-400"
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
                              id: course.id
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
          <div v-if="!state.loading && !courses.teaching">
            <h2 class="text-xl font-medium text-gray-900 dark:text-white mb-12">
              You are not teaching anu courses.
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
    </div>
  </main>
</template>

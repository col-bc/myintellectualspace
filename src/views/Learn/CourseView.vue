<script setup>
import axios from 'axios'
import { computed, onMounted, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AlertComponent from '../../components/AlertComponent.vue'
import NavbarComponent from '../../components/NavbarComponent.vue'
import StarsComponent from '../../components/StarsComponent.vue'
import ModalComponent from '../../components/ModalComponent.vue'
import useUserStore from '../../stores/user'

import '@/assets/course_content.css'

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()

const state = reactive({
  loading: true,
  rating: 0,
  showRating: false
})
const course = reactive({
  data: null,
  review: null
})

const isJoined = computed(() => {
  // returns true if user is joined or user is instructor
  if (course.data.instructor.id === userStore.user.id) {
    return true
  } else {
    for (const user of course.data.participants) {
      if (user.id === userStore.user.id) {
        return true
      }
    }
  }
})
onMounted(async () => {
  state.loading = true
  try {
    const { data } = await axios.get(`/api/course/${route.params.id}`, {
      headers: {
        Authorization: userStore.getBearerToken
      }
    })
    course.data = data
    for (var content of course.data.content) {
      content.collapsed = true
    }
  } catch (error) {
    console.log(error)
    if (error.response.status === 404) {
      router.push({ name: 'not-found' })
    }
  } finally {
    state.loading = false
  }
})
watch(course, (value) => {
  if (value.error) {
    setTimeout(() => {
      course.error = null
      course.errorType = null
    }, 5000)
  }
})

function scrollToAlert() {
  const alert = document.querySelector('.alert')
  if (alert) {
    alert.scrollIntoView({ behavior: 'smooth' })
  }
}
async function joinCourse() {
  try {
    await axios.post(
      `/api/course/${route.params.id}/join`,
      {},
      {
        headers: {
          Authorization: userStore.getBearerToken
        }
      }
    )
    course.error = 'You have successfully left the course'
    course.errorType = 'success'
    scrollToAlert()
  } catch (error) {
    console.log(error)
    course.error = error.response.data.error
    course.errorType = 'error'
    scrollToAlert()
  }
}
async function leaveCourse() {
  try {
    await axios.post(
      `/api/course/${route.params.id}/leave`,
      {},
      {
        headers: {
          Authorization: userStore.getBearerToken
        }
      }
    )
    course.error = 'You have successfully left the course'
    course.errorType = 'success'
    scrollToAlert()
  } catch (error) {
    console.log(error)
    course.error = error.response.data.error
    course.errorType = 'error'
    scrollToAlert()
  }
}
async function toggleContentComplete(id) {
  const editing = course.data.content.find((content) => content.id === id)
  try {
    const { data } = await axios.post(
      `/api/course/${route.params.id}/content/${id}/complete`,
      {},
      {
        headers: {
          Authorization: userStore.getBearerToken
        }
      }
    )
    if (data.complete) {
      JSON.parse(editing.completed_by).push(userStore.user.id)
    } else {
      JSON.parse(editing.completed_by).splice(
        JSON.parse(editing.completed_by).indexOf(userStore.user.id),
        1
      )
    }
    course.error = data.complete
      ? 'You have completed the content'
      : 'You have uncompleted the content'
    course.errorType = 'success'
    scrollToAlert()
  } catch (error) {
    console.log(error)
    course.error = error.response.data.error
    course.errorType = 'error'
    scrollToAlert()
  }
}
function saveRating() {}
</script>

<template>
  <main class="bg-white dark:bg-slate-800">
    <div class="min-h-screen">
      <div class="container max-w-screen-xl mx-auto">
        <NavbarComponent />
      </div>
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
        class="w-full h-96 object-cover mb-12"
      />

      <div
        v-if="!state.loading && !!course.data"
        class="container max-w-screen-xl mx-auto px-4 my-6"
      >
        <Transition>
          <AlertComponent
            v-if="!!course.error"
            :message="course.error"
            :type="course.errorType"
            class="mb-6"
          />
        </Transition>

        <div class="flex flex-col md:flex-row gap-12 mb-12 lg:gap-16">
          <div class="flex-1 flex flex-col gap-6">
            <div class="flex items-start justify-between">
              <h1
                class="text-3xl font-black drop-shadow-xl leading-loose text-gray-900 dark:text-white"
              >
                {{ course.data.name }}
              </h1>
              <ModalComponent>
                <template #button>
                  <button
                    type="button"
                    class="flex items-center gap-2.5 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm p-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-6 h-6"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                      <circle cx="6" cy="12" r="3"></circle>
                      <circle cx="18" cy="6" r="3"></circle>
                      <circle cx="18" cy="18" r="3"></circle>
                      <line x1="8.7" y1="10.7" x2="15.3" y2="7.3"></line>
                      <line x1="8.7" y1="13.3" x2="15.3" y2="16.7"></line>
                    </svg>
                    Share
                  </button>
                </template>
                <template #content>
                  <div class="flex flex-col gap-4 p-4">
                    <div
                      class="text-white mx-auto p-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-16 h-16"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <circle cx="6" cy="12" r="3"></circle>
                        <circle cx="18" cy="6" r="3"></circle>
                        <circle cx="18" cy="18" r="3"></circle>
                        <line x1="8.7" y1="10.7" x2="15.3" y2="7.3"></line>
                        <line x1="8.7" y1="13.3" x2="15.3" y2="16.7"></line>
                      </svg>
                    </div>
                    <h3 class="text-2xl text-center font-bold dark:text-white">
                      Share this Course
                    </h3>
                    <div class="w-full">
                      <label
                        class="block text-sm text-gray-700 font-medium mb-2 dark:text-gray-300"
                        >Url</label
                      >
                      <p
                        class="w-full block bg-gray-800 text-white font-mono p-2.5 select-all rounded-lg dark:bg-gray-700"
                      >
                        https://myintellectualspace.com{{ route.path }}
                      </p>
                    </div>
                    <div class="w-full">
                      <label
                        class="block text-sm text-gray-700 font-medium mb-2 dark:text-gray-300"
                        >Message</label
                      >
                      <p
                        class="w-full block bg-gray-800 text-white p-2.5 select-all rounded-lg dark:bg-gray-700"
                      >
                        Check out this course on My Intellectual Space!
                        <span class="font-mono">
                          https://myintellectualspace.com{{ route.path }}</span
                        >
                      </p>
                    </div>
                    <div class="flex items-center justify-between w-full">
                      <button
                        type="button"
                        class="p-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="w-8 h-8"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          stroke-width="2"
                          stroke="currentColor"
                          fill="none"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path
                            stroke="none"
                            d="M0 0h24v24H0z"
                            fill="none"
                          ></path>
                          <path
                            d="M12 20l-3 -3h-2a3 3 0 0 1 -3 -3v-6a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-2l-3 3"
                          ></path>
                          <line x1="8" y1="9" x2="16" y2="9"></line>
                          <line x1="8" y1="13" x2="14" y2="13"></line>
                        </svg>
                      </button>
                      <button
                        type="button"
                        class="p-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="w-8 h-8"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          stroke-width="2"
                          stroke="currentColor"
                          fill="none"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path
                            stroke="none"
                            d="M0 0h24v24H0z"
                            fill="none"
                          ></path>
                          <rect
                            x="3"
                            y="5"
                            width="18"
                            height="14"
                            rx="2"
                          ></rect>
                          <polyline points="3 7 12 13 21 7"></polyline>
                        </svg>
                      </button>
                      <button
                        type="button"
                        class="p-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="w-8 h-8"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          stroke-width="2"
                          stroke="currentColor"
                          fill="none"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path
                            stroke="none"
                            d="M0 0h24v24H0z"
                            fill="none"
                          ></path>
                          <path
                            d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3"
                          ></path>
                        </svg>
                      </button>
                      <button
                        type="button"
                        class="p-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="w-81 h-8"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          stroke-width="2"
                          stroke="currentColor"
                          fill="none"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path
                            stroke="none"
                            d="M0 0h24v24H0z"
                            fill="none"
                          ></path>
                          <path
                            d="M22 4.01c-1 .49 -1.98 .689 -3 .99c-1.121 -1.265 -2.783 -1.335 -4.38 -.737s-2.643 2.06 -2.62 3.737v1c-3.245 .083 -6.135 -1.395 -8 -4c0 0 -4.182 7.433 4 11c-1.872 1.247 -3.739 2.088 -6 2c3.308 1.803 6.913 2.423 10.034 1.517c3.58 -1.04 6.522 -3.723 7.651 -7.742a13.84 13.84 0 0 0 .497 -3.753c-.002 -.249 1.51 -2.772 1.818 -4.013z"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </template>
              </ModalComponent>
            </div>
            <p class="text-gray-700 leading-loose dark:text-gray-300">
              {{ course.data.description }}
            </p>
            <p class="flex items-center gap-2 flex-wrap">
              <span
                class="bg-blue-300 text-blue-800 font-medium px-2.5 py-0.5 rounded dark:bg-blue-300 dark:text-blue-900"
                >{{
                  course.data.price === 0.0
                    ? 'FREE'
                    : `$ ${course.data.price} USD`
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
            <div class="flex items-center dark:text-gray-300">
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                stroke-width="2"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-6 h-6 fill-yellow-500"
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
            <div>
              <button
                type="button"
                @click="state.showRating = true"
                v-if="!state.showRating"
                class="text-blue-600 hover:underline dark:text-blue-400"
              >
                Write a review
              </button>
            </div>
            <div
              v-if="state.showRating"
              class="flex flex-col gap-4 p-4 border rounded-lg dark:bg-gray-800 border-gray-300 dark:border-gray-700"
            >
              <h4 class="text-lg font-bold text-gray-900 dark:text-white">
                Write a review
              </h4>
              <StarsComponent @rated="(rating) => setRating(rating)" />
              <textarea
                class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Your comments"
                rows="4"
                v-model="course.rating"
              ></textarea>
              <div class="flex items-center gap-4">
                <button
                  type="button"
                  class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  Post Review
                </button>
                <button
                  type="button"
                  @click="state.showRating = false"
                  class="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
          <div class="flex-1 md:max-w-sm flex flex-col gap-6">
            <button
              type="button"
              v-if="!isJoined"
              @click="joinCourse()"
              class="shadow-lg py-3 px-5 text-base font-semibold text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <span
                class="bg-gray-100 text-gray-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300"
              >
                {{
                  course.data.price === 0.0 ? 'FREE' : `$${course.data.price}`
                }}
              </span>
              Join Course
            </button>
            <button
              type="button"
              @click="leaveCourse()"
              v-else
              class="shadow-lg py-3 px-5 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
            >
              Leave Course
            </button>
            <h4
              class="text-xl font-black drop-shadow-xl leading-loose text-gray-900 dark:text-white"
            >
              Meet Your Instructor
            </h4>
            <div class="flex flex-col items-start">
              <div class="flex items-start gap-4">
                <img
                  :src="course.data.instructor.avatar_uri"
                  class="w-12 h-12 rounded-full flex-shrink-0"
                  alt="instructor image"
                />
                <div>
                  <h6 class="text-lg font-bold text-gray-900 dark:text-white">
                    @{{ course.data.instructor.handle }}
                  </h6>
                  <p class="text-gray-700 text-sm mb-4 dark:text-gray-300">
                    {{ course.data.instructor.name }}
                  </p>
                </div>
              </div>

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
              <div class="w-full flex justify-start">
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

        <AlertComponent
          v-if="!isJoined"
          message="Join this course to view it's content."
          type="primary"
          class="mb-12"
        />

        <div v-else class="flex flex-col md:flex-row items-start gap-12 mb-24">
          <div
            class="w-full md:w-48 shadow-sm flex-shrink-0 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-700 dark:text-white"
          >
            <a
              href="#"
              class="block py-2 px-4 w-full rounded-t-lg border-b border-gray-200 cursor-pointer hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
            >
              All Content
            </a>
            <a
              href="#"
              class="block py-2 px-4 w-full border-b border-gray-200 cursor-pointer hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
            >
              Reading
            </a>
            <a
              href="#"
              class="block py-2 px-4 w-full border-b border-gray-200 cursor-pointer hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
            >
              Videos
            </a>
            <a
              href="#"
              class="block py-2 px-4 w-full border-b border-gray-200 cursor-pointer hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
            >
              Meetings
            </a>
            <a
              href="#"
              class="block py-2 px-4 w-full rounded-b-lg cursor-pointer hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
            >
              Assessments
            </a>
          </div>

          <div
            v-for="content of course.data.content"
            :key="content.id"
            class="w-full flex flex-col gap-4 p-2.5 bg-white shadow-sm border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700"
          >
            <div class="flex items-center justify-between px-2.5">
              <h6
                class="inline-flex items-center text-lg font-bold text-gray-900 dark:text-gray-300"
              >
                <span
                  v-if="
                    JSON.parse(content.completed_by).includes(userStore.user.id)
                  "
                  class="mr-3 bg-green-500 text-white p-1 rounded-full dark:bg-green-400 dark:text-gray-900"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-4 h-4"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M5 12l5 5l10 -10"></path></svg
                ></span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-6 h-6 mr-3"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                  <path
                    d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"
                  ></path>
                  <line x1="9" y1="9" x2="10" y2="9"></line>
                  <line x1="9" y1="13" x2="15" y2="13"></line>
                  <line x1="9" y1="17" x2="15" y2="17"></line>
                </svg>
                {{ content.title }}
              </h6>
              <div class="flex items-center gap-4">
                <p class="text-gray-700 dark:text-gray-400">
                  {{ new Date(content.created_at).toLocaleDateString() }} @
                  {{ new Date(content.created_at).toLocaleTimeString() }}
                </p>
                <button
                  type="button"
                  @click="content.expanded = !content.expanded"
                  class="p-2.5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-4 h-4"
                    :class="{ 'rotate-180': content.expanded }"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
              </div>
            </div>
            <div
              v-if="content.expanded"
              class="course-content py-2.5 border-y border-gray-300 dark:border-gray-700"
              v-html="content.body"
            ></div>
            <div
              v-if="content.expanded"
              class="flex items-center justify-between gap-4 b px-2.5"
            >
              <button
                type="button"
                v-if="
                  !JSON.parse(content.completed_by).includes(userStore.user.id)
                "
                @click="toggleContentComplete(content.id)"
                class="inline-flex items-center gap-3 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <rect x="4" y="4" width="16" height="16" rx="2"></rect>
                  <path d="M9 12l2 2l4 -4"></path>
                </svg>
                Mark Complete
              </button>
              <button
                type="button"
                v-else
                @click="toggleContentComplete(content.id)"
                class="py-2.5 px-5 flex items-center gap-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <rect x="4" y="4" width="16" height="16" rx="2"></rect>
                </svg>
                Mark Incomplete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.25s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>

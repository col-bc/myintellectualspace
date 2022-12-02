<script setup>
import axios from 'axios'
import { computed, onMounted, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AlertComponent from '@/components/AlertComponent.vue'
import LoaderComponent from '@/components/LoaderComponent.vue'
import ModalComponent from '@/components/ModalComponent.vue'
import NavbarComponent from '@/components/NavbarComponent.vue'
import StarsComponent from '@/components/StarsComponent.vue'
import useUserStore from '@/stores/user'

import '@/assets/course_content.css'
import UserCardComponent from '../../components/UserCardComponent.vue'

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
  if (!userStore.user) return false
  else if (course.data.instructor.id === userStore.user.id) {
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
  if (!userStore.user) {
    router.push({ name: 'login', query: { next: route.fullPath } })
    return
  }
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
    setTimeout(() => {
      router.go(0)
    }, 1000)
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
    setTimeout(() => {
      router.go(0)
    }, 1000)
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
    <div class="min-h-screen container max-w-screen-xl mx-auto">
      <NavbarComponent />
      <!-- Loading State -->
      <LoaderComponent v-if="state.loading" class="py-12" />
      <div
        v-if="!state.loading && !!course.data"
        class="container mx-auto px-4"
      >
        <img
          :src="course.data.image_uri"
          alt="course image"
          class="w-full h-96 rounded-xl shadow-lg object-cover my-12"
        />
        <AlertComponent
          v-if="!!course.error"
          :message="course.error"
          :type="course.errorType"
          class="mb-6"
        />

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
                      viewBox="0 0 24 24"
                      class="w-6 h-6 fill-current"
                      width="24"
                      height="24"
                    >
                      <path fill="none" d="M0 0h24v24H0z" />
                      <path
                        d="M13.12 17.023l-4.199-2.29a4 4 0 1 1 0-5.465l4.2-2.29a4 4 0 1 1 .959 1.755l-4.2 2.29a4.008 4.008 0 0 1 0 1.954l4.199 2.29a4 4 0 1 1-.959 1.755zM6 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm11-6a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
                      />
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
                        viewBox="0 0 24 24"
                        class="w-16 h-16 fill-current"
                        width="24"
                        height="24"
                      >
                        <path fill="none" d="M0 0h24v24H0z" />
                        <path
                          d="M13.12 17.023l-4.199-2.29a4 4 0 1 1 0-5.465l4.2-2.29a4 4 0 1 1 .959 1.755l-4.2 2.29a4.008 4.008 0 0 1 0 1.954l4.199 2.29a4 4 0 1 1-.959 1.755zM6 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm11-6a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
                        />
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
                          viewBox="0 0 24 24"
                          class="w-8 h-6 fill-current"
                          width="24"
                          height="24"
                        >
                          <path fill="none" d="M0 0h24v24H0z" />
                          <path
                            d="M6.455 19L2 22.5V4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6.455zm-.692-2H20V5H4v13.385L5.763 17zM8 10h8v2H8v-2z"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        class="p-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          class="w-8 h-6 fill-current"
                          width="24"
                          height="24"
                        >
                          <path fill="none" d="M0 0h24v24H0z" />
                          <path
                            d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm17 4.238l-7.928 7.1L4 7.216V19h16V7.238zM4.511 5l7.55 6.662L19.502 5H4.511z"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        class="p-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          class="w-8 h-6 fill-current"
                          width="24"
                          height="24"
                        >
                          <path fill="none" d="M0 0h24v24H0z" />
                          <path
                            d="M13 9h4.5l-.5 2h-4v9h-2v-9H7V9h4V7.128c0-1.783.186-2.43.534-3.082a3.635 3.635 0 0 1 1.512-1.512C13.698 2.186 14.345 2 16.128 2c.522 0 .98.05 1.372.15V4h-1.372c-1.324 0-1.727.078-2.138.298-.304.162-.53.388-.692.692-.22.411-.298.814-.298 2.138V9z"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        class="p-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          class="w-8 h-6 fill-current"
                          width="24"
                          height="24"
                        >
                          <path fill="none" d="M0 0h24v24H0z" />
                          <path
                            d="M15.3 5.55a2.9 2.9 0 0 0-2.9 2.847l-.028 1.575a.6.6 0 0 1-.68.583l-1.561-.212c-2.054-.28-4.022-1.226-5.91-2.799-.598 3.31.57 5.603 3.383 7.372l1.747 1.098a.6.6 0 0 1 .034.993L7.793 18.17c.947.059 1.846.017 2.592-.131 4.718-.942 7.855-4.492 7.855-10.348 0-.478-1.012-2.141-2.94-2.141zm-4.9 2.81a4.9 4.9 0 0 1 8.385-3.355c.711-.005 1.316.175 2.669-.645-.335 1.64-.5 2.352-1.214 3.331 0 7.642-4.697 11.358-9.463 12.309-3.268.652-8.02-.419-9.382-1.841.694-.054 3.514-.357 5.144-1.55C5.16 15.7-.329 12.47 3.278 3.786c1.693 1.977 3.41 3.323 5.15 4.037 1.158.475 1.442.465 1.973.538z"
                          />
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
            <p
              class="flex items-center gap-3 font-medium text-gray-700 dark:text-gray-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                class="w-5 h-5 fill-current"
                width="24"
                height="24"
              >
                <path fill="none" d="M0 0h24v24H0z" />
                <path
                  d="M2 22a8 8 0 1 1 16 0h-2a6 6 0 1 0-12 0H2zm8-9c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm8.284 3.703A8.002 8.002 0 0 1 23 22h-2a6.001 6.001 0 0 0-3.537-5.473l.82-1.824zm-.688-11.29A5.5 5.5 0 0 1 21 8.5a5.499 5.499 0 0 1-5 5.478v-2.013a3.5 3.5 0 0 0 1.041-6.609l.555-1.943z"
                />
              </svg>
              {{ !!course.participants ? course.participants.length : 0 }}
              participants
            </p>
            <p
              class="flex items-center gap-3 font-medium text-gray-700 dark:text-gray-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                class="w-5 h-5 fill-current"
                width="24"
                height="24"
              >
                <path fill="none" d="M0 0h24v24H0z" />
                <path
                  d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-8h4v2h-6V7h2v5z"
                />
              </svg>
              {{ course.data.duration }} to complete
            </p>
            <div class="flex items-center dark:text-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                class="w-5 h-5 fill-current"
                width="24"
                height="24"
              >
                <path fill="none" d="M0 0h24v24H0z" />
                <path
                  d="M12 18.26l-7.053 3.948 1.575-7.928L.587 8.792l8.027-.952L12 .5l3.386 7.34 8.027.952-5.935 5.488 1.575 7.928L12 18.26zm0-2.292l4.247 2.377-.949-4.773 3.573-3.305-4.833-.573L12 5.275l-2.038 4.42-4.833.572 3.573 3.305-.949 4.773L12 15.968z"
                />
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
            <div v-if="isJoined">
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
            <UserCardComponent :user="course.data.instructor" />
          </div>
        </div>

        <hr class="my-12 h-px bg-gray-200 border-0 dark:bg-gray-700" />

        <h2 class="mb-12 text-2xl font-bold text-gray-900 dark:text-white">
          Course Content
        </h2>

        <div
          class="flex items-center text-gray-700 dark:text-gray-300 gap-4 mb-24"
          v-if="!isJoined"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="w-6 h-6 fill-current"
            width="24"
            height="24"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path
              d="M19 10h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V11a1 1 0 0 1 1-1h1V9a7 7 0 1 1 14 0v1zM5 12v8h14v-8H5zm6 2h2v4h-2v-4zm6-4V9A5 5 0 0 0 7 9v1h10z"
            />
          </svg>
          <p>
            You need to join this course
            <span v-if="!userStore.isLoggedIn">
              or
              <router-link
                to="/login"
                class="text-blue-700 hover:underline dark:text-blue-400"
                >login</router-link
              >
            </span>
            to view this content.
          </p>
        </div>

        <div v-else class="flex flex-col md:flex-row items-start gap-12 mb-24">
          <!-- Filter -->
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
          <!-- Empty state -->
          <div
            v-if="!course.data.content.length"
            class="w-full md:w-3/4 flex flex-col items-center justify-center"
          >
            <h5 class="text-lg font-medium text-gray-900 dark:text-white">
              No content yet
            </h5>
          </div>
          <!-- Content -->
          <div class="flex flex-col gap-6 w-full">
            <div
              v-for="content of course.data.content"
              :key="content.id"
              class="w-full flex flex-col gap-4 p-4 bg-white shadow-sm border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700"
            >
              <div class="flex items-center justify-between px-4">
                <h6
                  class="inline-flex items-center text-lg font-bold text-gray-900 dark:text-gray-300"
                >
                  <span
                    v-if="
                      JSON.parse(content.completed_by).includes(
                        userStore.user.id
                      )
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
                    viewBox="0 0 24 24"
                    class="w-6 h-6 mr-3 fill-current"
                    width="24"
                    height="24"
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path
                      d="M21 8v12.993A1 1 0 0 1 20.007 22H3.993A.993.993 0 0 1 3 21.008V2.992C3 2.455 3.449 2 4.002 2h10.995L21 8zm-2 1h-5V4H5v16h14V9zM8 7h3v2H8V7zm0 4h8v2H8v-2zm0 4h8v2H8v-2z"
                    />
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
                      class="w-4 h-4 fill-current"
                      :class="{ 'rotate-180': content.expanded }"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                    >
                      <path fill="none" d="M0 0h24v24H0z" />
                      <path
                        d="M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div
                v-if="content.expanded"
                class="course-content p-4 border-y border-gray-300 dark:border-gray-700"
                v-html="content.body"
              ></div>
              <div
                v-if="content.expanded"
                class="flex items-center justify-between gap-4 px-4"
              >
                <button
                  type="button"
                  @click="toggleContentComplete(content.id)"
                  class="inline-flex items-center gap-2.5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    class="w-6 h-6 fill-current mr-2"
                    width="24"
                    height="24"
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path
                      d="M11.602 13.76l1.412 1.412 8.466-8.466 1.414 1.414-9.88 9.88-6.364-6.364 1.414-1.414 2.125 2.125 1.413 1.412zm.002-2.828l4.952-4.953 1.41 1.41-4.952 4.953-1.41-1.41zm-2.827 5.655L7.364 18 1 11.636l1.414-1.414 1.413 1.413-.001.001 4.951 4.951z"
                    />
                  </svg>
                  <span
                    v-if="
                      JSON.parse(content.completed_by).includes(
                        userStore.user.id
                      )
                    "
                  >
                    Mark as incomplete
                  </span>
                  <span v-else> Mark as complete </span>
                </button>
              </div>
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

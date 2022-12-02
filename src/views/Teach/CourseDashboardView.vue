<script setup>
import Editor from '@tinymce/tinymce-vue'
import axios from 'axios'
import { onMounted, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AlertComponent from '@/components/AlertComponent.vue'
import LoaderComponent from '@/components/LoaderComponent.vue'
import ModalComponent from '@/components/ModalComponent.vue'
import NavbarComponent from '@/components/NavbarComponent.vue'
import useUserStore from '@/stores/user'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'

import '@/assets/course_content.css'
import UserCardComponent from '../../components/UserCardComponent.vue'

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()

const state = reactive({
  loading: true,
  tab: 0,
  showDropdown: false,
  error: null,
  errorType: null
})
const course = reactive({
  data: null,
  editor: null,
  meeting: null,
  assessment: null
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
  // Auto dismiss error message after 5 seconds
  if (!!value.newContent && !!value.newContent.error) {
    setTimeout(() => {
      course.newContent.error = null
    }, 5000)
  }
})
watch(state, (value) => {
  // Auto dismiss error message after 5 seconds
  if (!!value.error) {
    setTimeout(() => {
      state.error = null
      state.errorType = null
    }, 5000)
  }
})

// Content editor methods
function newContent() {
  state.showDropdown = false
  course.meeting = null
  course.assessment = null
  course.editor = {
    title: '',
    body: '',
    error: null
  }
}
function setEditor(id) {
  const editing = course.data.content.find((content) => content.id === id)
  course.editor = {
    id: id,
    body: editing.body,
    title: editing.title,
    date: editing.created_at
  }
  const tabsEl = document.querySelector('#tabs')
  tabsEl.scrollIntoView({ behavior: 'smooth' })
}
function clearEditor() {
  course.editor = null
}
async function saveContent() {
  course.editor.error = null
  if (!course.editor.title) {
    course.editor.error = 'Title is required'
    return
  }

  // check if updating or saving content
  if (!!course.editor.id) {
    // send PUT request to update content
    try {
      const { data } = await axios.put(
        `/api/course/${route.params.id}/content/${course.editor.id}`,
        {
          title: course.editor.title,
          body: course.editor.body
        },
        {
          headers: {
            Authorization: userStore.getBearerToken
          }
        }
      )
      course.data.content.find(
        (content) => content.id === course.editor.id
      )[0] = data.content
      clearEditor()
      state.error = 'Content updated successfully'
      state.errorType = 'success'
    } catch (error) {
      console.log(error)
      state.error = error.response.data.message
      state.errorType = 'danger'
    }
  } else {
    try {
      // set POST request to create
      const { data } = await axios.post(
        `/api/course/${route.params.id}/content`,
        {
          title: course.editor.title,
          type: course.editor.type,
          body: course.editor.body
        },
        {
          headers: {
            Authorization: userStore.getBearerToken
          }
        }
      )
      course.data = data.course
      clearEditor()
    } catch (error) {
      console.log(error)
      course.editor.error = error.response.data.error
      state.errorType = 'danger'
    }
  }
}
async function deleteContent(index) {
  console.log(course.data.content)
  try {
    await axios.delete(`/api/course/${route.params.id}/content/${index}`, {
      headers: {
        Authorization: userStore.getBearerToken
      }
    })
    course.data.content.split(contentIndex, 1)
    state.errorType = 'success'
    state.error = 'Content deleted successfully'
  } catch (error) {
    console.log(error)
    state.error = error.response.data.error
    state.errorType = 'error'
  }
}
// Meeting content methods
function newMeeting() {
  state.showDropdown = false
  course.editor = null
  course.assessment = null
  course.meeting = {
    title: '',
    description: '',
    date: '',
    error: null
  }
}
function setMeeting(id) {
  const meeting = course.data.meetings.find((meeting) => meeting.id === id)
  course.meeting = {
    id: id,
    title: meeting.title,
    description: meeting.description,
    date: meeting.date,
    duration: meeting.duration,
    error: null
  }
}
function clearMeeting() {
  course.meeting = null
}
async function saveMeeting() {
  course.meeting.error = null
  if (!course.meeting.title) {
    course.meeting.error = 'Title is required'
    return
  }
  if (!course.meeting.description) {
    course.meeting.error = 'Description is required'
    return
  }
  if (!course.meeting.date) {
    course.meeting.error = 'Date is required'
    return
  }
  if (!course.meeting.duration) {
    course.meeting.error = 'Duration is required'
    return
  }
  if (!!course.meeting.id) {
    // send PUT request to update meeting
  } else {
    // set POST request to create meeting
  }
}
// Settings methods
async function updateCourse() {
  const formData = new FormData()
  formData.append('description', course.data.description)
  if (!!document.querySelector('#update-course-image').files[0]) {
    formData.append(
      'image',
      document.querySelector('#update-course-image').files[0]
    )
  }
  formData.append('price', course.data.price)
  formData.append('duration', course.data.duration)
  formData.append('category', course.data.category)
  formData.append('difficulty', course.data.difficulty)

  try {
    const { data } = await axios.put(
      `/api/course/${course.data.id}`,
      formData,
      {
        headers: {
          Authorization: userStore.getBearerToken,
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    course.data = data.course
    state.errorType = 'success'
    state.error = 'Course updated successfully'
  } catch (error) {
    console.log(error)
    state.error = error.response.data.error
    state.errorType = 'error'
  }
}
</script>

<template>
  <main class="bg-white dark:bg-slate-800">
    <div class="min-h-screen max-w-screen-xl mx-auto">
      <NavbarComponent />
      <div class="container mx-auto my-12 px-4 mb-24">
        <LoaderComponent v-if="state.loading" />
        <div v-if="!state.loading && !!course.data">
          <!-- Jumbotron -->
          <div
            class="flex flex-col-reverse lg:flex-row gap-12 justify-between items-start mb-12"
          >
            <div class="space-y-6">
              <h1
                class="text-3xl font-black drop-shadow-xl leading-loose text-gray-900 dark:text-white"
              >
                {{ course.data.name }} Dashboard
              </h1>
              <p
                class="text-gray-700 text-lg font-medium leading-relaxed dark:text-gray-300"
              >
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
                {{
                  !!course.data.participants
                    ? course.data.participants.length
                    : 0
                }}
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
                  {{ course.data.duration }}
                  to complete</span
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
            <div class="space-y-6 w-full lg:max-w-xl">
              <img
                :src="course.data.image_uri"
                class="w-full h-full object-cover mb-4 rounded-2xl"
              />
              <router-link
                :to="{
                  name: 'learn-course',
                  params: { name: course.data.name }
                }"
                class="block w-full text-center text-blue-700 hover:underline dark:text-blue-400"
                >Go to Course Home</router-link
              >
            </div>
          </div>

          <!-- Tabs -->
          <div
            id="tabs"
            class="sticky top-0 z-20 bg-gray-100 shadow-md rounded-md border border-gray-200 flex flex-col gap-6 mb-6 dark:bg-gray-700 dark:border-gray-600"
          >
            <div class="flex items-center gap-4">
              <ul
                id="course-tabs"
                class="flex-1 flex flex-wrap gap-2.5 p-2.5 text-sm font-medium text-center text-gray-500 dark:text-gray-400"
              >
                <li>
                  <button
                    type="button"
                    @click="state.tab = 0"
                    class="inline-block py-3 px-4 rounded-lg"
                    :class="[
                      state.tab === 0
                        ? ' text-white bg-blue-600 shadow-m active'
                        : ' hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white'
                    ]"
                  >
                    Content
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    @click="state.tab = 1"
                    class="inline-block py-3 px-4 rounded-lg"
                    :class="[
                      state.tab === 1
                        ? ' text-white bg-blue-600 shadow-m active'
                        : ' hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white'
                    ]"
                  >
                    Reviews
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    @click="state.tab = 2"
                    class="inline-block py-3 px-4 rounded-lg"
                    :class="[
                      state.tab === 2
                        ? ' text-white bg-blue-600 shadow-md active'
                        : ' hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white'
                    ]"
                  >
                    Participants
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    @click="state.tab = 3"
                    class="inline-block py-3 px-4 rounded-lg"
                    :class="[
                      state.tab === 3
                        ? ' text-white bg-blue-600 shadow-md active'
                        : ' hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white'
                    ]"
                  >
                    Settings
                  </button>
                </li>
              </ul>
              <Menu as="div" class="relative">
                <MenuButton>
                  <button
                    type="button"
                    class="shadow-lg inline-flex items-center py-2.5 px-5 mx-2.5 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      class="w-6 h-6 fill-current mr-3"
                      width="24"
                      height="24"
                    >
                      <path fill="none" d="M0 0h24v24H0z" />
                      <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z" />
                    </svg>
                    Add Content
                  </button>
                </MenuButton>
                <MenuItems
                  class="absolute right-2 mt-2 py-1 w-auto origin-top-right divide-y divide-gray-100 dark:divide-gray-600 rounded bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10 border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                >
                  <MenuItem
                    as="button"
                    @click="newContent()"
                    class="inline-flex items-center w-full text-start py-2 px-4 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      class="w-6 h-6 fill-current mr-3"
                      width="24"
                      height="24"
                    >
                      <path fill="none" d="M0 0h24v24H0z" />
                      <path
                        d="M21 8v12.993A1 1 0 0 1 20.007 22H3.993A.993.993 0 0 1 3 21.008V2.992C3 2.455 3.449 2 4.002 2h10.995L21 8zm-2 1h-5V4H5v16h14V9zM8 7h3v2H8V7zm0 4h8v2H8v-2zm0 4h8v2H8v-2z"
                      />
                    </svg>
                    Text Content
                  </MenuItem>
                  <MenuItem
                    as="button"
                    @click="newMeeting()"
                    class="inline-flex items-center w-full text-start py-2 px-4 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      class="w-6 h-6 fill-current mr-3"
                      width="24"
                      height="24"
                    >
                      <path fill="none" d="M0 0h24v24H0z" />
                      <path
                        d="M17 9.2l5.213-3.65a.5.5 0 0 1 .787.41v12.08a.5.5 0 0 1-.787.41L17 14.8V19a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v4.2zm0 3.159l4 2.8V8.84l-4 2.8v.718zM3 6v12h12V6H3zm2 2h2v2H5V8z"
                      />
                    </svg>
                    Meeting
                  </MenuItem>
                  <MenuItem
                    as="button"
                    @click="$router.push({ name: 'teach-create-assessment' })"
                    class="inline-flex items-center w-full text-start py-2 px-4 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      class="w-6 h-6 fill-current mr-3"
                      width="24"
                      height="24"
                    >
                      <path fill="none" d="M0 0h24v24H0z" />
                      <path
                        d="M11 4h10v2H11V4zm0 4h6v2h-6V8zm0 6h10v2H11v-2zm0 4h6v2h-6v-2zM3 4h6v6H3V4zm2 2v2h2V6H5zm-2 8h6v6H3v-6zm2 2v2h2v-2H5z"
                      />
                    </svg>
                    Assessment
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          </div>

          <AlertComponent
            :message="state.error"
            v-if="!!state.error"
            :type="state.errorType"
            :dismissible="true"
          />

          <!-- Content editor -->
          <Transition>
            <form
              v-if="!!course.editor"
              @submit.prevent="saveContent()"
              class="flex flex-col gap-6 mb-6"
            >
              <AlertComponent
                v-if="!!course.editor && !!course.editor.error"
                :message="course.editor.error"
                type="error"
              />
              <div class="flex items-center gap-6">
                <div class="flex-1">
                  <label
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >Content Title</label
                  >
                  <input
                    type="text"
                    v-model="course.editor.title"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                <div class="flex-1">
                  <div>
                    <label
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >Date</label
                    >
                    <input
                      type="text"
                      disabled
                      name="date"
                      class="cursor-not-allowed bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      :value="new Date().toISOString().split('T')[0]"
                    />
                  </div>
                </div>
              </div>
              <editor
                v-model="course.editor.body"
                api-key="8azlju673ibdtyv28md61v0t568tztcnr4ojvceomyy6bkib"
                :init="{
                  height: 500,
                  plugins: [
                    'advlist',
                    'autolink',
                    'lists',
                    'link',
                    'image',
                    'charmap',
                    'preview',
                    'anchor',
                    'searchreplace',
                    'visualblocks',
                    'codesample',
                    'fullscreen',
                    'insertdatetime',
                    'media',
                    'table',
                    'help',
                    'wordcount'
                  ],
                  toolbar:
                    'undo redo | blocks | ' +
                    'bold italic backcolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | codesample | help'
                }"
              />
              <div class="flex items-center gap-6">
                <button
                  type="submit"
                  class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Save and Publish
                </button>
                <button
                  type="button"
                  @click="clearEditor()"
                  class="py-2.5 px-5 flex items-center gap-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </Transition>

          <!-- Meeting form -->
          <Transition>
            <form
              v-if="!!course.meeting"
              @submit.prevent="saveMeeting()"
              class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
            >
              <AlertComponent
                v-if="!!course.meeting && !!course.meeting.error"
                :message="course.meeting.error"
                :type="course.meeting.errorType"
                class="md:col-span-2"
              />
              <div>
                <label
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Meeting Title
                </label>
                <input
                  type="text"
                  v-model="course.meeting.title"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Date
                </label>
                <input
                  type="datetime-local"
                  v-model="course.meeting.date"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
              <div class="md:col-span-2">
                <label
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Description
                </label>
                <textarea
                  v-model="course.meeting.description"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  rows="4"
                ></textarea>
              </div>
              <div class="flex items-center gap-6">
                <button
                  type="submit"
                  class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Save and Schedule
                </button>
                <button
                  type="button"
                  @click="clearMeeting()"
                  class="py-2.5 px-5 flex items-center gap-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </Transition>

          <!-- Content list -->
          <Transition>
            <div v-if="state.tab === 0" class="flex flex-col gap-6 mb-6">
              <h4
                class="text-xl font-black drop-shadow-xl leading-loose text-gray-900 dark:text-white"
              >
                Course Content
              </h4>

              <div
                v-if="course.data.content.length === 0"
                class="flex flex-col gap-6"
              >
                <p class="text-gray-700 dark:text-gray-400">
                  No content has been added to this course yet.
                </p>
              </div>
              <div
                v-for="content of course.data.content"
                :key="content.id"
                class="flex flex-col gap-4 p-2.5 bg-white shadow-sm border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700"
              >
                <div class="flex items-center justify-between px-2.5">
                  <h6
                    class="inline-flex items-center text-lg font-bold text-gray-900 dark:text-gray-300"
                  >
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
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
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
                  <div class="flex items-center gap-4">
                    <button
                      type="button"
                      @click="setEditor(content.id)"
                      class="py-2.5 px-5 flex items-center gap-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
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
                        class="w-4 h-4"
                      >
                        <path
                          d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                        ></path>
                        <path
                          d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                        ></path>
                      </svg>
                      Edit
                    </button>
                    <ModalComponent>
                      <template #button>
                        <button
                          type="button"
                          class="inline-flex gap-2.5 text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
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
                            class="w-h h-4"
                          >
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path
                              d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                            ></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                          Delete
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
                              <path d="M4 7h16"></path>
                              <path
                                d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"
                              ></path>
                              <path
                                d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"
                              ></path>
                              <path d="M10 12l4 4m0 -4l-4 4"></path>
                            </svg>
                          </div>
                          <h3
                            class="text-2xl text-center font-bold dark:text-white"
                          >
                            Are you sure you want to delete this content?
                          </h3>
                          <p
                            class="text-center text-gray-700 dark:text-gray-300"
                          >
                            <span class="font-bold"
                              >This action cannot be undone</span
                            >. The content and all associated data will be
                            permanently deleted for all participants.
                          </p>
                        </div>
                      </template>
                      <template #actions>
                        <button
                          type="button"
                          @click="deleteContent(content.id)"
                          class="inline-flex justify-center items-center gap-2.5 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                        >
                          Yes. I want to permanently delete this content.
                        </button>
                      </template>
                    </ModalComponent>
                  </div>
                  <ModalComponent>
                    <template #button>
                      <button
                        type="button"
                        class="ml-auto py-2.5 px-5 flex items-center gap-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
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
                          <path
                            stroke="none"
                            d="M0 0h24v24H0z"
                            fill="none"
                          ></path>
                          <path d="M7 12l5 5l10 -10"></path>
                          <path d="M2 12l5 5m5 -5l5 -5"></path>
                        </svg>
                        Completed by
                      </button>
                    </template>
                    <template #content>
                      <h3
                        class="text-2xl text-center font-bold dark:text-white mb-6"
                      >
                        Completed by
                      </h3>
                      <p
                        v-if="
                          !content.completed_by ||
                          JSON.parse(content.completed_by).length === 0
                        "
                        class="text-center text-gray-700 dark:text-gray-300"
                      >
                        No one has completed this content yet.
                      </p>
                      <div
                        v-for="user in JSON.parse(content.completed_by)"
                        :key="user"
                      >
                        {{ user }}
                      </div>
                    </template>
                  </ModalComponent>
                </div>
              </div>
            </div>
          </Transition>

          <!-- Reviews -->
          <Transition>
            <div v-if="state.tab === 1" class="flex flex-col gap-6 mb-6">
              <h4
                class="text-xl font-black drop-shadow-xl leading-loose text-gray-900 dark:text-white"
              >
                Reviews
              </h4>
            </div>
          </Transition>

          <!-- Participants -->
          <Transition>
            <div
              v-if="state.tab === 2"
              class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
            >
              <h4
                class="md:col-span-2 text-xl font-black drop-shadow-xl leading-loose text-gray-900 dark:text-white"
              >
                Participants
              </h4>
              <p
                v-if="course.data.participants.length === 0"
                class="md:col-span-2 bg-white border border-gray-200 p-2 rounded-lg dark:bg-gray-800 dark:border-gray-700 text-center text-gray-500"
              >
                There are no participants.
              </p>
              <UserCardComponent
                v-else
                v-for="user of course.data.participants"
                :key="user.id"
                :user="user"
              />
            </div>
          </Transition>

          <!-- Settings -->
          <Transition>
            <div v-if="state.tab === 3" class="flex flex-col gap-6 mb-6">
              <h4
                class="text-xl font-black drop-shadow-xl leading-loose text-gray-900 dark:text-white"
              >
                Course Settings
              </h4>
              <form
                @submit.prevent="updateCourse()"
                class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12"
              >
                <div>
                  <label
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >Course name</label
                  >
                  <input
                    type="text"
                    v-model="course.data.name"
                    disabled
                    class="cursor-not-allowed bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                <div>
                  <label
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >Course cost</label
                  >
                  <div class="flex">
                    <span
                      class="inline-flex items-center px-3 font-medium text-gray-900 bg-gray-200 rounded-l-md border border-r-0 border-gray-300 dark:bg-gray-600 dark:text-white dark:border-gray-600"
                    >
                      USD $
                    </span>
                    <input
                      type="number"
                      v-model="course.data.price"
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
                    >Image</label
                  >
                  <input
                    class="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    type="file"
                    id="update-course-image"
                  />
                </div>
                <div>
                  <label
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >Course duration</label
                  >
                  <input
                    type="text"
                    v-model="course.data.duration"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                <div class="md:col-span-2">
                  <label
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >Description</label
                  >
                  <textarea
                    v-model="course.data.description"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    rows="4"
                    placeholder="Course description"
                  ></textarea>
                </div>
                <div class="md:col-span-2 flex items-center gap-2">
                  <button
                    typ="submit"
                    class="mr-auto shadow-lg inline-flex items-center gap-2.5 py-2.5 px-5 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
                      <path
                        d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2"
                      ></path>
                      <circle cx="12" cy="14" r="2"></circle>
                      <polyline points="14 4 14 8 8 8 8 4"></polyline>
                    </svg>
                    Save Changes
                  </button>
                  <ModalComponent>
                    <template #button>
                      <button
                        type="button"
                        class="inline-flex items-center gap-2.5 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
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
                          <path
                            stroke="none"
                            d="M0 0h24v24H0z"
                            fill="none"
                          ></path>
                          <path d="M4 7h16"></path>
                          <path
                            d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"
                          ></path>
                          <path
                            d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"
                          ></path>
                          <path d="M10 12l4 4m0 -4l-4 4"></path>
                        </svg>
                        Delete Course
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
                            <path d="M4 7h16"></path>
                            <path
                              d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"
                            ></path>
                            <path
                              d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"
                            ></path>
                            <path d="M10 12l4 4m0 -4l-4 4"></path>
                          </svg>
                        </div>
                        <h3
                          class="text-2xl text-center font-bold dark:text-white"
                        >
                          Are you sure you want to delete your
                          {{ course.data.name }} course?
                        </h3>
                        <p class="text-center text-gray-700 dark:text-gray-300">
                          <span class="font-bold"
                            >This action cannot be undone</span
                          >. The course and all associated data will be
                          permanently deleted for all participants.
                        </p>
                      </div>
                    </template>
                    <template #actions>
                      <button
                        type="button"
                        class="inline-flex justify-center items-center gap-2.5 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                      >
                        Yes. I want to permanently delete this course.
                      </button>
                    </template>
                  </ModalComponent>
                </div>
              </form>
            </div>
          </Transition>
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

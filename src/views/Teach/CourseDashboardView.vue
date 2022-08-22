<script setup>
import axios from 'axios'
import { onMounted, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Editor from '@tinymce/tinymce-vue'
import NavbarComponent from '../../components/NavbarComponent.vue'
import useUserStore from '../../stores/user'
import AlertComponent from '../../components/AlertComponent.vue'

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()

const state = reactive({
  loading: true,
  showDropdown: false
})
const course = reactive({
  data: null,
  newContent: null
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
  } catch (error) {
    console.log(error)
    if (error.response.status === 404) {
      router.push({ name: 'not-found' })
    }
  } finally {
    state.loading = false
  }
})

function addNewContent(type) {
  state.showDropdown = false
  course.newContent = {
    title: '',
    type: type,
    content: '',
    link: '',
    error: null
  }
}
watch(course, (value) => {
  if (!!value.newContent && !!value.newContent.error) {
    setTimeout(() => {
      course.newContent.error = null
    }, 5000)
  }
})

function clearNewContent() {
  course.newContent = null
}
async function submitContentForm() {
  course.newContent.error = null
  if (!course.newContent.title) {
    course.newContent.error = 'Title is required'
    return
  }
  try {
    const { data } = await axios.put(
      `/api/course/${route.params.id}/content`,
      {
        title: course.newContent.title,
        type: course.newContent.type,
        content: course.newContent.content,
        link: course.newContent.link
      },
      {
        headers: {
          Authorization: userStore.getBearerToken
        }
      }
    )
    course.data = data.course
    clearNewContent()
  } catch (error) {
    console.log(error)
    course.newContent.error = error.response.data.error
  }
}
</script>

<template>
  <main class="bg-white dark:bg-slate-800">
    <div class="min-h-screen max-w-screen-xl mx-auto">
      <NavbarComponent />
      <div class="container mx-auto px-4 sm:px-2 my-12">
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
        <div v-if="!state.loading && !!course.data">
          <div
            class="bg-gray-100 rounded-lg p-6 flex flex-col md:flex-row gap-12 justify-between items-start mb-12 dark:bg-gray-700"
          >
            <div class="space-y-6">
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
            <div class="w-full max-w-lg mb-6">
              <img
                :src="course.data.image_uri"
                class="w-full h-full object-cover mb-4 rounded"
              />
              <button
                type="button"
                class="w-full text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              >
                Change Image
              </button>
            </div>
          </div>
          <div class="flex flex-col gap-6 mb-12">
            <div class="flex items-start justify-between">
              <div class="relative">
                <button
                  type="button"
                  @click="state.showDropdown = !state.showDropdown"
                  class="shadow-lg inline-flex items-center py-3 px-5 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
                    class="w-6 h-6 mr-3"
                  >
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Add Content
                </button>
                <div
                  v-if="state.showDropdown"
                  class="absolute z-10 mt-2 w-44 bg-white rounded shadow-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                >
                  <ul class="py-1 text-sm text-gray-700 dark:text-gray-200">
                    <li>
                      <button
                        type="button"
                        @click="addNewContent('text')"
                        class="block w-full text-start py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Text Content
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        @click="addNewContent('link')"
                        class="block w-full text-start py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        External Link
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        @click="addNewContent('meeting')"
                        class="block w-full text-start py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Schedule Meeting
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        @click="addNewContent('assessment')"
                        class="block w-full text-start py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Assessment
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              <button
                type="button"
                class="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                Edit Course Info
              </button>
            </div>
            <div
              v-if="!!course.newContent && course.newContent.type === 'text'"
            >
              <form
                @submit.prevent="submitContentForm()"
                class="flex flex-col gap-6"
              >
                <AlertComponent
                  id="content-form-alert"
                  v-if="!!course.newContent && !!course.newContent.error"
                  :message="course.newContent.error"
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
                      v-model="course.newContent.title"
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
                  v-model="course.newContent.content"
                  name="content"
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
                      'code',
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
                      'removeformat | help'
                  }"
                />

                <div class="">
                  <button
                    type="submit"
                    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Save and Publish
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div class="flex flex-col gap-6 mb-6">
            <div
              v-for="content in JSON.parse(course.data.content)"
              :key="content"
              class="flex flex-col gap-4 p-2.5 bg-white shadow-sm border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              <h6 class="text-lg font-medium text-gray-900 dark:text-gray-300">
                {{ content.title }}
              </h6>
              <p
                class="text-gray-700 text-sm leading-relaxed dark:text-gray-300"
                v-html="content.content"
              ></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

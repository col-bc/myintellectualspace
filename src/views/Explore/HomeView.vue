<script setup>
import NavbarComponent from '@/components/NavbarComponent.vue'
import PostComponent from '@/components/PostComponent.vue'
import ModalComponent from '@/components/ModalComponent.vue'
import NewPostComponent from '@/components/NewPostComponent.vue'
import useUserStore from '@/stores/user'
import axios from 'axios'
import { onMounted, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import LoaderComponent from '../../components/LoaderComponent.vue'

const route = useRoute()
const userStore = useUserStore()

const state = reactive({
  posts: [],
  paginate: {
    page: 1,
    limit: 10,
    total: 0
  },
  loading: true,
  error: null
})
const filters = reactive({
  page: 1,
  limit: 10,
  expandComments: false,
  showOwnPosts: true
})

async function getPosts() {
  state.loading = true
  try {
    var url = `/api/post/?${route.name.split('-')[1]}=True&page=${
      filters.page
    }s&limit=${filters.limit}`

    const { data } = await axios.get(url, {
      headers: {
        Authorization: userStore.getBearerToken
      }
    })
    state.posts = data.posts
    state.paginate = data.paginate
  } catch (error) {
    console.log(error)
    state.error = error.response.data.error
  } finally {
    state.loading = false
  }
}

// fetch data on route change
watch(
  route,
  async () => {
    await getPosts()
  },
  { immediate: true }
)
1
// fetch data on filters.
watch(
  filters,
  async () => {
    await getPosts()
  },
  { deep: true }
)
</script>

<template>
  <main class="bg-white min-h-screen dark:bg-slate-800">
    <div class="max-w-screen-xl mx-auto">
      <NavbarComponent />

      <div
        class="flex flex-col md:flex-row container mx-auto gap-12 lg:gap-16 py-12 px-4"
      >
        <div class="flex-none lg:w-full lg:max-w-xs">
          <!-- New post modal -->
          <ModalComponent>
            <template #button>
              <button
                type="button"
                class="inline-flex w-full mb-12 items-center gap-4 justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-7 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-80"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-6 h-6"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                  />
                  <path
                    d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                  />
                </svg>
                New Post
              </button>
            </template>
            <template #content>
              <NewPostComponent />
            </template>
          </ModalComponent>
          <!-- Filters -->
          <div
            class="w-full p-4 bg-white shadow-sm rounded-lg border border-gray-300 text-base font-normal text-gray-700 dark:text-gray-400 dark:border-gray-700 dark:bg-gray-800"
          >
            <h4 class="text-gray-800 dark:text-white text-xl font-bold mb-4">
              Filters
            </h4>
            <div class="flex flex-col gap-y-4 w-full">
              <div class="flex items-center gap-6 justify-between">
                <label
                  class="block text-sm font-medium text-gray-900 dark:text-gray-300"
                  >Show my posts</label
                >
                <label class="inline-flex relative items-center cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="filters.showOwnPosts"
                    class="sr-only peer"
                  />
                  <div
                    class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                  ></div>
                </label>
              </div>
              <div class="flex items-center gap-6 justify-between">
                <label
                  class="block text-sm font-medium text-gray-900 dark:text-gray-300"
                  >Expand comments</label
                >
                <label class="inline-flex relative items-center cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="filters.expandComments"
                    class="sr-only peer"
                  />
                  <div
                    class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                  ></div>
                </label>
              </div>
              <div class="flex items-center gap-6 justify-between">
                <label
                  class="block text-sm font-medium text-gray-900 dark:text-gray-300"
                  >Number of posts</label
                >
                <input
                  type="number"
                  v-model="filters.limit"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-16 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="20"
                />
              </div>
              <button
                type="button"
                class="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-white hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
        <!-- Content -->
        <div class="flex-1 max-h-full overflow-y-auto">
          <div
            class="w-full mb-12 p-1 bg-white shadow-sm rounded-lg border border-gray-300 flex items-center gap-4 overflow-x-auto text-sm font-medium text-center text-gray-700 dark:text-gray-400 dark:border-gray-700 dark:bg-gray-800"
          >
            <router-link
              :to="{ name: 'explore-network' }"
              class="inline-flex flex-1 py-1.5 px-5 justify-center rounded-md text-sm"
              :class="[
                route.name === 'explore-network'
                  ? 'text-white bg-blue-600 active shadow'
                  : 'hover:text-gray-900 hover:bg-white dark:hover:bg-gray-800 dark:hover:text-white'
              ]"
            >
              Network
            </router-link>
            <router-link
              :to="{ name: 'explore-interests' }"
              class="inline-flex flex-1 py-1.5 px-5 justify-center rounded-md text-sm"
              :class="[
                route.name === 'explore-interests'
                  ? 'text-white bg-blue-600 active shadow'
                  : 'hover:text-gray-900 hover:bg-white dark:hover:bg-gray-800 dark:hover:text-white'
              ]"
            >
              Interests
            </router-link>
            <router-link
              :to="{ name: 'explore-education' }"
              class="inline-flex flex-1 py-1.5 px-5 justify-center rounded-md text-sm"
              :class="[
                route.name === 'explore-education'
                  ? 'text-white bg-blue-600 active shadow'
                  : 'hover:text-gray-900 hover:bg-white dark:hover:bg-gray-800 dark:hover:text-white'
              ]"
            >
              Education
            </router-link>
            <router-link
              :to="{ name: 'explore-all' }"
              class="inline-flex flex-1 py-1.5 px-5 justify-center rounded-md text-sm"
              :class="[
                route.name === 'explore-all'
                  ? 'text-white bg-blue-600 active shadow'
                  : 'hover:text-gray-900 hover:bg-white dark:hover:bg-gray-800 dark:hover:text-white'
              ]"
            >
              Everything
            </router-link>
          </div>

          <LoaderComponent v-if="state.loading" />

          <div v-else class="w-full flex flex-col gap-12 max-w-screen-lg">
            <PostComponent
              v-for="p in state.posts"
              :key="p.id"
              :post="p"
              :expand="filters.expandComments"
              class="shadow-sm"
            />

            <!-- Paginate -->
            <div class="flex flex-col gap-4">
              <p class="text-gray-700 text-center text-sm dark:text-gray7-300">
                Page {{ state.paginate.page }} of {{ state.paginate.pages }}
              </p>
              <div class="flex items-center w-full justify-center">
                <button
                  type="button"
                  @click="filters.page > 1 ? filters.page-- : null"
                  class="inline-flex items-center py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg rounded-r-none border border-gray-200 hover:bg-white hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  <svg
                    viewBox="0 0 24 24"
                    class="w-5 h-5 mr-3"
                    width="24"
                    height="24"
                    stroke="currentColor"
                    stroke-width="2"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  Prev
                </button>
                <button
                  type="button"
                  @click="filters.page++"
                  class="inline-flex gap-3 py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg rounded-l-none border border-gray-200 hover:bg-white hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  Next
                  <svg
                    viewBox="0 0 24 24"
                    class="w-5 h-5 ml-3"
                    width="24"
                    height="24"
                    stroke="currentColor"
                    stroke-width="2"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import NavbarComponent from '@/components/NavbarComponent.vue'
import PostComponent from '@/components/PostComponent.vue'
import useUserStore from '@/stores/user'
import axios from 'axios'
import { onMounted, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import ModalComponent from '../../components/ModalComponent.vue'

const route = useRoute()
const userStore = useUserStore()

const state = reactive({
  posts: [],
  loading: true,
  error: null
})

async function getPosts() {
  state.loading = true
  try {
    const { data } = await axios.get(
      `/api/post/?${route.name.split('-')[1]}=True`,
      {
        headers: {
          Authorization: userStore.getBearerToken
        }
      }
    )
    state.posts = data.posts
  } catch (error) {
    console.log(error)
    state.error = error
  } finally {
    state.loading = false
  }
}
watch(
  route,
  async () => {
    await getPosts()
  },
  { immediate: true }
)
</script>

<template>
  <main class="bg-gray-100 min-h-screen dark:bg-slate-800">
    <div class="max-w-screen-xl mx-auto">
      <NavbarComponent />

      <div class="flex container mx-auto gap-12 py-12">
        <div class="w-full max-w-xs">
          <button
            type="button"
            class="mb-12 w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base px-6 py-2.5 flex items-center justify-center shadow-lg"
          >
            New Post
          </button>
          <!-- Filters -->
          <div
            class="w-full p-4 bg-white shadow-sm rounded-lg border border-gray-300 text-base font-normal text-gray-700 dark:text-gray-400 dark:border-gray-700 dark:bg-gray-800"
          >
            <h4
              class="text-start text-gray-800 dark:text-white text-2xl font-seminold mb-4"
            >
              Filters
            </h4>
            <div class="flex flex-col gap-y-4 w-full">
              <div class="flex items-center justify-between">
                <label
                  class="block text-sm font-medium text-gray-900 dark:text-gray-300"
                  >Number of posts</label
                >
                <input
                  type="email"
                  id="email"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-24 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="20"
                />
              </div>
              <div class="flex items-center justify-between">
                <label
                  class="block text-sm font-medium text-gray-900 dark:text-gray-300"
                  >Show my posts</label
                >
                <label class="inline-flex relative items-center cursor-pointer">
                  <input
                    type="checkbox"
                    value=""
                    checked
                    class="sr-only peer"
                  />
                  <div
                    class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                  ></div>
                </label>
              </div>
              <div class="flex items-center justify-between">
                <label
                  class="block text-sm font-medium text-gray-900 dark:text-gray-300"
                  >Expand comments</label
                >
                <label class="inline-flex relative items-center cursor-pointer">
                  <input
                    type="checkbox"
                    value=""
                    checked
                    class="sr-only peer"
                  />
                  <div
                    class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                  ></div>
                </label>
              </div>
              <button
                type="button"
                class="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
        <!-- Content -->
        <div class="w-full max-h-full overflow-y-auto">
          <ul
            class="w-full mb-12 p-1 bg-white shadow-sm rounded-lg border border-gray-300 flex items-start overflow-x-auto text-sm font-medium text-center text-gray-700 dark:text-gray-400 dark:border-gray-700 dark:bg-gray-800"
          >
            <li class="mr-2">
              <router-link
                :to="{ name: 'explore-network' }"
                class="inline-block py-1.5 px-3 rounded-lg text-sm"
                :class="[
                  route.name === 'explore-network'
                    ? 'text-white bg-blue-600 active'
                    : 'hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white'
                ]"
              >
                Network
              </router-link>
            </li>
            <li class="mr-2">
              <router-link
                :to="{ name: 'explore-interests' }"
                class="inline-block py-1.5 px-3 rounded-lg text-sm"
                :class="[
                  route.name === 'explore-interests'
                    ? 'text-white bg-blue-600 active'
                    : 'hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white'
                ]"
              >
                Interests
              </router-link>
            </li>
            <li class="mr-2">
              <router-link
                :to="{ name: 'explore-education' }"
                class="inline-block py-1.5 px-3 rounded-lg text-sm"
                :class="[
                  route.name === 'explore-education'
                    ? 'text-white bg-blue-600 active'
                    : 'hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white'
                ]"
              >
                Education
              </router-link>
            </li>
            <li class="mr-2">
              <router-link
                :to="{ name: 'explore-all' }"
                class="inline-block py-1.5 px-3 rounded-lg text-sm"
                :class="[
                  route.name === 'explore-all'
                    ? 'text-white bg-blue-600 active'
                    : 'hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white'
                ]"
              >
                Everything
              </router-link>
            </li>
          </ul>

          <div v-if="state.loading" role="status" class="text-center h=full">
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

          <div v-else class="w-full flex flex-col gap-12 max-w-screen-lg">
            <PostComponent
              v-for="p in state.posts"
              :key="p.id"
              :post="p"
              class="shadow-sm"
            />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

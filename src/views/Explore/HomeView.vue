<script setup>
import NavbarComponent from '@/components/NavbarComponent.vue'
import PostComponent from '@/components/PostComponent.vue'
import ModalComponent from '@/components/ModalComponent.vue'
import NewPostComponent from '@/components/NewPostComponent.vue'
import useUserStore from '@/stores/user'
import { getFirestore, doc, collection, getDocs } from '@firebase/firestore'
import { onMounted, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import LoaderComponent from '../../components/LoaderComponent.vue'

const route = useRoute()
const user = useUserStore()

const state = reactive({
  posts: [],
  suggestedUsers: [],
  loading: true,
  error: null
})

const filters = reactive({
  showMyPosts: false,
  expandComments: false,
  limit: 10
})

onMounted(async () => {
  // get all posts from firestore
  // TODO: move to state management
  const db = getFirestore()
  const postsRef = collection(db, 'posts')
  const postsSnapshot = await getDocs(postsRef)
  const posts = postsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }))

  state.posts = posts
    .filter((post) => {
      if (filters.showMyPosts) {
        return post.author.id === user.user.id
      }
      return true
    })
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, filters.limit)

  state.suggestedUsers = await user.getSuggestedUsers()

  // pagination

  state.loading = false
})
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
          <button
            type="button"
            class="inline-flex w-full mb-12 items-center gap-4 justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-7 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-80"
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
                d="M16.757 3l-2 2H5v14h14V9.243l2-2V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h12.757zm3.728-.9L21.9 3.516l-9.192 9.192-1.412.003-.002-1.417L20.485 2.1z"
              />
            </svg>
            New Post
          </button>

          <!-- Filters -->
          <div
            class="w-full p-4 mb-6 bg-white shadow-sm rounded-lg border border-gray-300 text-base font-normal text-gray-700 dark:text-gray-400 dark:border-gray-700 dark:bg-gray-800"
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
                  <input type="checkbox" class="sr-only peer" />
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
                  <input type="checkbox" class="sr-only peer" />
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

          <!-- Suggestions -->
          <div
            class="w-full p-4 bg-white shadow-sm rounded-lg border border-gray-300 text-base font-normal text-gray-700 dark:text-gray-400 dark:border-gray-700 dark:bg-gray-800"
          >
            <h4 class="text-gray-800 dark:text-white text-xl font-bold mb-4">
              Suggestions for you
            </h4>
            <div class="flex flex-col gap-y-4 w-full">
              <template v-for="user in state.suggestedUsers" :key="user.id">
                <div class="flex items-center">
                  <img :src="user.avatarUrl" class="w-10 h-10 rounded-full" />
                  <div class="ml-4">
                    <h6
                      class="text-gray-800 dark:text-white text-lg font-medum"
                    >
                      @{{ user.handle }}
                    </h6>
                    <p class="text-gray-500 dark:text-gray-400 text-sm">
                      {{ user.fullName }}
                    </p>
                  </div>
                  <button
                    type="button"
                    class="ml-auto py-2 px-3 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Follow
                  </button>
                </div>
              </template>
              <button
                type="button"
                class="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-white hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                See all suggestions
              </button>
            </div>
          </div>
        </div>
        <!-- Content -->
        <div class="flex-1 max-h-full overflow-y-auto">
          <LoaderComponent v-if="state.loading" />

          <div v-else class="w-full flex flex-col gap-12 max-w-screen-lg">
            <PostComponent
              v-for="p in state.posts"
              :key="p.id"
              :post="p"
              class="shadow-sm"
            />

            <!-- Paginate -->
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

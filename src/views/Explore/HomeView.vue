<script setup>
import NavbarComponent from '@/components/NavbarComponent.vue'
import PostComponent from '@/components/PostComponent.vue'
import ModalComponent from '@/components/ModalComponent.vue'
import NewPostComponent from '@/components/NewPostComponent.vue'
import useUserStore from '@/stores/user'
import { onMounted, onUpdated, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import LoaderComponent from '../../components/LoaderComponent.vue'
import useInterface from '@/stores/interface'

const ui = useInterface()
const route = useRoute()
const user = useUserStore()

const state = reactive({
  posts: [],
  suggestedUsers: [],
  loading: true,
  error: null,
  collapseFilters: false,
  collapseSuggestions: false
})

const filters = reactive({
  showMyPosts: false,
  expandComments: false,
  showNewPostDialog: false,
  limit: 10
})

onMounted(async () => {
  state.loading = true
  console.log(ui.isMobile)
  state.collapseFilters = ui.isMobile

  state.posts = await loadPosts()
  state.posts
    .filter((post) => {
      if (filters.showMyPosts) {
        return post.author.id === user.user.id
      }
      return true
    })
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, filters.limit)

  state.suggestedUsers = await user.getSuggestedUsers()

  // TODO: pagination
  state.loading = false
})

watch(
  () => route.name,
  async () => {
    state.loading = true
    state.posts = await loadPosts()

    if (route.name === 'explore-network') {
      // remove posts from users not in user's following array
      state.posts = state.posts.filter((post) => {
        if (user.user.following) {
          return user.user.following
            .map((user) => user.handle)
            .includes(post.author.handle)
        }
      })
    }

    state.loading = false
  },
  { immediate: true }
)

async function loadPosts() {
  var posts = await user.fetchAllPosts()

  if (route.name === 'explore-all') {
    // pass
  } else if (route.name === 'explore-network') {
    // remove posts from users not in network
    posts = posts.filter((post) => {
      return !user.user.following?.includes(post.author.handle)
    })
  }
  return posts.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
}
async function refreshPosts() {
  state.loading = true
  state.posts = await loadPosts()
  state.loading = false
}
async function followUser(userData) {
  await user.toggleFollowUser(userData)
  state.suggestedUsers = await user.getSuggestedUsers()
}
</script>

<template>
  <main class="bg-white min-h-screen dark:bg-slate-800">
    <div class="max-w-screen-xl mx-auto">
      <NavbarComponent />

      <div
        class="relative h-full container mx-auto flex flex-col md:flex-row items-start gap-6 md:gap:12 lg:gap-16 py-12 px-2 md:px-4"
      >
        <div
          class="sticky too-6 flex flex-col flex-none lg:w-full lg:max-w-sm gap-6 lg:gap-12"
        >
          <!-- Open new post modal -->
          <button
            type="button"
            @click="state.showNewPostDialog = true"
            class="inline-flex w-full items-center gap-4 justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-7 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 focus:shadow-sm focus:translate-y-0.5 transition duration-200 ease-in-out"
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
            class="w-full p-4 bg-white shadow-md rounded-lg border border-gray-300 text-base font-normal text-gray-700 dark:text-gray-400 dark:border-gray-700 dark:bg-gray-800"
          >
            <div
              class="flex items-center justify-between"
              :class="{ 'mb-4': !state.collapseFilters }"
            >
              <h4
                class="flex items-center gap-3 text-gray-800 dark:text-white text-xl font-bold"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-6 h-6 fill-current"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path fill="none" d="M0 0H24V24H0z" />
                  <path
                    d="M21 4v2h-1l-5 7.5V22H9v-8.5L4 6H3V4h18zM6.404 6L11 12.894V20h2v-7.106L17.596 6H6.404z"
                  />
                </svg>
                Filters
              </h4>
              <button
                type="button"
                @click="state.collapseFilters = !state.collapseFilters"
                class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm p-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                :class="{ 'rotate-180': state.collapseFilters }"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-6 h-6 fill-current"
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
            <div
              v-if="!state.collapseFilters"
              class="flex flex-col gap-y-4 w-full"
            >
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
                  <input
                    type="checkbox"
                    class="sr-only peer"
                    v-model="state.expandComments"
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
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-16 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="20"
                />
              </div>
            </div>
          </div>
          <!-- Suggestions -->
          <div
            class="w-full p-4 bg-white shadow-md rounded-lg border border-gray-300 text-base font-normal text-gray-700 dark:text-gray-400 dark:border-gray-700 dark:bg-gray-800"
          >
            <div
              class="flex items-center justify-between"
              :class="{ 'mb-4': !state.collapseSuggestions }"
            >
              <h4
                class="flex items-center gap-3 text-gray-800 dark:text-white text-xl font-bold"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-6 h-6 fill-current"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path
                    d="M2 22a8 8 0 1 1 16 0h-2a6 6 0 1 0-12 0H2zm8-9c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm8.284 3.703A8.002 8.002 0 0 1 23 22h-2a6.001 6.001 0 0 0-3.537-5.473l.82-1.824zm-.688-11.29A5.5 5.5 0 0 1 21 8.5a5.499 5.499 0 0 1-5 5.478v-2.013a3.5 3.5 0 0 0 1.041-6.609l.555-1.943z"
                  />
                </svg>
                Suggestions for you
              </h4>
              <button
                type="button"
                @click="state.collapseSuggestions = !state.collapseSuggestions"
                class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm p-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                :class="{ 'rotate-180': state.collapseSuggestions }"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-6 h-6 fill-current"
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
            <div
              v-if="!state.collapseSuggestions"
              class="flex flex-col gap-y-4 w-full"
            >
              <template v-if="state.suggestedUsers.length === 0">
                <p class="text-gray-500 dark:text-gray-400">
                  No suggestions at this time. Check back later.
                </p>
              </template>
              <template v-for="user in state.suggestedUsers" :key="user.id">
                <div class="flex items-center">
                  <router-link
                    :to="`/social/@${user.handle}`"
                    class="flex items-center"
                  >
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
                  </router-link>
                  <button
                    type="button"
                    @click="followUser(user)"
                    class="ml-auto py-2 px-3 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Follow
                  </button>
                </div>
              </template>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="flex-1 max-h-full">
          <div
            v-if="state.loading"
            class="flex items-center justify-center text-gray-900 dark:text-white"
          >
            <LoaderComponent size="lg" />
          </div>
          <div v-else class="w-full flex flex-col gap-12">
            <!-- Tabs -->
            <div
              class="max-w-full text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700"
            >
              <ul class="relative overflow-x-scroll flex -mb-px">
                <li class="mr-2">
                  <router-link
                    to="/explore/all"
                    class="whitespace-nowrap"
                    :class="
                      route.name === 'explore-all'
                        ? 'inline-block p-4 text-blue-600 rounded-t-lg border-b-2 border-blue-600 active dark:text-blue-500 dark:border-blue-500'
                        : 'inline-block p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                    "
                    >All Posts</router-link
                  >
                </li>
                <li class="mr-2">
                  <router-link
                    to="/explore/network"
                    class="whitespace-nowrap"
                    :class="
                      route.name === 'explore-network'
                        ? 'inline-block p-4 text-blue-600 rounded-t-lg border-b-2 border-blue-600 active dark:text-blue-500 dark:border-blue-500'
                        : 'inline-block p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                    "
                    >My Network</router-link
                  >
                </li>
                <li class="mr-2">
                  <router-link
                    to="/explore/education"
                    class="whitespace-nowrap"
                    :class="
                      route.name === 'explore-education'
                        ? 'inline-block p-4 text-blue-600 rounded-t-lg border-b-2 border-blue-600 active dark:text-blue-500 dark:border-blue-500'
                        : 'inline-block p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                    "
                    >Similar Education</router-link
                  >
                </li>
                <li class="mr-2">
                  <router-link
                    to="/explore/interests"
                    class="whitespace-nowrap"
                    :class="
                      route.name === 'explore-interests'
                        ? 'inline-block p-4 text-blue-600 rounded-t-lg border-b-2 border-blue-600 active dark:text-blue-500 dark:border-blue-500'
                        : 'inline-block p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                    "
                    >Similar Interests</router-link
                  >
                </li>
              </ul>
            </div>
            <template v-if="state.posts.length > 0">
              <PostComponent
                v-for="p in state.posts"
                @delete="refreshPosts"
                :key="p.id"
                :post="p"
                class="shadow-sm"
              />
            </template>
            <div v-else class="text-center text-gray-500 dark:text-gray-400">
              No posts to show.
            </div>

            <!-- Paginate -->
          </div>
        </div>
      </div>

      <Dialog
        :open="state.showNewPostDialog"
        @close="state.showNewPostDialog = false"
        class="relative z-10"
      >
        <div class="fixed inset-0 bg-black bg-opacity-60" />
        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <div
              class="w-full max-w-lg flex flex-col p-6 bg-white rounded-lg shadow dark:bg-gray-700"
            >
              <NewPostComponent
                @post-created="
                  () => (refreshPosts(), (state.showNewPostDialog = false))
                "
              />
              <button
                @click="state.showNewPostDialog = false"
                class="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  </main>
</template>

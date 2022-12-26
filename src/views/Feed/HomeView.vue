<script setup>
import NavbarComponent from '@/components/NavbarComponent.vue'
import PostComponent from '@/components/PostComponent.vue'
import ModalComponent from '@/components/ModalComponent.vue'
import NewPostComponent from '@/components/NewPostComponent.vue'
import useUserStore from '@/stores/user'
import usePostStore from '@/stores/post'
import { onMounted, onUpdated, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LoaderComponent from '../../components/LoaderComponent.vue'
import useInterface from '@/stores/interface'

const ui = useInterface()
const route = useRoute()
const router = useRouter()
const user = useUserStore()
const post = usePostStore()

const state = reactive({
  posts: [],
  suggestedUsers: [],
  loading: true,
  error: null,
  collapseFilters: false,
  collapseSuggestions: false
})

const filters = reactive({
  showMyPosts: true,
  showNewPostDialog: false,
  limit: 10,
  page: 1,
  total: 0
})

onMounted(async () => {
  state.loading = true
  state.collapseFilters = ui.isMobile
  state.posts = await loadPosts()
  state.suggestedUsers = await user.getSuggestedUsers()

  // TODO: pagination
  state.loading = false
})

watch(
  () => route.name,
  async () => {
    state.loading = true
    state.posts = await loadPosts()
    state.loading = false
  },
  { immediate: true }
)
watch(
  () => [filters.showMyPosts, filters.limit, filters.page],
  async () => {
    state.loading = true
    state.posts = await loadPosts()
    state.loading = false
  },
  { immediate: true }
)

async function loadPosts() {
  var posts = []
  if (route.name === 'feed-all') {
    posts = await post.fetchAllPosts()
  } else if (route.name === 'feed-network') {
    posts = await post.getNetworkPosts()
  } else if (route.name === 'feed-education') {
    posts = await post.getEducationPosts()
  }

  // Filter out posts by the current user
  if (!filters.showMyPosts) {
    posts = posts.filter((post) => post.author.handle !== user.user.handle)
  }
  // Paginate
  filters.total = Math.ceil(posts.length / filters.limit)
  posts = posts
    .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
    .slice((filters.page - 1) * filters.limit, filters.page * filters.limit)

  return posts
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

function nextPage() {
  if (filters.page < filters.total) {
    filters.page++
  }
}
function prevPage() {
  if (filters.page > 1) {
    filters.page--
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
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
          class="md:sticky md:top-6 flex flex-col items-start gap-12 w-full md:max-w-xs lg:max-w-sm"
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
            class="w-full p-4 bg-white shadow rounded-lg border border-gray-300 text-base font-normal text-gray-700 dark:text-gray-400 dark:border-gray-700 dark:bg-gray-800"
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
                  <input
                    v-model="filters.showMyPosts"
                    type="checkbox"
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
            </div>
          </div>
          <!-- Suggestions -->
          <div
            class="w-full p-4 bg-white shadow rounded-lg border border-gray-300 text-base font-normal text-gray-700 dark:text-gray-400 dark:border-gray-700 dark:bg-gray-800"
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
          <button
            type="button"
            @click="scrollToTop"
            class="hidden w-full md:flex items-center justify-center gap-3 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 hover:shadow transition-all duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-6 h-6 fill-current"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path d="M13 12v8h-2v-8H4l8-8 8 8z" />
            </svg>
            Back to top
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 max-h-full">
          <!-- Tabs -->
          <div
            class="mb-9 text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700"
          >
            <ul class="w-full flex flex-wrap -mb-px">
              <li class="mr-2">
                <router-link
                  to="/feed/all"
                  class="whitespace-nowrap"
                  :class="
                    route.name === 'feed-all'
                      ? 'inline-block p-4 text-blue-600 rounded-t-lg border-b-2 border-blue-600 active dark:text-blue-500 dark:border-blue-500'
                      : 'inline-block p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                  "
                  >All Posts</router-link
                >
              </li>
              <li class="mr-2">
                <router-link
                  to="/feed/network"
                  class="whitespace-nowrap"
                  :class="
                    route.name === 'feed-network'
                      ? 'inline-block p-4 text-blue-600 rounded-t-lg border-b-2 border-blue-600 active dark:text-blue-500 dark:border-blue-500'
                      : 'inline-block p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                  "
                  >My Network</router-link
                >
              </li>
              <li class="mr-2">
                <router-link
                  to="/feed/education"
                  class="whitespace-nowrap"
                  :class="
                    route.name === 'feed-education'
                      ? 'inline-block p-4 text-blue-600 rounded-t-lg border-b-2 border-blue-600 active dark:text-blue-500 dark:border-blue-500'
                      : 'inline-block p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                  "
                  >Similar Education</router-link
                >
              </li>
              <li class="mr-2">
                <router-link
                  to="/feed/interests"
                  class="whitespace-nowrap"
                  :class="
                    route.name === 'feed-interests'
                      ? 'inline-block p-4 text-blue-600 rounded-t-lg border-b-2 border-blue-600 active dark:text-blue-500 dark:border-blue-500'
                      : 'inline-block p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                  "
                  >Similar Interests</router-link
                >
              </li>
            </ul>
          </div>
          <div
            v-if="state.loading"
            class="flex items-center justify-center text-gray-900 dark:text-white"
          >
            <LoaderComponent size="lg" />
          </div>
          <div v-else class="w-full flex flex-col gap-12">
            <template v-if="state.posts.length > 0">
              <PostComponent
                v-for="p in state.posts"
                @delete="refreshPosts"
                :key="p.id"
                :post="p"
                class="shadow-sm"
              />
            </template>
            <template
              v-else
              class="text-center text-gray-500 dark:text-gray-400"
            >
              No posts to show.
            </template>

            <!-- Paginate -->
            <div class="flex flex-col gap-4">
              <p class="text-base text-center text-gray-500 dark:text-gray-400">
                Page <span class="font-medium">{{ filters.page }}</span> of
                <span class="font-medium">{{ filters.total }}</span>
              </p>
              <div class="flex items-center justify-center gap-3">
                <!-- Previous Button -->
                <button
                  type="button"
                  @click="prevPage"
                  v-if="filters.page > 1"
                  class="inline-flex items-center justify-center gap-4 px-4 py-2 text-sm shadow font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
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
                      d="M7.828 11H20v2H7.828l5.364 5.364-1.414 1.414L4 12l7.778-7.778 1.414 1.414z"
                    /></svg
                  >Previous
                </button>

                <!-- Next Button -->
                <button
                  type="button"
                  @click="nextPage"
                  v-if="filters.page < filters.total"
                  class="inline-flex items-center justify-center gap-4 px-4 py-2 text-sm font-medium shadow text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  Next
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-6 h-6 fill-current"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path
                      d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        :open="state.showNewPostDialog"
        @close="state.showNewPostDialog = false"
        @keydown.escape="state.showNewPostDialog = false"
        class="relative z-10"
      >
        <div class="fixed inset-0 bg-black bg-opacity-60" />
        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <div
              class="w-full max-w-2xl flex flex-col gap-6 p-6 bg-white rounded-lg shadow dark:bg-gray-700"
            >
              <div class="flex items-center justify-between">
                <h2
                  class="text-2xl font-semibold text-gray-900 dark:text-white"
                >
                  New Post
                </h2>
                <button
                  type="button"
                  @click="state.showNewPostDialog = false"
                  class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-300 dark:hover:bg-gray-600 dark:focus:ring-gray-500"
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
                      d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"
                    />
                  </svg>
                </button>
              </div>
              <NewPostComponent
                @post-created="
                  () => (refreshPosts(), (state.showNewPostDialog = false))
                "
              />
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  </main>
</template>

<script setup>
import NavbarComponent from '@/components/NavbarComponent.vue'
import PostComponent from '@/components/PostComponent.vue'
import NewPostComponent from '@/components/NewPostComponent.vue'
import useUserStore from '@/stores/user'
import usePostStore from '@/stores/post'
import { onMounted, onUpdated, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LoaderComponent from '../../components/LoaderComponent.vue'
import useInterface from '@/stores/interface'
import {
  mdiSquareEditOutline,
  mdiFilterOutline,
  mdiChevronDown,
  mdiAccountGroupOutline,
  mdiArrowUpThin,
  mdiArrowRightThin,
  mdiArrowLeftThin,
  mdiClose
} from '@mdi/js'

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
        class="container mx-auto flex flex-col md:flex-row items-start gap-6 md:gap:12 lg:gap-16 py-12 mb-12 px-2 md:px-4"
      >
        <div
          class="flex flex-col items-start gap-12 mb-6 w-full md:max-w-xs lg:max-w-sm"
        >
          <!-- Open new post modal -->
          <button
            type="button"
            @click="state.showNewPostDialog = true"
            class="inline-flex w-full items-center gap-4 justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-7 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 focus:shadow-sm focus:translate-y-0.5 transition duration-200 ease-in-out"
          >
            <svg-icon :path="mdiSquareEditOutline" type="mdi" />
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
                <svg-icon :path="mdiFilterOutline" type="mdi" />
                Filters
              </h4>
              <button
                type="button"
                @click="state.collapseFilters = !state.collapseFilters"
                class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm p-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                :class="{ 'rotate-180': state.collapseFilters }"
              >
                <svg-icon :path="mdiChevronDown" type="mdi" />
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
                <svg-icon :path="mdiAccountGroupOutline" type="mdi" />
                Suggestions for you
              </h4>
              <button
                type="button"
                @click="state.collapseSuggestions = !state.collapseSuggestions"
                class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm p-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                :class="{ 'rotate-180': state.collapseSuggestions }"
              >
                <svg-icon :path="mdiChevronDown" type="mdi" />
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
                    <img
                      :src="user.avatarUrl"
                      class="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-700"
                    />

                    <div class="ml-4">
                      <h6
                        class="text-gray-800 dark:text-white text-lg font-medium"
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
                    class="ml-auto py-2 px-3 text-xs font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
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
            class="md:sticky md:top-6 hidden w-full md:flex items-center justify-center gap-3 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 hover:shadow transition-all duration-300"
          >
            <svg-icon :path="mdiArrowUpThin" type="mdi" />
            Back to top
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 max-h-full">
          <!-- Tabs -->
          <div
            class="mb-12 font-medium text-center flex flex-wrap text-sm text-gray-500 dark:text-gray-400"
          >
            <router-link
              to="/feed/all"
              class="inline-block px-4 py-3 whitespace-nowrap rounded-lg"
              :class="
                route.name === 'feed-all'
                  ? 'text-white bg-blue-600 active'
                  : ' hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white'
              "
              >Everything</router-link
            >
            <router-link
              to="/feed/network"
              class="inline-block px-4 py-3 whitespace-nowrap rounded-lg"
              :class="
                route.name === 'feed-network'
                  ? 'text-white bg-blue-600 active'
                  : ' hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white'
              "
            >
              Network</router-link
            >
            <router-link
              to="/feed/education"
              class="inline-block px-4 py-3 whitespace-nowrap rounded-lg"
              :class="
                route.name === 'feed-education'
                  ? 'text-white bg-blue-600 active'
                  : ' hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white'
              "
              >Similar Education</router-link
            >
            <router-link
              to="/feed/interests"
              class="inline-block px-4 py-3 whitespace-nowrap rounded-lg"
              :class="
                route.name === 'feed-interests'
                  ? 'text-white bg-blue-600 active'
                  : ' hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white'
              "
              >Similar Interests</router-link
            >
          </div>
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
          <template v-else>
            <p class="text-gray-500 dark:text-gray-400">No posts to show.</p>
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
                <svg-icon :path="mdiArrowLeftThin" type="mdi" />
                Previous
              </button>

              <!-- Next Button -->
              <button
                type="button"
                @click="nextPage"
                v-if="filters.page < filters.total"
                class="inline-flex items-center justify-center gap-4 px-4 py-2 text-sm font-medium shadow text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Next
                <svg-icon :path="mdiArrowRightThin" type="mdi" />
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
              <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
                New Post
              </h2>
              <button
                type="button"
                @click="state.showNewPostDialog = false"
                class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-300 dark:hover:bg-gray-600 dark:focus:ring-gray-500"
              >
                <svg-icon :path="mdiClose" type="mdi" />
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
  </main>
</template>

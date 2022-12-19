<script setup>
import useUserStore from '@/stores/user'
import AlertComponent from '@/components/AlertComponent.vue'
import { useRouter } from 'vue-router'
import { computed, defineProps, onMounted, reactive } from 'vue'
import { Timestamp } from '@firebase/firestore'
import { Menu, MenuButton, MenuItems, Dialog } from '@headlessui/vue'

const user = useUserStore()
const router = useRouter()
const props = defineProps({
  post: {
    type: Object,
    required: true
  },
  expand: {
    type: Boolean,
    default: false
  }
})
const state = reactive({
  showComments: false,
  showDelete: false,
  comment: '',
  showReportDialog: false,
  isRecentlyActive: false
})
const reportForm = reactive({
  error: '',
  postId: props.post?.id,
  userId: user.user?.uid,
  reason: 'default',
  details: ''
})

onMounted(async () => {
  state.showComments = props.post.comments.length > 0 || props.expand
  const lastActiveTimestamp = await user.getLastActive(props.post.author.handle)
  if (!lastActiveTimestamp) {
    return
  }
  const lastActive = lastActiveTimestamp.toDate()
  const now = new Date()
  const diff = now.getTime() - lastActive.getTime()
  const diffMinutes = Math.round(diff / 60000)
  if (diffMinutes < 15) {
    state.isRecentlyActive = true
  }
})

const isFollowing = computed(() => {
  return user.user?.following?.includes(props.post.author.handle)
})
const isOwnPost = computed(() => {
  return user.user?.handle === props.post.author.handle
})
const isLiked = computed(() => {
  return props.post.likes?.includes(user.user?.handle)
})

function timeSince(timestamp) {
  // parse firestore timestamp
  const date = new Timestamp(timestamp.seconds, timestamp.nanoseconds).toDate()
  // get current time
  const now = new Date()
  // get difference in seconds
  const seconds = Math.floor((now - date) / 1000)
  // calculate time since
  let interval = Math.floor(seconds / 31536000)
  if (interval > 1) {
    return interval + ' years'
  }
  interval = Math.floor(seconds / 2592000)
  if (interval > 1) {
    return interval + ' months'
  }
  interval = Math.floor(seconds / 86400)
  if (interval > 1) {
    return interval + ' days'
  }
  interval = Math.floor(seconds / 3600)
  if (interval > 1) {
    return interval + ' hours'
  }
  interval = Math.floor(seconds / 60)
  if (interval > 1) {
    return interval + ' minutes'
  }
  return Math.floor(seconds) + ' seconds'
}
async function toggleLike() {
  if (!user.isAuthenticated) {
    router.push('/login?redirect=/social/@' + props.post.author.handle)
  }
  user.toggleLike(props.post)
}
async function deletePost() {
  if (!user.isAuthenticated) {
    router.push('/login?redirect=/social/@' + props.post.author.handle)
  }
  if (!isOwnPost.value) {
    return
  }
  user.deletePost(props.post)
}
async function addComment() {
  if (!user.isAuthenticated) {
    router.push('/login?redirect=', route.path)
  }
  if (state.comment.length > 0) {
    await user.addComment(props.post.id, state.comment)
    state.comment = ''
  }
}
async function reportPost() {
  if (!user.isAuthenticated) {
    router.push('/login?redirect=/social/@' + props.post.author.handle)
  }
  // validate report form
  if (reportForm.reason === 'default') {
    reportForm.error = 'Please select a reason for reporting this post'
    return
  }
  if (reportForm.details.length < 10) {
    reportForm.error =
      'Please provide more details about why you are reporting this post'
    return
  }
  // send report
}
</script>

<template>
  <div
    class="bg-white shadow-sm rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-600"
  >
    <!-- Header -->
    <div class="flex items-center p-4 pb-2">
      <div
        class="flex items-center mr-auto"
        @click="$router.push(`/social/@${props.post.author.handle}`)"
      >
        <router-link
          :to="'/social/@' + props.post.author.handle"
          class="flex items-center mr-4"
        >
          <img
            :src="props.post.author.avatarUrl"
            class="h-8 w-8 rounded-full mr-4"
          />
          <h6 class="font-medium text-gray-900 dark:text-white">
            {{ props.post.author.handle }}
          </h6>
        </router-link>
        <div
          v-if="state.isRecentlyActive && !isOwnPost"
          class="flex items-center px-2 py-0.5 gap-2 rounded-full border border-green-600 dark:border-green-400"
        >
          <div
            class="block w-3 h-3 rounded-full bg-green-600 dark:bg-green-400 animate-pulse"
          ></div>
          <span class="text-xs font-medium text-green-600 dark:text-green-400"
            >Recently active</span
          >
        </div>
      </div>
      <p class="ml-3 text-xs text-gray-600 dark:text-gray-400">
        {{ timeSince(props.post.createdAt) }}
        ago
      </p>
    </div>
    <!-- Body -->
    <div
      class="flex flex-col md:flex-row justify-start md:justify-between items-start gap-4 px-4 py-4"
    >
      <p class="text-gray-800 dark:text-white font-medium">
        {{ props.post.content }}
      </p>
      <img
        v-if="!!props.post.image"
        :src="props.post.image"
        class="w-full max-w-md"
      />
    </div>
    <!-- Action bar -->
    <div
      class="flex items-center justify-end py-2 px-3 bg-gray-50 border-y dark:border-gray-600 dark:bg-gray-700"
      :class="{
        'rounded-b-lg':
          (!props.post.comments || props.post.comments.length === 0) &&
          !state.showComments
      }"
    >
      <p
        v-if="!!props.post.location"
        class="flex items-center gap-2 mr-auto text-xs text-gray-700 dark:text-gray-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          class="w-4 h-4 fill-current"
          width="24"
          height="24"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path
            d="M12 23.728l-6.364-6.364a9 9 0 1 1 12.728 0L12 23.728zm4.95-7.778a7 7 0 1 0-9.9 0L12 20.9l4.95-4.95zM12 13a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"
          />
        </svg>
        {{ props.post.location }}
      </p>
      <!-- Delete btn -->
      <Menu as="div" class="relative" v-if="isOwnPost">
        <MenuButton
          type="button"
          class="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            class="w-5 h-5 fill-current"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path
              d="M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3zm1 2H6v12h12V8zm-4.586 6l1.768 1.768-1.414 1.414L12 15.414l-1.768 1.768-1.414-1.414L10.586 14l-1.768-1.768 1.414-1.414L12 12.586l1.768-1.768 1.414 1.414L13.414 14zM9 4v2h6V4H9z"
            />
          </svg>
        </MenuButton>
        <MenuItems
          class="flex flex-col absolute top-full w-52 mt-1 max-w-sm right-0 p-4 text-gray-800 bg-white border border-gray-200 rounded-lg shadow-md dark:text-white dark:bg-gray-800 dark:border-gray-700"
        >
          <p class="text-lg font-medium mb-4">
            Are you sure you want to delete this post?
          </p>
          <button
            type="button"
            @click="deletePost"
            class="flex items-center justify-center gap-2.5 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              class="w-5 h-5 fill-current"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path
                d="M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3zm1 2H6v12h12V8zm-4.586 6l1.768 1.768-1.414 1.414L12 15.414l-1.768 1.768-1.414-1.414L10.586 14l-1.768-1.768 1.414-1.414L12 12.586l1.768-1.768 1.414 1.414L13.414 14zM9 4v2h6V4H9z"
              />
            </svg>
            Delete Post
          </button>
        </MenuItems>
      </Menu>
      <!-- Report button -->
      <button
        type="button"
        v-if="!isOwnPost"
        @click="state.showReportDialog = true"
        class="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
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
            d="M5 16v6H3V3h9.382a1 1 0 0 1 .894.553L14 5h6a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-6.382a1 1 0 0 1-.894-.553L12 16H5zM5 5v9h8.236l1 2H19V7h-6.236l-1-2H5z"
          />
        </svg>
      </button>
      <!-- Comment counter -->
      <button
        type="button"
        @click="state.showComments = !state.showComments"
        class="inline-flex items-center justify-center gap-2 p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
      >
        <span
          class="inline-flex justify-center items-center ml-2 w-4 h-4 text-xs font-semibold"
        >
          {{ props.post.comments ? props.post.comments.length : '0' }}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          class="w-5 h-5 fill-current"
          width="24"
          height="24"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path
            d="M10 3h4a8 8 0 1 1 0 16v3.5c-5-2-12-5-12-11.5a8 8 0 0 1 8-8zm2 14h2a6 6 0 1 0 0-12h-4a6 6 0 0 0-6 6c0 3.61 2.462 5.966 8 8.48V17z"
          />
        </svg>
      </button>
      <!-- Like btn -->
      <button
        type="button"
        @click="toggleLike"
        class="inline-flex items-center justify-center gap-2 p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
      >
        <span
          class="inline-flex justify-center items-center ml-2 w-4 h-4 text-xs font-semibold"
        >
          {{ props.post.likes ? props.post.likes.length : '0' }}
        </span>
        <svg
          v-if="!isLiked"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          class="w-5 h-5 fill-current"
          width="24"
          height="24"
        >
          <path fill="none" d="M0 0H24V24H0z" />
          <path
            d="M12.001 4.529c2.349-2.109 5.979-2.039 8.242.228 2.262 2.268 2.34 5.88.236 8.236l-8.48 8.492-8.478-8.492c-2.104-2.356-2.025-5.974.236-8.236 2.265-2.264 5.888-2.34 8.244-.228zm6.826 1.641c-1.5-1.502-3.92-1.563-5.49-.153l-1.335 1.198-1.336-1.197c-1.575-1.412-3.99-1.35-5.494.154-1.49 1.49-1.565 3.875-.192 5.451L12 18.654l7.02-7.03c1.374-1.577 1.299-3.959-.193-5.454z"
          />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          class="w-5 h-5 fill-red-500"
          width="24"
          height="24"
        >
          <path fill="none" d="M0 0H24V24H0z" />
          <path
            d="M12.001 4.529c2.349-2.109 5.979-2.039 8.242.228 2.262 2.268 2.34 5.88.236 8.236l-8.48 8.492-8.478-8.492c-2.104-2.356-2.025-5.974.236-8.236 2.265-2.264 5.888-2.34 8.244-.228z"
          />
        </svg>
      </button>
    </div>

    <!-- Comments -->
    <form v-if="state.showComments">
      <div class="flex items-end px-3 py-2 bg-gray-white dark:bg-gray-800">
        <textarea
          rows="1"
          v-model="state.comment"
          class="block mr-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Add a  comment"
        ></textarea>
        <button
          type="button"
          @click="addComment"
          class="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
        >
          <svg
            aria-hidden="true"
            class="w-6 h-6 rotate-90"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
            ></path>
          </svg>
          <span class="sr-only">Send message</span>
        </button>
      </div>
      <div
        v-if="props.post.comments?.length !== 0"
        class="bg-white dark:bg-gray-800 rounded-b-lg"
      >
        <template
          v-for="(comment, idx) in props.post.comments"
          :key="comment.id"
        >
          <div
            class="flex items-center px-3 py-2 border-b border-gray-200 dark:border-gray-600"
            :class="{
              'rounded-b-lg': idx === props.post.comments.length - 1
            }"
          >
            {{ comment.id }}
            <img
              @click="
                $router.push({
                  name: 'profile',
                  params: { handle: comment.author.handle }
                })
              "
              :src="comment.author.avatarUrl"
              class="w-10 h-10 rounded-full cursor-pointer"
            />
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                @{{ comment.author.handle }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ comment.content }}
              </p>
            </div>
          </div>
        </template>
      </div>
    </form>
  </div>

  <Dialog
    :open="state.showReportDialog"
    @close="state.showReportDialog = false"
    class="relative z-10"
  >
    <div class="fixed inset-0 bg-black bg-opacity-60" />
    <div class="fixed inset-0 overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4">
        <div
          class="w-full max-w-lg flex flex-col p-6 bg-white rounded-lg shadow dark:bg-gray-700"
        >
          <div
            class="text-white mb-6 block w-auto mx-auto p-4 rounded-full shadow-lg shadow-purple-400/30 bg-gradient-to-br from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="w-24 h-24 fill-current"
              width="24"
              height="24"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path
                d="M5 16v6H3V3h9.382a1 1 0 0 1 .894.553L14 5h6a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-6.382a1 1 0 0 1-.894-.553L12 16H5zM5 5v9h8.236l1 2H19V7h-6.236l-1-2H5z"
              />
            </svg>
          </div>
          <h2
            class="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white"
          >
            Report post
          </h2>
          <p class="text-gray-700 dark:text-gray-300 mb-6">
            You should report this post if it violates the
            <router-link
              to="/community-guidelines"
              target="_blank"
              class="text-blue-700 hover:underline dark:text-blue-400"
              >community guidelines</router-link
            >, contains illegal or inappropriate content, or it is spam. We will
            take prompt and appropriate action within 48 hours.
          </p>
          <form
            class="flex flex-col gap-6 justify-start"
            @submit.prevent="reportPost"
          >
            <AlertComponent
              v-if="!!reportForm.error"
              type="error"
              :message="reportForm.error"
            />
            <div>
              <label
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Post ID</label
              >
              <input
                type="text"
                disabled
                v-model="reportForm.postId"
                class="bg-gray-50 cursor-not-allowed border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required
              />
            </div>
            <div>
              <label
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Your user ID</label
              >
              <input
                type="text"
                disabled
                v-model="reportForm.userId"
                class="bg-gray-50 cursor-not-allowed border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required
              />
            </div>
            <div>
              <label
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Reason</label
              >
              <select
                v-model="reportForm.reason"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required
              >
                <option value="default" selected>Select a reason</option>
                <option value="community_guidelines">
                  Violates community guidelines
                </option>
                <option value="inappropriate">
                  Inappropriate or illegal content
                </option>
                <option value="spam">Spam</option>
                <option value="other">Other (specify in details)</option>
              </select>
            </div>
            <div>
              <label
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Details</label
              >
              <textarea
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                v-model="reportForm.details"
                rows="4"
              ></textarea>
            </div>
            <div class="flex items-center justify-center gap-4">
              <button
                type="submit"
                class="w-full text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2"
              >
                Submit report
              </button>
              <button
                type="reset"
                @click="state.showReportDialog = false"
                class="w-full text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import AlertComponent from '@/components/AlertComponent.vue'
import usePostStore from '@/stores/post'
import useUserStore from '@/stores/user'
import { serverTimestamp, Timestamp } from '@firebase/firestore'
import { Dialog, Menu, MenuButton, MenuItems } from '@headlessui/vue'
import { computed, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import LightboxComponent from './LightboxComponent.vue'
import {
  mdiMapMarkerOutline,
  mdiTrashCanOutline,
  mdiFlagOutline,
  mdiCommentOutline,
  mdiHeart,
  mdiHeartOutline,
  mdiSend,
  mdiClose,
  mdiDeleteOutline
} from '@mdi/js'
import useReportStore from '@/stores/report'

const emit = defineEmits(['delete', 'comment'])
const user = useUserStore()
const post = usePostStore()
const reportStore = useReportStore()
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
  comments: props.post.comments,
  comment: '',
  showReportDialog: false,
  isRecentlyActive: false,
  reportSubmitted: false
})
const reportForm = reactive({
  error: '',
  postId: props.post?.id,
  userId: user.user?.uid,
  reason: 'default',
  details: '',
  status: 'pending'
})

onMounted(async () => {
  state.showComments = props.post.comments?.length > 0 || props.expand
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
  post.toggleLike(props.post)
}
async function deletePost() {
  if (!user.isAuthenticated) {
    router.push('/login?redirect=/social/@' + props.post.author.handle)
  }
  if (!isOwnPost.value) {
    return
  }
  post.deletePost(props.post)
  emit('delete', props.post.id)
}
async function addComment() {
  if (!user.isAuthenticated) {
    router.push('/login?redirect=', route.path)
  }
  if (state.comment.length > 0) {
    state.comments = await post.addComment(props.post.id, state.comment)
    state.comment = ''
  }
}
async function deleteComment(commentId) {
  if (!user.isAuthenticated) {
    router.push('/login?redirect=', route.path)
  }
  state.comments = await post.deleteComment(props.post.id, commentId)
}
async function reportPost() {
  if (!user.isAuthenticated) {
    router.push('/login?then=/social/@' + props.post.author.handle)
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
  reportForm.timestamp = serverTimestamp()
  // send report
  const reportPath = `posts/${props.post.id}`
  await reportStore.createReport(reportPath, reportForm)
  state.reportSubmitted = true
}
</script>

<template>
  <div
    class="w-full bg-white shadow-sm rounded-lg border border-gray-300 text-base font-normal text-gray-700 dark:text-gray-400 dark:border-gray-700 dark:bg-gray-800"
  >
    <!-- Header -->
    <div class="flex items-start p-4 pb-2">
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
            class="h-10 w-10 rounded-full mr-4 border border-gray-200 dark:border-gray-700"
          />
          <div>
            <h6 class="font-medium text-gray-900 dark:text-white">
              @{{ props.post.author.handle }}
            </h6>
            <p class="text-xs text-gray-600 dark:text-gray-400 ml-1">
              {{ props.post.author.fullName }}
            </p>
          </div>
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
    <div class="flex flex-col gap-4 px-4 py-4">
      <p class="flex-1 mb-4 leading-relaxed text-gray-900 dark:text-white">
        {{ props.post.content }}
      </p>
      <div v-if="!!props.post.image" class="w-full">
        <LightboxComponent
          :image="props.post.image"
          classes="w-full h-full object-fit"
        />
      </div>
    </div>
    <!-- Action bar -->
    <div
      class="flex items-center justify-end py-2 px-3"
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
        <svg-icon
          :path="mdiMapMarkerOutline"
          type="mdi"
          class="w-5 h-5 fill-current"
        />
        {{ props.post.location }}
      </p>
      <!-- Delete btn -->
      <Menu as="div" class="relative" v-if="isOwnPost">
        <MenuButton
          type="button"
          class="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-7010"
        >
          <svg-icon
            :path="mdiTrashCanOutline"
            type="mdi"
            class="w-5 h-5 fill-current"
          />
        </MenuButton>
        <MenuItems
          class="flex flex-col absolute top-0 right-full w-64 mr-2 max-w-sm p-4 text-gray-800 bg-white border border-gray-300 rounded-lg shadow-md dark:text-white dark:bg-gray-800 dark:border-gray-600"
        >
          <p class="text-lg font-medium mb-4">Are you sure?</p>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Do you you want to delete this post and all of it's comments? This
            action cannot be undone.
          </p>
          <button
            type="button"
            @click="deletePost"
            class="flex items-center justify-center gap-2.5 w-full focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          >
            <svg-icon
              :path="mdiTrashCanOutline"
              type="mdi"
              class="flex-shrink-0 w-5 h-5 fill-current"
            />
            Yes, delete post.
          </button>
        </MenuItems>
      </Menu>
      <!-- Report button -->
      <button
        type="button"
        v-if="!isOwnPost"
        @click="state.showReportDialog = true"
        class="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-7010"
      >
        <svg-icon
          :path="mdiFlagOutline"
          type="mdi"
          class="w-5 h-5 fill-current"
        />
      </button>
      <!-- Comment counter -->
      <button
        type="button"
        @click="state.showComments = !state.showComments"
        class="inline-flex items-center justify-center gap-2 p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
      >
        <span
          class="inline-flex justify-center items-center ml-2 w-4 h-4 text-xs font-semibold"
        >
          {{ props.post.comments ? props.post.comments.length : '0' }}
        </span>
        <svg-icon
          :path="mdiCommentOutline"
          type="mdi"
          class="w-5 h-5 fill-current"
        />
      </button>
      <!-- Like btn -->
      <button
        type="button"
        @click="toggleLike"
        class="inline-flex items-center justify-center gap-2 p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
      >
        <span
          class="inline-flex justify-center items-center ml-2 w-4 h-4 text-xs font-semibold"
        >
          {{ props.post.likes ? props.post.likes.length : '0' }}
        </span>
        <svg-icon
          v-if="!isLiked"
          :path="mdiHeartOutline"
          type="mdi"
          class="w-5 h-5 fill-current"
        />
        <svg-icon
          v-else
          :path="mdiHeart"
          type="mdi"
          class="w-5 h-5 text-red-500"
        />
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
          <svg-icon :path="mdiSend" type="mdi" />
          <span class="sr-only">Send message</span>
        </button>
      </div>
      <div
        v-if="state.comments?.length !== 0"
        class="bg-white dark:bg-gray-800 rounded-b-lg px-3 divide-y divide-gray-200 dark:divide-gray-600 mb-2"
      >
        <template v-for="(comment, idx) in state.comments" :key="comment.id">
          <div class="flex items-center justify-between">
            <div
              class="flex items-center py-2"
              :class="{
                'rounded-b-lg': idx === props.post.comments.length - 1
              }"
            >
              <img
                @click="
                  $router.push({
                    name: 'profile',
                    params: { handle: comment.author.handle }
                  })
                "
                :src="comment.author.avatarUrl"
                class="w-10 h-10 rounded-full cursor-pointer border border-gray-200 dark:border-gray-700"
              />
              <div class="ml-3">
                <span
                  class="text-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  @{{ comment.author.handle }}
                </span>
                <p class="text-gray-700 text-sm dark:text-white">
                  {{ comment.content }}
                </p>
              </div>
            </div>
            <button
              type="button"
              @click="deleteComment(comment.id)"
              v-if="
                comment.author.handle === user.user?.handle ||
                user.user?.handle === props.post.author.handle
              "
              class="p-1.5 text-xs rounded-md bg-white text-red-500 hover:bg-red-500 hover:text-white dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-400 dark:hover:text-gray-900 transition-colors duration-200 ease-in-out"
            >
              <svg-icon
                :path="mdiTrashCanOutline"
                type="mdi"
                class="w-5 h-5 fill-current"
              />
            </button>
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
          v-if="!state.reportSubmitted"
          class="w-full max-w-lg flex flex-col p-6 bg-white rounded-lg shadow dark:bg-gray-700"
        >
          <div
            class="text-white mb-6 block w-auto mx-auto p-4 rounded-full shadow-lg shadow-purple-400/30 bg-gradient-to-br from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 dark:text-gray-800"
          >
            <svg-icon
              :path="mdiFlagOutline"
              type="mdi"
              class="w-24 h-24 fill-current"
            />
          </div>
          <h2
            class="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white"
          >
            Report Post
          </h2>
          <p class="text-gray-700 dark:text-gray-300 mb-6 leading-loose">
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
            <div
              class="flex flex-col-reverse md:flex-row items-center justify-center gap-4"
            >
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
        <div
          v-else
          class="w-full max-w-lg flex flex-col p-6 bg-white rounded-lg shadow dark:bg-gray-700"
        >
          <div
            class="text-white mb-6 block w-auto mx-auto p-4 rounded-full shadow-lg shadow-purple-400/30 bg-gradient-to-br from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 dark:text-gray-800"
          >
            <svg-icon
              :path="mdiFlagOutline"
              type="mdi"
              class="w-24 h-24 fill-current"
            />
          </div>
          <h2
            class="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white"
          >
            We have received your report
          </h2>
          <p class="text-gray-700 dark:text-gray-300 leading-loose mb-6">
            You post will be reviewed by our team within 48 hours and we will
            take appropriate action. If you have any questions, please
            <router-link
              to="/support"
              class="text-blue-700 dark:text-blue-400 hover:underline"
              >contact us</router-link
            >. Thanks for helping us keep the community safe.
          </p>
          <button
            type="reset"
            @click="state.showReportDialog = false"
            class="w-full text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </Dialog>
</template>

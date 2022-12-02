<script setup>
import useUserStore from '@/stores/user'
import axios from 'axios'
import { defineProps, onMounted, onUpdated, reactive, ref } from 'vue'
import LightboxComponent from './LightboxComponent.vue'
import ModalComponent from './ModalComponent.vue'

const userStore = useUserStore()

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
  post: props.post,
  liked: false,
  isPostOwner: false,
  commentsExpended: false,
  newComment: '',
  commentError: '',
  reportMenuOpen: false
})
onMounted(() => {
  state.commentsExpended =
    JSON.parse(state.post.comments).length > 0 || props.expand
  state.post = props.post
  state.liked = state.post.liked_by.includes(userStore.getHandle)
  state.isPostOwner = state.post.user_id === userStore.user.id
})
onUpdated(() => {
  state.post = props.post
  state.liked = state.post.liked_by.includes(userStore.getHandle)
  state.isPostOwner = state.post.user_id === userStore.user.id
  state.commentsExpended =
    JSON.parse(state.post.comments).length > 0 || props.expand
})

const reportForm = ref() // <form> ...

async function handleLike() {
  if (state.liked) {
    try {
      const response = await axios.post(
        `/api/post/${state.post.id}/unlike`,
        {},
        {
          headers: {
            Authorization: userStore.getBearerToken
          }
        }
      )
      if (response.status === 200) {
        state.liked = false
        userStore.updatePost(response.data.post.id, response.data.post)
        state.post = response.data.post
      }
    } catch (error) {
      console.log(error)
    }
  } else {
    try {
      const response = await axios.post(
        `/api/post/${state.post.id}/like`,
        {},
        {
          headers: {
            Authorization: userStore.getBearerToken
          }
        }
      )
      if (response.status === 200) {
        state.liked = true
        userStore.updatePost(response.data.post.id, response.data.post)
        state.post = response.data.post
      }
    } catch (error) {
      console.log(error)
    }
  }
}
function timeSince(date) {
  var seconds = Math.floor((new Date() - date) / 1000)

  var interval = seconds / 31536000

  if (interval > 1) {
    return Math.floor(interval) + ' years'
  }
  interval = seconds / 2592000
  if (interval > 1) {
    return Math.floor(interval) + ' months'
  }
  interval = seconds / 86400
  if (interval > 1) {
    return Math.floor(interval) + ' days'
  }
  interval = seconds / 3600
  if (interval > 1) {
    return Math.floor(interval) + ' hours'
  }
  interval = seconds / 60
  if (interval > 1) {
    return Math.floor(interval) + ' minutes'
  }
  return Math.floor(seconds) + ' seconds'
}
async function deletePost() {
  let id = state.post.id
  try {
    const response = await axios.delete(`/api/post/${id}`, {
      headers: {
        Authorization: userStore.getBearerToken
      }
    })
    if (response.status === 200) {
      userStore.removePost(id)
    }
  } catch (err) {
    console.log(err)
  }
}
async function addComment() {
  state.commentError = ''
  if (!state.newComment) {
    state.commentError = 'Comment cannot be empty'
    return
  }
  try {
    const response = await axios.post(
      `/api/post/${state.post.id}/comment`,
      {
        content: state.newComment
      },
      {
        headers: {
          Authorization: userStore.getBearerToken
        }
      }
    )
    if (response.status === 200) {
      state.post.comments.push(response.data.comment)
      state.newComment = ''
    }
  } catch (error) {
    console.log(error)
  }
}
async function reportPost() {
  const form = reportForm.value
  console.log(form)
  state.reportMenuOpen = false
}
</script>

<template>
  <div
    class="bg-white border border-gray-300 rounded-lg w-full dark:bg-gray-800 dark:border-gray-600"
  >
    <!-- Header -->
    <div class="flex items-center p-4 pb-2">
      <div
        class="flex items-center cursor-pointer mr-auto"
        @click="$router.push(`/social/@${state.post.owner_handle}`)"
      >
        <img :src="state.post.owner_avatar" class="h-8 w-8 rounded-full mr-4" />
        <h6 class="font-medium text-gray-900 dark:text-white">
          {{ state.post.owner_handle }}
        </h6>
      </div>
      <p class="text-xs text-gray-600 dark:text-gray-400">
        {{ timeSince(new Date(state.post.created_at)) }}
        ago
      </p>
    </div>
    <!-- Body -->
    <div
      class="flex flex-col md:flex-row justify-start md:justify-between items-start gap-4 px-4 py-4"
    >
      <div class="w-1/2">
        <p class="text-gray-800 dark:text-white font-medium">
          {{ state.post.content }}
        </p>
      </div>
      <div class="w-1/2">
        <LightboxComponent
          :image="state.post.image_uri"
          class="rounded-lg object-cover"
        />
      </div>
    </div>
    <!-- Action bar -->
    <div
      class="flex items-center justify-end py-2 px-3 bg-gray-50 border-t rounded-b-lg dark:border-gray-600 dark:bg-gray-700"
    >
      <p
        v-if="!!state.post.location"
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
        {{ state.post.location }}
      </p>
      <!-- Delete btn -->
      <button
        v-if="state.isPostOwner"
        @click="deletePost()"
        type="button"
        class="inline-flex items-center justify-center gap-2 p-2 text-red-500 rounded font-medium text-xs hover:text-red-700 hover:bg-white dark:text-red-400 dark:hover:bg-gray-600"
      >
        DELETE
      </button>
      <!-- report btn -->
      <form @submit.prevent="reportPost()" ref="reportForm">
        <ModalComponent v-if="userStore.user.id !== state.post.user_id">
          <template #button>
            <button
              type="button"
              class="ml-2 inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-white dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
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
          </template>
          <template #content>
            <div class="flex flex-col gap-4 p-4">
              <div
                class="text-white mx-auto p-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  class="w-16 h-16 fill-current"
                  width="24"
                  height="24"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path
                    d="M5 16v6H3V3h9.382a1 1 0 0 1 .894.553L14 5h6a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-6.382a1 1 0 0 1-.894-.553L12 16H5zM5 5v9h8.236l1 2H19V7h-6.236l-1-2H5z"
                  />
                </svg>
              </div>
              <h3 class="text-2xl text-center font-bold dark:text-white">
                Report Post
              </h3>
              <div class="flex flex-col gap-4">
                <label
                  class="cursor-pointer bg-gray-50 rounded-lg border border-gray-300 dark:border-gray-600 p-4 w-full text-sm font-medium text-gray-900 dark:text-gray-300 dark:bg-gray-800"
                >
                  <input
                    type="checkbox"
                    value="inappropriate"
                    name="report_reason"
                    class="w-4 h-4 mr-2 text-blue-600 bg-white rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  This post contains inappropriate content
                </label>
                <label
                  class="cursor-pointer bg-gray-50 rounded-lg border border-gray-300 dark:border-gray-600 p-4 w-full text-sm font-medium text-gray-900 dark:text-gray-300 dark:bg-gray-800"
                >
                  <input
                    type="checkbox"
                    name="report_reason"
                    value="community_guidelines"
                    class="w-4 h-4 mr-2 text-blue-600 bg-white rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  This post violates the Community Guidelines
                </label>
                <label
                  class="cursor-pointer bg-gray-50 rounded-lg border border-gray-300 dark:border-gray-600 p-4 w-full text-sm font-medium text-gray-900 dark:text-gray-300 dark:bg-gray-800"
                >
                  <input
                    type="checkbox"
                    name="report_reason"
                    value="spam"
                    class="w-4 h-4 mr-2 text-blue-600 bg-white rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  This post is spam or malicious
                </label>
                <label
                  class="cursor-pointer bg-gray-50 rounded-lg border border-gray-300 dark:border-gray-600 p-4 w-full text-sm font-medium text-gray-900 dark:text-gray-300 dark:bg-gray-800"
                >
                  <input
                    type="checkbox"
                    name="report_reason"
                    value="other"
                    class="w-4 h-4 mr-2 text-blue-600 bg-white rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  Other <small>(please specify)</small>
                </label>
              </div>
              <textarea
                rows="4"
                name="report_reason_other"
                class="block mb-4 p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Details (optional)"
              ></textarea>
            </div>
          </template>
          <template #actions>
            <button
              type="submit"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Report
            </button>
          </template>
        </ModalComponent>
      </form>
      <!-- comments btn -->
      <button
        type="button"
        @click="state.commentsExpended = !state.commentsExpended"
        class="inline-flex items-center justify-center gap-2 p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
      >
        <span
          class="inline-flex justify-center items-center ml-2 w-4 h-4 text-xs font-semibold"
        >
          {{
            !!state.post.comments ? JSON.parse(state.post.comments).length : ''
          }}
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

      <!-- like btn -->
      <button
        type="button"
        @click="handleLike()"
        class="inline-flex items-center justify-center gap-2 p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
      >
        <span
          class="inline-flex justify-center items-center ml-2 w-4 h-4 text-xs font-semibold"
        >
          {{ !!state.post.liked_by ? state.post.liked_by.length : '' }}
        </span>
        <svg
          v-if="!state.liked"
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
    <div
      v-if="state.commentsExpended"
      class="p-4 pt-2 border-t border-gray-300 dark:border-gray-700"
    >
      <div
        v-for="comment of JSON.parse(state.post.comments)"
        :key="comment"
        class="flex items-start w-full mb-4"
      >
        <router-link
          class="flex-shrink-0"
          :to="{ name: 'profile', params: { handle: comment.handle } }"
        >
          <img :src="comment.avatar" class="block w-8 h-8 rounded-full" />
        </router-link>
        <div class="flex flex-col ml-2">
          <p class="text-gray-900 text-sm dark:text-white">
            {{ comment.comment }}
          </p>
          <p class="text-xs text-gray-700 dark:text-gray-400">
            on {{ new Date(comment.created_at).toLocaleString() }}
          </p>
        </div>
      </div>
      <!-- New comment -->
      <div class="w-full relative mt-4">
        <input
          type="text"
          v-model="state.newComment"
          @keyup.enter="addComment()"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Add a comment"
        />
        <button
          type="button"
          @click="addComment()"
          class="absolute inset-y-0 right-0 m-px text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg rounded-l-none text-sm p-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>
      <span v-if="!!state.commentError" class="-mt-4 text-red-500 text-xs">
        {{ state.commentError }}
      </span>
    </div>
  </div>
</template>

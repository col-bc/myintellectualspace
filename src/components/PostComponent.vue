<script setup>
import { defineProps, onMounted, reactive } from 'vue'
import ModalComponent from './ModalComponent.vue'
import useUserStore from '@/stores/user'
import axios from 'axios'

const userStore = useUserStore()

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})
const state = reactive({
  post: props.post,
  liked: false,
  shoeUserMenu: false,
  newComment: '',
  commentError: '',
  reportMenuOpen: false
})
onMounted(() => {
  state.post = props.post
  state.liked = state.post.liked_by.includes(userStore.getHandle)
})

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
</script>

<template>
  <div
    class="bg-white border border-gray-300 rounded-lg w-full dark:bg-gray-800 dark:border-gray-700"
  >
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
    <div
      class="flex flex-col md:flex-rowr justify-start items-start gap-4 px-4 py-2"
    >
      <p class="text-gray-800 flex-1 dark:text-white font-medium">
        {{ state.post.content }}
      </p>
      <img
        v-if="state.post.image_uri"
        :src="state.post.image_uri"
        class="w-full h-fll md:w-48 lg:w-1/2 rounded object-cover"
      />
    </div>
    <div class="px-4 py-2 flex items-center justify-end">
      <p
        v-if="!!state.post.location"
        class="flex items-center gap-2 mr-auto text-xs text-gray-700 dark:text-gray-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-4 h-4"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        {{ state.post.location }}
      </p>
      <p class="text-xs text-gray-700 dark:text-gray-300 ml-2">
        {{ state.post.liked_by.length }}
      </p>
      <!-- like btn -->
      <button
        type="button"
        @click="handleLike()"
        class="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
      >
        <svg
          v-if="!state.liked"
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
          <path
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
          />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5 fill-red-500 stroke-red-500"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
          />
        </svg>
      </button>
      <p class="text-xs text-gray-700 dark:text-gray-300 ml-2">
        {{ JSON.parse(state.post.comments).length }}
      </p>
      <!-- comments btn -->
      <button
        type="button"
        class="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
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
          <path
            d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
          />
        </svg>
      </button>
      <!-- user menu -->
      <div class="relative ml-2">
        <button
          v-if="userStore.user.id === state.post.user_id"
          @click="state.showUserMenu = !state.showUserMenu"
          type="button"
          class="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
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
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </button>
        <div
          v-if="state.showUserMenu"
          class="absolute right-0 top-full z-10 w-44 bg-white rounded border border-gray-300 shadow dark:bg-gray-700 dark:border-gray-600"
        >
          <ul
            class="py-1 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownDefault"
          >
            <li>
              <a
                href="#"
                class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >Edit Post</a
              >
            </li>
            <li>
              <a
                href="#"
                @click="deletePost()"
                class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >Delete Post</a
              >
            </li>
          </ul>
        </div>
      </div>
      <!-- report btn -->
      <ModalComponent v-if="userStore.user.id !== state.post.user_id">
        <template #button>
          <button
            type="button"
            class="ml-2 inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
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
              <path
                d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"
              />
              <line x1="4" y1="22" x2="4" y2="15" />
            </svg></button
        ></template>
        <template #content>
          <div class="flex flex-col gap-4 p-4">
            <h3 class="text-xl font-bold dark:text-white">Report Post</h3>
            <p class="text-gray-700 dark:text-gray-300">
              Reports are taken seriously. You may report a post if it goes
              against our community guidelines or if it is spam.
            </p>
            <select
              id="countries"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option selected>Choose a reason</option>
              <option value="">
                This post contains inappropriate material.
              </option>
              <option value="">This post violates community guidelines.</option>
              <option value="">This post is spam.</option>
              <option value="">Other</option>
            </select>
            <textarea
              rows="4"
              class="block mb-4 p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Details (optional)"
            ></textarea>
            <button
              type="button"
              @click="$emit('close')"
              class="py-2.5 px-5 w-full text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              CANCEL
            </button>
            <button
              type="button"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              REPORT POST
            </button>
          </div>
        </template>
      </ModalComponent>
    </div>
    <div class="p-4 pt-2 border-t border-gray-300 dark:border-gray-700">
      <div
        v-for="comment of JSON.parse(state.post.comments)"
        :key="comment"
        class="flex items-start w-full mb-2"
      >
        <router-link
          :to="{ name: 'profile', params: { handle: comment.handle } }"
        >
          <img :src="comment.avatar" class="w-8 h-8 rounded-full" />
        </router-link>
        <div class="flex flex-col ml-2">
          <p class="text-gray-900 dark:text-white">{{ comment.comment }}</p>
          <p class="text-xs text-gray-700 dark:text-gray-400">
            on {{ new Date(comment.created_at).toLocaleString() }}
          </p>
        </div>
      </div>
      <div class="w-full relative mt-2">
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

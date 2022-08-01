<script setup>
import { defineProps, onMounted, ref } from 'vue'
import useUserStore from '@/stores/user'
import axios from 'axios'

const userStore = useUserStore()

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
})
onMounted(() => {
  postData.value = props.post
})
const postData = ref({})
const showOwnerMenu = ref(false)
const showFlagMenu = ref(false)

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
  var postId = postData.value.id
  try {
    const response = await axios.delete(`/api/post/${postId}`, {
      headers: {
        Authorization: userStore.getBearerToken,
      },
    })
    if (response.status === 200) {
      userStore.removePost(postId)
    }
  } catch (err) { }
}
</script>

<template>
  <div class="bg-white shadow-sm border border-gray-200 rounded-lg w-full">
    <div @click="$router.push(`/social/@${postData.owner_handle}`)"
         class="cursor-pointer flex items-center mb-3 p-4 pb-0">
      <img :src="postData.owner_avatar"
           class="h-8 w-8 rounded-full mr-4" />
      <h6 class="font-medium text-gray-900 mr-auto">
        {{ postData.owner_handle }}
      </h6>
      <p class="text-xs text-gray-600">
        {{ timeSince(new Date(postData.created_at)) }}
        ago
      </p>
    </div>
    <div class="flex justify-start px-4 py-2">
      <img v-if="postData.image_uri"
           :src="postData.image_uri"
           class="h-fll w-48 ml-4 object-cover" />
      <p class="text-gray-800">{{ postData.content }}</p>
    </div>
    <div class="px-4 pt-2 bg-gray-50 flex items-center justify-end rounded-b-lg">
      <p class="mr-auto text-xs text-gray-700">
        {{ postData.location }}
      </p>
      <p class="text-xs text-gray-700">{{ postData.liked_by }}</p>
      <button type="button"
              class="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
        <svg xmlns="http://www.w3.org/2000/svg"
             class="h-6 w-6"
             fill="none"
             viewBox="0 0 24 24"
             stroke="currentColor"
             stroke-width="2">
          <path stroke-linecap="round"
                stroke-linejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
      <button type="button"
              class="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
        <svg xmlns="http://www.w3.org/2000/svg"
             class="h-6 w-6"
             fill="none"
             viewBox="0 0 24 24"
             stroke="currentColor"
             stroke-width="2">
          <path stroke-linecap="round"
                stroke-linejoin="round"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>
      <div class="relative">
        <button v-if="userStore.user.id === postData.user_id"
                @click="showOwnerMenu = !showOwnerMenu"
                type="button"
                class="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg"
               class="h-6 w-6"
               fill="none"
               viewBox="0 0 24 24"
               stroke="currentColor"
               stroke-width="2">
            <path stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
        <div v-if="showOwnerMenu"
             class="absolute right-0 top-full z-10 w-44 bg-white rounded border border-gray-200 shadow dark:bg-gray-700">
          <ul class="py-1 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdownDefault">
            <li>
              <a href="#"
                 class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Edit Post</a>
            </li>
            <li>
              <a href="#"
                 @click="deletePost()"
                 class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete Post</a>
            </li>
          </ul>
        </div>
      </div>
      <button v-if="userStore.user.id !== postData.user_id"
              type="button"
              class="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
        <svg xmlns="http://www.w3.org/2000/svg"
             class="h-6 w-6"
             fill="none"
             viewBox="0 0 24 24"
             stroke="currentColor"
             stroke-width="2">
          <path stroke-linecap="round"
                stroke-linejoin="round"
                d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
        </svg>
      </button>
    </div>
  </div>
</template>

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
  if (postData.value.liked_by.includes(userStore.getUserId)) {
    liked.value = true
  }
})
const postData = ref({})
const liked = ref(false)
const showOwnerMenu = ref(false)
const showFlagMenu = ref(false)


async function handleLike() {
  if (liked.value) {
    try {
      const response = await axios.post(
        `/api/post/${postData.value.id}/unlike/`,
        {},
        {
          headers: {
            Authorization: userStore.getBearerToken,
          },
        }
      )
      if (response.status === 200) {
        liked.value = false
        userStore.updatePost(postData.value.id, response.data.post)
      }
    } catch (error) {
      console.log(error)
    }
  } else {
    try {
      const response = await axios.post(
        `/api/post/${postData.value.id}/like`,
        {},
        {
          headers: {
            Authorization: userStore.getBearerToken,
          },
        }
      )
      if (response.status === 200) {
        liked.value = true
        userStore.updatePost(postData.value.id, response.data.post)
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
  <div class="bg-white border border-gray-200 rounded-lg w-full dark:bg-gray-800 dark:border-gray-600">
    <div @click="$router.push(`/social/@${postData.owner_handle}`)"
         class="cursor-pointer flex items-center mb-3 p-4 pb-0">
      <img :src="postData.owner_avatar"
           class="h-8 w-8 rounded-md mr-4" />
      <h6 class="font-medium text-gray-900 mr-auto dark:text-white">
        {{ postData.owner_handle }}
      </h6>
      <p class="text-xs text-gray-600 dark:text-gray-400">
        {{ timeSince(new Date(postData.created_at)) }}
        ago
      </p>
    </div>
    <div class="flex justify-start items-start gap-4 px-4 py-2">
      <p class="text-gray-800 flex-1  dark:text-white font-medium">{{ postData.content }}</p>
      <img v-if="postData.image_uri"
           :src="postData.image_uri"
           class="h-fll w-48 lg:w-1/2 object-cover" />
    </div>
    <div class="px-4 pt-2  flex items-center justify-end rounded-b-lg border-t border-gray-300 dark:border-gray-600">
      <p class="mr-auto text-xs text-gray-700 dark:text-gray-300">
        {{ postData.location }}
      </p>
      <p class="text-xs text-gray-700">{{ postData.liked_by }}</p>
      <button type="button"
              @click="handleLike()"
              class="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
        <svg v-if="!liked"
             xmlns="http://www.w3.org/2000/svg"
             class="w-6 h-6 fill-current"
             viewBox="0 0 24 24"
             width="24"
             height="24">
          <path fill="none"
                d="M0 0H24V24H0z" />
          <path d="M12.001 4.529c2.349-2.109 5.979-2.039 8.242.228 2.262 2.268 2.34 5.88.236 8.236l-8.48 8.492-8.478-8.492c-2.104-2.356-2.025-5.974.236-8.236 2.265-2.264 5.888-2.34 8.244-.228z" />
        </svg>
        <svg v-else
             xmlns="http://www.w3.org/2000/svg"
             class="w-6 h-6 fill-red-600"
             viewBox="0 0 24 24"
             width="24"
             height="24">
          <path fill="none"
                d="M0 0H24V24H0z" />
          <path d="M12.001 4.529c2.349-2.109 5.979-2.039 8.242.228 2.262 2.268 2.34 5.88.236 8.236l-8.48 8.492-8.478-8.492c-2.104-2.356-2.025-5.974.236-8.236 2.265-2.264 5.888-2.34 8.244-.228z" />
        </svg>
      </button>
      <button type="button"
              class="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
        <svg xmlns="http://www.w3.org/2000/svg"
             class="w-6 h-6 fill-current"
             viewBox="0 0 24 24"
             width="24"
             height="24">
          <path fill="none"
                d="M0 0h24v24H0z" />
          <path d="M16.8 19L14 22.5 11.2 19H6a1 1 0 0 1-1-1V7.103a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1V18a1 1 0 0 1-1 1h-5.2zM2 2h17v2H3v11H1V3a1 1 0 0 1 1-1z" />
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
             class="h-6 w-6 fill-current"
             viewBox="0 0 24 24"
             width="24"
             height="24">
          <path fill="none"
                d="M0 0h24v24H0z" />
          <path d="M3 3h9.382a1 1 0 0 1 .894.553L14 5h6a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-6.382a1 1 0 0 1-.894-.553L12 16H5v6H3V3z" />
        </svg>
      </button>
    </div>
  </div>
</template>

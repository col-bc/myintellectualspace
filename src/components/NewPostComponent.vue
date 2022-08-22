<script setup>
import { reactive } from 'vue'
import axios from 'axios'

import AlertComponent from '@/components/AlertComponent.vue'
import useUserStore from '@/stores/user'

const userStore = useUserStore()

const newPost = reactive({
  error: '',
  content: '',
  location: '',
  image: null,
  imageUrl: null
})
async function selectPostImage() {
  var input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/png, image/jpg, image/jpeg, image/gif'
  input.onchange = async () => {
    const file = input.files[0]
    newPost.image = file
    const reader = new FileReader()
    reader.onload = (e) => {
      newPost.imageUrl = e.target.result
    }
    reader.readAsDataURL(file)
  }
  input.click()
}
function verifyForm() {
  if (!newPost.content) {
    newPost.error = 'Post body cannot be blank'
  }
}
async function createPost() {
  verifyForm()
  if (newPost.error) {
    return
  }
  const formData = new FormData()
  formData.append('content', newPost.content)
  formData.append('location', newPost.location)
  formData.append('image', newPost.image)

  try {
    const response = await axios.post('/api/post/', formData, {
      headers: {
        Authorization: userStore.getBearerToken,
        'Content-Type': 'multiple/form-data'
      }
    })
    if (response.status === 201) {
      newPost.content = ''
      newPost.location = ''
      newPost.image = null
      newPost.imageUrl = null
      newPost.error = ''

      userStore.addPost(response.data.post)
    }
  } catch (error) {
    console.log(error)
    newPost.error = error.response.data
  }
}
async function getPostLocation() {
  try {
    const { data } = await axios.get('https://ipinfo.io/json', {
      headers: { Authorization: 'Bearer c63cde3ca6489b' }
    })
    newPost.location = `${data.city}, ${data.region}, ${data.country}`
  } catch (err) {
    newPost.error = 'Could not get your location'
  }
}
</script>

<template>
  <form @submit.prevent="verifyForm()">
    <div
      class="mb-4 w-full bg-white shadow-sm rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-600"
    >
      <div class="flex py-2 px-4">
        <textarea
          v-model="newPost.content"
          rows="4"
          class="flex-1 px-0 w-full text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
          placeholder="Share with your network"
        ></textarea>
        <img
          v-if="newPost.image !== null"
          :src="newPost.imageUrl"
          class="h-fll w-48 ml-4 object-cover"
        />
      </div>
      <AlertComponent
        :message="newPost.error"
        v-if="!!newPost.error"
        :dismissible="false"
        type="error"
      />
      <div
        class="flex justify-between items-center py-2 px-3 border-t dark:border-gray-600"
      >
        <button
          type="submit"
          @click="createPost()"
          class="inline-flex items-center gap-2.5 py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
        >
          <svg
            viewBox="0 0 24 24"
            class="h-4 w-4"
            width="24"
            height="24"
            stroke="currentColor"
            stroke-width="2"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
          Submit Post
        </button>
        <div class="flex pl-0 space-x-1 sm:pl-2 items-center">
          <p class="text-xs dark:text-gray-400">{{ newPost.location }}</p>
          <button
            type="button"
            @click="getPostLocation()"
            class="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-white dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
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
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span class="sr-only">Set location</span>
          </button>
          <button
            type="button"
            @click="selectPostImage()"
            class="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-white dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
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
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span class="sr-only">Upload image</span>
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

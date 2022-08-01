<script setup>
import { reactive } from 'vue'
import axios from 'axios'
import useUserStore from '@/stores/user';

const userStore = useUserStore();

const newPost = reactive({
  error: '',
  content: '',
  location: '',
  image: null,
  imageUrl: null,
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
function verifyNewPost() {
  if (!newPost.content) {
    newPost.error = 'You must say something!'
  }
}
async function createPost() {
  verifyNewPost()
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
        'Content-Type': 'application/json',
      },
    })
    if (response.status === 201) {
      newPost.content = ''
      newPost.location = ''
      newPost.image = null
      newPost.imageUrl = null
      newPost.error = ''

      userStore.addPost(response.data)
      user.data = userStore.getUser
    }
  } catch (error) {
    newPost.error = error.response.data.message
  }
}
async function getPostLocation() {
  try {
    const { data } = await axios.get('https://ipinfo.io/json', {
      headers: { Authorization: 'Bearer c63cde3ca6489b' },
    })
    newPost.location = `${data.city}, ${data.region}, ${data.country}`
  } catch (err) {
    newPost.error = 'Could not get your location'
  }
}
</script>

<template>
  <form @submit.prevent="verifyNewPost()">
    <div class="mb-4 w-full bg-gray-50 shadow-sm rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
      <AlertComponent :message="newPost.error"
                      v-if="!!newPost.error"
                      :dismissible="false" />
      <div class="flex py-2 px-4 bg-white rounded-t-lg dark:bg-gray-800">
        <textarea v-model="newPost.content"
                  rows="4"
                  class="flex-1 px-0 w-full text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                  placeholder="Share with your network"></textarea>
        <img v-if="newPost.image !== null"
             :src="newPost.imageUrl"
             class="h-fll w-48 ml-4 object-cover" />
      </div>
      <div class="flex justify-between items-center py-2 px-3 border-t dark:border-gray-600">
        <button type="submit"
                @click="createPost()"
                class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
          Submit Post
        </button>
        <div class="flex pl-0 space-x-1 sm:pl-2 items-center">
          <p class="text-xs">{{ newPost.location }}</p>
          <button type="button"
                  @click="getPostLocation()"
                  class="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
            <svg aria-hidden="true"
                 class="w-5 h-5"
                 fill="currentColor"
                 viewBox="0 0 20 20"
                 xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clip-rule="evenodd"></path>
            </svg>
            <span class="sr-only">Set location</span>
          </button>
          <button type="button"
                  @click="selectPostImage()"
                  class="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
            <svg aria-hidden="true"
                 class="w-5 h-5"
                 fill="currentColor"
                 viewBox="0 0 20 20"
                 xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clip-rule="evenodd"></path>
            </svg>
            <span class="sr-only">Upload image</span>
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup>
import AlertComponent from '@/components/AlertComponent.vue'
import useUserStore from '@/stores/user'
import { reactive } from 'vue'

const user = useUserStore()

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
  await user.addPost({
    content: newPost.content,
    location: newPost.location,
    image: newPost.image,
    likes: [],
    comments: []
  })
  // reset form
  newPost.content = ''
  newPost.location = ''
  newPost.image = null
  newPost.imageUrl = null
}
async function getPostLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      newPost.location = `${position.coords.latitude},${position.coords.longitude}`
    })
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
          rows="6"
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
        class="flex justify-between items-center py-2 px-3 bg-gray-50 border-t dark:border-gray-600 dark:bg-gray-700"
      >
        <button
          type="submit"
          @click="createPost()"
          class="inline-flex items-center gap-2.5 py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
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
              d="M3.741 1.408l18.462 10.154a.5.5 0 0 1 0 .876L3.741 22.592A.5.5 0 0 1 3 22.154V1.846a.5.5 0 0 1 .741-.438zM5 13v6.617L18.85 12 5 4.383V11h5v2H5z"
            />
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
              viewBox="0 0 24 24"
              class="w-5 h-5 fill-current"
              width="24"
              height="24"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path
                d="M12 23.728l-6.364-6.364a9 9 0 1 1 12.728 0L12 23.728zm4.95-7.778a7 7 0 1 0-9.9 0L12 20.9l4.95-4.95zM12 13a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"
              />
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
              viewBox="0 0 24 24"
              class="w-5 h-5 fill-current"
              width="24"
              height="24"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path
                d="M4.828 21l-.02.02-.021-.02H2.992A.993.993 0 0 1 2 20.007V3.993A1 1 0 0 1 2.992 3h18.016c.548 0 .992.445.992.993v16.014a1 1 0 0 1-.992.993H4.828zM20 15V5H4v14L14 9l6 6zm0 2.828l-6-6L6.828 19H20v-1.172zM8 11a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"
              />
            </svg>
            <span class="sr-only">Upload image</span>
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

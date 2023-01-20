<script setup>
import AlertComponent from '@/components/AlertComponent.vue'
import { MAPS_API_KEY } from '@/secrets'
import useUserStore from '@/stores/user'
import usePostStore from '@/stores/post'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import { reactive, watch } from 'vue'
import LoaderComponent from './LoaderComponent.vue'
import { mdiSendOutline, mdiMapMarkerOutline, mdiImageOutline } from '@mdi/js'

const user = useUserStore()
const post = usePostStore()
const storage = getStorage()

const emit = defineEmits(['postCreated'])
const state = reactive({
  loading: false,
  locationLoading: false
})
const newPost = reactive({
  error: '',
  content: '',
  location: '',
  image: null,
  imageUrl: null
})

watch(
  () => newPost.error,
  (error) => {
    if (error) {
      setTimeout(() => {
        newPost.error = ''
      }, 3000)
    }
  }
)

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
  if (newPost.error) return
  state.loading = true
  if (newPost.image) {
    // upload image to firebase storage
    const storageRef = ref(
      storage,
      `posts/${user.user.uid}/${newPost.image.name}`
    )
    await uploadBytes(storageRef, newPost.image)
    newPost.imageUrl = await getDownloadURL(storageRef)
    // create post
    await post.addPost({
      content: newPost.content,
      location: newPost.location,
      likes: [],
      comments: [],
      image: newPost.imageUrl
    })
  } else {
    try {
      await post.addPost({
        content: newPost.content,
        location: newPost.location,
        likes: [],
        comments: []
      })
      emit('postCreated')
    } catch (e) {
      console.log(e)
    }
  }

  // reset form
  newPost.content = ''
  newPost.location = ''
  newPost.image = null
  newPost.imageUrl = null
  state.loading = false
}
async function getGeolocation() {
  if (navigator.geolocation) {
    state.locationLoading = true
    try {
      navigator.geolocation.getCurrentPosition(async (position) => {
        // resolve position with google maps api
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=${MAPS_API_KEY}`,
          {
            method: 'GET'
          }
        )
        const data = await response.json()
        // extract city and country from address components
        const city = data.results[0].address_components.find(
          (component) => component.types[0] === 'locality'
        )
        const country = data.results[0].address_components.find(
          (component) => component.types[0] === 'country'
        )
        newPost.location = `${city.long_name}, ${country.long_name}`
        state.locationLoading = false
      })
    } catch (err) {
      state.locationLoading = false
      newPost.error = err
    } finally {
      state.locationLoading = false
    }
  }
}
</script>

<template>
  <form @submit.prevent="verifyForm()">
    <div
      class="w-full bg-white shadow-sm rounded-lg border border-gray-300 text-base font-normal text-gray-700 dark:text-gray-400 dark:border-gray-700 dark:bg-gray-800"
    >
      <AlertComponent
        :message="newPost.error"
        v-if="!!newPost.error"
        type="error"
      />
      <div class="flex py-2 px-4">
        <textarea
          v-model="newPost.content"
          rows="6"
          class="flex-1 px-0 w-full text-sm text-gray-900 bg-transparent border-0 focus:ring-0 dark:text-white dark:placeholder-gray-400"
          placeholder="Share with your network"
        ></textarea>
        <img
          v-if="newPost.image !== null"
          :src="newPost.imageUrl"
          class="h-fll w-48 ml-4 object-cover"
        />
      </div>

      <div
        class="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-b-lg border-t dark:border-gray-600 dark:bg-gray-700"
      >
        <button
          type="submit"
          @click="createPost()"
          :disabled="state.loading"
          class="inline-flex items-center gap-2.5 py-2.5 px-4 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
        >
          <LoaderComponent v-if="state.loading" />
          <template v-else>
            Share Post
            <svg-icon
              :path="mdiSendOutline"
              type="mdi"
              class="w-5 h-5 fill-current"
            />
          </template>
        </button>
        <div class="flex pl-0 space-x-1 sm:pl-2 items-center">
          <p class="text-xs dark:text-gray-400">{{ newPost.location }}</p>
          <button
            type="button"
            @click="getGeolocation"
            class="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-white dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
          >
            <svg-icon
              v-if="!state.locationLoading"
              :path="mdiMapMarkerOutline"
              type="mdi"
              class="w-5 h-5 fill-current"
            />
            <LoaderComponent v-else size="sm" />
            <span class="sr-only">Set location</span>
          </button>
          <button
            type="button"
            @click="selectPostImage"
            class="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-white dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
          >
            <svg-icon
              :path="mdiImageOutline"
              type="mdi"
              class="w-5 h-5 fill-current"
            />
            <span class="sr-only">Upload image</span>
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

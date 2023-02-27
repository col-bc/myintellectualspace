<script setup>
import { reactive, watch, onMounted } from 'vue'
import AlertComponent from '@/components/AlertComponent.vue'
import LoaderComponent from '@/components/LoaderComponent.vue'
import {
  mdiPlus,
  mdiClose,
  mdiMovieRoll,
  mdiVideoBox,
  mdiCloudUploadOutline,
  mdiContentSaveOutline,
  mdiTimerOutline
} from '@mdi/js'
import useLectureStore from '@/stores/lecture'

const lectures = useLectureStore()
const props = defineProps({
  lecture: {
    type: Object,
    default: null
  }
})
const state = reactive({
  error: null,
  loading: false,
  mode: 'create', // create | edit
  success: false,
  title: '',
  description: '',
  tagInput: '',
  tags: [],
  thumbnailFile: null,
  videoFile: null,
  isReel: false
})

onMounted(async () => {
  state.error = null
  state.success = false
  if (props.lecture) {
    state.mode = 'edit'
    state.title = props.lecture.title
    state.description = props.lecture.description
    state.tags = props.lecture.tags
    state.videoFile = props.lecture.videoUrl
    state.thumbnailFile = props.lecture.thumbnailUrl
  } else {
    state.mode = 'create'
    state.videoFile = null
    state.thumbnailFile = null
    state.tags = []
    state.tagInput = ''
    state.description = ''
    state.title = ''
  }
  state.loading = false
})

function addTag() {
  if (state.tagInput) {
    state.tags.push(state.tagInput)
    state.tagInput = ''
  }
}
function removeTag(tag) {
  state.tags = state.tags.filter((t) => t !== tag)
}
function validate() {
  state.error = null
  if (!state.title) {
    state.error = {
      type: 'error',
      message: 'Title is required'
    }
    return false
  }
  if (!state.description) {
    state.error = {
      type: 'error',
      message: 'Description is required'
    }
    return false
  }
  if (!state.tags.length) {
    state.error = {
      type: 'error',
      message: 'At least one tag is required'
    }
    return false
  }
  if (!state.thumbnailFile) {
    state.error = {
      type: 'error',
      message: 'Thumbnail is required'
    }
    return false
  }
  if (!state.videoFile) {
    state.error = {
      type: 'error',
      message: 'Video is required'
    }
    return false
  }
  return true
}
async function onSubmit() {
  if (!validate()) return
  state.loading = true
  const lectureData = await lectures.createLecture({
    title: state.title,
    description: state.description,
    tags: state.tags,
    thumbnailFile: state.thumbnailFile,
    videoFile: state.videoFile,
    isReel: state.isReel,
    duration: state.duration
  })
  if (lectureData) {
    state.loading = false
    state.success = true
  } else {
    state.loading = false
    state.error = {
      type: 'error',
      message: 'Something went wrong. Please try again later.'
    }
  }
}

watch(
  () => state.error,
  (error) => {
    if (error) {
      setTimeout(() => {
        state.error = null
      }, 7500)
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }
)
watch(
  () => state.videoFile,
  () => {
    if (state.videoFile) {
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.onloadedmetadata = function () {
        window.URL.revokeObjectURL(video.src)
        state.duration = video.duration
        state.isReel = state.duration <= 300
      }
      video.src = URL.createObjectURL(state.videoFile)
    }
  }
)
</script>

<template>
  <template v-if="state.loading">
    <div class="flex flex-col items-center justify-center-gao-6 lg:gap-12">
      <LoaderComponent size="lg" class="tex-gray-900 dark:text-white" />
      <p class="text-lg font-medium text-gray-700 dark:text-gray-300">
        Creating lecture. Please wait...
      </p>
    </div>
  </template>
  <template v-else-if="state.success">
    <div class="flex flex-col items-center justify-center gao-6 lg:gap-12">
      <h3 class="text-3xl font-bold text-gray-900 dark:text-white">
        Lecture created successfully!
      </h3>
      <p class="text-lg font-medium text-gray-700 dark:text-gray-300">
        You can now view your lecture in the
        <router-link
          to="/lectures"
          class="text-blue-700 hover:underline dark:text-blue-400"
          >Lectures</router-link
        >
        page.
      </p>
    </div>
  </template>
  <form v-else @submit.prevent="onSubmit" class="flex flex-col gap-4">
    <AlertComponent
      v-if="state.error"
      :message="state.error.message"
      :type="state.error.type"
    />
    <div>
      <label
        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Title</label
      >
      <input
        type="text"
        v-model="state.title"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
      <span class="mt-2 text-sm text-gray-500 dark:text-gray-400"
        >{{ state.title.length || '0' }}/75</span
      >
    </div>
    <div>
      <label
        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Description</label
      >
      <textarea
        v-model="state.description"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        rows="4"
      ></textarea>
    </div>
    <div>
      <label
        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Tags</label
      >
      <div class="relative w-full">
        <input
          type="text"
          v-model="state.tagInput"
          @keydown.enter.prevent="addTag"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <button
          type="button"
          @click="addTag"
          class="absolute top-2 right-3 text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          <span class="sr-only">Add tag</span>
          <svg-icon :path="mdiPlus" type="mdi" />
        </button>
      </div>
      <div class="flex flex-wrap gap-2 mt-2">
        <span
          v-for="tag in state.tags"
          :key="tag"
          class="flex items-center gap-2 bg-gray-100 text-gray-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300"
        >
          {{ tag }}
          <button
            type="button"
            @click="removeTag(tag)"
            class="text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <span class="sr-only">Remove tag</span>
            <svg-icon :path="mdiClose" type="mdi" class="w-4 h-4" />
          </button>
        </span>
      </div>
    </div>
    <div v-if="state.mode === 'create'">
      <label
        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        for="file_input"
        >Select video file</label
      >
      <input
        @change="state.videoFile = $event.target.files[0]"
        accept="video/mp4"
        class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        type="file"
      />
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-300">
        MP4 (MAX. 1GB).
      </p>
    </div>
    <div
      v-if="state.videoFile"
      class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-700"
    >
      <p class="mb-2">
        <span
          class="inline=flex items-center text-lg font-medium text-gray-900 dark:text-white"
        >
          Your content will be added as a
          <h4
            class="inline-flex items-center gap-2 text-2xl font-black py-1 px-2 rounded bg-purple-700 dark:bg-purple-400 text-white dark:text-gray-900 ml-3"
          >
            <svg-icon
              :path="state.isReel ? mdiMovieRoll : mdiVideoBox"
              type="mdi"
              class="w-6 h-6"
            />
            {{ state.isReel ? 'Reel' : 'Full Lecture' }}
          </h4>
        </span>
      </p>
      <p
        class="flex items-center text-sm font-medium text-gray-900 dark:text-white mb-6"
      >
        Video duration:
        <span class="font-normal inline-flex items-center gap-2.5 my-2 ml-3">
          <svg-icon :path="mdiTimerOutline" type="mdi" />
          {{ (state.duration / 60).toLocaleString('en-us') }} minutes
        </span>
      </p>
      <button
        type="button"
        @click="state.isReel = !state.isReel"
        class="flex items-center gap-2.5 py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-gray-100 rounded-lg border border-gray-300 hover:bg-gray-200 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
      >
        <svg-icon
          :path="state.isReel ? mdiVideoBox : mdiMovieRoll"
          type="mdi"
        />
        Switch to {{ state.isReel ? 'Full Lecture' : 'Reel' }}
      </button>
    </div>
    <div v-if="state.mode === 'create'">
      <label
        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        for="file_input"
        >Select video thumbnail</label
      >
      <input
        @change="state.thumbnailFile = $event.target.files[0]"
        accept="image/jpg, image/png"
        class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        type="file"
      />
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-300">
        JPG, PNG (MAX. 1MB).
      </p>
    </div>
    <div v-if="state.mode === 'edit'" class="flex flex-col gap-6 pt-4">
      <AlertComponent
        type="primary"
        message=" You cannot change the thumbnail or video file of an existing lecture. If
        you want to change the video, please delete the lecture and create a new
        one."
      />
      <video
        :src="props.lecture.video"
        ref="videoEl"
        class="w-full h-full flex-shrink-0 object-fit rounded-lg"
        controls
        loop
      ></video>
      <img :src="props.lecture.thumbnail" class="w-full h-full" />
    </div>

    <div class="mt-4">
      <button
        type="submit"
        class="inline-flex items-center gap-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-7 py-3.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-80 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 focus:shadow-sm focus:translate-y-0.5 transition duration-200 ease-in-out"
      >
        <svg-icon :path="mdiContentSaveOutline" type="mdi" />
        <span v-if="state.mode === 'create'">Create Lecture</span>
        <span v-if="state.mode === 'edit'">Save Changes</span>
      </button>
    </div>
  </form>
</template>

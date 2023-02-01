<script setup>
import AlertComponent from '@/components/AlertComponent.vue'
import VuePdfEmbed from 'vue-pdf-embed'
import { reactive, onMounted, ref, watch, computed } from 'vue'
import {
  getStorage,
  ref as refStorage,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from '@firebase/storage'
import useJobStore from '../stores/job'
import useUserStore from '../stores/user'
import {
  mdiCloudUploadOutline,
  mdiTextBoxRemoveOutline,
  mdiTextBoxOutline,
  mdiEyeOffOutline
} from '@mdi/js'
import { serverTimestamp } from '@firebase/firestore'

const user = useUserStore()
const job = useJobStore()
const fileInput = ref(null)
const state = reactive({
  loading: true,
  error: null
})
const uploadedDate = computed(() => {
  if (user.user.resume && user.user.resume.uploaded) {
    return new Date(user.user.resume.uploaded.seconds * 1000)
  }
  return null
})

onMounted(async () => {
  await user.fetchCurrentUser()
  state.loading = false
})

watch(
  () => state.error,
  () => {
    if (state.error) {
      setTimeout(() => {
        state.error = null
      }, 7500)
    }
  }
)

async function uploadResume(event) {
  // validate file
  state.error = null
  const file = event.target.files[0]
  if (!file) {
    state.error = {
      message: 'Please select a file',
      type: 'error'
    }
    return
  }
  if (!file.name.endsWith('.pdf')) {
    state.error = {
      message: 'File must be a PDF',
      type: 'error'
    }
    return
  }
  if (file.size > 10000000) {
    state.error = {
      message: 'File size must be less than 10MB',
      type: 'error'
    }
    return
  }
  // upload file to storage
  const storage = getStorage()
  const storageRef = refStorage(storage, `resumes/${user.user.uid}.pdf`)
  if (user.user.resume) {
    // delete existing resume from storage
    try {
      await deleteObject(storageRef)
    } catch (e) {
      console.log(
        'Failed to delete object from storage. URL: ',
        user.user.resume.url
      )
    }
    // delete resume field from user document
    await user.dropField('resume')
  }
  await uploadBytes(storageRef, file)
  const storageUrl = await getDownloadURL(storageRef)
  // update user document with resume data
  await user.updateUser({
    resume: {
      url: storageUrl,
      name: file.name,
      uploaded: serverTimestamp()
    }
  })
  state.error = {
    message: 'Resume uploaded successfully',
    type: 'success'
  }
}
async function removeResume() {
  const storage = getStorage()
  const storageRef = refStorage(storage, `resumes/${user.user.uid}.pdf`)
  try {
    await deleteObject(storageRef)
  } catch (e) {
    console.log('Failed to delete object from storage. URL: ', state.resumeUrl)
  }
  await user.dropField('resumeUrl')
  state.error = {
    message: 'Resume removed successfully',
    type: 'success'
  }
}
async function changeResume() {
  await removeResume()
  fileInput.value.click()
}
</script>

<template>
  <AlertComponent
    v-if="state.error"
    :message="state.error.message"
    :type="state.error.type"
    class="mb-6"
  />

  <div v-if="!user.user.resume">
    <input
      class="block w-full max-w-xl text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
      type="file"
      accept=".pdf"
      ref="fileInput"
      @change="uploadResume"
    />
  </div>

  <div
    v-if="user.user.resume"
    class="flex flex-col border border-gray-300 dark:border-gray-700 shadow"
  >
    <div
      class="flex items-center gap-6 p-2 border-b border-gray-300 dark:border-gray-700 shadow-sm"
    >
      <div class="flex-1">
        <div class="inline-flex items-center gap-6">
          <h6
            class="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-400"
          >
            <svg-icon :path="mdiTextBoxOutline" type="mdi" />
            <a
              :href="user.user.resume.url"
              target="_blank"
              class="text-blue-700 dark:text-blue-400 hover:underline"
            >
              {{ user.user.resume.name }}
            </a>
          </h6>
          <span
            class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
          >
            <svg-icon :path="mdiCloudUploadOutline" type="mdi" />
            {{ uploadedDate.toLocaleString('en-us') }}</span
          >
        </div>
      </div>
      <button
        type="button"
        @click="changeResume"
        class="inline-flex items-center gap-2 p-2.5 bg-transparent rounded hover:bg-blue-100 text-blue-700 dark:text-blue-400 dark:hover:text-blue-700 font-medium"
      >
        <svg-icon :path="mdiCloudUploadOutline" type="mdi" class="w-6 h-6" />
        Replace Resume
      </button>
      <button
        type="button"
        @click="removeResume"
        class="inline-flex items-center gap-2 p-2.5 bg-transparent rounded hover:bg-red-100 text-red-700 dark:text-red-400 dark:hover:text-red-700 font-medium"
      >
        <svg-icon :path="mdiTextBoxRemoveOutline" type="mdi" class="w-6 h-6" />
        Remove Resume
      </button>
    </div>
    <div class="p-4">
      <VuePdfEmbed :source="user.user.resume?.url" />
    </div>
  </div>
</template>

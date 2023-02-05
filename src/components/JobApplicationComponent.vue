<script setup>
import AlertComponent from '@/components/AlertComponent.vue'
import LoaderComponent from './LoaderComponent.vue'
import useUserStore from '@/stores/user'
import useJobStore from '@/stores/job'
import { useRoute } from 'vue-router'
import { onMounted, reactive, watch } from 'vue'
import { mdiSendOutline, mdiShare, mdiBookmarkOutline } from '@mdi/js'
import ResumeComponent from './ResumeComponent.vue'

const user = useUserStore()
const job = useJobStore()
const route = useRoute()
const state = reactive({
  loading: true,
  error: null,
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  resume: '',
  coverLetter: '',
  job: null
})

onMounted(async () => {
  await user.fetchCurrentUser()
  state.job = await job.fetchJob(route.params.jobId)
  state.loading = false
})

watch(
  () => state.phone,
  (phone) => {
    // format ###-###-####
    if (phone.length === 3) {
      state.phone = phone + '-'
    }
    if (phone.length === 7) {
      state.phone = phone + '-'
    }
  }
)

async function apply() {
  state.error = null
  if (!state.firstName) {
    state.error = {
      message: 'Please enter your first name',
      type: 'error'
    }
    return
  }
  if (!state.lastName) {
    state.error = {
      message: 'Please enter your last name',
      type: 'error'
    }
    return
  }
  if (!state.email) {
    state.error = {
      message: 'Please enter your email',
      type: 'error'
    }
    return
  }
  if (!state.phone) {
    state.error = {
      message: 'Please enter your phone number',
      type: 'error'
    }
    return
  }
  delete state.error
  const applicationData = await job.createJobApplication(state.job.id, {
    firstName: state.firstName,
    lastName: state.lastName,
    email: state.email,
    phone: state.phone,
    resume: state.resume,
    coverLetter: state.coverLetter
  })
  window.location.reload()
}
</script>

<template>
  <div v-if="state.loading" class="flex items-center justify-center py-12">
    <LoadingComponent />
  </div>
  <form
    @submit.prevent="apply"
    class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full"
  >
    <AlertComponent
      v-if="state.error"
      :message="state.error.message"
      :type="state.error.type"
      class="md:col-span-2"
    />

    <div>
      <label
        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >First name</label
      >
      <input
        type="text"
        v-model="state.firstName"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
    </div>
    <div>
      <label
        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Last name</label
      >
      <input
        type="text"
        v-model="state.lastName"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
    </div>
    <div>
      <label
        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Daytime phone number</label
      >
      <input
        type="text"
        v-model="state.phone"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
    </div>
    <div>
      <label
        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Email address</label
      >
      <input
        type="email"
        v-model="state.email"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
    </div>
    <div>
      <label
        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Cover Letter</label
      >
      <input
        class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        type="file"
        accept=".pdf"
        @change="
          (e) => {
            state.coverLetter = e.target.files[0]
          }
        "
      />
    </div>
    <div></div>
    <div class="md:col-span-2">
      <label
        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Resume</label
      >
      <ResumeComponent />
    </div>
    <div class="md:col-span-2 flex items-center gap-4 pt-6">
      <button
        type="submit"
        class="flex items-center gap-2.5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        <svg-icon :path="mdiSendOutline" type="mdi" />
        Submit Application
      </button>
      <button
        type="button"
        class="flex items-center gap-2.5 py-2.5 px-5 font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
      >
        <svg-icon :path="mdiBookmarkOutline" type="mdi" />
        Save for Later
      </button>
      <button
        type="button"
        class="flex items-center gap-2.5 py-2.5 px-5 font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
      >
        <svg-icon :path="mdiShare" type="mdi" />
        Share This Job
      </button>
    </div>
  </form>
</template>

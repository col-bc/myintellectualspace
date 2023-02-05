<script setup>
import NavbarComponent from '@/components/NavbarComponent.vue'
import JobPostComponent from '../../components/JobPostComponent.vue'
import JobCardComponent from '@/components/JobCardComponent.vue'
import JobApplicationComponent from '@/components/JobApplicationComponent.vue'
import LoaderComponent from '@/components/LoaderComponent.vue'
import ResumeComponent from '@/components/ResumeComponent.vue'
import useJobStore from '@/stores/job'
import useUserStore from '@/stores/user'
import { reactive, onMounted, onUpdated } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { mdiEyeOffOutline } from '@mdi/js'

const route = useRoute()
const router = useRouter()
const user = useUserStore()
const job = useJobStore()
const state = reactive({
  loading: true,
  job: null,
  applied: false
})
onMounted(async () => {
  if (route.name === 'jobs-new' || route.name === 'jobs-resume') {
    state.job = {}
    state.loading = false
    return
  } else {
    state.job = await job.fetchJob(route.params.jobId)
    state.applied = user.user.jobApplications?.some(
      (jobApplication) => jobApplication.jobId === state.job.id
    )
    state.loading = false
  }
})

onUpdated(async () => {
  if (route.name === 'jobs-new' || route.name === 'jobs-resume') {
    state.job = {}
    state.loading = false
    return
  } else if (state.job.id !== route.params.jobId) {
    state.job = await job.fetchJob(route.params.jobId)
    state.applied = user.user.jobApplications?.some(
      (jobApplication) => jobApplication.jobId === state.job.id
    )
    state.loading = false
  }
})
</script>

<template>
  <template v-if="state.loading">
    <div
      class="h-screen flex items-center justify-center text-gray-900 dark:text-white"
    >
      <LoaderComponent size="lg" />
    </div>
  </template>
  <template v-else-if="route.name === 'jobs-apply'">
    <main class="bg-white min-h-screen dark:bg-slate-800">
      <div class="max-w-screen-xl mx-auto">
        <NavbarComponent />
        <div
          v-if="state.applied"
          class="h-full container mx-auto flex flex-col gap-6 py-12 px-2 md:px-4"
        >
          <JobCardComponent :job="state.job" />
          <h3
            class="text-3xl font-black leading-normal text-gray-900 dark:text-white mb-6"
          >
            You have already applied for this job
          </h3>
          <div class="flex items-center justify-center">
            <img
              src="@/assets/images/applied-illustration.svg"
              alt="Applied illustration"
              class="w-full md:max-w-sm mx-auto"
            />
          </div>
        </div>
        <div
          v-else
          class="h-full container mx-auto flex flex-col gap-6 py-12 px-2 md:px-4"
        >
          <JobCardComponent :job="state.job" />
          <h1
            class="text-5xl font-black leading-normal text-gray-900 dark:text-white mb-6"
          >
            Prepare Your Application
          </h1>
          <JobApplicationComponent :job="state.job" />
        </div>
      </div>
    </main>
  </template>
  <template v-else-if="route.name === 'jobs-manage'">
    <JobPostComponent :job="state.job" />
  </template>
  <template v-if="route.name === 'jobs-resume'">
    <main class="bg-white min-h-screen dark:bg-slate-800">
      <div class="max-w-screen-xl mx-auto">
        <NavbarComponent />
        <div
          class="h-full container mx-auto flex flex-col gap-6 md:gap-12 py-12 px-2 md:px-4"
        >
          <h1
            class="text-5xl font-black leading-normal text-gray-900 dark:text-white"
          >
            Upload Your Resume
          </h1>
          <div
            class="flex items-center gap-4 p-4 text-sm text-gray-800 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"
            role="alert"
          >
            <svg-icon :path="mdiEyeOffOutline" type="mdi" />
            <div>
              Your resume and job information is always hidden from your social
              network.
            </div>
          </div>
          <ResumeComponent />
        </div>
      </div>
    </main>
  </template>
  <template v-if="route.name === 'jobs-new'">
    <JobPostComponent />
  </template>
</template>

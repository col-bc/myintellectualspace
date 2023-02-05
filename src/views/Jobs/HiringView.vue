<script setup>
import NavbarComponent from '@/components/NavbarComponent.vue'
import CompanyProfileComponent from '@/components/CompanyProfileComponent.vue'
import LoaderComponent from '@/components/LoaderComponent.vue'
import JobCardComponent from '@/components/JobCardComponent.vue'
import { Dialog } from '@headlessui/vue'
import { mdiPlus, mdiMagnify, mdiDomain } from '@mdi/js'
import { reactive, onMounted } from 'vue'
import useUserStore from '@/stores/user'
import { useRouter } from 'vue-router'
import useJobStore from '@/stores/job'

const user = useUserStore()
const router = useRouter()
const job = useJobStore()
const state = reactive({
  loading: true,
  myJobs: [],
  showCompanyProfileDialog: false
})
onMounted(async () => {
  await user.fetchCurrentUser()
  state.myJobs = await job.fetchMyJobs()
  state.loading = false
})

function handlePostJob() {
  if (!user.user.companyProfile) {
    state.showCompanyProfileDialog = true
  } else {
    router.push({ name: 'jobs-new' })
  }
}
</script>

<template>
  <main class="bg-white min-h-screen dark:bg-slate-800">
    <div class="max-w-screen-xl mx-auto">
      <NavbarComponent />
      <div
        class="h-full container mx-auto flex flex-col md:flex-row items-start gap-6 md:gap*12 lg:gap-16 py-12 px-2 md:px-4"
      >
        <div class="w-full md:w-auto flex justify-center mb-12">
          <img
            src="@/assets/images/hire-illustration.svg"
            alt="Jobs illustration"
            class="w-full max-w-sm md:max-w-md lg:max-w-lg"
          />
        </div>
        <div class="flex-1 flex flex-col">
          <h1
            class="text-5xl font-black leading-normal text-gray-900 dark:text-white mb-12"
          >
            Hiring Center
          </h1>
          <p
            class="text-lg text-gray-700 dark:text-gray-300 mb-12 leading-loose"
          >
            Whether you're looking for a new job or want to hire the best
            talent, My Intellectual Space makes it easy to find the right fit.
            Whatever your needs are, We have the tools to help you get there.
          </p>

          <div
            class="flex flex-col md:flex-row lg:items-center flex-wrap gap-6"
          >
            <button
              type="button"
              @click="handlePostJob"
              class="inline-flex items-center justify-center gap-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-7 py-3.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-80 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 focus:shadow-sm focus:translate-y-0.5 transition duration-200 ease-in-out"
            >
              <svg-icon :path="mdiPlus" type="mdi" />
              Post a Job
            </button>
            <button
              type="button"
              @click="state.showCompanyProfileDialog = true"
              class="inline-flex items-center justify-center gap-3 px-7 py-3.5 font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              <svg-icon :path="mdiDomain" type="mdi" />
              Update Company Profile
            </button>
          </div>
        </div>
      </div>
      <div
        class="h-full container mx-auto flex flex-col items-start gap-6 md:gap*12 py-12 px-2 md:px-4"
      >
        <template v-if="!!user.user.companyProfile">
          <h3 class="text-3xl font-bold text-gray-900 dark:text-white mb-12">
            My Jobs
          </h3>

          <LoaderComponent v-if="state.loading" size="lg" />
          <JobCardComponent
            :job="job"
            primaryAction="manage"
            v-for="job in state.myJobs"
            :key="job.id"
          />
        </template>
        <template v-else>
          <div class="w-full max-w-xl mx-auto">
            <h3 class="text-3xl font-bold text-gray-900 dark:text-white mb-12">
              Missing Company Profile
            </h3>
            <p
              class="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-loose"
            >
              Your company profile is an essential part of the hiring process on
              My Intellectual Space. It provides a quick overview of your
              company for prospective candidates. Please update your company
              profile to continue using the hiring center.
            </p>
            <div>
              <CompanyProfileComponent />
            </div>
          </div>
        </template>
      </div>
    </div>
  </main>
  <Dialog
    :open="state.showCompanyProfileDialog"
    @close="state.showCompanyProfileDialog = false"
    class="relative z-10"
  >
    <div class="fixed inset-0 bg-black bg-opacity-60" />
    <div class="fixed inset-0 overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4">
        <div
          class="w-full max-w-lg flex flex-col p-6 bg-white rounded-lg shadow dark:bg-gray-700"
        >
          <div
            class="text-white mb-6 block w-auto mx-auto p-4 rounded-full shadow-lg shadow-purple-400/30 bg-gradient-to-br from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 dark:text-gray-800"
          >
            <svg-icon :path="mdiDomain" type="mdi" size="96" />
          </div>
          <h2
            class="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white"
          >
            Update Your Company Profile
          </h2>
          <CompanyProfileComponent
            @close="state.showCompanyProfileDialog = false"
          />
        </div>
      </div>
    </div>
  </Dialog>
</template>

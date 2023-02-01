<script setup>
import NavbarComponent from '@/components/NavbarComponent.vue'
import JobCardComponent from '@/components/JobCardComponent.vue'
import useJobStore from '@/stores/job'
import useUserStore from '@/stores/user'
import { useRoute } from 'vue-router'
import { reactive, onMounted } from 'vue'
import { mdiAccountOutline, mdiEmailOutline, mdiPhoneOutline } from '@mdi/js'
import VuePdfEmbed from 'vue-pdf-embed'

const job = useJobStore()
const user = useUserStore()
const route = useRoute()
const state = reactive({
  loading: true,
  job: null,
  candidates: []
})

onMounted(async () => {
  state.job = await job.fetchJob(route.params.jobId)
  state.candidates = await job.fetchJobApplications(state.job.id)
  state.loading = false
})
</script>

<template>
  <main class="bg-white min-h-screen dark:bg-slate-800">
    <div class="max-w-screen-xl mx-auto">
      <NavbarComponent />
      <div v-if="state.loading" class="flex items center justify center py-12">
        <LoaderComponent size="large" />
      </div>
      <div
        v-else
        class="h-full container mx-auto flex flex-col gap-6 py-12 px-2 md:px-4"
      >
        <JobCardComponent :job="state.job" />
        <h1 class="text-5xl font-bold text-gray-800 dark:text-white">
          Review Applications from {{ state.candidates.length }}
          {{ state.candidates.length > 1 ? 'Candidates' : 'Candidate' }}
        </h1>
        <div class="flex flex-col gap-6">
          <template v-for="candidate in state.candidates" :key="candidate">
            <div
              class="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-300 dark:border-gray-700 p-4 flex items-center"
            >
              <div class="flex flex-col w-full gap-4">
                <div class="flex items-center">
                  <svg-icon
                    :path="mdiAccountOutline"
                    type="mdi"
                    size="48"
                    class="rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 p-1.5"
                  />
                  <div class="flex flex-col ml-4">
                    <span class="text-gray-800 dark:text-white font-bold">
                      {{ candidate.firstName }} {{ candidate.lastName }}
                    </span>
                    <span class="text-gray-500 dark:text-gray-400 text-sm">
                      {{ candidate.email }}
                    </span>
                  </div>
                  <div class="flex flex-items-center ml-auto gap-4">
                    <a
                      :href="'tel:' + candidate.phone"
                      class="p-2.5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    >
                      <svg-icon :path="mdiPhoneOutline" type="mdi" />
                    </a>
                    <a
                      :href="'mailto:' + candidate.email"
                      class="p-2.5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    >
                      <svg-icon :path="mdiEmailOutline" type="mdi" />
                    </a>
                    <select
                      v-model="candidate.status"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      <option value="new">New</option>
                      <option value="rejected">Rejected</option>
                      <option value="interested">Interested</option>
                      <option value="interviewing">Interviewing</option>
                      <option value="hired">Hired</option>
                    </select>
                  </div>
                </div>
                <div class="flex-1">
                  <VuePdfEmbed :source="candidate.resume" />
                </div>
                <div class="">
                  <a
                    :href="candidate.resume"
                    target="_blank"
                    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                  >
                    Download Resume
                  </a>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </main>
</template>

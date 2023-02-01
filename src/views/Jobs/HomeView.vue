<script setup>
import NavbarComponent from '@/components/NavbarComponent.vue'
import JobCardComponent from '@/components/JobCardComponent.vue'
import {
  mdiFileDocumentEditOutline,
  mdiCrosshairsGps,
  mdiMagnify,
  mdiFilterOutline
} from '@mdi/js'
import { Dialog } from '@headlessui/vue'
import { onMounted, reactive } from 'vue'
import { MAPS_API_KEY } from '@/secrets'
import useJobStore from '@/stores/job'

const job = useJobStore()
const state = reactive({
  jobs: [],
  filters: {
    sort: 'date',
    type: 'all',
    distance: 'all',
    salary: 'all',
    education: 'all',
    experience: 'all'
  },
  query: '',
  location: '',
  type: '',
  loading: false
})

onMounted(async () => {
  state.jobs = await job.fetchJobs()
})

async function getGeolocation() {
  // get user's location fromm browser
  try {
    navigator.geolocation.getCurrentPosition(async (position) => {
      // resolve position with google maps api
      const data = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=${MAPS_API_KEY}`,
        {
          method: 'GET'
        }
      ).then(async (res) => await res.json())
      const city = data.results[0].address_components.find(
        (component) => component.types[0] === 'locality'
      )
      const st = data.results[0].address_components.find(
        (component) => component.types[0] === 'administrative_area_level_1'
      )
      state.location = `${city.long_name}, ${st.short_name}`
    })
  } catch (error) {
    console.log(error)
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
            src="@/assets/images/jobs-illustration.svg"
            alt="Jobs illustration"
            class="w-full max-w-sm md:max-w-md lg:max-w-lg"
          />
        </div>
        <div class="flex-1 flex flex-col">
          <h1
            class="text-5xl font-black leading-normal text-gray-900 dark:text-white mb-12"
          >
            Find Your Next Job Opportunity
          </h1>
          <p
            class="text-lg text-gray-700 dark:text-gray-300 mb-12 leading-loose"
          >
            Whether you're looking for a new job or want to hire the best
            talent, My Intellectual Space makes it easy to find the right fit.
            Whatever your needs are, We have the tools to help you get there.
          </p>

          <div class="flex items-center gap-6">
            <button
              type="button"
              @click="$router.push('/jobs/resume')"
              class="inline-flex items-center gap-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-7 py-3.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-80 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 focus:shadow-sm focus:translate-y-0.5 transition duration-200 ease-in-out"
            >
              <svg-icon :path="mdiFileDocumentEditOutline" type="mdi" />
              Manage Resume
            </button>
            <button
              type="button"
              @click="$router.push('/jobs/hiring')"
              class="px-7 py-3.5 font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              Hiring Center
            </button>
          </div>
        </div>
      </div>

      <div
        class="container mx-auto flex flex-col md:flex-row w-full h-full items-start gap-6 md:gap-12 mb-12 px-2 md:px-4"
      >
        <!-- Filters -->
        <div
          class="sticky top-6 w-full md:max-w-xs bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gary-300 dark:border-gray-700 p-4 mb-12"
        >
          <h4
            class="flex items-center gap-3 text-gray-800 dark:text-white text-xl font-bold mb-6"
          >
            <svg-icon :path="mdiFilterOutline" type="mdi" />
            Filters
          </h4>
          <div class="flex flex-col gap-4">
            <div>
              <label class="text-gray-700 dark:text-gray-300 font-medium mb-2">
                Sort by
              </label>
              <select
                v-model="state.filters.sort"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="date">Most recent first</option>
                <option value="salary">Highest salary first</option>
                <option value="distance">Shortest distance first</option>
              </select>
            </div>
            <div>
              <label class="text-gray-700 dark:text-gray-300 font-medium mb-2">
                Type
              </label>
              <select
                v-model="state.filters.type"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="all">All</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>
            <div>
              <label class="text-gray-700 dark:text-gray-300 font-medium mb-2">
                Experience
              </label>
              <select
                v-model="state.filters.experience"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="all">All</option>
                <option value="entry-level">Entry-level</option>
                <option value="mid-level">Mid-level</option>
                <option value="senior-level">Senior-level</option>
              </select>
            </div>
            <div>
              <label class="text-gray-700 dark:text-gray-300 font-medium mb-2">
                Salary
              </label>
              <div class="flex items-center gap-4">
                <input
                  type="number"
                  v-model="state.filters.salary.min"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Min"
                />
                <input
                  type="number"
                  v-model="state.filters.salary.max"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Max"
                />
              </div>
            </div>
          </div>
        </div>
        <!-- Search / jobs -->
        <div class="flex-col gap-6 md:gap-12">
          <div
            class="sticky top-6 z-30 w-full flex items-center bg-white dark:bg-gray-800 rounded-full p-2 border border-gray-300 dark:border-gray-700 shadow-lg"
          >
            <input
              type="text"
              v-model="state.keyword"
              class="flex-1 p-4 text-gray-900 border border-gray-300 rounded-l-full bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search keywords"
            />
            <div class="relative flex-1">
              <input
                type="text"
                v-model="state.location"
                class="p-4 w-full text-gray-900 border border-gray-300 rounded-r-full bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Location"
              />
              <button
                type="button"
                @click="getGeolocation"
                class="absolute inset-y-0 right-0 flex items-center rounded-r-full px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                <svg-icon :path="mdiCrosshairsGps" type="mdi" />
              </button>
            </div>
            <button
              type="button"
              class="ml-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-base p-4 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <svg-icon :path="mdiMagnify" type="mdi" />
            </button>
          </div>

          <div
            class="relative z=20 flex flex-col gap-6 md:gap-12 pt-12 bg-white dark:bg-slate-800"
          >
            <JobCardComponent
              v-for="job in state.jobs"
              :key="job.id"
              :job="job"
              primaryAction="apply"
            />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

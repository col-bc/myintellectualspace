<script setup>
import AlertComponent from '@/components/AlertComponent.vue'
import NavbarComponent from '@/components/NavbarComponent.vue'
import { TINYMCE_API_KEY } from '@/secrets'
import useInterfaceStore from '@/stores/interface'
import useJobStore from '@/stores/job'
import useUserStore from '@/stores/user'
import {
  mdiBriefcaseOutline,
  mdiClockOutline,
  mdiClose,
  mdiContentSaveOutline,
  mdiCurrencyUsd,
  mdiPlus,
  mdiTrashCanOutline
} from '@mdi/js'
import Editor from '@tinymce/tinymce-vue'
import { onMounted, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'

const user = useUserStore()
const job = useJobStore()
const ui = useInterfaceStore()
const router = useRouter()
const props = defineProps({
  job: {
    type: Object,
    required: false
  }
})
const state = reactive({
  error: null,
  mode: null,
  loading: false,
  jobTitle: '',
  jobDescription: '',
  jobType: 'default',
  jobLocation: '',
  jobSalary: {
    min: '',
    max: '',
    schedule: 'default'
  },
  skill: '',
  jobSkills: [],
  jobEducation: 'default',
  jobHours: '',
  acceptApplications: true
})

onMounted(async () => {
  state.mode = props.job?.id ? 'edit' : 'create'
  console.log(state.mode)
  if (state.mode === 'edit') {
    state.loading = true
    const jobData = await job.fetchJob(props.job.id)
    if (jobData.ownerUid !== user.user.uid) {
      router.push({ name: 'jobs-hiring' })
    }
    state.jobTitle = jobData.title
    state.jobDescription = jobData.description
    state.jobType = jobData.type
    state.jobLocation = jobData.location
    state.jobSalary.min = jobData.salary.min
    state.jobSalary.max = jobData.salary.max
    state.jobSalary.schedule = jobData.salary.schedule
    state.jobSkills = jobData.skills
    state.jobEducation = jobData.education
    state.jobHours = jobData.hours
    state.acceptApplications = jobData.acceptApplications || true
    state.loading = false
  } else {
    state.jobTitle = ''
    state.jobDescription = ''
    state.jobType = 'default'
    state.jobLocation = ''
    state.jobSalary.min = ''
    state.jobSalary.max = ''
    state.jobSalary.schedule = 'default'
    state.jobSkills = []
    state.jobEducation = 'default'
    state.jobHours = ''
    state.acceptApplications = true
  }
})

function addSkill() {
  if (state.skill) {
    state.jobSkills.push(state.skill)
    state.skill = ''
  }
}
function removeSkill(idx) {
  state.jobSkills.splice(idx, 1)
}
function validate() {
  state.error = null
  if (!state.jobTitle) {
    state.error = {
      message: 'Job title is required',
      type: 'error'
    }
    return false
  }
  if (!state.jobDescription) {
    state.error = {
      message: 'Job description is required',
      type: 'error'
    }
    return false
  }
  if (state.jobType === 'default') {
    state.error = {
      message: 'Job type is required',
      type: 'error'
    }
    return false
  }
  if (!state.jobLocation) {
    state.error = {
      message: 'Job location is required',
      type: 'error'
    }
    return false
  }
  if (!state.jobSalary.min) {
    state.error = {
      message: 'Job salary minimum is required',
      type: 'error'
    }
    return false
  }
  if (!state.jobSalary.max) {
    state.error = {
      message: 'Job salary maximum is required',
      type: 'error'
    }
    return false
  }
  if (state.jobSalary.schedule === 'default') {
    state.error = {
      message: 'Job salary schedule is required',
      type: 'error'
    }
    return false
  }
  if (state.jobEducation === 'default') {
    state.error = {
      message: 'Job education is required',
      type: 'error'
    }
    return false
  }
  if (!state.jobHours) {
    state.error = {
      message: 'Job hours is required',
      type: 'error'
    }
    return false
  }
  return true
}
async function onSubmit() {
  if (!validate()) return

  delete state.error
  delete state.loading
  if (state.mode === 'create') {
    const jobData = await job.createJob({
      title: state.jobTitle,
      description: state.jobDescription,
      type: state.jobType,
      location: state.jobLocation,
      salary: {
        min: state.jobSalary.min,
        max: state.jobSalary.max,
        schedule: state.jobSalary.schedule
      },
      skills: state.jobSkills,
      education: state.jobEducation,
      hours: state.jobHours,
      acceptApplications: state.acceptApplications
    })
    router.push({ name: 'jobs-apply', params: { jobId: jobData.id } })
  } else {
    const jobData = await job.updateJob(props.job.id, {
      title: state.jobTitle,
      description: state.jobDescription,
      type: state.jobType,
      location: state.jobLocation,
      salary: {
        min: state.jobSalary.min,
        max: state.jobSalary.max,
        schedule: state.jobSalary.schedule
      },
      skills: state.jobSkills,
      education: state.jobEducation,
      hours: state.jobHours,
      acceptApplications: state.acceptApplications
    })
    state.error = {
      message: 'Job updated successfully',
      type: 'success'
    }
    state.mode = 'edit'
  }
}
async function deleteJob() {
  try {
    job.deleteJob(props.job.id)
    router.push({ name: 'jobs-hiring' })
  } catch (e) {
    state.error = {
      message: 'Could not delete job posting. ' + e,
      type: 'error'
    }
  }
}

watch(
  () => state.error,
  (val) => {
    if (val) {
      setTimeout(() => {
        state.error = null
      }, 7500)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
)
</script>

<template>
  <main class="bg-white min-h-screen dark:bg-slate-800">
    <div class="max-w-screen-xl mx-auto">
      <NavbarComponent />
      <div
        class="h-full container mx-auto flex flex-col gap-6 md:gap*12 py-12 px-2 md:px-4"
      >
        <div class="flex items-center">
          <h1
            class="flex-1 text-5xl font-black leading-normal text-gray-900 dark:text-white mb-12"
          >
            {{ state.mode === 'create' ? 'Create' : 'Manage' }} a Job Posting
          </h1>
          <button
            v-if="state.mode === 'edit'"
            type="button"
            @click="deleteJob"
            class="flex items-center gap-2.5 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm p-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          >
            <svg-icon :path="mdiTrashCanOutline" type="mdi" />
            Delete Job
          </button>
        </div>
        <div class="flex flex-col-reverse md:flex-row gap-12">
          <form
            @submit.prevent="onSubmit"
            class="flex flex-col gap-4 w-full md:w-1/2"
          >
            <AlertComponent
              v-if="state.error"
              :message="state.error.message"
              :type="state.error.type"
            />
            <div>
              <label
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Job title</label
              >
              <input
                type="text"
                v-model="state.jobTitle"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
            <div>
              <label
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Job description</label
              >
              <Editor
                :api-key="TINYMCE_API_KEY"
                v-model="state.jobDescription"
                :init="{
                  toolbar:
                    'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
                  plugins: 'lists link image table code help wordcount',
                  skin: ui.isDark ? 'oxide-dark' : 'oxide',
                  content_css: ui.isDark ? 'dark' : 'default'
                }"
              />
            </div>
            <div>
              <label
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Job type</label
              >
              <select
                v-model="state.jobType"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="default">Select a job type</option>
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Temporary">Temporary</option>
              </select>
            </div>
            <div>
              <label
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Job location</label
              >
              <input
                type="text"
                v-model="state.jobLocation"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              <label
                class="block mt-2 text-sm text-gray-700 dark:text-gray-400"
              >
                <input
                  type="checkbox"
                  :checked="
                    state.jobLocation ===
                    user.user.companyProfile.city +
                      ', ' +
                      user.user.companyProfile.state
                  "
                  @change="
                    () => {
                      if (state.jobLocation === '') {
                        state.jobLocation =
                          user.user.companyProfile.city +
                          ', ' +
                          user.user.companyProfile.state
                      } else {
                        state.jobLocation = ''
                      }
                    }
                  "
                  class="w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                Same as company profile:
                {{
                  user.user.companyProfile.city +
                  ', ' +
                  user.user.companyProfile.state
                }}</label
              >
            </div>
            <div>
              <label
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Job skills</label
              >
              <div class="relative w-full">
                <input
                  type="text"
                  v-model="state.skill"
                  @keydown.enter.prevent="addSkill"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                <button
                  type="button"
                  @click="addSkill"
                  class="absolute top-0 right-0 mt-2 mr-2 text-gray-400 hover:text-gray-500"
                >
                  <svg-icon :path="mdiPlus" type="mdi" />
                </button>
              </div>
              <div
                v-if="state.jobSkills.length"
                class="mt-2 flex flex-wrap gap-2"
              >
                <template
                  v-for="(skill, index) in state.jobSkills"
                  :key="index"
                >
                  <div
                    class="flex items-center px-2 py-1 text-sm font-medium text-gray-900 bg-gray-100 rounded-lg dark:bg-gray-700 dark:text-white"
                  >
                    {{ skill }}
                    <button
                      type="button"
                      @click="removeSkill(index)"
                      class="ml-2"
                    >
                      <svg-icon :path="mdiClose" type="mdi" class="w-4 h-4" />
                    </button>
                  </div>
                </template>
              </div>
            </div>
            <div>
              <label
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Job education</label
              >
              <select
                v-model="state.jobEducation"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="default">Select a job type</option>
                <option value="High School">High School</option>
                <option value="Associate">Associate</option>
                <option value="Bachelor">Bachelor</option>
                <option value="Master">Master</option>
                <option value="Doctorate">Doctorate</option>
              </select>
            </div>
            <div>
              <label
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Salary</label
              >
              <div class="flex items-center gap-4">
                <div class="relative w-full">
                  <svg-icon
                    :path="mdiCurrencyUsd"
                    type="mdi"
                    class="w-5 h-5 absolute left-2 top-2.5 text-gray-400"
                  />
                  <input
                    type="number"
                    step="0.01"
                    v-model="state.jobSalary.min"
                    class="pl-8 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Min"
                  />
                </div>
                <div class="relative w-full">
                  <svg-icon
                    :path="mdiCurrencyUsd"
                    type="mdi"
                    class="w-5 h-5 absolute left-2 top-2.5 text-gray-400"
                  />
                  <input
                    type="number"
                    step="0.01"
                    v-model="state.jobSalary.max"
                    class="pl-8 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Max"
                  />
                </div>
                <select
                  v-model="state.jobSalary.schedule"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="default">Select a salary schedule</option>
                  <option value="Hourly">Hourly</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Annual">Annual</option>
                </select>
              </div>
            </div>
            <div>
              <label
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Hours per week</label
              >
              <input
                type="number"
                step="1"
                v-model="state.jobHours"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
            <div>
              <label
                class="block mb-4 text-sm font-medium text-gray-900 dark:text-white"
                >Jpb Options</label
              >
              <div class="flex items-center">
                <input
                  id="accept-applications"
                  type="checkbox"
                  v-model="state.acceptApplications"
                  value=""
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  for="accept-applications"
                  class="ml-2 text-sm font-medium text-gray-900 dark:text-white"
                  >Accept applications</label
                >
              </div>
            </div>
            <div class="mt-4">
              <button
                type="submit"
                class="flex items-center justify-center gap-2.5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                <svg-icon :path="mdiContentSaveOutline" type="mdi" />
                <template v-if="state.mode === 'edit'">
                  Update Job Post
                </template>
                <template v-else> Create Job Post </template>
              </button>
            </div>
          </form>
          <!-- Preview -->
          <div class="flex flex-col w-full md:w-1/2">
            <h6
              class="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2"
            >
              Preview
            </h6>
            <div
              class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-300 dark:border-gray-700 p-6"
            >
              <div class="flex items-center mb-4 pb-4 border-b">
                <div
                  v-if="!user.user.companyProfile.logo"
                  class="w-14 h-14 bg-gray-500 text-white mr-4 rounded-full border flex items-center justify-center font-bold"
                >
                  {{ user.user.companyProfile.name.charAt(0) }}
                </div>
                <img
                  v-else
                  :src="user.user.companyProfile.logo"
                  alt="logo"
                  class="w-14 h-14 mr-4 rounded-full border"
                />
                <div class="flex-1">
                  <h3
                    class="text-xl font-bold text-gray-900 dark:text-gray-100"
                  >
                    {{ state.jobTitle || 'Job title' }}
                  </h3>
                  <div
                    class="flex items-center divide-x divide-gray-300 dark:divide-gray-700"
                  >
                    <h6
                      class="text-base font-medium text-gray-500 dark:text-gray-400 pr-2"
                    >
                      {{ user.user.companyProfile.name }}
                    </h6>
                    <p
                      class="text-base font-medium text-gray-500 dark:text-gray-400 px-2"
                    >
                      {{ state.jobLocation || 'Job location' }}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  Apply
                </button>
              </div>

              <p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                <span class="font-medium mr-2">Job description: </span>
                <span v-html="state.jobDescription || 'Job description'"></span>
              </p>
              <div class="flex items-center gap-4 flex-wrap mb-4">
                <span
                  v-if="state.jobSalary.min || state.jobSalary.max"
                  class="flex items-center gap-2 bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300"
                >
                  <svg-icon :path="mdiCurrencyUsd" type="mdi" />
                  {{ state.jobSalary.min.toLocaleString('en-US') || 'Min' }} -
                  {{ state.jobSalary.max.toLocaleString('en-US') || 'Max' }} -
                  {{
                    state.jobSalary.schedule === 'default'
                      ? 'Schedule'
                      : state.jobSalary.schedule
                  }}
                </span>
                <span
                  v-if="state.jobType !== 'default'"
                  class="flex items-center gap-2 bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300"
                >
                  <svg-icon :path="mdiBriefcaseOutline" type="mdi" />
                  {{ state.jobType }}
                </span>
                <span
                  v-if="state.jobType !== 'default'"
                  class="flex items-center gap-2 bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300"
                >
                  <svg-icon :path="mdiClockOutline" type="mdi" />
                  {{ state.jobHours }} hrs / week
                </span>
              </div>
              <h6
                class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4"
              >
                Requirements
              </h6>
              <p
                class="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 flex items-center gap-2 flex-wrap"
              >
                <span class="font-medium mr-2">Education: </span>
                {{
                  state.jobEducation === 'default'
                    ? 'Select education'
                    : state.jobEducation
                }}
              </p>

              <p
                class="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 flex items-center gap-2 flex-wrap"
              >
                <span class="font-medium mr-2">Skills: </span>
                <template
                  v-for="(skill, index) in state.jobSkills"
                  :key="index"
                >
                  <span
                    class="flex items-center bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300"
                  >
                    {{ skill }}
                  </span>
                </template>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

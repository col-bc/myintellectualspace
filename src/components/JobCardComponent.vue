<script setup>
import {
  mdiCurrencyUsd,
  mdiSchoolOutline,
  mdiBriefcaseOutline,
  mdiPlus,
  mdiClose,
  mdiClockOutline,
  mdiCogOutline,
  mdiAccountGroupOutline,
  mdiSendOutline,
  mdiAlertOctagramOutline
} from '@mdi/js'
import useUserStore from '@/stores/user'
import useJobStore from '@/stores/job'
import { reactive, onMounted } from 'vue'
import { Timestamp } from '@firebase/firestore'

const user = useUserStore()
const job = useJobStore()
const props = defineProps({
  job: {
    type: Object,
    required: true
  },
  primaryAction: {
    type: String,
    required: false,
    default: '' // 'apply' or 'manage'
  }
})

const state = reactive({
  loading: true,
  expand: false,
  candidateLength: 0
})

onMounted(async () => {
  if (props.job.ownerUid === user.user?.uid) {
    state.candidateLength = await job.fetchJobApplicationCount(props.job.id)
  }
  state.loading = false
})
</script>

<template>
  <LoaderComponent v-if="state.loading" />
  <div
    v-else
    class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-300 dark:border-gray-700 p-6"
  >
    <div
      class="flex items-center mb-4 pb-4 border-b border-gray-300 dark:border-gray-700"
    >
      <img
        :src="
          props.job.companyProfile.logo || 'https://via.placeholder.com/150'
        "
        alt="logo"
        class="w-14 h-14 mr-4 rounded-full border dark:border-gray-400"
      />
      <div class="flex-1 mr-4">
        <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100">
          {{ props.job.title }}
        </h3>
        <div
          class="flex items-center divide-x divide-gray-300 dark:divide-gray-700"
        >
          <h6
            class="text-base font-medium text-gray-500 dark:text-gray-400 pr-2"
          >
            {{ props.job.companyProfile.name }}
          </h6>
          <p
            class="text-base font-medium text-gray-500 dark:text-gray-400 px-2"
          >
            {{ props.job.location }}
          </p>
        </div>
      </div>
      <span
        v-if="props.job.urgent && $route.name !== 'jobs-hiring'"
        class="inline-flex items-center gap-2 mr-4 bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300"
      >
        <svg-icon :path="mdiAlertOctagramOutline" type="mdi" class="w-5 h-5" />
        Urgent Need
      </span>

      <button
        v-if="props.primaryAction === 'apply'"
        type="button"
        @click="
          $router.push({ name: 'jobs-apply', params: { jobId: props.job.id } })
        "
        class="flex items-center gap-2.5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        Apply
        <svg-icon :path="mdiSendOutline" type="mdi" />
      </button>
      <div
        v-if="
          props.primaryAction === 'manage' &&
          props.job.ownerUid === user.user.uid
        "
        class="flex flex-col md:flex-row md:items-center gap-4"
      >
        <button
          type="button"
          @click="
            $router.push({
              name: 'jobs-candidates',
              params: { jobId: props.job.id }
            })
          "
          class="relative py-2.5 px-5 flex items-center gap-2.5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        >
          <svg-icon :path="mdiAccountGroupOutline" type="mdi" />
          <span>Review Candidates</span>
          <div
            class="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -right-2 dark:border-gray-900"
          >
            {{ state.candidateLength }}
          </div>
        </button>
        <button
          type="button"
          @click="
            $router.push({
              name: 'jobs-manage',
              params: { jobId: props.job.id }
            })
          "
          class="flex items-center gap-2.5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          <svg-icon :path="mdiCogOutline" type="mdi" />
          Manage
        </button>
      </div>
    </div>

    <p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
      <span v-if="state.expand" v-html="props.job.description"></span>
      <span v-else v-html="props.job.description.slice(0, 300) + '...'"></span>
      <button
        type="button"
        @click="state.expand = !state.expand"
        class="text-blue-700 hover:underline dark:text-blue-400"
      >
        {{ state.expand ? 'Show less' : 'Show more' }}
      </button>
    </p>
    <div class="flex items-center gap-4 flex-wrap mb-4">
      <span
        class="flex items-center gap-2 bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300"
      >
        <svg-icon :path="mdiCurrencyUsd" type="mdi" />
        {{ props.job.salary.min.toLocaleString('en-US') || 'Min' }} -
        {{ props.job.salary.max.toLocaleString('en-US') || 'Max' }} -
        {{ props.job.salary.schedule }}
      </span>
      <span
        class="flex items-center gap-2 bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300"
      >
        <svg-icon :path="mdiBriefcaseOutline" type="mdi" />
        {{ props.job.type }}
      </span>
      <span
        class="flex items-center gap-2 bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300"
      >
        <svg-icon :path="mdiClockOutline" type="mdi" />
        {{ props.job.hours }} hrs / week
      </span>
    </div>
    <h6 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
      Requirements
    </h6>
    <p
      class="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 flex items-center gap-2 flex-wrap"
    >
      <span class="font-medium mr-2">Education: </span>
      <span
        class="flex items-center gap-2 bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300"
      >
        <svg-icon :path="mdiSchoolOutline" type="mdi" />
        {{ props.job.education }}
      </span>
    </p>
    <p
      class="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 flex items-center gap-2 flex-wrap"
    >
      <span class="font-medium mr-2">Skills: </span>
      <template v-for="(skill, index) in props.job.skills" :key="index">
        <span
          class="flex items-center bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300"
        >
          {{ skill }}
        </span>
      </template>
    </p>
    <p class="text-sm text-gray-500 dark:text-gray-400">
      Posted
      {{
        new Date(
          props.job.created.seconds * 1000 +
            props.job.created.nanoseconds / 1000000
        ).toLocaleDateString()
      }}
    </p>
  </div>
</template>

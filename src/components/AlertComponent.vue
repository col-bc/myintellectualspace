<script setup>
import { defineProps, reactive, onMounted, onUpdated } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'default' // default, primary, error, success
  },
  showIcon: {
    type: Boolean,
    default: true
  },
  dismissible: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    required: true
  }
})
const alert = reactive({
  type: 'default',
  show: true,
  showIcon: true,
  dismissible: true,
  message: ''
})
onMounted(() => {
  alert.show = true
  alert.type = props.type
  alert.showIcon = props.showIcon
  alert.dismissible = props.dismissible
  alert.message = props.message
})
onUpdated(() => {
  alert.show = true
  alert.type = props.type
  alert.showIcon = props.showIcon
  alert.dismissible = props.dismissible
  alert.message = props.message
})
</script>

<template>
  <div
    class="flex items-center p-2.5 rounded-lg border-l-8"
    :class="{
      'text-gray-700 bg-gray-200 border-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-800':
        alert.type === 'default',
      'text-red-700 bg-red-200 border-red-700 dark:bg-red-200 dark:text-red-800 dark:border-red-800':
        alert.type === 'error',
      'text-green-700 bg-green-200 border-green-700 dark:bg-green-200 dark:text-green-800 dark:border-green-800':
        alert.type === 'success',
      'text-blue-700 bg-blue-200 border-blue-700 dark:bg-blue-200 dark:text-blue-800 dark:border-blue-800':
        alert.type === 'primary'
    }"
    v-if="alert.show"
    role="alert"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      v-if="alert.showIcon"
      class="w-5 h-5"
      :class="{
        'text-gray-700 dark:text-gray-800': alert.type === 'default',
        'text-red-700 dark:text-red-900': alert.type === 'error',
        'text-green-700 dark:text-green-800': alert.type === 'success',
        'text-blue-700 dark:text-blue-800': alert.type === 'primary'
      }"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
    <span
      class="flex-1 text-sm font-medium"
      :class="{ 'ml-3': props.showIcon }"
    >
      {{ props.message }}
    </span>
    <button
      type="button"
      v-if="alert.dismissible"
      @click="alert.show = false"
      class="ml-auto rounded-lg focus:ring-2 p-1.5 inline-flex h-8 w-8"
      :class="{
        'bg-gray-200 text-gray-500 focus:ring-gray-400 hover:bg-gray-200 dark:bg-gray-200 dark:text-gray-600 dark:hover:bg-gray-300':
          alert.type === 'default',
        'bg-green-200 text-green-500 focus:ring-green-400 hover:bg-green-200 dark:bg-green-200 dark:text-green-600 dark:hover:bg-green-300':
          alert.type === 'success',
        'bg-red-200 text-red-500 focus:ring-red-400 hover:bg-red-200 dark:bg-red-200 dark:text-red-600 dark:hover:bg-red-300':
          alert.type === 'error',
        'bg-blue-200 text-blue-500 focus:ring-blue-400 hover:bg-blue-200 dark:bg-blue-200 dark:text-blue-600 dark:hover:bg-blue-300':
          alert.type === 'primary'
      }"
      aria-label="Close"
    >
      <span class="sr-only">Close</span>
      <svg
        aria-hidden="true"
        class="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clip-rule="evenodd"
        ></path>
      </svg>
    </button>
  </div>
</template>

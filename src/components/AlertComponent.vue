<script setup>
import { reactive, onMounted, onUpdated } from 'vue'

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
    v-if="alert.show"
    role="alert"
    class="flex items-start p-2.5 rounded-lg border-l-8"
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
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      v-if="alert.showIcon"
      class="w-5 h-5"
      :class="{
        'fill-gray-700 dark:fill-gray-300': alert.type === 'default',
        'fill-red-700 dark:fill-red-800': alert.type === 'error',
        'fill-green-700 dark:fill-green-800': alert.type === 'success',
        'fill-blue-700 dark:fill-blue-800': alert.type === 'primary'
      }"
      viewBox="0 0 24 24"
      width="24"
      height="24"
    >
      <path fill="none" d="M0 0h24v24H0z" />
      <path
        d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM11 7h2v2h-2V7zm0 4h2v6h-2v-6z"
      />
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
    >
      <span class="sr-only">Close</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        viewBox="0 0 24 24"
        width="24"
        height="24"
      >
        <path fill="none" d="M0 0h24v24H0z" />
        <path
          d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"
        />
      </svg>
    </button>
  </div>
</template>

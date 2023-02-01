<script setup>
import { reactive, onMounted, onUpdated } from 'vue'
import { mdiAlertCircleOutline, mdiClose } from '@mdi/js'

const props = defineProps({
  type: {
    type: String,
    default: 'default' // default, primary, error, success
  },
  message: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: mdiAlertCircleOutline
  },
  dismissible: {
    type: Boolean,
    default: false
  }
})
const state = reactive({
  type: 'default',
  message: '',
  show: true,
  icon: mdiAlertCircleOutline,
  dismissible: true
})
onMounted(() => {
  state.show = true
  state.type = props.type
  state.message = props.message
  state.icon = props.icon
  state.dismissible = props.dismissible
})
onUpdated(() => {
  state.show = true
  state.type = props.type
  state.message = props.message
  state.icon = props.icon
  state.dismissible = props.dismissible
})
</script>

<template>
  <div
    v-if="state.show"
    role="alert"
    class="flex p-4 text-sm border rounded-lg dark:bg-gray-800"
    :class="{
      'text-gray-800 border-gray-300 bg-gray-50 dark:text-gray-400 dark:border-gray-800':
        state.type === 'default',
      'text-red-800 border-red-300 bg-red-50 dark:text-red-400 dark:border-red-800':
        state.type === 'error',
      'text-green-800 border-green-300 bg-green-50 dark:text-green-400 dark:border-green-800':
        state.type === 'success',
      'text-blue-800 border-blue-300 bg-blue-50 dark:text-blue-400 dark:border-blue-800':
        state.type === 'primary'
    }"
  >
    <svg-icon
      v-if="state.icon"
      :path="state.icon"
      type="mdi"
      class="flex-shrink-0 inline w-5 h-5"
    />
    <span class="flex-1 text-sm font-medium" :class="{ 'ml-3': props.icon }">
      {{ props.message }}
    </span>
    <button
      type="button"
      v-if="state.dismissible"
      @click="state.show = false"
      class="ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex h-8 w-8 dark:bg-gray-800 dark:hover:bg-gray-700"
      :class="{
        'bg-gray-50 text-gray-500 focus:ring-gray-400 hover:bg-gray-200 dark:text-gray-400':
          state.type === 'default',
        'bg-green-50 text-green-500 focus:ring-green-400 hover:bg-green-200 dark:text-green-400':
          state.type === 'success',
        'bg-red-50 text-red-500 focus:ring-red-400 hover:bg-red-200 dark:text-red-400':
          state.type === 'error',
        'bg-blue-50 text-blue-500 focus:ring-blue-400 hover:bg-blue-200 dark:text-blue-400':
          state.type === 'primary'
      }"
    >
      <span class="sr-only">Close</span>
      <svg-icon :path="mdiClose" type="mdi" class="w-5 h-5" />
    </button>
  </div>
</template>

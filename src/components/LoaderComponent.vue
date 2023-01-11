<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String
  }
})

const classList = computed(() => {
  return {
    'w-6 h-6': props.size === 'sm',
    'w-8 h-8': props.size === 'md',
    'w-12 h-12': props.size === 'lg'
  }
})
</script>

<template>
  <div role="status" class="text-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="animate-spin fill-current"
      :class="classList"
      viewBox="0 0 24 24"
      width="24"
      height="24"
    >
      <path fill="none" d="M0 0h24v24H0z" />
      <path
        d="M12 2a1 1 0 0 1 1 1v3a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1zm0 15a1 1 0 0 1 1 1v3a1 1 0 0 1-2 0v-3a1 1 0 0 1 1-1zm8.66-10a1 1 0 0 1-.366 1.366l-2.598 1.5a1 1 0 1 1-1-1.732l2.598-1.5A1 1 0 0 1 20.66 7zM7.67 14.5a1 1 0 0 1-.366 1.366l-2.598 1.5a1 1 0 1 1-1-1.732l2.598-1.5a1 1 0 0 1 1.366.366zM20.66 17a1 1 0 0 1-1.366.366l-2.598-1.5a1 1 0 0 1 1-1.732l2.598 1.5A1 1 0 0 1 20.66 17zM7.67 9.5a1 1 0 0 1-1.366.366l-2.598-1.5a1 1 0 1 1 1-1.732l2.598 1.5A1 1 0 0 1 7.67 9.5z"
      />
    </svg>
    <span class="sr-only">Loading...</span>
  </div>
</template>

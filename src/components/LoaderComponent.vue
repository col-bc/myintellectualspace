<script setup>
import { computed } from 'vue'
import { mdiLoading } from '@mdi/js'

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
    <svg-icon
      :path="mdiLoading"
      type="mdi"
      class="animate-spin fill-current"
      :class="classList"
    />
    <span class="sr-only">Loading...</span>
  </div>
</template>

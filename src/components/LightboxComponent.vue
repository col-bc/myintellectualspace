<script setup>
import { reactive, onMounted, onUpdated } from 'vue'
import { Dialog } from '@headlessui/vue'

const props = defineProps({
  image: {
    type: String,
    required: true
  },
  classes: {
    type: String,
    default: ''
  }
})

const state = reactive({
  image: props.image,
  show: false
})

onMounted(() => {
  state.image = props.image
})
onUpdated(() => {
  if (state.image !== props.image) {
    state.image = props.image
  }
})
</script>

<template>
  <img
    :src="state.image"
    @click="state.show = true"
    class="cursor-pointer"
    :class="props.classes"
  />
  <Teleport to="#modals-root">
    <div
      v-if="state.show"
      @click="state.show = false"
      class="cursor-pointer fixed z-30 top-0 right-0 w-screen h-screen bg-black bg-opacity-60"
    ></div>
    <Dialog
      as="div"
      class="fixed inset-0 z-30 overflow-y-auto"
      :open="state.show"
      @close="state.show = false"
      @keydown.escape="state.show = false"
    >
      <div class="relative w-full h-full">
        <button
          tabindex="-1"
          type="button"
          @click="state.show = false"
          class="absolute z-50 top-6 right-6 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-full text-sm p-5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <img
          :src="state.image"
          class="absolute z-40 top-0 left-0 w-full h-full object-contain"
        />
      </div>
    </Dialog>
  </Teleport>
</template>

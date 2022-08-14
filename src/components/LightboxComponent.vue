<script setup>
import { defineProps, ref } from 'vue'

const props = defineProps({
  image: {
    type: String,
    required: true
  }
})
const show = ref(false)
</script>

<template>
  <button type="button" @click="show = !show">
    <slot> </slot>
  </button>
  <Teleport to="#modals-container">
    <div
      v-if="show"
      class="fixed z-30 top-0 left-0 w-screen h-screen bg-black bg-opacity-40"
    ></div>
    <button
      type="button"
      v-if="show"
      @click="show = false"
      class="fixed z-50 top-0 right-0 m-4 p-4 text-white bg-black bg-opacity-50 hover:bg-opacity-70 rounded"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
    <div
      v-if="show"
      class="fixed top-0 left-0 z-40 flex flex-col items-center justify-center"
    >
      <img :src="props.image" class-="w-full mx-auto h-auto shadow-xl" />
    </div>
  </Teleport>
</template>

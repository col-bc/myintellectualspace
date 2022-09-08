<script setup>
import { defineProps, onMounted, defineEmits, reactive } from 'vue'

const emits = defineEmits(['rated'])

const props = defineProps({
  count: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0
  }
})

const state = reactive({
  count: 0,
  rating: 0
})

onMounted(() => {
  state.count = props.count
  state.rating = props.rating
})
</script>

<template>
  <div class="flex items-center gap-3">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-9 w-8 text-gray-500"
      :class="{
        'fill-gray-500': state.rating < 1 || state.count < 1,
        'fill-yellow-400 stroke-yellow-400':
          state.rating >= 1 || state.count >= 1
      }"
      @mouseover="state.count = 1"
      @mouseleave="state.count = 0"
      @click=";(state.rating = 1), $emit('rated', state.rating)"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path
        d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"
      ></path>
    </svg>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-9 w-8 text-gray-500"
      :class="{
        'fill-gray-500': state.rating < 2 || state.count < 2,
        'fill-yellow-400 stroke-yellow-400':
          state.rating >= 2 || state.count >= 2
      }"
      @mouseover="state.count = 2"
      @mouseleave="state.count = 0"
      @click=";(state.rating = 2), $emit('rated', state.rating)"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path
        d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"
      ></path>
    </svg>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-9 w-8 text-gray-500"
      :class="{
        'fill-gray-500': state.rating < 3 || state.count < 3,
        'fill-yellow-400 stroke-yellow-400':
          state.rating >= 3 || state.count >= 3
      }"
      @mouseover="state.count = 3"
      @mouseleave="state.count = 0"
      @click=";(state.rating = 3), $emit('rated', state.rating)"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path
        d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"
      ></path>
    </svg>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-9 w-8 text-gray-500"
      :class="{
        'fill-gray-500': state.rating < 4 || state.count < 4,
        'fill-yellow-400 stroke-yellow-400':
          state.rating >= 4 || state.count >= 4
      }"
      @mouseover="state.count = 4"
      @mouseleave="state.count = 0"
      @click=";(state.rating = 4), $emit('rated', state.rating)"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path
        d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"
      ></path>
    </svg>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-9 w-8 text-gray-500"
      :class="{
        'fill-gray-500': state.rating < 5 || state.count < 5,
        'fill-yellow-400 stroke-yellow-400':
          state.rating >= 5 || state.count >= 5
      }"
      @mouseover="state.count = 5"
      @mouseleave="state.count = 0"
      @click=";(state.rating = 5), $emit('rated', state.rating)"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path
        d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"
      ></path>
    </svg>
  </div>
</template>

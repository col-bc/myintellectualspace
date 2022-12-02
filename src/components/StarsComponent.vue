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
      viewBox="0 0 24 24"
      class="h-10 w-10 fill-gray-500"
      :class="{
        'fill-gray-500': state.rating < 1 || state.count < 1,
        'fill-yellow-400': state.rating >= 1 || state.count >= 1
      }"
      @mouseover="state.count = 1"
      @mouseleave="state.count = 0"
      @click=";(state.rating = 1), $emit('rated', state.rating)"
      width="24"
      height="24"
    >
      <path fill="none" d="M0 0h24v24H0z" />
      <path
        d="M12 18.26l-7.053 3.948 1.575-7.928L.587 8.792l8.027-.952L12 .5l3.386 7.34 8.027.952-5.935 5.488 1.575 7.928z"
      />
    </svg>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      class="h-10 w-10 fill-gray-500"
      :class="{
        'fill-gray-500': state.rating < 2 || state.count < 2,
        'fill-yellow-400': state.rating >= 2 || state.count >= 2
      }"
      @mouseover="state.count = 2"
      @mouseleave="state.count = 0"
      @click=";(state.rating = 2), $emit('rated', state.rating)"
      width="24"
      height="24"
    >
      <path fill="none" d="M0 0h24v24H0z" />
      <path
        d="M12 18.26l-7.053 3.948 1.575-7.928L.587 8.792l8.027-.952L12 .5l3.386 7.34 8.027.952-5.935 5.488 1.575 7.928z"
      />
    </svg>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      class="h-10 w-10 fill-gray-500"
      :class="{
        'fill-gray-500': state.rating < 3 || state.count < 3,
        'fill-yellow-400': state.rating >= 3 || state.count >= 3
      }"
      @mouseover="state.count = 3"
      @mouseleave="state.count = 0"
      @click=";(state.rating = 3), $emit('rated', state.rating)"
      width="24"
      height="24"
    >
      <path fill="none" d="M0 0h24v24H0z" />
      <path
        d="M12 18.26l-7.053 3.948 1.575-7.928L.587 8.792l8.027-.952L12 .5l3.386 7.34 8.027.952-5.935 5.488 1.575 7.928z"
      />
    </svg>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      class="h-10 w-10 fill-gray-500"
      :class="{
        'fill-gray-500': state.rating < 4 || state.count < 4,
        'fill-yellow-400': state.rating >= 4 || state.count >= 4
      }"
      @mouseover="state.count = 4"
      @mouseleave="state.count = 0"
      @click=";(state.rating = 4), $emit('rated', state.rating)"
      width="24"
      height="24"
    >
      <path fill="none" d="M0 0h24v24H0z" />
      <path
        d="M12 18.26l-7.053 3.948 1.575-7.928L.587 8.792l8.027-.952L12 .5l3.386 7.34 8.027.952-5.935 5.488 1.575 7.928z"
      />
    </svg>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      class="h-10 w-10 fill-gray-500"
      :class="{
        'fill-gray-500': state.rating < 5 || state.count < 5,
        'fill-yellow-400': state.rating >= 5 || state.count >= 5
      }"
      @mouseover="state.count = 5"
      @mouseleave="state.count = 0"
      @click=";(state.rating = 5), $emit('rated', state.rating)"
      width="24"
      height="24"
    >
      <path fill="none" d="M0 0h24v24H0z" />
      <path
        d="M12 18.26l-7.053 3.948 1.575-7.928L.587 8.792l8.027-.952L12 .5l3.386 7.34 8.027.952-5.935 5.488 1.575 7.928z"
      />
    </svg>
  </div>
</template>

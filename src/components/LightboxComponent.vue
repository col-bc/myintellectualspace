<script setup>
import { defineProps, reactive, onMounted, onUpdated } from 'vue'

const state = reactive({
  show: false,
  image: null,
  caption: null
})
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  image: {
    type: String,
    default: null
  },
  caption: {
    type: String,
    default: null
  }
})
onMounted(() => {
  state.show = props.show
  state.image = props.image
  state.caption = props.caption
})
</script>

<template>
  <img
    @click="state.show = true"
    :src="state.image"
    class="w-full cursor-pointer"
  />

  <Teleport to="#modals-container">
    <!-- Overlay -->
    <div
      v-if="state.show"
      @click="state.show = false"
      class="cursor-pointer absolute z-40 top-0 right-0 w-full h-full bg-gray-900 bg-opacity-80"
    >
      &nbsp;
    </div>
    <Transition>
      <div
        tabindex="-1"
        v-show="state.show"
        class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 z-40 w-full md:inset-0 h-modal md:h-full"
      >
        <button
          type="button"
          @click="state.show = false"
          class="absolute z-50 top-3 right-3 text-white bg-transparent hover:bg-gray-900 hover:bg-opacity-100 rounded-lg text-sm p-1.5 inline-flex items-center"
        >
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
          <span class="sr-only">Close modal</span>
        </button>
        <div class="relative p-4 w-full max-w-lg mx-auto h-full md:h-auto">
          <!-- Modal content -->
          <div class="relative bg-white rounded-lg shadow dark:bg-gray-800">
            <img :src="state.image" class="w-full h-full" />
            <!-- Modal Actions -->
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.25s ease-in-out;
  top: 0px;
}

.v-enter-from,
.v-leave-to {
  top: -100%;
}
</style>

<script setup>
import { reactive, watch } from 'vue'

const state = reactive({
  isOpen: false
})
watch(state, () => {
  if (state.isOpen) {
    document.body.classList.toggle('overflow-hidden')
  } else {
    document.body.classList.toggle('overflow-hidden')
  }
})
</script>

<template>
  <div>
    <button type="button" @click="state.isOpen = !state.isOpen" class="w-full">
      <slot name="button"></slot>
    </button>
    <Teleport to="#modals-container">
      <!-- Overlay -->
      <div
        v-if="state.isOpen"
        @click="state.isOpen = false"
        class="cursor-pointer fixed z-40 top-0 right-0 w-full h-full bg-black bg-opacity-60 blur-"
      >
        &nbsp;
      </div>
      <Transition>
        <div
          tabindex="-1"
          v-show="state.isOpen"
          class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 z-40 w-full md:inset-0 h-modal md:h-full"
        >
          <div class="relative p-4 w-full max-w-lg mx-auto h-full md:h-auto">
            <button
              type="button"
              @click="state.isOpen = false"
              class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
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
            <!-- Modal content -->
            <div class="relative bg-white rounded-lg shadow dark:bg-gray-800">
              <div class="p-4">
                <slot name="content"></slot>
                <!-- Modal Actions -->
                <div class="flex flex-col gap-4 mt-4">
                  <button
                    type="button"
                    @click="state.isOpen = false"
                    class="py-2.5 px-5 w-full text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-300 hover:bg-white hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  >
                    CLOSE
                  </button>
                  <slot name="actions"></slot>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
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

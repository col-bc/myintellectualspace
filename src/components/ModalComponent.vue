<script setup>
import { reactive } from 'vue'

const state = reactive({
  isOpen: false
})
</script>

<template>
  <div>
    <button @click="state.isOpen = !state.isOpen">
      <slot name="button"></slot>
    </button>
    <Teleport to="#modals-container">
      <!-- Overlay -->
      <div
        v-if="state.isOpen"
        class="fixed z-30 top-0 left-0 h-screen w-screen bg-black opacity-60"
      ></div>
      <div
        tabindex="-1"
        v-show="state.isOpen"
        class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 z-40 w-full md:inset-0 h-modal md:h-full"
      >
        <div class="relative p-4 w-full max-w-lg mx-auto h-full md:h-auto">
          <!-- Modal content -->
          <div class="relative bg-white rounded-lg shadow dark:bg-gray-800">
            <slot name="content"></slot>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import LoaderComponent from '../../components/LoaderComponent.vue'
import NavbarComponent from '../../components/NavbarComponent.vue'
import useUserStore from '../../stores/user'

const user = useUserStore()
const state = reactive({
  loading: false,
  showNewMeetingDialog: false,
  error: null
})
</script>

<template>
  <main class="bg-white min-h-screen dark:bg-slate-800">
    <div class="max-w-screen-xl mx-auto h-full flex flex-col">
      <NavbarComponent />
      <div
        v-if="state.loading"
        class="h-screen flex items-center justify-center"
      >
        <LoaderComponent size="lg" class="text-gray-900 dark:text-white" />
      </div>
      <div
        v-else
        class="flex-1 container mx-auto flex flex-col py-12 px-2 md:px-4"
      >
        <div
          class="flex flex-col md:flex-row md:items-center md:justify-between mb-12"
        >
          <h1
            class="text-5xl font-black leading-loose text-gray-900 dark:text-white"
          >
            Video Meetings
          </h1>
        </div>

        <MeetingLaunchComponent class="mb-12" />

        <h6 class="text-xl font-bold text-gray-900 dark:text-white">
          Upcoming Meetings
        </h6>
      </div>
      <VideoComponent />
    </div>
  </main>
</template>

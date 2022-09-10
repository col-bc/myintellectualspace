<script setup>
import { onMounted, reactive } from 'vue'
import LoaderComponent from '../../components/LoaderComponent.vue'
import NavbarComponent from '../../components/NavbarComponent.vue'
import useUserStore from '../../stores/user'

const userStore = useUserStore()
const data = reactive({
  user: userStore.user,
  meetings: []
})
const state = reactive({
  loading: true,
  dropdown: false,
  view: 'list' // list | new | edit
})

onMounted(async () => {
  await userStore.fetchUser()
  data.meetings = userStore.user.meetings
  state.loading = false
})
</script>

<template>
  <main class="bg-white dark:bg-slate-800">
    <div class="min-h-screen max-w-screen-xl mx-auto">
      <NavbarComponent />
      <div class="container mx-auto px-4">
        <h1
          class="text-3xl font-black drop-shadow-xl leading-loose text-gray-900 dark:text-white my-6"
        >
          My Meetings
        </h1>
        <LoaderComponent v-if="state.loading" />
        <div v-if="!state.loading && data.meetings.length === 0">
          <p class="text-gray-600 dark:text-gray-400">
            You have no meetings yet. Join a course to get started.
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

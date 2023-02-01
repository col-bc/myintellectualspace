<script setup>
import { reactive, watch } from 'vue'
import useUserStore from '@/stores/user'
import { useRouter } from 'vue-router'
import { mdiMagnify } from '@mdi/js'

const user = useUserStore()
const router = useRouter()

const state = reactive({
  query: '',
  results: [],
  history: [],
  loading: false,
  error: null
})

onMounted(() => {
  state.history = localStorage.getItem('searchHistory')
    ? JSON.parse(localStorage.getItem('searchHistory'))
    : []
})

watch(
  () => state.query,
  async (query) => {
    if (query.length > 2) {
      state.loading = true
      try {
        state.results = await user.search(query)
      } catch (error) {
        state.error = error
      } finally {
        state.loading = false
      }
    }
  }
)
</script>

<template>
  <div class="flex flex-col gap-2 p-4">
    <div class="relative w-full">
      <svg-icon
        :path="mdiMagnify"
        type="mdi"
        size="24"
        class="absolute top-2 left-2 text-gray-500 dark:text-gray-400"
      />
      <input
        type="search"
        class="focus:outline-none focus:ring-2 pl-10 focus:ring-blue-500 focus:border-transparent rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 py-2 px-4 w-full"
        placeholder="Search My Intellectual Space"
      />
    </div>
    <p class="text-gray-500 dark:text-gray-400 text-sm font-medium">
      Search Results
    </p>
  </div>
</template>

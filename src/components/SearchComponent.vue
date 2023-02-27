<script setup>
import { reactive, watch, onMounted } from 'vue'
import AlertComponent from '@/components/AlertComponent.vue'
import LoaderComponent from '@/components/LoaderComponent.vue'
import useUserStore from '@/stores/user'
import useInterfaceStore from '@/stores/interface'
import { useRouter } from 'vue-router'
import { mdiMagnify } from '@mdi/js'

const user = useUserStore()
const ui = useInterfaceStore()
const router = useRouter()
const emit = defineEmits(['close'])
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
      state.results = await user.searchUser(query)
      state.loading = false
    }
  }
)
</script>

<template>
  <div class="flex flex-col gap-2 p-4">
    <AlertComponent
      v-if="error"
      :message="state.error.message"
      :type="state.error.type"
    />
    <div class="relative w-full">
      <svg-icon
        :path="mdiMagnify"
        type="mdi"
        size="24"
        class="absolute top-2 left-2 text-gray-500 dark:text-gray-400"
      />
      <input
        type="search"
        v-model="state.query"
        class="focus:outline-none focus:ring-2 pl-10 focus:ring-blue-500 focus:border-transparent rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 py-2 px-4 w-full"
        placeholder="Search My Intellectual Space"
      />
    </div>
    <template v-if="!state.query">
      <p class="text-gray-500 dark:text-gray-400 text-sm font-medium">
        Search History
      </p>
      <div class="flex flex-col gap-2">
        <button
          v-for="item in state.history"
          :key="item"
          @click="state.query = item"
          class="text-gray-500 dark:text-gray-400 text-sm font-medium"
        >
          {{ item }}
        </button>
      </div>
    </template>
    <template v-else-if="state.loading">
      <div
        class="flex items-center justify-center text-gray-900 dark:text-gray-100 py-6"
      >
        <loaderComponent />
      </div>
    </template>
    <template v-else-if="state.results.length > 0">
      <p class="text-gray-500 dark:text-gray-400 text-sm font-medium">
        Search Results
      </p>
      <div class="flex flex-col gap-2">
        <button
          v-for="item in state.results"
          :key="item.id"
          @click="
            router.push({ name: 'profile', params: { handle: item.handle } })
          "
          class="flex items-center gap-4"
        >
          <img
            :src="item.avatarUrl"
            class="h-10 w-10 rounded-full mr-4 border border-gray-200 dark:border-gray-700"
          />
          <div
            class="flex flex-col divide-y divide-gray-300 dark:divide-gray-700"
          >
            <h6 class="font-medium text-gray-900 dark:text-white">
              {{ item.handle }}
            </h6>
            <p class="text-gray-500 dark:text-gray-400 text-sm font-medium">
              {{ item.fullName }}
            </p>
          </div>
        </button>
      </div>
    </template>
    <button
      type="reset"
      @click="ui.toggleSearch"
      class="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-600"
    >
      Close
    </button>
  </div>
</template>

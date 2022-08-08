<script setup>
import { watch, ref, onMounted } from 'vue'
import axios from 'axios'
import NavbarComponent from '@/components/NavbarComponent.vue'
import PostComponent from '@/components/PostComponent.vue'
import useUserStore from '@/stores/user'

const userStore = useUserStore()

const posts = ref([])
const isLoading = ref(false)
const mode = ref('network') // network | interests | education | all

onMounted(async () => {
  await getPosts()
})
watch(mode, async (value) => {
  await getPosts()
})
async function getPosts() {
  // get posts from api
  let url = '/api/post'
  if (mode.value === 'network') {
    url += '?network=true'
  } else if (mode.value === 'interests') {
    url += '?interests=true'
  } else if (mode.value === 'education') {
    url += '?education=true'
  } else if (mode.value === 'all') {
    url += '?all=true'
  }

  isLoading.value = true
  posts.value = []

  try {
    isLoading.value = true
    const response = await axios.get(url, {
      headers: {
        Authorization: userStore.getBearerToken,
      },
    })
    if (response.status === 200) {
      for (const post of response.data.posts) {
        posts.value.push(post)
      }
      posts.value.reverse()
    }

  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <main class="bg-gray-100 dark:bg-slate-800">
    <div class="min-h-screen   max-w-screen-xl mx-auto">
      <NavbarComponent />

      <div class="container lg:max-w-screen-lg mx-auto flex flex-col sm:px-2 py-12">

        <h1 class="text-3xl font-bold text-gray-800 mb-12 dark:text-white">
          Explore {{ mode.charAt(0).toUpperCase() + mode.slice(1) }}
        </h1>

        <ul class="w-full mb-12 p-1 bg-white shadow-sm rounded-lg border border-gray-300 flex flex-wrap text-sm font-medium text-center text-gray-700 dark:text-gray-400 dark:border-gray-700 dark:bg-gray-800">
          <li class="mr-2">
            <button @click="mode = 'network'"
                    type-="button"
                    class="inline-block py-1.5 px-3 rounded-lg text-sm"
                    :class="[mode === 'network' ? 'text-white bg-blue-600 active' : 'hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white']"
                    aria-current="page">My Network</button>
          </li>
          <li class="mr-2">
            <button @click="mode = 'interests'"
                    type-="button"
                    class="inline-block py-1.5 px-3 rounded-lg text-sm"
                    :class="[mode === 'interests' ? 'text-white bg-blue-600 active' : 'hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white']"
                    aria-current="page">My Interests</button>
          </li>
          <li class="mr-2">
            <button @click="mode = 'education'"
                    type-="button"
                    class="inline-block py-1.5 px-3 rounded-lg text-sm"
                    :class="[mode === 'education' ? 'text-white bg-blue-600 active' : 'hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white']"
                    aria-current="page">My Education</button>
          </li>
          <li class="mr-2">
            <button @click="mode = 'all'"
                    type-="button"
                    class="inline-block py-1.5 px-3 rounded-lg text-sm"
                    :class="[mode === 'all' ? 'text-white bg-blue-600 active' : 'hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white']"
                    aria-current="page">Everything</button>
          </li>
        </ul>

        <div v-if="isLoading"
             role="status"
             class="text-center">
          <svg class="inline mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
               viewBox="0 0 100 101"
               fill="none"
               xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill" />
          </svg>
          <span class="sr-only">Loading...</span>

        </div>

        <div v-else
             class="flex flex-col gap-12 w-full max-w-screen-lg">

          <PostComponent v-for="p in posts"
                         :key="p.id"
                         :post="p"
                         class="shadow-sm" />
        </div>
      </div>
    </div>
  </main>
</template>


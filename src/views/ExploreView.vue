<script setup>
import { reactive, ref, onMounted } from 'vue'
import axios from 'axios'
import NavbarComponent from '@/components/NavbarComponent.vue'
import PostComponent from '../components/PostComponent.vue'
import useUserStore from '../stores/user'

const userStore = useUserStore()

const posts = ref([])
const isLoading = ref(false)
const networkOnly = ref(true)

onMounted(async () => {
  await getPosts()
})

async function getPosts() {
  // get posts from api
  try {
    isLoading.value = true
    if (networkOnly.value) {
      const response = await axios.get('/api/post?network=true', {
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
    }
    else {
      const response = await axios.get('/api/post', {
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
    <div class="min-h-screen">
      <NavbarComponent />
      <div class="container lg:max-w-screen-lg mx-auto flex flex-col items-center sm:px-2 py-12">
        <h1 class="text-3xl font-bold text-center text-gray-800 mb-6 dark:text-white">
          What's new in your network
        </h1>

        <div v-if="isLoading"
             class="text-center">
          <div class="spinner"></div>
        </div>

        <div v-else
             class="flex flex-col gap-12 w-full max-w-screen-lg">
          <div class="flex bg-white flex-col w-full p-4 rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <h3 class="font-semibold text-xl dark:text-gray-200">Filters</h3>
            <div class="flex w-full items-center">
              <label class="py-4 ml-2 w-full text-sm font-medium text-gray-900 dark:text-gray-300">
                <input type="checkbox"
                       v-model="networkOnly"
                       class="mr-4 w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                Only show posts from my network</label>
            </div>
            <div>
              <button type="button"
                      @click="getPosts()"
                      class="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Apply Changes</button>
            </div>
          </div>

          <PostComponent v-for="p in posts"
                         :key="p.id"
                         :post="p"
                         class="shadow-sm" />
        </div>
      </div>
    </div>
  </main>
</template>

<style>
@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}

.spinner:before {
  content: '';
  box-sizing: border-box;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50px;
  height: 50px;
  margin-top: -25px;
  margin-left: -25px;
  border-radius: 50%;
  border: 2px solid #ccc;
  border-top-color: #000;
  animation: spinner 0.6s linear infinite;
}
</style>

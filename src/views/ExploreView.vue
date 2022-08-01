<script setup>
import { reactive, ref, onMounted } from 'vue'
import axios from 'axios'
import NavbarComponent from '@/components/NavbarComponent.vue'
import PostComponent from '../components/PostComponent.vue'
import useUserStore from '../stores/user'

const userStore = useUserStore()

const posts = ref([])
const isLoading = ref(false)
const displayMode = ref('all') // all | network

onMounted(async () => {
  try {
    const response = await axios.get('/api/post?network=true', {
      headers: {
        Authorization: userStore.getBearerToken,
      },
    })
    if (response.status === 200) {
      for (const post of response.data) {
        posts.value.push(post)
      }
      posts.value.reverse()
    }
  } catch (error) {
    console.log(error)
  } finally {
    posts.isLoading = false
  }
})
</script>

<template>
  <main>
    <div class="min-h-screen">
      <NavbarComponent />
      <div class="container mx-auto flex flex-col items-center sm:px-2 py-12">
        <h1 class="text-4xl font-bold text-center leading-relaxed mb-12">
          What's new in your network
        </h1>
        <div v-if="isLoading" class="text-center">
          <div class="spinner"></div>
        </div>

        <div v-else class="flex flex-col gap-4 w-full max-w-screen-lg">
          <PostComponent
            v-for="p in posts"
            :key="p.id"
            :post="p"
            class="shadow-sm"
          />
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

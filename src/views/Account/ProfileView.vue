<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'
import LightboxComponent from '@/components/LightboxComponent.vue'

import useUserStore from '@/stores/user'
import NavbarComponent from '@/components/NavbarComponent.vue'
import AlertComponent from '@/components/AlertComponent.vue'
import PostComponent from '@/components/PostComponent.vue'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

const user = reactive({
  data: {},
})
onMounted(async () => {
  try {
    const response = await axios.get(
      `/api/user/handle/${route.params.handle}`,
      {
        headers: {
          Authorization: userStore.getBearerToken,
        },
      }
    )
    if (response.status === 200) {
      user.data = response.data
    }

  } catch (error) {
    console.log(error)
    if (error.response.status === 404) {
      router.push('/user-not-found')
    }
  }
})
watch(route.query, (route.query.handle), async () => {
  try {
    const response = await axios.get(
      `/api/user/handle/${route.params.handle}`,
      {
        headers: {
          Authorization: userStore.getBearerToken,
        },
      }
    )
    if (response.status === 200) {
      user.data = response.data
    }

  } catch (error) {
    console.log(error)
    if (error.response.status === 404) {
      router.push('/user-not-found')
    }
  }
})
const tab = ref('posts') // posts, friends, about
</script>

<template>
  <main>
    <NavbarComponent />
    <div class="container mx-auto flex flex-col md:flex-row items-start sm:px-2 gap-16 py-12">
      <div class="flex flex-col gap-12 w-64">
        <div class="relative group border-4 border-blue-400 rounded-xl">
          <img :src="user.data.avatar_uri"
               class="rounded-lg w-full h-auto md:w-64 md:h-64" />

        </div>
        <div class="bg-white border border-gray-200 rounded-lg divide-y shadow-sm divide-gray-300 first:rounded-t last:rounded-b">
          <h3 class="px-4 py-2 text-2xl font-semibold">
            @{{ user.data.handle }}
          </h3>
          <p class="px-4 py-2 text-lg text-gray-700">
            {{ user.data.first_name }} {{ user.data.last_name }}
          </p>
          <p class="px-4 py-2 leading-loose text-gray-700">
            <span v-if="user.data.bio">
              {{ user.data.bio }}
            </span>
            <span v-else
                  class="italic text-xm"> No bio available. </span>
          </p>
          <a href="#"
             class="inline-flex items-center gap-2 w-full px-4 py-2 text-sm font-medium text-blue-600 hover:underline hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg"
                 class="h-4 w-4"
                 fill="none"
                 viewBox="0 0 24 24"
                 stroke="currentColor"
                 stroke-width="2">
              <path stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>ADD FRIEND
          </a>
          <a href="#"
             class="inline-flex items-center gap-2 w-full px-4 py-2 text-sm font-medium text-blue-600 hover:underline hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg"
                 class="h-4 w-4"
                 fill="none"
                 viewBox="0 0 24 24"
                 stroke="currentColor"
                 stroke-width="2">
              <path stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>SEND MESSAGE
          </a>
          <button type="button"
                  @click="() => {
                    if (tab === 'posts') tab = 'about'
                    else tab = 'posts'
                  }"
                  class="inline-flex items-center gap-2 w-full px-4 py-2 text-sm font-medium text-blue-600 hover:underline hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg"
                 class="h-4 w-4"
                 fill="none"
                 viewBox="0 0 24 24"
                 stroke="currentColor"
                 stroke-width="2">
              <path stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ tab === 'posts' ? 'SEE ABOUT' : 'SEE POSTS' }}
          </button>
        </div>
      </div>
      <div v-if="tab === 'posts'"
           class="flex-1 flex flex-col gap-6">
        <div v-for="post of user.data.posts"
             :key="post.id">
          <PostComponent :post="post" />
        </div>
      </div>
      <div v-if="tab === 'about'"
           class="flex-1 flex flex-col gap-6">
        <div class="flex flex-col bg-white border border-gray-200 shadow-sm rounded-lg p-4 divide-y divide-gray-200">
          <h2 class="text-2xl font-bold py-3">About @{{ user.data.handle }}</h2>
          <p class="py-2">
            <span class="font-semibold mr-2 uppercase text-sm">Name</span> {{ user.data.first_name }} {{ user.data.last_name }}
          </p>
          <p class="py-2">
            <span class="font-semibold mr-2 uppercase text-sm">Location</span> {{ user.data.location }}
          </p>
          <p class="py-2">
            <span class="font-semibold mr-2 uppercase text-sm">Join Date</span> {{ new Date(user.data.created_at).toLocaleDateString() }}
          </p>
          <p class="py-2">
            <span class="font-semibold mr-2 uppercase text-sm">Education Level</span>
            <span v-if="user.data.education_level === 'Hs'">High School</span>
            <span v-if="user.data.education_level === 'Aa'">Associate's of Science/Art</span>
            <span v-if="user.data.education_level === 'Ba'">Bachelor's of Science/Art</span>
            <span v-if="user.data.education_level === 'Na'">Masters's of Science/Art</span>
            <span v-if="user.data.education_level === 'Phd'">Doctorate</span>
          </p>
          <p class="py-2">
            <span class="font-semibold mr-2 uppercase text-sm">Education Institution</span> {{ user.data.education_institution }}
          </p>
          <p class="py-2">
            <span class="font-semibold mr-2 uppercase text-sm">Major</span> {{ user.data.education_major }}
          </p>
          <p class="py-2">
            <span class="font-semibold mr-2 uppercase text-sm">Occupation</span> {{ user.data.occupation }}
          </p>
          <p class="py-2">
            <span class="font-semibold mr-2 uppercase text-sm">Interests</span> {{ user.data.interests }}
          </p>
        </div>
      </div>
      <div class="hidden lg:flex flex-col gap-12 w-64 h-80 bg-gray-200"></div>
    </div>
  </main>
</template>

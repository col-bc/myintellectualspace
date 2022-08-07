<script setup>
import axios from 'axios'
import { onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import NavbarComponent from '@/components/NavbarComponent.vue'
import PostComponent from '@/components/PostComponent.vue'
import useUserStore from '@/stores/user'

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
      user.data.posts.reverse()
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
  <main class="bg-white dark:bg-slate-800">
    <NavbarComponent />
    <div class="container mx-auto flex flex-col md:flex-row items-start sm:px-2 gap-12 py-12">
      <div class="flex flex-col gap-12 w-64">
        <!-- Avatar -->
        <div class="relative group p-2 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl">
          <img :src="user.data.avatar_uri"
               class="rounded-lg w-full h-auto md:w-64 md:h-64" />
          <button type="button"
                  @click="changeAvatar()"
                  class="hidden group-hover:block absolute bottom-0 left-0 w-full py-2.5 bg-gray-800 bg-opacity-40 hover:bg-opacity-60 text-white text-sm font-medium rounded-b-lg">
            Change avatar
          </button>
        </div>
        <!-- Actions/About -->
        <div class="bg-white border border-gray-200 rounded-lg divide-y divide-gray-300 first:rounded-t last:rounded-b dark:bg-gray-800 dark:border-gray-600 dark:divide-gray-600">
          <h3 class="px-4 py-2 text-2xl font-semibold dark:text-white">
            @{{ user.data.handle }}
          </h3>
          <p class="px-4 py-4 leading-tight text-gray-700 dark:text-gray-300">
            <span v-if="user.data.bio">
              {{ user.data.bio }}
            </span>
            <span v-else
                  class="italic text-xm"> No bio available. </span>
          </p>
          <a href="#"
             class="inline-flex items-center gap-2 w-full px-4 py-2 text-sm font-medium text-blue-600 hover:underline hover:bg-gray-100 dark:text-blue-400 dark:hover:bg-gray-700">
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
             class="inline-flex items-center gap-2 w-full px-4 py-2 text-sm font-medium text-blue-600 hover:underline hover:bg-gray-100 dark:text-blue-400 dark:hover:bg-gray-700">
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
                  class="inline-flex items-center gap-2 w-full px-4 py-2 text-sm font-medium text-blue-600 hover:underline hover:bg-gray-100 dark:text-blue-400 dark:hover:bg-gray-700">
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
           class="flex-1 flex flex-col gap-12">
        <div v-for="post of user.data.posts"
             :key="post.id">
          <PostComponent :post="post" />
        </div>
      </div>
      <div v-if="tab === 'about'"
           class="flex-1 flex flex-col gap-12">
        <div class="flex flex-col bg-white border border-gray-200 shadow-sm rounded-lg p-4 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold py-3 dark:text-white">About @{{ user.data.handle }}</h2>
          </div>
          <!-- Name -->
          <div class="py-2 flex items-center">
            <span class="font-semibold mr-2 uppercase text-sm w-40">Name</span>
            <p>{{ user.data.first_name }} {{ user.data.last_name }}</p>
          </div>
          <!-- Location -->
          <div class="py-2 flex items-center">
            <span class="font-semibold mr-2 uppercase text-sm w-40">Location</span>
            <p>{{ user.data.location }}</p>
          </div>
          <!-- Bio -->
          <div class="py-2 flex items-start">
            <span class="font-semibold mr-2 uppercase text-sm w-40">Bio</span>
            <p v-if="user.data.bio" class="flex-shrink">
              {{ user.data.bio }}
            </p>
            <p v-else
               class="italic text-xm"> No bio available. </p>
          </div>
          <!-- Join Date -->
          <div class="py-2 flex items-center">
            <span class="font-semibold mr-2 uppercase text-sm w-40">Joined</span>
            <p>{{ new Date(user.data.created_at).toLocaleDateString() }}</p>
          </div>
          <!-- Education Level -->
          <div class="py-2 flex items-center">
            <span class="font-semibold mr-2 uppercase text-sm w-40">Education Level</span>
            <p>
              <span v-if="user.data.education_level === 'Hs'">
                High School </span>
              <span v-else-if="user.data.education_level === 'Aa'">
                Associate's of Arts / Science </span>
              <span v-else-if="user.data.education_level === 'Ba'">
                Bachelor's of Arts / Science </span>
              <span v-else-if="user.data.education_level === 'Ma'">
                Master's of Arts / Science </span>
              <span v-else-if="user.data.education_level === 'Phd'">
                Doctorate Degree </span>
            </p>
          </div>
          <!-- Education institution -->
          <div class="py-2 flex items-center">
            <span class="font-semibold mr-2 uppercase text-sm w-40">Education Institution</span>
            <p>{{ user.data.education_institution }}</p>
          </div>
          <!-- Education major -->
          <div class="py-2 flex items-center">
            <span class="font-semibold mr-2 uppercase text-sm w-40">Education Major</span>
            <p>{{ user.data.education_major }}</p>
          </div>
          <!-- Occupation -->
          <div class="py-2 flex items-center">
            <span class="font-semibold mr-2 uppercase text-sm w-40">Occupation</span>
            <p>{{ user.data.occupation }}</p>
          </div>
          <!-- Interests -->
          <div class="py-2 flex items-center">
            <span class="font-semibold mr-2 uppercase text-sm w-40">Interests</span>
            <span>COMING SOON</span>
          </div>
          <!-- Business Name -->
          <div class="py-2 flex items-center">
            <span class="font-semibold mr-2 uppercase text-sm w-40">Business Name</span>
            <p>{{ user.data.business_name }}</p>
          </div>
          <!-- In business since -->
          <div class="py-2 flex items-center">
            <span class="font-semibold mr-2 uppercase text-sm w-40">In business since</span>
            <p>{{ user.data.years_in_business }}</p>
          </div>
        </div>
      </div>
      <div class="hidden lg:flex flex-col gap-12 w-40 h-80 bg-gray-200"></div>
    </div>
  </main>
</template>

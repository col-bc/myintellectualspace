<script setup>
import axios from 'axios'
import { onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import NavbarComponent from '@/components/NavbarComponent.vue'
import PostComponent from '@/components/PostComponent.vue'
import useUserStore from '@/stores/user'
import NewPostComponent from '../../components/NewPostComponent.vue'

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
  <main class="bg-gray-100 min-h-screen dark:bg-slate-800">
    <div class="  max-w-screen-xl mx-auto">
      <NavbarComponent />
      <div class="container mx-auto flex flex-col md:flex-row items-start sm:px-2 gap-12 py-12">
        <div class="flex flex-col gap-12 w-80">
          <!-- Avatar -->
          <div class="relative group p-2 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl">
            <img :src="user.data.avatar_uri"
                 class="rounded-lg w-full h-auto md:w-80 md:h-80" />

          </div>
          <!-- Actions/About -->
          <div class="sm:flex-1 shadow-sm bg-white border border-gray-200 rounded-lg divide-y divide-gray-300 first:rounded-t last:rounded-b dark:bg-gray-800 dark:border-gray-600 dark:divide-gray-600">
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
                   class="h-5 w-5 fill-current"
                   viewBox="0 0 24 24"
                   width="24"
                   height="24">
                <path fill="none"
                      d="M0 0h24v24H0z" />
                <path d="M14 14.252V22H4a8 8 0 0 1 10-7.748zM12 13c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm6 4v-3h2v3h3v2h-3v3h-2v-3h-3v-2h3z" />
              </svg>ADD FRIEND
            </a>
            <a href="#"
               class="inline-flex items-center gap-2 w-full px-4 py-2 text-sm font-medium text-blue-600 hover:underline hover:bg-gray-100 dark:text-blue-400 dark:hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg"
                   class="h-5 w-5 fill-current"
                   viewBox="0 0 24 24"
                   width="24"
                   height="24">
                <path fill="none"
                      d="M0 0h24v24H0z" />
                <path d="M6.455 19L2 22.5V4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6.455zM11 10H8v2h3v3h2v-3h3v-2h-3V7h-2v3z" />
              </svg>SEND MESSAGE
            </a>
            <button type="button"
                    @click="() => {
                      if (tab === 'posts') tab = 'about'
                      else tab = 'posts'
                    }"
                    class="inline-flex items-center gap-2 w-full px-4 py-2 text-sm font-medium text-blue-600 hover:underline hover:bg-gray-100 dark:text-blue-400 dark:hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg"
                   class="h-5 w-5 fill-current"
                   viewBox="0 0 24 24"
                   width="24"
                   height="24">
                <path fill="none"
                      d="M0 0h24v24H0z" />
                <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z" />
              </svg>
              {{ tab === 'posts' ? 'SEE ABOUT' : 'SEE POSTS' }}
            </button>
          </div>
        </div>
        <div v-if="tab === 'posts'"
             class="flex-1 flex flex-col gap-12">
          <NewPostComponent v-if="user.data.handle === userStore.getUser.handle" />
          <div v-for="post of user.data.posts"
               :key="post.id">
            <PostComponent :post="post"
                           class="shadow-sm" />
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
              <p v-if="user.data.bio"
                 class="flex-shrink">
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
        <div class="hidden xl:flex bg-white border shadow-sm w-60 h-80 border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-600">&nbsp;</div>
      </div>
    </div>
  </main>
</template>

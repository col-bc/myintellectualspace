<script setup>
import NavbarComponent from '@/components/NavbarComponent.vue'
import LoaderComponent from '@/components/LoaderComponent.vue'
import { reactive, onMounted } from 'vue'
import {
  mdiCloudUploadOutline,
  mdiPlayBoxOutline,
  mdiHeart,
  mdiHeartOutline,
  mdiCommentOutline,
  mdiEyeOutline,
  mdiMovieRoll,
  mdiMovieOpen
} from '@mdi/js'
import useLectureStore from '@/stores/lecture'
import useUserStore from '@/stores/user'
import LectureCardComponent from '../../components/LectureCardComponent.vue'

const user = useUserStore()
const lectures = useLectureStore()
const state = reactive({
  loading: true,
  lectures: [],
  reels: []
})

onMounted(async () => {
  const content = await lectures.fetchLectures()
  console.log(content)
  state.reels = content.filter((item) => item.isReel)
  state.lectures = content.filter((item) => !item.isReel)
  state.reels.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
  state.lectures.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
  state.loading = false
})
</script>

<template>
  <main class="bg-white min-h-screen dark:bg-slate-800">
    <div class="max-w-screen-xl mx-auto">
      <NavbarComponent />
      <div
        class="relative h-full container mx-auto flex flex-col md:flex-row items-start gap-6 md:gap*12 lg:gap-16 py-12 px-2 md:px-4"
      >
        <div class="w-full md:w-auto flex justify-center mb-12">
          <img
            src="@/assets/images/lectures-illustration.svg"
            class="w-full max-w-sm md:max-w-md lg:max-w-lg"
            alt="Lectures Illustration"
          />
        </div>
        <div class="flex-1 flex flex-col">
          <h1
            class="text-5xl font-black leading-loose text-gray-900 dark:text-white mb-12"
          >
            Lectures and Learning
          </h1>

          <p
            class="text-lg leading-loose text-gray-700 dark:text-gray-300 mb-12"
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
            voluptates, quod, quia, voluptate quae quidem voluptatem quibusdam
            doloremque quas quos nemo. Quisquam, quae. Quisquam, quae. Quisquam,
            quae. Quisquam, quae.
          </p>
          <div class="flex items-center gap-6">
            <button
              type="button"
              @click="$router.push('/lectures/new')"
              class="inline-flex items-center gap-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-7 py-3.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-80 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 focus:shadow-sm focus:translate-y-0.5 transition duration-200 ease-in-out"
            >
              <svg-icon :path="mdiCloudUploadOutline" type="mdi" />
              Upload Content
            </button>
            <button
              type="button"
              @click="$router.push('/lectures/creator-dashboard')"
              class="inline-flex items-center gap-3 px-7 py-3.5 font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              <svg-icon :path="mdiMovieOpen" type="mdi" /> Creator Dashboard
            </button>
          </div>
        </div>
      </div>
      <div
        class="h-full container mx-auto flex flex-col gap-6 md:gap-12 lg:gap-16 py-12 px-2 md:px-4"
      >
        <template v-if="state.loading">
          <div class="py-12 flex items-center justify-center">
            <LoaderComponent size="lg" />
          </div>
        </template>
        <template v-else>
          <!-- Tabs -->
          <div
            class="grid grid-cols-2 gap-6 text-sm p-2 rounded-lg shadow border border-gray-300 dark:border-gray-700 font-medium text-center text-gray-500 dark:text-gray-400"
          >
            <router-link
              :to="{ name: 'lectures-home' }"
              class="flex items-center justify-center gap-3 px-4 py-3 rounded-lg"
              :class="[
                $route.name === 'lectures-home'
                  ? ' text-white bg-blue-600 active'
                  : ' hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white'
              ]"
            >
              <svg-icon :path="mdiPlayBoxOutline" type="mdi" />
              Full Length
            </router-link>
            <router-link
              :to="{ name: 'lectures-reels' }"
              class="flex items-center justify-center gap-3 px-4 py-3 rounded-lg"
              :class="[
                $route.name === 'lectures-reels'
                  ? ' text-white bg-blue-600 active'
                  : ' hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white'
              ]"
            >
              <svg-icon :path="mdiMovieRoll" type="mdi" />
              Reels
            </router-link>
          </div>

          <template v-if="$route.name === 'lectures-home'">
            <div class="flex flex-col gap-6 md:gap-12">
              <LectureCardComponent
                v-for="l of state.lectures"
                :key="l.id"
                :lecture="l"
              />
            </div>
          </template>
          <template v-else-if="$route.name === 'lectures-reels'">
            <div class="flex flex-col gap-6 md:gap-12">
              <LectureCardComponent
                v-for="r of state.reels"
                :key="r.id"
                :lecture="r"
              />
            </div>
          </template>
        </template>
      </div>
    </div>
  </main>
</template>

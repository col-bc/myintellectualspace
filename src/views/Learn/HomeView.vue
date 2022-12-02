<script setup>
import axios from 'axios'
import { reactive, onMounted } from 'vue'
import NavbarComponent from '@/components/NavbarComponent.vue'

const state = reactive({
  courses: null
})

onMounted(async () => {
  const { data } = await axios.get('/api/course')
  state.courses = data
})
</script>

<template>
  <main class="bg-white dark:bg-slate-800">
    <div class="min-h-screen max-w-screen-xl mx-auto">
      <NavbarComponent />
      <div
        class="container mx-auto flex flex-col md:flex-row items-center gap-16 px-4 md:py-12"
      >
        <div class="flex-1 flex flex-col gap-12">
          <h1
            class="text-3xl md:text-5xl font-black drop-shadow-xl leading-loose text-gray-900 dark:text-white"
          >
            Learn the way you that works for you
          </h1>
          <p class="leading-loose text-gray-700 dark:text-gray-300">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Et
            exercitationem iure, fugit fugiat, aperiam dignissimos dolorum,
            molestiae placeat libero cupiditate odit? Eveniet quibusdam
            molestiae, rerum error ad adipisci voluptas corrupti.
          </p>
          <div class="flex items-center gap-6">
            <button
              type="button"
              @click="$router.push({ name: 'my-courses' })"
              class="flex-1 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              View Joined Courses
            </button>
            <button
              type="button"
              @click="$router.push('/teach/new-course')"
              class="flex-1 py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              Teach a course
            </button>
          </div>
        </div>
        <lottie-player
          src="https://assets9.lottiefiles.com/packages/lf20_kcixdxqk/animations/lf30_editor_opilardo.json"
          background="transparent"
          class="flex-shrink-0 md:max-w-sm lg:max-w-lg"
          speed="1"
          autoplay
        ></lottie-player>
      </div>
    </div>
    <div class="min-h-screen max-w-screen-xl mx-auto">
      <h2
        class="text-gray-900 text-center text-4xl font-black drop-shadow-xl leading-snug dark:text-white mb-12"
      >
        Explore Trending Courses
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12 mb-12 p-4">
        <div
          v-for="course of state.courses"
          :key="course.id"
          @click="
            $router.push({ name: 'learn-course', params: { id: course.id } })
          "
          class="bg-white hover:bg-gray-50 shadow-md hover:shadow-xl hover:-translate-y-4 border rounded-lg border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 cursor-pointer transition-transform duration-100"
        >
          <img
            :src="course.image_uri"
            alt=""
            class="h-64 w-full rounded-t-lg object-cover object-center"
          />
          <div class="flex-1 p-6 space-y-4">
            <h4 class="text-xl font-bold text-gray-800 dark:text-white">
              {{ course.name }}
            </h4>
            <p class="text-gray-700 text-base leading-snug dark:text-gray-300">
              {{ course.description }}
            </p>
            <p class="flex items-center text-gray-700 dark:text-gray-300">
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                stroke="currentColor"
                stroke-width="2"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-5 h-5 mr-3"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              {{ course.participants.length }} participants
            </p>
            <p
              class="text-sm inline-flex items-center text-gray-700 dark:text-gray-300"
            >
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                stroke="currentColor"
                stroke-width="2"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-5 h-5 mr-1"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline></svg
              ><span class="font-medium ml-2"
                >{{ course.duration }} to complete</span
              >
            </p>
            <div class="flex items-center dark:text-gray-300">
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                stroke-width="2"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-6 h-6 fill-yellow-500"
              >
                <polygon
                  points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                ></polygon>
              </svg>
              <p class="ml-3 text-sm font-bold text-gray-900 dark:text-white">
                4.95
              </p>
              <span
                class="w-1 h-1 mx-1.5 bg-gray-500 rounded-full dark:bg-gray-400"
              ></span>
              <a
                href="#"
                class="text-sm font-medium text-gray-900 underline hover:no-underline dark:text-white"
                >73 reviews</a
              >
            </div>
          </div>
        </div>
      </div>
      <div>
        <button
          type="button"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base mx-auto px-6 py-3.5 text-center flex items-center shadow-lg"
        >
          See all Learning Courses
        </button>
      </div>
    </div>
    <div class="min-h-screen flex flex-col justify-center dark:text-white">
      <h2
        class="text-center drop-shadow-lg text-4xl font-bold leading-relaxed mb-12"
      >
        Can't find what you're looking for?
      </h2>

      <div class="flex justify-center">
        <button
          type="button"
          class="text-white shadow-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Teach a course
        </button>
      </div>
    </div>
  </main>
</template>

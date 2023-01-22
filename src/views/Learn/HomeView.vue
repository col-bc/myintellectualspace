<script setup>
import NavbarComponent from '@/components/NavbarComponent.vue'
import { reactive } from '@vue/reactivity'
import {
  mdiMagnify,
  mdiStar,
  mdiAccountGroupOutline,
  mdiClockOutline,
  mdiCurrencyUsd,
  mdiArrowRightThin
} from '@mdi/js'

const state = reactive({
  searchQuery: '',
  results: [],
  loading: false,
  courses: [
    {
      id: 1,
      title: 'Introduction to Web Development',
      description:
        'Learn to build a website from scratch using HTML, CSS, and JavaScript. No prior experience required. ',
      image:
        'https://assets.justinmind.com/wp-content/uploads/2019/10/best-20-web-development-blogs.png',
      tags: ['computer science', 'web development', 'programming'],
      price: 0,
      rating: 4.5,
      students: 1000,
      lessons: 5,
      duration: 60
    }
  ],
  filters: {
    sorting: 'featured',
    category: 'all',
    price: 'all',
    rating: 'all',
    duration: 'all'
  }
})
</script>

<template>
  <main class="bg-white min-h-screen dark:bg-slate-800">
    <div class="max-w-screen-xl mx-auto">
      <NavbarComponent />
      <div
        class="h-full container mx-auto flex flex-col lg:flex-row items-start gap-6 md:gap-12 lg:gap-16 py-12 px-2 md:px-4 mb-12"
      >
        <div class="w-full lg:w-auto flex justify-center">
          <img
            src="@/assets/images/learn-illustration.svg"
            alt="Learn Illustration"
            class="w-full max-w-sm md:max-w-xs lg:max-w-lg"
          />
        </div>
        <div class="flex-1 flex flex-col">
          <h1
            class="text-5xl font-black leading-normal text-gray-900 dark:text-white mb-12"
          >
            Find a Course that Interests You
          </h1>

          <p
            class="text-lg leading-loose text-gray-700 dark:text-gray-300 mb-12"
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
            voluptates, quod, quia, voluptate quae quidem voluptatem quibusdam
            doloremque quas quos nemo. Quisquam, quae. Quisquam, quae. Quisquam,
            quae. Quisquam, quae.
          </p>
          <div>
            <button
              type="button"
              class="inline-flex items-center gap-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-7 py-3.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-80"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-6 h-6 fill-current"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path fill="none" d="M0 0h24v24H0z" />
                <path
                  d="M20 22H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1zm-1-2V4H5v16h14zM7 6h4v4H7V6zm0 6h10v2H7v-2zm0 4h10v2H7v-2zm6-9h4v2h-4V7z"
                />
              </svg>
              Brose Support Articles
            </button>
          </div>
        </div>
      </div>
      <div
        class="h-full container mx-auto flex flex-col lg:flex-row items-start gap-6 md:gap-12 mb-12 px-2 md:px-4"
      >
        <div
          class="flex flex-col p-4 w-full max-w-xs bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700"
        >
          <h4 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Filter
          </h4>
          <div>
            <label
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Category</label
            >
            <select
              v-model="state.filters.sorting"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="featured">Featured</option>
              <option value="popular">Popular</option>
              <option value="new">New</option>
              <option value="updated">Recently Updated</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>
        <div class="flex-1 flex flex-col gap-6 md:gap-12">
          <div class="flex items-center">
            <label
              class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
              >Search</label
            >
            <div class="relative w-full shadow-sm rounded-lg">
              <div
                class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
              >
                <svg-icon
                  :path="mdiMagnify"
                  type="mdi"
                  class="w-5 h-5 text-gray-500 dark:text-gray-400"
                />
              </div>
              <input
                type="search"
                id="default-search"
                class="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search Subjects, Keywords..."
                required
              />
              <button
                type="submit"
                class="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Search
              </button>
            </div>
          </div>
          <div
            v-for="course of state.courses"
            :key="course.id"
            class="flex flex-col md:flex-row items-stretch p-4 gap-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-md"
          >
            <div class="w-auto md:max-w-sm h-full flex-shrink-0">
              <img
                :src="course.image"
                alt="Course Image"
                class="w-full h-full object-center object-cover rounded-lg"
              />
            </div>
            <div class="flex flex-col">
              <h3
                class="flex-1 text-2xl font-bold text-gray-900 dark:text-white mb-4"
              >
                {{ course.title }}
              </h3>
              <div class="flex items-center gap-4 mb-4">
                <span
                  class="flex items-center gap-2 text-lg font-medium text-gray-700 dark:text-gray-300"
                >
                  <svg-icon
                    :path="mdiStar"
                    type="mdi"
                    class="text-yellow-500"
                  />
                  {{ course.rating }}
                </span>
                <span
                  class="flex items-center gap-2 text-lg font-medium text-gray-700 dark:text-gray-300"
                >
                  <svg-icon
                    :path="mdiClockOutline"
                    type="mdi"
                    class="text-gray-800 dark:text-gray-300"
                  />
                  {{ course.duration }} min
                </span>
                <span
                  class="flex items-center gap-2 text-lg font-medium text-gray-700 dark:text-gray-300"
                >
                  <svg-icon
                    :path="mdiCurrencyUsd"
                    type="mdi"
                    class="text-gray-800 dark:text-gray-300"
                  />
                  {{ course.price || 'Free' }}
                </span>
              </div>
              <div class="flex items-center flex-wrap gap-2 mb-4">
                <div
                  v-for="tag in course.tags"
                  :key="tag"
                  class="bg-gray-100 text-gray-800 font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300"
                >
                  {{ tag }}
                </div>
              </div>
              <p
                class="text-lg leading-loose text-gray-700 dark:text-gray-300 mb-4"
              >
                {{ course.description }}
              </p>
              <div class="flex md:justify-end">
                <button
                  type="button"
                  class="inline-flex items-center gap-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  View Course Details
                  <svg-icon :path="mdiArrowRightThin" type="mdi" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

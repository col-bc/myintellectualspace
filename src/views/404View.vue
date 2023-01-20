<script setup>
import NavbarComponent from '../components/NavbarComponent.vue'
import { mdiArrowLeftThin, mdiHomeOutline, mdiMagnify } from '@mdi/js'
</script>

<template>
  <NavbarComponent />
  <div class="min-h-screen max-w-lg mx-auto flex flex-col px-4 py-12 lg:py-16">
    <div
      class="text-white mb-12 block w-auto mx-auto p-4 rounded-full shadow-lg shadow-purple-400/30 bg-gradient-to-br from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 dark:text-gray-800"
    >
      <svg-icon :path="mdiMagnify" type="mdi" class="h-24 w-24" />
    </div>
    <h1
      class="text-5xl font-black leading-loose text-gray-900 dark:text-white mb-6"
    >
      404 - Page Not Found
    </h1>
    <p
      class="text-gray-700 text-lg font-medium leading-loose dark:text-gray-300 mb-6"
    >
      The page you are looking for does not exist. Please check the URL ang try
      again.
    </p>
    <p class="text-gray-700 text-lg font-medium dark:text-gray-300 mb-12">
      Think this is a mistake?
      <router-link
        to="/support"
        class="text-blue-700 hover:underline dark:text-blue-400"
        >Submit a bug report</router-link
      >.
    </p>

    <div class="w-full flex items-center gap-6">
      <button
        type="button"
        @click="$router.go(-2)"
        class="flex-1 inline-flex justify-center items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-80"
      >
        <svg-icon :path="mdiArrowLeftThin" type="mdi" class="mr-3" />
        Go Back
      </button>
      <button
        type="button"
        @click="$router.push('/')"
        class="flex-1 flex items-center justify-center px-5 py-2.5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-white hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
      >
        <svg-icon :path="mdiHomeOutline" type="mdi" class="mr-3" />
        Go Home
      </button>
    </div>
  </div>
</template>

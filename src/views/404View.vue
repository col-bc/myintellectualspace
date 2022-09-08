<script setup>
import NavbarComponent from '../components/NavbarComponent.vue'
</script>

<template>
  <NavbarComponent />
  <div class="min-h-screen max-w-lg mx-auto flex flex-col px-4 py-12 lg:py-16">
    <div
      class="text-white mb-12 block w-auto mx-auto p-4 rounded-full shadow-lg shadow-purple-400/30 bg-gradient-to-br from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-24 w-24"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <circle cx="10" cy="10" r="7"></circle>
        <path d="M21 21l-6 -6"></path>
        <line x1="10" y1="13" x2="10" y2="13.01"></line>
        <path d="M10 10a1.5 1.5 0 1 0 -1.14 -2.474"></path>
      </svg>
    </div>
    <h1
      class="text-3xl text-center font-bold drop-shadow-xl leading-loose text-gray-900 dark:text-white mb-6"
    >
      Page Not Found
    </h1>
    <p
      class="text-gray-700 text-lg font-medium text-center dark:text-gray-300 mb-12"
    >
      Error 404. The page you are looking for does not exist. Please check the
      URL ang try again.
    </p>

    <div class="w-full flex items-center gap-6">
      <button
        type="button"
        @click="$router.go(-2)"
        class="flex-1 inline-flex justify-center items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-80"
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
          class="w-54F h-5 mr-3"
        >
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Go Back
      </button>
      <button
        type="button"
        @click="$router.push('/')"
        class="flex-1 px-5 py-2.5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-white hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
      >
        Go Home
      </button>
    </div>
  </div>
</template>

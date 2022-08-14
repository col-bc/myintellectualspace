<script setup>
import NavbarComponent from '../../components/NavbarComponent.vue'
</script>

<template>
  <main class="bg-gray-100 min-h-screen dark:bg-slate-800">
    <NavbarComponent />
    <div
      class="container mx-auto flex flex-col md:flex-row items-start sm:px-2 gap-16 py-12"
    >
      <div
        class="flex flex-col max-w-screen-lg mx-auto gap-6 justify-center items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-24 w-24 text-white mb-6 mx-auto p-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <h1 class="text-3xl font-bold text-gray-800 mb-6 dark:text-white">
          User does't exist
        </h1>
        <div>
          <button
            type="button"
            @click="$router.push('/')"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Return to homepage
          </button>
          <button
            type="button"
            @click="$router.go(-2)"
            class="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

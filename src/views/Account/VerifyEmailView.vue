<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  if (localStorage.getItem('color-theme') === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
})
</script>

<template>
  <main class="min-h-screen bg-white py-12 dark:bg-slate-800">
    <div class="max-w-screen-md mx-auto flex flex-col">
      <div
        class="text-white mb-6 mx-auto p-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-24 w-24"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
          />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      </div>
      <router-link
        to="/"
        class="flex items-center mr-auto md:mr-0 text-gray-900 dark:text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="fill-current h-8 w-8 mr-3"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path fill="none" d="M0 0H24V24H0z" />
          <path
            d="M11 2c4.068 0 7.426 3.036 7.934 6.965l2.25 3.539c.148.233.118.58-.225.728L19 14.07V17c0 1.105-.895 2-2 2h-1.999L15 22H6v-3.694c0-1.18-.436-2.297-1.244-3.305C3.657 13.631 3 11.892 3 10c0-4.418 3.582-8 8-8zm0 5c-.552 0-1 .448-1 1v.999L9 9c-.552 0-1 .448-1 1s.448 1 1 1l1-.001V12c0 .552.448 1 1 1s1-.448 1-1v-1h1c.552 0 1-.448 1-1s-.448-1-1-1h-1V8c0-.552-.448-1-1-1z"
          />
        </svg>
        <span class="self-center text-2xl font-bold whitespace-nowrap"
          >Intellectual Space</span
        >
      </router-link>
      <h1
        class="text-3xl font-bold text-center text-gray-800 mb-6 dark:text-white"
      >
        Action Required
      </h1>
      <p class="text-lg text-center text-gray-800 dark:text-gray-200 mb-6">
        We send a verification email to the address you provided at
        registration. Please click the link in the email to verify your email
        address.If you have not received the email, please check your spam
        folder before contacting us.
      </p>
      <div class="flex justify-center">
        <button
          type="button"
          class="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-white hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        >
          Send a new activation email
        </button>
      </div>
    </div>
  </main>
</template>

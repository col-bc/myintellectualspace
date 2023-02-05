<script setup>
import NavbarComponent from '@/components/NavbarComponent.vue'
</script>

<template>
  <main class="bg-white min-h-screen dark:bg-slate-800">
    <div class="max-w-screen-xl mx-auto">
      <NavbarComponent />

      <div
        class="relative h-full container mx-auto flex flex-col md:flex-row-reverse items-start gap-6 md:gap*12 lg:gap-16 py-12 px-2 md:px-4"
      >
        <div class="w-full md:w-auto flex justify-center mb-12">
          <lottie-player
            src="https://assets1.lottiefiles.com/packages/lf20_AQcLsD.json"
            background="transparent"
            speed="1"
            class="w-full max-w-sm md:max-w-md lg:max-w-lg"
            loop
            autoplay
          ></lottie-player>
        </div>
        <div class="flex-1 flex flex-col">
          <h1
            class="text-5xl font-black leading-normal text-gray-900 dark:text-white mb-6"
          >
            This Page is Not Available Yet
          </h1>
          <p
            class="leading-loose text-lg text-gray-700 dark:text-gray-300 mb-6"
          >
            We're constantly working on new features and improving the user
            experience. Please check back later. Thank you for your patience.
          </p>

          <div
            class="p-4 md:p-6 mb-6 w-full md:max-w-xl bg-white border border-gray-300 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700"
          >
            <h5 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Get notified when this page is ready
            </h5>
            <p class="leading-loose text-gray-700 dark:text-gray-300 mb-4">
              Enter your email address below to be notified when this page is
              live.
            </p>
            <div class="mb-4">
              <label
                class="block text-smt mb-2 ext-gray-700 dark:text-gray-400"
              >
                Email Address
              </label>
              <input
                type="email"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              />
            </div>
            <button
              type="button"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Notify Me
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

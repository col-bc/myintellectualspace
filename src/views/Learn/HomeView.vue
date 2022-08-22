<script setup>
import NavbarComponent from '@/components/NavbarComponent.vue'
</script>

<template>
  <main class="bg-white dark:bg-slate-800">
    <div class="min-h-screen max-w-screen-xl mx-auto">
      <NavbarComponent />
      <div
        class="container mx-auto flex flex-col md:flex-row items-center sm:px-2 gap-16 px-2 md:py-12"
      >
        <div class="flex-1 flex flex-col gap-6">
          <h1
            class="text-3xl md:text-5xl font-black drop-shadow-xl leading-loose text-gray-900 dark:text-white"
          >
            Learn the way you that works for you
          </h1>
          <p class="leading-relaxed text-gray-700 dark:text-gray-300">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Et
            exercitationem iure, fugit fugiat, aperiam dignissimos dolorum,
            molestiae placeat libero cupiditate odit? Eveniet quibusdam
            molestiae, rerum error ad adipisci voluptas corrupti.
          </p>
          <div class="flex items-center gap-6">
            <button
              type="button"
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
          src="https://assets2.lottiefiles.com/packages/lf20_j2rjqphu.json"
          background="transparent"
          class="flex-shrink-0 md:max-w-sm lg:max-w-lg"
          speed="1"
          loop
          autoplay
        ></lottie-player>
      </div>
    </div>
    <div class="py-12 bg- flex flex-col overflow-x-hidden">
      <h2
        class="text-gray-900 text-center text-4xl font-black drop-shadow-xl leading-snug dark:text-white mb-12"
      >
        Explore Trending Courses
      </h2>
      <div
        class="max-w-screen-xl w-full mx-auto px-2 md:px-0 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-12 mb-12 sm:px-4"
      >
        <div
          @click="
            $router.push({ name: 'learn-course', params: { name: 'test' } })
          "
          class="placeholder-course"
        >
          &nbsp;
        </div>
        <div class="placeholder-course">&nbsp;</div>
        <div class="placeholder-course">&nbsp;</div>
        <div class="placeholder-course">&nbsp;</div>
        <div class="placeholder-course">&nbsp;</div>
        <div class="placeholder-course">&nbsp;</div>
        <div class="hidden md:block placeholder-course">&nbsp;</div>
        <div class="hidden md:block placeholder-course">&nbsp;</div>
        <div class="hidden md:block placeholder-course">&nbsp;</div>
        <div class="hidden md:block placeholder-course">&nbsp;</div>
        <div class="hidden md:block placeholder-course">&nbsp;</div>
        <div class="hidden md:block placeholder-course">&nbsp;</div>
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
    <div
      class="min-h-screen flex flex-col justify-center bg-gradient-to-b from-blue-200 to-purple-200"
    >
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

<style scoped>
.placeholder-course {
  @apply h-32 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-lg hover:scale-110 transition-transform dark:bg-gray-800 dark:border-gray-700;
}
</style>

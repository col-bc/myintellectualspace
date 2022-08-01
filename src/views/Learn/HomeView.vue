<script setup>
import NavbarComponent from '@/components/NavbarComponent.vue'
</script>

<template>
  <main>
    <div class="min-h-screen">
      <NavbarComponent />
      <div class="container mx-auto flex flex-col md:flex-row items-center sm:px-2 gap-16 py-12">
        <div class="w-1/2 flex flex-col gap-6">
          <h1 class="text-4xl font-bold leading-relaxed">
            Learn the way you that works for you
          </h1>
          <p class="leading-relaxed">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Et
            exercitationem iure, fugit fugiat, aperiam dignissimos dolorum,
            molestiae placeat libero cupiditate odit? Eveniet quibusdam
            molestiae, rerum error ad adipisci voluptas corrupti.
          </p>
          <div class="flex items-center gap-6">
            <button type="button"
                    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
              See all courses
            </button>
            <button type="button"
                    class="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
              Teach a course
            </button>
          </div>
        </div>
        <lottie-player src="https://assets7.lottiefiles.com/packages/lf20_DMgKk1.json"
                       background="transparent"
                       class="max-w-lg"
                       speed="1"
                       loop
                       autoplay></lottie-player>
      </div>
    </div>
    <div class="min-h-screen">
      <h2 class="text-center text-4xl font-bold leading-relaxed mb-12">
        Popular courses
      </h2>
      <div class="grid grid-cols-4 gap-12 px-6">
        <div class="w-auto h-32 border border-gray-200 rounded bg-white shadow-sm hover:shadow-mg">
          &nbsp;
        </div>
        <div class="w-auto h-32 border border-gray-200 rounded bg-white shadow-sm hover:shadow-mg">
          &nbsp;
        </div>
        <div class="w-auto h-32 border border-gray-200 rounded bg-white shadow-sm hover:shadow-mg">
          &nbsp;
        </div>
        <div class="w-auto h-32 border border-gray-200 rounded bg-white shadow-sm hover:shadow-mg">
          &nbsp;
        </div>
        <div class="w-auto h-32 border border-gray-200 rounded bg-white shadow-sm hover:shadow-mg">
          &nbsp;
        </div>
        <div class="w-auto h-32 border border-gray-200 rounded bg-white shadow-sm hover:shadow-mg">
          &nbsp;
        </div>
        <div class="w-auto h-32 border border-gray-200 rounded bg-white shadow-sm hover:shadow-mg">
          &nbsp;
        </div>
        <div class="w-auto h-32 border border-gray-200 rounded bg-white shadow-sm hover:shadow-mg">
          &nbsp;
        </div>
        <div class="w-auto h-32 border border-gray-200 rounded bg-white shadow-sm hover:shadow-mg">
          &nbsp;
        </div>
        <div class="w-auto h-32 border border-gray-200 rounded bg-white shadow-sm hover:shadow-mg">
          &nbsp;
        </div>
        <div class="w-auto h-32 border border-gray-200 rounded bg-white shadow-sm hover:shadow-mg">
          &nbsp;
        </div>
        <div class="w-auto h-32 border border-gray-200 rounded bg-white shadow-sm hover:shadow-mg">
          &nbsp;
        </div>
      </div>
    </div>
    <div class="min-h-screen flex flex-col justify-center bg-gradient-to-b from-blue-200 to-purple-200">
      <h2 class="text-center text-4xl font-bold leading-relaxed mb-12">
        Can't find what you're looking for?
      </h2>
      <div class="flex justify-center">
        <button type="button"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
          Teach a course
        </button>
      </div>
    </div>
  </main>
</template>

<style scoped>
#teach-course {
  background: url('');
}
</style>

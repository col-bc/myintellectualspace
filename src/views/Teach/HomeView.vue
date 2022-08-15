<script setup>
import NavbarComponent from '@/components/NavbarComponent.vue'
</script>

<template>
  <main class="bg-gray-100 dark:bg-slate-800">
    <div class="min-h-screen max-w-screen-xl mx-auto">
      <NavbarComponent />
      <div
        class="container mx-auto flex flex-col md:flex-row items-center sm:px-2 gap-16 py-12"
      >
        <div class="flex flex-col gap-6">
          <h1 class="text-4xl font-bold leading-relaxed dark:text-white">
            Share your knowledge with the world
          </h1>
          <p class="leading-relaxed dark:text-gray-300">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Et
            exercitationem iure, fugit fugiat, aperiam dignissimos dolorum,
            molestiae placeat libero cupiditate odit? Eveniet quibusdam
            molestiae, rerum error ad adipisci voluptas corrupti.
          </p>
          <div class="flex items-center gap-6">
            <button
              type="button"
              @click="$router.push('/teach/new-course')"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Create a Course
            </button>
            <button
              type="button"
              @click="$router.push('/teach/new-meeting')"
              class="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              Start a meeting
            </button>
          </div>
        </div>
        <lottie-player
          src="https://assets4.lottiefiles.com/packages/lf20_ikvz7qhc.json"
          background="transparent"
          class="max-w-lg"
          speed="1"
          loop
          autoplay
        ></lottie-player>
      </div>
    </div>
    <div class="min-h-screen sm:px-2">
      <h2
        class="text-center text-4xl font-bold leading-relaxed mb-12 dark:text-white"
      >
        How to get started
      </h2>
      <p class="max-w-screen-md mx-auto leading-loose mb-6 dark:text-gray-300">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat
        consequuntur commodi fugit laboriosam explicabo recusandae sequi in
        praesentium assumenda et, unde officia repudiandae ab alias adipisci.
        Et, amet! Suscipit, totam. Lorem ipsum dolor sit amet consectetur
        adipisicing elit. Error illum aspernatur labore. Repellendus repellat
        unde labore maiores libero sint porro voluptates aliquid cupiditate
        pariatur suscipit vero, quas nobis iure est. Lorem ipsum dolor sit, amet
        consectetur adipisicing elit. Numquam perspiciatis molestiae accusamus
        iure. Necessitatibus ipsum modi fugiat deserunt, porro, excepturi itaque
        quia debitis corrupti obcaecati dicta praesentium impedit ipsam odio?
      </p>
      <p class="max-w-screen-md mx-auto leading-loose dark:text-gray-300">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat
        consequuntur commodi fugit laboriosam explicabo recusandae sequi in
        praesentium assumenda et, unde officia repudiandae ab alias adipisci.
        Et, amet! Suscipit, totam. Lorem ipsum dolor sit amet consectetur
        adipisicing elit. Error illum aspernatur labore. Repellendus repellat
        unde labore maiores libero sint porro voluptates aliquid cupiditate
        pariatur suscipit vero, quas nobis iure est. Lorem ipsum dolor sit, amet
        consectetur adipisicing elit. Numquam perspiciatis molestiae accusamus
        iure. Necessitatibus ipsum modi fugiat deserunt, porro, excepturi itaque
        quia debitis corrupti obcaecati dicta praesentium impedit ipsam odio?
      </p>
    </div>
  </main>
</template>

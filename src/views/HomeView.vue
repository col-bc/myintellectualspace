<script setup>
import NavbarComponent from '../components/NavbarComponent.vue'
import FooterComponent from '../components/FooterComponent.vue'
</script>

<template>
  <main class="bg-gray-100 dark:bg-slate-800">
    <div class="min-h-screen" id="landing">
      <div class="bg-gray-100 dark:bg-slate-800">
        <div class="max-w-screen-xl mx-auto">
          <NavbarComponent />
        </div>
      </div>
      <div
        class="max-w-screen-xl mx-auto flex flex-row items-center px-2 py-12"
      >
        <div class="container mx-auto flex-1 flex flex-col gap-8">
          <h1
            class="max-w-screen-md text-3xl md:text-5xl font-black drop-shadow-xl leading-loose text-white"
          >
            Your space to learn, grow, share and connect.
          </h1>
          <p
            class="max-w-screen-md text-base md:text-lg drop-shadow text-gray-300 leading-normal md:leading-loose"
          >
            Intellectual Space is a place for learning, networking, and
            innovation. Our mission is to give access and guidance to all
            communities, regardless of fiscal or social capital. We present the
            tools and resources to allow our users to connect with other members
            with a variety of skills, knowledge, trades, and interests, so that
            they may develop a strong network and community, presenting job
            opportunities, networking opportunities, and much more!
          </p>
          <div>
            <button
              type="button"
              @click="$router.push('/register')"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base px-6 py-3.5 text-center flex items-center shadow-lg"
            >
              Create Your Own Space
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 ml-3"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="min-h-screen py-12 flex flex-col">
      <h2
        class="text-gray-900 text-center text-4xl font-black drop-shadow-xl leading-snug dark:text-white mb-12"
      >
        Explore Trending Courses
      </h2>
      <div
        class="max-w-screen-xl w-full mx-auto px-2 md:px-0 grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-12 mb-12 sm:px-4"
      >
        <div class="placeholder-course">&nbsp;</div>
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
      <button
        type="button"
        class="py-3.5 px-7 mx-auto font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 dark:hover:text-white dark:hover:bg-gray-700"
      >
        See all Learning Courses
      </button>
    </div>
  </main>
</template>

<style scoped>
#landing {
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
    url('https://images.unsplash.com/photo-1619512673224-91cfb2688284?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80')
      no-repeat center center;
  background-size: cover;
}

.placeholder-course {
  @apply h-32 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-lg hover:scale-110 transition-transform dark:bg-gray-800 dark:border-gray-700;
}
</style>

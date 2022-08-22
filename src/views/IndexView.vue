<script setup>
import NavbarComponent from '../components/NavbarComponent.vue'
import FooterComponent from '../components/FooterComponent.vue'
</script>

<template>
  <main class="bg-white dark:bg-slate-800">
    <div class="min-h-screen" id="hero">
      <div class="bg-white dark:bg-slate-800">
        <div class="max-w-screen-xl mx-auto">
          <NavbarComponent />
        </div>
      </div>
      <div
        ref="logoutAlert"
        v-if="$route.query && $route.query.logout === 'true'"
        class="px-2 sm:px-4 py-2 text-sm text-blue-700 bg-blue-100 border-y border-blue-700 dark:bg-blue-200 dark:text-blue-800 dark:border-blue-800"
        role="alert"
      >
        <div
          class="flex items-center justify-between max-w-screen-xl mx-auto px-4"
        >
          You have been logged out.
          <button
            type="button"
            @click="$refs.logoutAlert.remove()"
            class="ml-auto -mx-1.5 -my-1.5 bg-blue-100 text-blue-500 rounded-lg focus:ring-2 focus:ring-blue-400 p-1.5 hover:bg-blue-200 inline-flex h-8 w-8 dark:bg-blue-200 dark:text-blue-600 dark:hover:bg-blue-300"
          >
            <span class="sr-only">Close</span>
            <svg
              aria-hidden="true"
              class="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      <div
        class="max-w-screen-xl mx-auto flex flex-row items-center px-2 py-12 lg:py-16"
      >
        <div class="container mx-auto flex-1 flex flex-col gap-8">
          <h1
            class="max-w-screen-md text-3xl md:text-5xl font-black drop-shadow-xl leading-loose text-white"
          >
            Your space to learn, grow, share and connect.
          </h1>
          <p
            class="max-w-screen-md text-lg md:text-lg drop-shadow text-gray-300 leading-normal md:leading-loose"
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
              class="inline-flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-7 py-3.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-80"
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

    <div
      class="bg-white dark:bg-slate-800 py-12 bg- flex flex-col overflow-x-hidden"
    >
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

    <div class="min-h-screen flex items-center" id="hero-1">
      <div
        class="container max-w-screen-md mx-auto flex-1 flex flex-col gap-8 px-2"
      >
        <h1
          class="text-3xl md:text-5xl font-black drop-shadow-xl leading-loose text-white"
        >
          Build your network and grow your career.
        </h1>
        <p
          class="text-lg md:text-lg drop-shadow text-gray-300 leading-normal md:leading-loose"
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
            @click="$router.push('/explore')"
            class="inline-flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-7 py-3.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-80"
          >
            Explore Network
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
#hero {
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
    url('https://images.unsplash.com/photo-1619512673224-91cfb2688284?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80')
      no-repeat;
  background-size: cover;
  background-attachment: fixed;
}

#hero-1 {
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
    url('https://images.unsplash.com/photo-1573164574572-cb89e39749b4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1738&q=80')
      no-repeat;
  background-size: cover;
  background-attachment: fixed;
}

.placeholder-course {
  @apply h-32 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-lg hover:scale-110 transition-transform dark:bg-gray-800 dark:border-gray-700;
}
</style>

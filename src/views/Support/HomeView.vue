<script setup>
import NavbarComponent from '@/components/NavbarComponent.vue'
</script>

<template>
  <main class="bg-white min-h-screen dark:bg-slate-800">
    <div class="max-w-screen-xl mx-auto">
      <NavbarComponent />
      <div
        class="relative h-full container mx-auto flex flex-col md:flex-row items-start gap-6 md:gap*12 lg:gap-16 py-12 px-2 md:px-4"
      >
        <div class="w-full md:w-auto flex justify-center mb-12">
          <lottie-player
            src="https://assets1.lottiefiles.com/packages/lf20_7z8wtyb0.json"
            background="transparent"
            speed="1"
            class="w-full max-w-sm md:max-w-md lg:max-w-lg"
            loop
            autoplay
          ></lottie-player>
        </div>
        <div class="flex-1 flex flex-col">
          <h1
            class="text-5xl font-black leading-loose text-gray-900 dark:text-white mb-12"
          >
            Support Center
          </h1>

          <p
            class="text-lg leading-loose text-gray-700 dark:text-gray-300 mb-12"
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
            voluptates, quod, quia, voluptate quae quidem voluptatem quibusdam
            doloremque quas quos nemo. Quisquam, quae. Quisquam, quae. Quisquam,
            quae. Quisquam, quae.
          </p>
          <div>
            <button
              type="button"
              class="inline-flex items-center gap-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-7 py-3.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-80"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-6 h-6 fill-current"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path fill="none" d="M0 0h24v24H0z" />
                <path
                  d="M20 22H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1zm-1-2V4H5v16h14zM7 6h4v4H7V6zm0 6h10v2H7v-2zm0 4h10v2H7v-2zm6-9h4v2h-4V7z"
                />
              </svg>
              Brose Support Articles
            </button>
          </div>
        </div>
      </div>
      <div class="flex flex-col md:flex-row md:justify-between w-full gap-6">
        <div
          class="w-full max-w-sm p-6 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-lg dark:bg-gray-800 dark:border-gray-700 transition-all duration-100 ease-linear"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-12 w-12 text-gray-700 dark:text-gray-300 fill-current mb-4 mx-auto"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path
              d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-5h2v2h-2v-2zm2-1.645V14h-2v-1.5a1 1 0 0 1 1-1 1.5 1.5 0 1 0-1.471-1.794l-1.962-.393A3.501 3.501 0 1 1 13 13.355z"
            />
          </svg>
          <router-link
            to="/support/faq"
            class="flex items-center justify-center gap-3 text-xl font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-20 dark:hover:text-blue-700 rounded-md px-5 py-2.5"
            >FAQ
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 fill-current"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path
                d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
              /></svg
          ></router-link>
        </div>
        <div
          class="w-full max-w-sm p-6 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-lg dark:bg-gray-800 dark:border-gray-700 transition-all duration-100 ease-linear"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-12 w-12 text-gray-700 dark:text-gray-300 fill-current mb-4 mx-auto"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path
              d="M13 19.9a5.002 5.002 0 0 0 4-4.9v-3a4.98 4.98 0 0 0-.415-2h-9.17A4.98 4.98 0 0 0 7 12v3a5.002 5.002 0 0 0 4 4.9V14h2v5.9zm-7.464-2.21A6.979 6.979 0 0 1 5 15H2v-2h3v-1c0-.643.087-1.265.249-1.856L3.036 8.866l1-1.732L6.056 8.3a7.01 7.01 0 0 1 .199-.3h11.49c.069.098.135.199.199.3l2.02-1.166 1 1.732-2.213 1.278c.162.59.249 1.213.249 1.856v1h3v2h-3c0 .953-.19 1.862-.536 2.69l2.5 1.444-1 1.732-2.526-1.458A6.986 6.986 0 0 1 12 22a6.986 6.986 0 0 1-5.438-2.592l-2.526 1.458-1-1.732 2.5-1.443zM8 6a4 4 0 1 1 8 0H8z"
            />
          </svg>
          <a
            href="https://github.com/col-bc/myintellectualspace/issues/new?assignees=&labels=bug&template=bug_report.md&title="
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center justify-center gap-3 text-xl font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-20 dark:hover:text-blue-700 rounded-md px-5 py-2.5"
          >
            Bug Report
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 fill-current"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path
                d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
              />
            </svg>
          </a>
        </div>
        <div
          class="w-full max-w-sm p-6 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-lg dark:bg-gray-800 dark:border-gray-700 transition-all duration-100 ease-linear"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-12 w-12 text-gray-700 dark:text-gray-300 fill-current mb-4 mx-auto"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path
              d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 15a4.987 4.987 0 0 1-1.828-.345l-2.236 2.237A7.963 7.963 0 0 0 12 20a7.963 7.963 0 0 0 4.064-1.108l-2.236-2.237A4.987 4.987 0 0 1 12 17zm-8-5c0 1.484.404 2.873 1.108 4.064l2.237-2.236A4.987 4.987 0 0 1 7 12c0-.645.122-1.261.345-1.828L5.108 7.936A7.963 7.963 0 0 0 4 12zm14.892-4.064l-2.237 2.236c.223.567.345 1.183.345 1.828s-.122 1.261-.345 1.828l2.237 2.236A7.963 7.963 0 0 0 20 12a7.963 7.963 0 0 0-1.108-4.064zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm0-5a7.963 7.963 0 0 0-4.064 1.108l2.236 2.237A4.987 4.987 0 0 1 12 7c.645 0 1.261.122 1.828.345l2.236-2.237A7.963 7.963 0 0 0 12 4z"
            />
          </svg>
          <router-link
            to="/support/contact"
            class="flex items-center justify-center gap-3 text-xl font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-20 dark:hover:text-blue-700 rounded-md px-5 py-2.5"
            >Contact Us
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 fill-current"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path
                d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
              />
            </svg>
          </router-link>
        </div>
      </div>
    </div>
  </main>
</template>

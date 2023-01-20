<script setup>
import NavbarComponent from '@/components/NavbarComponent.vue'
import {
  mdiTextBoxOutline,
  mdiHelp,
  mdiBugOutline,
  mdiLifebuoy,
  mdiArrowRightThin
} from '@mdi/js'
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
              <svg-icon :path="mdiTextBoxOutline" type="mdi" />
              Brose Support Articles
            </button>
          </div>
        </div>
      </div>
      <div
        class="flex flex-col md:flex-row md:justify-between w-full gap-6 mb-12 px-2 md:px-4"
      >
        <div
          class="w-full max-w-sm p-6 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-lg dark:bg-gray-800 dark:border-gray-700 transition-all duration-100 ease-linear"
        >
          <svg-icon
            :path="mdiHelp"
            type="mdi"
            class="h-12 w-12 text-gray-700 dark:text-gray-300 fill-current mb-4 mx-auto"
          />
          <router-link
            to="/support/faq"
            class="flex items-center justify-center gap-3 text-xl font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-20 dark:hover:text-blue-700 rounded-md px-5 py-2.5"
          >
            FAQ <svg-icon :path="mdiArrowRightThin" type="mdi" />
          </router-link>
        </div>
        <div
          class="w-full max-w-sm p-6 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-lg dark:bg-gray-800 dark:border-gray-700 transition-all duration-100 ease-linear"
        >
          <svg-icon
            :path="mdiBugOutline"
            type="mdi"
            class="h-12 w-12 text-gray-700 dark:text-gray-300 fill-current mb-4 mx-auto"
          />
          <a
            href="https://github.com/col-bc/myintellectualspace/issues/new?assignees=&labels=bug&template=bug_report.md&title="
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center justify-center gap-3 text-xl font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-20 dark:hover:text-blue-700 rounded-md px-5 py-2.5"
          >
            Bug Report <svg-icon :path="mdiArrowRightThin" type="mdi" />
          </a>
        </div>
        <div
          class="w-full max-w-sm p-6 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-lg dark:bg-gray-800 dark:border-gray-700 transition-all duration-100 ease-linear"
        >
          <svg-icon
            :path="mdiLifebuoy"
            type="mdi"
            class="h-12 w-12 text-gray-700 dark:text-gray-300 fill-current mb-4 mx-auto"
          />
          <router-link
            to="/support/contact"
            class="flex items-center justify-center gap-3 text-xl font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-20 dark:hover:text-blue-700 rounded-md px-5 py-2.5"
          >
            Contact Us <svg-icon :path="mdiArrowRightThin" type="mdi" />
          </router-link>
        </div>
      </div>
    </div>
  </main>
</template>

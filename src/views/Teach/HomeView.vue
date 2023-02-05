<script setup>
import NavbarComponent from '@/components/NavbarComponent.vue'
import { mdiArrowRightThin } from '@mdi/js'
</script>

<template>
  <main class="bg-white min-h-screen dark:bg-slate-800">
    <div class="max-w-screen-xl mx-auto">
      <NavbarComponent />
      <div
        class="relative h-full container mx-auto flex flex-col md:flex-row items-start gap-6 md:gap*12 lg:gap-16 py-12 px-2 md:px-4"
      >
        <div class="w-full md:w-auto flex justify-center mb-12">
          <img
            src="@/assets/images/teach-illustration.svg"
            alt="Teach Illustration"
            class="w-full max-w-sm md:max-w-md lg:max-w-lg"
          />
        </div>
        <div class="flex-1 flex flex-col">
          <h1
            class="text-5xl font-black leading-normal text-gray-900 dark:text-white mb-12"
          >
            Share Your Expertise with Others
          </h1>

          <p
            class="text-lg leading-loose text-gray-700 dark:text-gray-300 mb-12"
          >
            Create a course and share your knowledge with others. We'll give you
            the tools to make it happen. You'll be able to create a course,
            manage your students, and track their progress. You can even charge
            for your course if you wish. Get started today!
          </p>

          <div>
            <button
              type="button"
              class="inline-flex items-center gap-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-7 py-3.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-80"
            >
              Create a Course
              <svg-icon
                :path="mdiArrowRightThin"
                type="mdi"
                class="w-6 h-6 fill-current"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import NavbarComponent from '@/components/NavbarComponent.vue'
import {
  mdiArrowRightThin,
  mdiLaptopAccount,
  mdiHelpBoxMultipleOutline,
  mdiTuneVariant
} from '@mdi/js'
</script>

<template>
  <main class="bg-white min-h-screen dark:bg-slate-800">
    <div class="max-w-screen-xl mx-auto">
      <NavbarComponent />
      <div
        class="h-full container mx-auto flex flex-col lg:flex-row items-start gap-6 md:gap-12 lg:gap-16 py-12 px-2 md:px-4 mb-12"
      >
        <div class="w-full lg:w-auto flex justify-center">
          <img
            src="@/assets/images/teach-illustration.svg"
            alt="Learn Illustration"
            class="w-full max-w-sm md:max-w-xs lg:max-w-lg"
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
      <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-12">
        Tools for Teachers
      </h2>
      <p class="text-lg leading-loose text-gray-700 dark:text-gray-300 mb-12">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint rem quos
        culpa soluta? Quo cum voluptatibus ullam. Saepe illo asperiores quasi,
        voluptas neque aspernatur nobis voluptate doloribus, quo quam natus!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint rem quos
        culpa soluta? Quo cum voluptatibus ullam. Saepe illo asperiores quasi,
        voluptas neque aspernatur nobis voluptate doloribus, quo quam natus!
      </p>
      <div
        class="flex flex-col md:flex-row gap-6 md:gap-12 lg:gap-16 justify-between items-start mb-12"
      >
        <div class="flex flex-col">
          <div
            class="flex items-center justify-center w-24 h-24 mx-auto rounded-full bg-blue-100 mb-6"
          >
            <svg-icon
              :path="mdiLaptopAccount"
              type="mdi"
              class="w-12 h-12 fill-current text-blue-700"
            />
          </div>
          <h3
            class="text-2xl text-center font-bold text-gray-900 dark:text-white mb-4"
          >
            Live Stream Classes
          </h3>
          <p
            class="text-lg leading-loose text-gray-700 dark:text-gray-300 mb-6"
          >
            Connect with your students in real-time. We've built a live
            streaming, video conferencing tool that's easy to use and works on
            any device. You can even record your classes and share them with
            your students.
          </p>
          <div>
            <router-link
              to="'/teach/live-streaming"
              class="text=center inline-flex items-center gap-3 text-blue-700 hover:underline dark:text-blue-400"
            >
              Learn More
              <svg-icon
                :path="mdiArrowRightThin"
                type="mdi"
                class="w-6 h-6 fill-current"
              />
            </router-link>
          </div>
        </div>
        <div class="flex flex-col">
          <div
            class="flex items-center justify-center w-24 h-24 mx-auto rounded-full bg-blue-100 mb-6"
          >
            <svg-icon
              :path="mdiHelpBoxMultipleOutline"
              type="mdi"
              class="w-12 h-12 fill-current text-blue-700"
            />
          </div>
          <h3
            class="text-2xl text-center font-bold text-gray-900 dark:text-white mb-4"
          >
            Create Assessments
          </h3>
          <p
            class="text-lg leading-loose text-gray-700 dark:text-gray-300 mb-6"
          >
            Create quizzes and tests for your students to track their progress
            abd help them learn. We've built a powerful assessment tool that's
            easy to use for both teachers and students.
          </p>
          <div>
            <router-link
              to="'/teach/live-streaming"
              class="text=center inline-flex items-center gap-3 text-blue-700 hover:underline dark:text-blue-400"
            >
              Learn More
              <svg-icon
                :path="mdiArrowRightThin"
                type="mdi"
                class="w-6 h-6 fill-current"
              />
            </router-link>
          </div>
        </div>
        <div class="flex flex-col">
          <div
            class="flex items-center justify-center w-24 h-24 mx-auto rounded-full bg-blue-100 mb-6"
          >
            <svg-icon
              :path="mdiTuneVariant"
              type="mdi"
              class="w-12 h-12 fill-current text-blue-700"
            />
          </div>
          <h3
            class="text-2xl text-center font-bold text-gray-900 dark:text-white mb-4"
          >
            Powerful Course Editor
          </h3>
          <p
            class="text-lg leading-loose text-gray-700 dark:text-gray-300 mb-6"
          >
            Fine tune your course with our powerful course editor. You can
            customize the look and feel of your course, add videos, images, and
            more to target your students' needs.
          </p>
          <div>
            <router-link
              to="'/teach/live-streaming"
              class="text=center inline-flex items-center gap-3 text-blue-700 hover:underline dark:text-blue-400"
            >
              Learn More
              <svg-icon
                :path="mdiArrowRightThin"
                type="mdi"
                class="w-6 h-6 fill-current"
              />
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

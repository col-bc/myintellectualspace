<script setup>
import { mdiHeadCogOutline } from '@mdi/js'
</script>

<template>
  <div class="bg-gray-100 dark:bg-gray-900">
    <footer class="container max-w-screen-xl w-full mx-auto px-4 py-12">
      <div class="md:flex md:justify-between">
        <div class="mb-12 md:mb-0">
          <router-link
            to="/"
            class="flex items-center mr-auto md:mr-0 text-gray-900 dark:text-white"
          >
            <svg-icon
              :path="mdiHeadCogOutline"
              type="mdi"
              class="fill-current h-8 w-8 mr-3"
            />

            <span class="self-center text-xl font-bold whitespace-nowrap"
              >Intellectual Space</span
            >
          </router-link>
        </div>
        <div class="flex flex-col md:flex-row md:items-start gap-12">
          <div>
            <h2
              class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white"
            >
              Resources
            </h2>
            <ul class="text-gray-600 dark:text-gray-400">
              <li class="mb-4">
                <router-link to="/community-guidelines" class="hover:underline"
                  >Community Guide</router-link
                >
              </li>
              <li>
                <router-link to="/support" class="hover:underline"
                  >Support</router-link
                >
              </li>
            </ul>
          </div>
          <div>
            <h2
              class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white"
            >
              Get involved
            </h2>
            <ul class="text-gray-600 dark:text-gray-400">
              <li class="mb-4">
                <a
                  href="https://github.com/col-bc/myintellectualspace"
                  class="hover:underline"
                  target="_blank"
                  >Github</a
                >
              </li>
            </ul>
          </div>
          <div>
            <h2
              class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white"
            >
              Legal
            </h2>
            <ul class="text-gray-600 dark:text-gray-400">
              <li class="mb-4">
                <router-link to="/privacy" class="hover:underline"
                  >Privacy Policy</router-link
                >
              </li>
              <li>
                <router-link to="/terms" class="hover:underline"
                  >Terms of Service</router-link
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
      <hr
        class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8"
      />
      <div class="sm:flex sm:items-center sm:justify-between">
        <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400"
          >© 2022
          <a
            href="https://my-intellectual-space.firebaseapp.com/"
            class="hover:underline"
            >My Intellectual Space</a
          >. All Rights Reserved.
        </span>
      </div>
    </footer>
  </div>
</template>

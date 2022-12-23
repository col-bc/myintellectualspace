<template>
  <div class="bg-gray-100 dark:bg-gray-900">
    <footer class="container max-w-screen-xl w-full mx-auto px-4 py-12">
      <div class="md:flex md:justify-between">
        <div class="mb-12 md:mb-0">
          <router-link
            to="/"
            class="flex items-center mr-auto md:mr-0 text-gray-900 dark:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="fill-current h-8 w-8 mr-3"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path fill="none" d="M0 0H24V24H0z" />
              <path
                d="M11 2c4.068 0 7.426 3.036 7.934 6.965l2.25 3.539c.148.233.118.58-.225.728L19 14.07V17c0 1.105-.895 2-2 2h-1.999L15 22H6v-3.694c0-1.18-.436-2.297-1.244-3.305C3.657 13.631 3 11.892 3 10c0-4.418 3.582-8 8-8zm0 5c-.552 0-1 .448-1 1v.999L9 9c-.552 0-1 .448-1 1s.448 1 1 1l1-.001V12c0 .552.448 1 1 1s1-.448 1-1v-1h1c.552 0 1-.448 1-1s-.448-1-1-1h-1V8c0-.552-.448-1-1-1z"
              />
            </svg>
            <span class="self-center text-xl font-bold whitespace-nowrap"
              >Intellectual Space</span
            >
          </router-link>
        </div>
        <div class="flex flex-col md:flex-row md:items-center gap-12">
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
                <a href="#" class="hover:underline">FAQ</a>
              </li>
            </ul>
          </div>
          <div>
            <h2
              class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white"
            >
              Follow us
            </h2>
            <ul class="text-gray-600 dark:text-gray-400">
              <li class="mb-4">
                <a
                  href="https://github.com/themesberg/flowbite"
                  class="hover:underline"
                  >Github</a
                >
              </li>
              <li>
                <a href="https://discord.gg/4eeurUVvTy" class="hover:underline"
                  >Discord</a
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
                <a href="#" class="hover:underline">Privacy Policy</a>
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
          <a href="https://flowbite.com/" class="hover:underline"
            >My My Intellectual Space</a
          >. All Rights Reserved.
        </span>
      </div>
    </footer>
  </div>
</template>

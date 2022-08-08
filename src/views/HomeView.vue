<script setup>
import { reactive } from 'vue'
import NavbarComponent from '../components/NavbarComponent.vue'

const contactForm = reactive({
  error: '',
  name: '',
  email: '',
  message: '',
})
</script>

<template>
  <main class="bg-gray-100 dark:bg-slate-800">
    <div class="min-h-screen max-w-screen-xl mx-auto">
      <NavbarComponent />
      <div class="container mx-auto flex flex-col md:flex-row items-center sm:px-2 gap-16 py-12">
        <div class="flex flex-col md:flex-row items-center gap-12">
          <div class="flex-1 flex flex-col gap-8">
            <h1 class="text-4xl font-bold leading-snug text-gray-900 dark:text-white">
              Welcome to My Intellectual Space
            </h1>
            <p class="text-gray-700 leading-loose dark:text-gray-300">
              Intellectual Space is a place for learning, networking, and
              innovation. Our mission is to give access and guidance to all
              communities, regardless of fiscal or social capital. We present
              the tools and resources to allow our users to connect with other
              members with a variety of skills, knowledge, trades, and
              interests, so that they may develop a strong network and
              community, presenting job opportunities, networking opportunities,
              and much more!
            </p>
            <div>
              <button type="button"
                      @click="$router.push('/register')"
                      class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base px-6 py-3.5 text-center flex items-center shadow-lg shadow-blue-400/60 dark:shadow-blue-800/40">
                Create Your Own Space
                <svg xmlns="http://www.w3.org/2000/svg"
                     class="w-5 h-5 fill-current ml-3"
                     viewBox="0 0 24 24"
                     width="24"
                     height="24">
                  <path fill="none"
                        d="M0 0h24v24H0z" />
                  <path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" />
                </svg>
              </button>
            </div>
          </div>
          <div class="flex-1 flex items-center justify-center">
            <lottie-player src="https://assets3.lottiefiles.com/packages/lf20_osdxlbqq.json"
                           background="transparent"
                           class="max-w-lg"
                           speed="1"
                           loop
                           autoplay></lottie-player>
          </div>
        </div>
      </div>
    </div>
    <div class="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div class="flex flex-col justify-center gap-12 p-12">
        <h1 class="text-gray-900 text-3xl font-bold  dark:text-white">
          The best way to connect with like-minded people
        </h1>
        <p class="text-gray-700 text-lg font-medium leading-loose  dark:text-gray-300">
          Intellectual Space is a place for learning, networking, and
          innovation. Our mission is to give access and guidance to all
          communities, regardless of fiscal or social capital. We present the
          tools and resources to allow our users to connect with other members
          with a variety of skills, knowledge, trades, and interests, so that
          they may develop a strong network and community, presenting job
          opportunities, networking opportunities, and much more!
        </p>
        <button type="button"
                @click="$router.push('/register')"
                class="self-start text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base px-6 py-3.5">
          Explore Our Community
        </button>
      </div>
      <img src="https://images.unsplash.com/photo-1531844251246-9a1bfaae09fc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1216&q=80"
           class="w-full h-full object-cover rounded-l-3xl shadow-2xl" />
    </div>
    <div class="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <img src="https://images.unsplash.com/photo-1582560469753-f2598d73444a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1699&q=80"
           class="w-full h-full object-cover rounded-r-3xl shadow-2xl" />
      <div class="flex flex-col justify-center gap-12 p-12">
        <h1 class="text-gray-900 text-3xl font-bold dark:text-white">
          Explore the topics your passionate about
        </h1>
        <p class="text-gray-700 text-lg font-medium leading-loose dark:text-gray-300">
          Intellectual Space is a place for learning, networking, and
          innovation. Our mission is to give access and guidance to all
          communities, regardless of fiscal or social capital. We present the
          tools and resources to allow our users to connect with other members
          with a variety of skills, knowledge, trades, and interests, so that
          they may develop a strong network and community, presenting job
          opportunities, networking opportunities, and much more!
        </p>
        <button type="button"
                @click="$router.push('/learn')"
                class="self-start text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base px-6 py-3.5">
          Search courses
        </button>
      </div>
    </div>
    <div class="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div class="flex flex-col justify-center gap-12 p-12">
        <h1 class="text-gray-900 text-3xl font-bold  dark:text-white">
          Share your knowledge with the world
        </h1>
        <p class="text-gray-700 text-lg font-medium leading-loose  dark:text-gray-300">
          Intellectual Space is a place for learning, networking, and
          innovation. Our mission is to give access and guidance to all
          communities, regardless of fiscal or social capital. We present the
          tools and resources to allow our users to connect with other members
          with a variety of skills, knowledge, trades, and interests, so that
          they may develop a strong network and community, presenting job
          opportunities, networking opportunities, and much more!
        </p>
        <button type="button"
                @click="$router.push('/register')"
                class="self-start text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base px-6 py-3.5">
          Requirements for educators
        </button>
      </div>
      <img src="https://images.unsplash.com/photo-1605711285791-0219e80e43a3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1738&q=80"
           class="w-full h-full object-cover rounded-l-3xl shadow-2xl" />
    </div>
    <div class="min-h-screen grid grid-cols-1">
      <div class="flex flex-col items-center justify-center gap-12 p-12">
        <h2 class="text-gray-900 text-3xl font-bold text-center dark:text-white">
          How can we help you?
        </h2>
        <form @submit.prevent
              class="flex flex-col gap-6 w-full max-w-lg">
          <input type="text"
                 class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                 placeholder="Your name"
                 required />
          <input type="email"
                 class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                 placeholder="Your email"
                 required />
          <textarea id="message"
                    rows="4"
                    class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Your message..."></textarea>
          <div>
            <button type="button"
                    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
              Send message
            </button>
          </div>
        </form>
      </div>
    </div>
    <footer class="p-4 bg-white sm:p-6 dark:bg-gray-900">
      <div class="md:flex md:justify-between">
        <div class="mb-6 md:mb-0">
          <router-link to="/"
                       class="flex w-auto justify-center items-center mr-auto md:mr-0 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400">
            <svg xmlns="http://www.w3.org/2000/svg"
                 class="stroke-gray-900 dark:stroke-white h-8 w-8 mr-2"
                 width="24"
                 height="24"
                 viewBox="0 0 24 24"
                 stroke-width="2"
                 stroke="currentColor"
                 fill="none"
                 stroke-linecap="round"
                 stroke-linejoin="round">
              <path stroke="none"
                    d="M0 0h24v24H0z"
                    fill="none"></path>
              <path d="M5.931 6.936l1.275 4.249m5.607 5.609l4.251 1.275"></path>
              <path d="M11.683 12.317l5.759 -5.759"></path>
              <circle cx="5.5"
                      cy="5.5"
                      r="1.5"></circle>
              <circle cx="18.5"
                      cy="5.5"
                      r="1.5"></circle>
              <circle cx="18.5"
                      cy="18.5"
                      r="1.5"></circle>
              <circle cx="8.5"
                      cy="15.5"
                      r="4.5"></circle>
            </svg>
            <span class="self-center text-3xl font-bold whitespace-nowrap">
              Intellectual Space
            </span>
          </router-link>
        </div>
        <div class="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
          <div>
            <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
              Resources
            </h2>
            <ul class="text-gray-600 dark:text-gray-400">
              <li class="mb-4">
                <a href="https://flowbite.com/"
                   class="hover:underline">Flowbite</a>
              </li>
              <li>
                <a href="https://tailwindcss.com/"
                   class="hover:underline">Tailwind CSS</a>
              </li>
            </ul>
          </div>
          <div>
            <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
              Follow us
            </h2>
            <ul class="text-gray-600 dark:text-gray-400">
              <li class="mb-4">
                <a href="https://github.com/themesberg/flowbite"
                   class="hover:underline">Github</a>
              </li>
              <li>
                <a href="https://discord.gg/4eeurUVvTy"
                   class="hover:underline">Discord</a>
              </li>
            </ul>
          </div>
          <div>
            <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
              Legal
            </h2>
            <ul class="text-gray-600 dark:text-gray-400">
              <li class="mb-4">
                <a href="#"
                   class="hover:underline">Privacy Policy</a>
              </li>
              <li>
                <a href="#"
                   class="hover:underline">Terms &amp; Conditions</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
      <div class="sm:flex sm:items-center sm:justify-between">
        <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2022
          <a href="https://flowbite.com/"
             class="hover:underline">Flowbite™</a>.
          All Rights Reserved.
        </span>
        <div class="flex mt-4 space-x-6 sm:justify-center sm:mt-0">
          <a href="#"
             class="text-gray-500 hover:text-gray-900 dark:hover:text-white">
            <svg class="w-5 h-5"
                 fill="currentColor"
                 viewBox="0 0 24 24"
                 aria-hidden="true">
              <path fill-rule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clip-rule="evenodd"></path>
            </svg>
            <span class="sr-only">Facebook page</span>
          </a>
          <a href="#"
             class="text-gray-500 hover:text-gray-900 dark:hover:text-white">
            <svg class="w-5 h-5"
                 fill="currentColor"
                 viewBox="0 0 24 24"
                 aria-hidden="true">
              <path fill-rule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clip-rule="evenodd"></path>
            </svg>
            <span class="sr-only">Instagram page</span>
          </a>
          <a href="#"
             class="text-gray-500 hover:text-gray-900 dark:hover:text-white">
            <svg class="w-5 h-5"
                 fill="currentColor"
                 viewBox="0 0 24 24"
                 aria-hidden="true">
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
            </svg>
            <span class="sr-only">Twitter page</span>
          </a>
          <a href="#"
             class="text-gray-500 hover:text-gray-900 dark:hover:text-white">
            <svg class="w-5 h-5"
                 fill="currentColor"
                 viewBox="0 0 24 24"
                 aria-hidden="true">
              <path fill-rule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clip-rule="evenodd"></path>
            </svg>
            <span class="sr-only">GitHub account</span>
          </a>
          <a href="#"
             class="text-gray-500 hover:text-gray-900 dark:hover:text-white">
            <svg class="w-5 h-5"
                 fill="currentColor"
                 viewBox="0 0 24 24"
                 aria-hidden="true">
              <path fill-rule="evenodd"
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
                    clip-rule="evenodd"></path>
            </svg>
            <span class="sr-only">Dribbbel account</span>
          </a>
        </div>
      </div>
    </footer>
  </main>
</template>

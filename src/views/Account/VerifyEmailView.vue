<script setup>
import { onMounted, } from 'vue';


onMounted(async () => {
    if (localStorage.getItem('color-theme') === 'dark') {
        document.documentElement.classList.add('dark');
        darkMode.value = true
    } else {
        document.documentElement.classList.remove('dark')
        darkMode.value = false
    }
})
</script>

<template>
    <main class="min-h-screen bg-gray-100 py-12 dark:bg-slate-800">
        <div class="max-w-screen-md mx-auto flex flex-col bg-white border border-gray-200 rounded-lg p-6 dark:bg-gray-800 dark:border-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg"
                 class="h-24 w-24 fill-white mb-6 mx-auto p-4 rounded-full bg-gradient-to-b from-blue-400 to-purple-400"
                 viewBox="0 0 24 24"
                 width="24"
                 height="24">
                <path fill="none"
                      d="M0 0h24v24H0z" />
                <path d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm9.06 8.683L5.648 6.238 4.353 7.762l7.72 6.555 7.581-6.56-1.308-1.513-6.285 5.439z" />
            </svg>
            <router-link to="/"
                         class="flex w-auto mb-6 justify-center items-center mr-auto md:mr-0 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400">
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
            <h1 class="text-3xl font-bold text-center text-gray-800 mb-6 dark:text-white">
                Action Required
            </h1>

            <p class="text-lg text-center text-gray-800 dark:text-gray-200">
                We send a verification email to the address you provided at registration. Please click the link in the email to verify your email address.If you have not received the email, please check your spam folder before contacting us.
            </p>
        </div>
    </main>
</template>
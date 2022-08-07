<script setup>
import NavbarComponent from '../../components/NavbarComponent.vue';
</script>

<template>
    <main class="bg-white min-h-screen dark:bg-slate-800">
        <NavbarComponent />
        <div class="container mx-auto flex flex-col md:flex-row items-start sm:px-2 gap-16 py-12">
            <div class="flex flex-col max-w-screen-lg mx-auto gap-6 justify-center items-center">
                <h1 class="text-4xl font-bold dark:text-white">404 - User not found</h1>
                <p class="dark:text-gray-300">The user you're looking for cannot be found. Please check the spelling and try agin.</p>
                <div>
                    <button type="button"
                            @click="$router.push('/')"
                            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Return to homepage</button>
                    <button type="button"
                            @click="$router.go(-2)"
                            class="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Go back</button>
                </div>
            </div>
        </div>
    </main>
</template>
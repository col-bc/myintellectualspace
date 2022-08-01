<script setup>
import NavbarComponent from '../../components/NavbarComponent.vue';
</script>

<template>
    <main>
        <NavbarComponent />
        <div class="container mx-auto flex flex-col md:flex-row items-start sm:px-2 gap-16 py-12">
            <div class="flex flex-col max-w-screen-lg mx-auto gap-6 justify-center items-center w-64">
                <lottie-player src="https://assets5.lottiefiles.com/packages/lf20_t24tpvcu.json"
                               background="transparent"
                               class="max-w-lg"
                               speed="1"
                               loop
                               autoplay></lottie-player>
                <h1 class="text-2xl font-bold">User not found</h1>
                <router-link to="/"
                             class="text-blue-500 hover:underline">
                    <span class="text-sm">Go back to the homepage</span>
                </router-link>
            </div>
        </div>
    </main>
</template>
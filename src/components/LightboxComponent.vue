<script setup>
import NavbarComponent from '@/components/NavbarComponent.vue'
import { defineProps, onMounted, onUpdated } from 'vue'

const props = defineProps({
    image: {
        type: String,
        required: true
    },
    show: {
        type: Boolean,
        default: false
    },
})
const isShown = ref(false)
onMounted(() => {
    isShown.value = props.show
})
onUpdated(() => {
    isShown.value = props.show
})
</script>

<template>
    <main>
        <template name="button"
                  @click="isShown = !isShown">
        </template>
        <Teleport to="modals-container">
            <div class="fixed z-40 top-0 left-0 w-screen h-screen bg-black bg-opacity-40"></div>
            <button type="button"
                    @click="isShown = false"
                    class="bg-transparent hover:bg-black hover:bg-opacity-30 p-2.5">
                <svg xmlns="http://www.w3.org/2000/svg"
                     class="h-6 w-6"
                     fill="none"
                     viewBox="0 0 24 24"
                     stroke="currentColor"
                     stroke-width="2">
                    <path stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <div class="fixed z-50 flex flex-col items-center justify-center">
                <img :src="props.src"
                     class-="w-full h-auto shadow-xl" />
            </div>

        </Teleport>
    </main>
</template>
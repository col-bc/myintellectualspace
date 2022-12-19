<script setup>
import FooterComponent from './components/FooterComponent.vue'
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import useInterface from '@/stores/interface'

const ui = useInterface()

onMounted(() => {
  if (localStorage.getItem('color-theme') === 'dark') {
    ui.setDarkTheme(true)
  } else {
    ui.setDarkTheme(false)
  }
})
</script>

<template>
  <div>
    <router-view v-slot="{ Component }">
      <transition>
        <component :is="Component" />
      </transition>
    </router-view>
    <FooterComponent />
  </div>
</template>

<style>
/* @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap'); */
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@100;200;300;400;500;600;700;800&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: 'Sora', 'Roboto', sans-serif;
  @apply bg-white dark:bg-slate-800;
}
</style>

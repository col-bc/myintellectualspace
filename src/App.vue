<script setup>
import FooterComponent from './components/FooterComponent.vue'
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'

onMounted(() => {
  if (localStorage.getItem('color-theme') === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
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
    <div id="modals-container"></div>
    <FooterComponent />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: 'Josefin Sans', sans-serif;
}

html,
body {
  @apply bg-white dark:bg-slate-800;
}

#modals-container {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
}
</style>

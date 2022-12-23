<script setup>
import FooterComponent from './components/FooterComponent.vue'
import { RouterView } from 'vue-router'
import { onMounted, ref } from 'vue'
import useInterface from '@/stores/interface'
import useUserStore from '@/stores/user'
import { getAuth, onAuthStateChanged } from '@firebase/auth'

const ui = useInterface()
const user = useUserStore()
const auth = getAuth()
const vpWidth = ref(window.innerWidth)

onMounted(() => {
  if (localStorage.getItem('color-theme') === 'dark') {
    ui.setDarkTheme(true)
  } else {
    ui.setDarkTheme(false)
  }
  ui.setViewportWidth(vpWidth.value)

  onAuthStateChanged(auth, (credential) => {
    if (!credential?.auth) {
      user.logout()
    }
  })
})

window.addEventListener('resize', () => {
  vpWidth.value = window.innerWidth
  ui.setViewportWidth(vpWidth.value)
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
    <div id="modals-root"></div>
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

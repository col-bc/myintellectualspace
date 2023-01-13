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
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inconsolata:wght@200;300;400;500;600;700;800;900&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: 'Roboto', sans-serif;
  @apply bg-white dark:bg-slate-800;
}

.font-mono {
  font-family: 'Inconsolata', monospace !important;
}
</style>

import { createApp } from 'vue'

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import axios from 'axios'

import 'flowbite'

import App from './App.vue'
import router from './router'

// initialize pinia and persisted state
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// axios defaults
axios.defaults.baseURL = 'http://localhost:5000'

createApp(App).use(router).use(pinia).mount('#app')

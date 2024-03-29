import { createApp } from 'vue'

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import 'flowbite'
import '@/assets/flowbite.css'

import SvgIcon from '@jamescoyle/vue-icon'

import App from './App.vue'
import router from './router'

import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
const firebaseConfig = {
  apiKey: 'AIzaSyCN5ebqn1T3Gcc-DAWS-oRRkCqRAnTrZwk',
  authDomain: 'my-intellectual-space.firebaseapp.com',
  projectId: 'my-intellectual-space',
  storageBucket: 'my-intellectual-space.appspot.com',
  messagingSenderId: '783506874330',
  appId: '1:783506874330:web:094dc21867fe3e77c7eae3',
  measurementId: 'G-E8TRYHSK1Y'
}
const fvApp = initializeApp(firebaseConfig)
const analytics = getAnalytics(fvApp)

// initialize pinia and persisted state
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

createApp(App)
  .component('svg-icon', SvgIcon)
  .use(router)
  .use(pinia)
  .mount('#app')

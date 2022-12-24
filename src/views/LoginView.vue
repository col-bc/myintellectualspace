<script setup>
import AlertComponent from '@/components/AlertComponent.vue'
import LoaderComponent from '@/components/LoaderComponent.vue'
import useUserStore from '@/stores/user'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword
} from 'firebase/auth'
import { getDoc, doc, getFirestore } from 'firebase/firestore'
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const provider = new GoogleAuthProvider()
const auth = getAuth()
const db = getFirestore()
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

onMounted(() => {
  auth.languageCode = 'it'
  // Dark mode
  if (localStorage.getItem('color-theme') === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
})

const form = reactive({
  email: '',
  password: ''
})
const alert = ref('')
const loading = ref(false)

function validateForm() {
  alert.value = ''
  if (!form.email || !form.password) {
    alert.value = 'Both email and password are required.'
    form.password = ''
    return false
  }
  // verify email is valid
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    alert.value = 'Please enter a valid email address'
    form.password = ''
    return false
  }
  return true
}
async function loginWithEmail() {
  // login with username and password
  if (!validateForm()) {
    return
  }
  loading.value = true
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      form.email,
      form.password
    )
    const user = userCredential.user
    const userDoc = doc(db, 'users', user.uid)
    const docSnap = await getDoc(userDoc)
    if (docSnap.exists()) {
      userStore.setUser(docSnap.data())
      // handle redirect
      // push to onboarding if handle or fullName if not set
      if (!userStore.user.handle || !userStore.user.fullName) {
        router.push('/getting-started')
        return
      }
      // push to router next param if set
      if (route.params.next && route.params.next !== '/login') {
        router.push(route.params.next)
        return
      }
      // push to profile home if no next param
      else {
        router.push({
          name: 'profile',
          params: { handle: userStore.user.handle }
        })
        return
      }
    } else {
      alert.value = 'Invalid email or password'
    }
  } catch (error) {
    /*
    TODO: Remove error logging
          exposing this error allows for user enumeration
    */
    console.log(error)
    alert.value = 'Invalid email or password'
  } finally {
    loading.value = false
    form.password = ''
  }
}
async function loginWithGoogle() {
  signInWithPopup(auth, provider)
    .then(async (result) => {
      const user = result.user
      // get user from firestore
      getDoc(doc(db, 'users', user.uid)).then(async (doc) => {
        if (doc.exists()) {
          await userStore.setUser(doc.data())
          // handle redirect
          // push to onboarding if handle or fullName if not set
          if (!userStore.user.handle || !userStore.user.fullName) {
            router.push('/getting-started')
            return
          }
          // push to router next param if set
          if (!!route.params.next) {
            router.push(route.params.next)
            return
          }
          // push to profile home if no next param
          else {
            router.push({
              name: 'profile',
              params: { handle: userStore.user.handle }
            })
            return
          }
          router.push('/')
        } else {
          router.push('/register')
          return
        }
      })
    })
    .catch((error) => {
      if (error.code === 'auth/unauthorized-domain') {
        alert.value = 'Authentication is not enabled for this domain.'
        return
      }
      alert.value = error.message
    })
}
</script>

<template>
  <main class="min-h-screen flex items-stretch bg-white dark:bg-slate-800">
    <div class="flex-1 max-w-md mx-auto flex flex-col justify-center px-4">
      <h1
        class="text-3xl font-bold text-center text-gray-900 mb-4 dark:text-white"
      >
        Welcome back to
      </h1>
      <router-link
        to="/"
        class="flex items-center justify-center mb-12 text-gray-900 dark:text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="fill-current h-8 w-8 mr-3"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path fill="none" d="M0 0H24V24H0z" />
          <path
            d="M11 2c4.068 0 7.426 3.036 7.934 6.965l2.25 3.539c.148.233.118.58-.225.728L19 14.07V17c0 1.105-.895 2-2 2h-1.999L15 22H6v-3.694c0-1.18-.436-2.297-1.244-3.305C3.657 13.631 3 11.892 3 10c0-4.418 3.582-8 8-8zm0 5c-.552 0-1 .448-1 1v.999L9 9c-.552 0-1 .448-1 1s.448 1 1 1l1-.001V12c0 .552.448 1 1 1s1-.448 1-1v-1h1c.552 0 1-.448 1-1s-.448-1-1-1h-1V8c0-.552-.448-1-1-1z"
          />
        </svg>
        <span class="self-center text-2xl font-bold whitespace-nowrap"
          >Intellectual Space</span
        >
      </router-link>

      <button
        type="button"
        @click="loginWithGoogle()"
        class="py-2.5 px-5 flex items-center justify-center gap-4 mb-6 font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
      >
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          class="w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
            <path
              fill="#4285F4"
              d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
            />
            <path
              fill="#34A853"
              d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
            />
            <path
              fill="#FBBC05"
              d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
            />
            <path
              fill="#EA4335"
              d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
            />
          </g>
        </svg>
        Continue with Google
      </button>

      <div class="flex items-center justify-center mb-6">
        <div class="w-1/3 border-b dark:border-gray-600"></div>
        <div class="mx-4 text-gray-500 dark:text-gray-400">or</div>
        <div class="w-1/3 border-b dark:border-gray-600"></div>
      </div>

      <form
        class="w-full flex flex-col gap-6 mb-6"
        @submit.prevent="loginWithEmail"
      >
        <!-- Alerts -->
        <div
          v-if="$route.query.registered === 'true' || !!alert"
          class="flex flex-col gap-y-2"
        >
          <AlertComponent
            v-if="$route.query.registered === 'true'"
            message="You have successfully registered. Please login to continue."
            type="success"
            :dismissible="false"
          />
          <AlertComponent
            v-if="!!alert"
            :message="alert"
            :show="!!alert"
            type="error"
          />
        </div>
        <div>
          <label class="mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Email</label
          >
          <input
            type="text"
            v-model="form.email"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Email address"
          />
        </div>
        <div>
          <label class="mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Password</label
          >
          <input
            type="password"
            v-model="form.password"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Password"
          />
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="inline-flex items-center text-base justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 uppercase"
        >
          <LoaderComponent v-if="loading" />
          <span v-else> Continue </span>
        </button>
      </form>

      <p class="mb-8 dark:text-white">
        Need an account?
        <router-link
          to="/register"
          class="text-blue-600 hover:underline dark:text-blue-400"
          >Create one here.</router-link
        >
      </p>
    </div>
  </main>
</template>

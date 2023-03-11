<script setup>
import AlertComponent from '@/components/AlertComponent.vue'
import LoaderComponent from '@/components/LoaderComponent.vue'
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import {
  doc,
  getDoc,
  setDoc,
  getFirestore,
  serverTimestamp
} from 'firebase/firestore'
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { mdiHeadCogOutline } from '@mdi/js'

const provider = new GoogleAuthProvider()
const auth = getAuth()
const db = getFirestore()
const router = useRouter()

onMounted(() => {
  auth.languageCode = 'it'
})

const form = reactive({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: false
})
const alert = ref(null)
const loading = ref(false)
const requirements = computed(() => {
  return {
    length: form.password.length >= 8,
    uppercase: /[A-Z]/.test(form.password),
    digit: /[0-9]/.test(form.password)
  }
})

function verifyForm() {
  alert.value = null
  // check if form is filled out
  if (
    !form.fullName ||
    !form.email ||
    !form.password ||
    !form.confirmPassword
  ) {
    alert.value = 'Please fill out all fields'
    return false
  }
  // check if email is valid
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    alert.value = 'Please enter a valid email address'
    return
  }
  // check if passwords match
  if (form.password !== form.confirmPassword) {
    alert.value = 'Passwords do not match.'
    return false
  }
  // check if password is at least 8 characters long and contains at least one number and one uppercase letter
  if (
    form.password.length < 8 ||
    !/\d/.test(form.password) ||
    !/[a-z]/.test(form.password) ||
    !/[A-Z]/.test(form.password)
  ) {
    alert.value =
      'Password must be at least 8 characters long and contain at least one number and one uppercase letter.'
    return false
  }
  // check if terms are checked
  if (!form.terms) {
    alert.value = 'Please agree to the terms and privacy policy.'
    return false
  }
  return true
}
async function registerWithEmail() {
  loading.value = true
  if (!verifyForm()) {
    loading.value = false
    return
  }

  // create a user with email and password in firebase auth
  createUserWithEmailAndPassword(auth, form.email, form.password)
    .then(async (userCredential) => {
      // create user document in firestore
      const userRef = doc(db, 'users', userCredential.user.uid)
      const userSnap = await getDoc(userRef)
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: userCredential.user.uid,
          fullName: form.fullName,
          email: form.email,
          avatarUrl:
            'https://firebasestorage.googleapis.com/v0/b/my-intellectual-space.appspot.com/o/avatars%2Favatar.png?alt=media&token=de2d4a8a-ae3e-48f1-b8c7-3620b1eb3b69',
          createdAt: serverTimestamp()
        })
        router.push('/login?registered=true')
      } else {
        alert.value = 'An account with this email already exists.'
        return
      }
    })
    .catch((error) => {
      console.log(error)
      alert.value = error.message
    })
    .finally(() => {
      loading.value = false
    })
}
async function registerWithGoogle() {
  // create user with google in firebase auth
  loading.value = true

  signInWithPopup(auth, provider)
    .then(async (result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result)
      const googleUser = result.user

      // create user document in firestore
      const userRef = doc(db, 'users', googleUser.uid)
      const userSnap = await getDoc(userRef)
      if (!userSnap.exists()) {
        console.log('creating document ' + googleUser.uid)
        await setDoc(userRef, {
          uid: googleUser.uid,
          fullName: googleUser.displayName,
          email: googleUser.email,
          avatarUrl: googleUser.photoURL,
          createdAt: serverTimestamp()
        })
        router.push('/login?registered=true')
      } else {
        alert.value = 'An account with this email already exists.'
        return
      }
    })
    .catch((error) => {
      console.log(error)
      alert.value = error.message
    })
    .finally(() => {
      loading.value = false
    })
}
</script>

<template>
  <main class="min-h-screen flex items-stretch bg-white dark:bg-slate-800">
    <div
      class="flex-1 max-w-md mx-auto flex flex-col justify-center px-4 py-12"
    >
      <router-link
        to="/"
        class="flex items-center justify-center mb-6 text-gray-900 dark:text-white"
      >
        <svg-icon
          :path="mdiHeadCogOutline"
          type="mdi"
          class="fill-current h-8 w-8 mr-3"
        />
        <span class="self-center text-2xl font-bold whitespace-nowrap"
          >Intellectual Space</span
        >
      </router-link>
      <h1
        class="text-3xl font-bold text-center text-gray-900 mb-12 dark:text-white"
      >
        Create your free account
      </h1>

      <button
        type="button"
        @click="registerWithGoogle()"
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

      <div class="relative w-full flex flex-col gap-6 mb-6">
        <AlertComponent
          v-if="!!alert"
          :message="alert"
          type="error"
          class="col-span-2"
        />
        <div>
          <label class="mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Full name</label
          >
          <input
            type="text"
            v-model="form.fullName"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div>
          <label class="mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Email</label
          >
          <input
            type="email"
            v-model="form.email"
            class="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div>
          <label class="mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Password</label
          >
          <div class="relative">
            <input
              type="password"
              v-model="form.password"
              class="peer col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            <div
              class="hidden peer-focus-within:block absolute w-full top-full mt-1 p-4 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700"
            >
              <h5
                class="mb-2 text-base font-semibold text-gray-900 dark:text-white"
              >
                Password requirements:
              </h5>
              <ul
                class="space-y-1 max-w-md list-inside text-gray-500 dark:text-gray-400"
              >
                <li class="flex items-center">
                  <svg
                    v-if="requirements.length"
                    class="w-4 h-4 mr-1.5 text-green-500 dark:text-green-400 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <svg
                    v-else
                    class="w-4 h-4 mr-1.5 text-gray-400 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  At least 8 characters
                </li>
                <li class="flex items-center">
                  <svg
                    v-if="requirements.uppercase"
                    class="w-4 h-4 mr-1.5 text-green-500 dark:text-green-400 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <svg
                    v-else
                    class="w-4 h-4 mr-1.5 text-gray-400 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  At least one uppercase letter
                </li>
                <li class="flex items-center">
                  <svg
                    v-if="requirements.digit"
                    class="w-4 h-4 mr-1.5 text-green-500 dark:text-green-400 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <svg
                    v-else
                    class="w-4 h-4 mr-1.5 text-gray-400 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  At least one number
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div>
          <label class="mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Confirm password</label
          >
          <input
            type="password"
            v-model="form.confirmPassword"
            class="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div class="flex items-center py-4">
          <label
            class="flex items-start gap-3 w-full font-medium text-gray-900 dark:text-gray-300"
          >
            <input
              type="checkbox"
              v-model="form.terms"
              class="w-4 h-4 text-blue-600 bg-white rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <span
              >I have read and agree to the
              <router-link
                to="/terms"
                class="text-blue-600 hover:underline dark:text-blue-400"
                >terms of service</router-link
              >
              and
              <router-link
                to="/privacy"
                class="text-blue-600 hover:underline dark:text-blue-400"
                >privacy policy</router-link
              >
              .
            </span></label
          >
        </div>
        <button
          type="button"
          @click="registerWithEmail"
          :disabled="loading"
          class="flex items-center justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 uppercase"
        >
          <LoaderComponent v-if="loading" />
          <template v-else>Create my account</template>
        </button>
      </div>

      <p class="mb-8 dark:text-white">
        Already have an account?
        <router-link
          to="/login"
          class="text-blue-600 hover:underline dark:text-blue-400"
          >Login here.</router-link
        >
      </p>
    </div>
  </main>
</template>

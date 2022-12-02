<script setup>
import AlertComponent from '@/components/AlertComponent.vue'
import NavbarComponent from '@/components/NavbarComponent.vue'
import NewPostComponent from '@/components/NewPostComponent.vue'
import PostComponent from '@/components/PostComponent.vue'
import useUserStore from '@/stores/user'
import axios from 'axios'
import { onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LoaderComponent from '../../components/LoaderComponent.vue'
import UserCardComponent from '../../components/UserCardComponent.vue'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

const newInterest = ref('')
const profileAlert = reactive({
  type: 'primary',
  message: ''
})
watch(profileAlert, (value) => {
  if (!!value.message) {
    // scroll to alert
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
    setTimeout(() => {
      profileAlert.message = ''
    }, 5000)
  }
})
const user = reactive({
  isOwnAccount: false,
  data: {},
  connections: [],
  comments: [],
  likes: []
})
const state = reactive({
  loading: true,
  filtersExpanded: true
})

onMounted(async () => {
  user.isOwnAccount = false
  state.loading = true
  try {
    const response = await axios.get(
      `/api/user/handle/${route.params.handle}`,
      {
        headers: {
          Authorization: userStore.getBearerToken
        }
      }
    )

    user.data = response.data.user
    user.comments = response.data.comments
    user.likes = response.data.likes
    user.data.interests = JSON.parse(user.data.interests)
    user.connections = response.data.connections
    user.isOwnAccount = user.data.handle === userStore.getHandle

    user.data.posts.reverse()

    if (user.isOwnAccount) userStore.user = user.data
  } catch (error) {
    console.log(error)
    console.log(error)
    if (error.response.status === 404) {
      router.push('/user-not-found')
    } else {
      profileAlert.type = 'danger'
      profileAlert.message = error.response.data.error
    }
  } finally {
    state.loading = false
  }
})

async function updateUser() {
  profileAlert.message = ''
  profileAlert.type = ''
  try {
    const response = await axios.put('/api/user/me', user.data, {
      headers: {
        Authorization: userStore.getBearerToken
      }
    })
    if (response.status === 200) {
      if (user.isOwnAccount) {
        userStore.user = response.data
      }
      user.data = response.data
      profileAlert.message = response.data.success
      profileAlert.type = 'success'
    }
  } catch (error) {
    console.log(error)
    profileAlert.message = error.response.data.error
    profileAlert.type = 'error'
  }
}
async function changeAvatar() {
  if (!user.isOwnAccount) {
    return
  }
  var input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/png, image/jpg, image/jpeg, image/gif'
  input.onchange = async () => {
    const file = input.files[0]
    const formData = new FormData()
    formData.append('file', file)
    // send form data to server
    try {
      const response = await axios.post('/api/user/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: userStore.getBearerToken
        }
      })
      // update user avatar
      if (response.status === 200) {
        user.data.avatar_uri = response.data.avatar_uri
        userStore.user.avatar_uri = response.data.avatar_uri
        profileAlert.message = response.data.success
        profileAlert.type = 'success'
        setTimeout(() => {
          router.go(0)
        }, 1000)
      }
    } catch (error) {
      console.log(error)
    }
  }
  input.click()
}
function addInterest() {
  user.data.interests.push(newInterest.value)
  newInterest.value = ''
  console.log(user.data.interests)
}
function removeInterest(index) {
  user.data.interests.splice(index, 1)
}
async function addFriend() {
  if (user.isOwnAccount) {
    profileAlert.message = 'Cannot add yourself as a friend'
    profileAlert.type = 'error'
    return
  }
  profileAlert.message = ''
  profileAlert.type = ''
  try {
    const response = await axios.put(
      `/api/user/friend/${user.data.id}`,
      {},
      {
        headers: {
          Authorization: userStore.getBearerToken
        }
      }
    )
    if (response.status === 200) {
      profileAlert.message = response.data.success
      profileAlert.type = 'success'
      // update state
      userStore.user.friends = response.data.friends
      console.log(response.data.friends)
      console.log(userStore.user.friends)
    }
  } catch (error) {
    profileAlert.message = error.response.data.error
    profileAlert.type = 'error'
    console.log(error)
  }
}
</script>

<template>
  <main class="bg-white min-h-screen dark:bg-slate-800">
    <div class="max-w-screen-xl mx-auto">
      <NavbarComponent />
      <LoaderComponent v-if="state.loading" />
      <div
        v-if="!state.loading"
        class="container mx-auto flex flex-col md:flex-row items-start px-2 gap-6 md:gap:12 lg:gap-16 py-12"
      >
        <div class="flex flex-col items-start gap-12 w-full md:w-80">
          <!-- Avatar -->
          <div
            class="sm:flex-1 relative group p-2 bg-gradient-to-br from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 rounded-lg text-white shadow-lg shadow-purple-400/30 dark:text-gray-900"
          >
            <img
              :src="user.data.avatar_uri"
              class="rounded-lg w-full h-auto md:w-80 md:h-80"
            />
            <button
              v-if="user.isOwnAccount"
              @click="changeAvatar"
              class="w-full text-center hover:underline mt-1"
            >
              Change Avatar
            </button>
          </div>
          <!-- Menu/About -->
          <div class="sm:flex-1 w-full flex flex-col gap-4">
            <h3 class="text-3xl font-semibold dark:text-white">
              @{{ user.data.handle }}
            </h3>
            <p class="leading-tight text-gray-700 dark:text-gray-300">
              <span v-if="user.data.bio">
                {{ user.data.bio }}
              </span>
              <span
                v-else
                class="italic text-xm text-gray-700 dark:text-gray-300"
              >
                No bio available.
              </span>
            </p>

            <!-- User menu -->
            <div
              class="flex flex-col text-gray-900 divide-y dark:text-gray-200 divide-gray-300 dark:divide-gray-600"
            >
              <router-link
                :to="{ name: 'profile' }"
                class="inline-flex relative items-center p-2 w-ful font-medium hover:bg-gray-100 hover:text-blue-700 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
                :class="{
                  'text-blue-700 dark:text-white': $route.name === 'profile'
                }"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  class="h-6 w-6 fill-current mr-3"
                  width="24"
                  height="24"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path
                    d="M16.757 3l-2 2H5v14h14V9.243l2-2V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h12.757zm3.728-.9L21.9 3.516l-9.192 9.192-1.412.003-.002-1.417L20.485 2.1z"
                  />
                </svg>
                Posts
              </router-link>
              <router-link
                :to="{ name: 'profile-comments' }"
                class="inline-flex relative items-center p-2 w-ful font-medium hover:bg-gray-100 hover:text-blue-700 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
                :class="{
                  'text-blue-700 dark:text-white':
                    $route.name === 'profile-comments'
                }"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  class="h-6 w-6 fill-current mr-3"
                  width="24"
                  height="24"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path
                    d="M10 3h4a8 8 0 1 1 0 16v3.5c-5-2-12-5-12-11.5a8 8 0 0 1 8-8zm2 14h2a6 6 0 1 0 0-12h-4a6 6 0 0 0-6 6c0 3.61 2.462 5.966 8 8.48V17z"
                  />
                </svg>
                Comments
              </router-link>
              <router-link
                type="button"
                :to="{ name: 'profile-likes' }"
                class="inline-flex relative items-center p-2 w-ful font-medium hover:bg-gray-100 hover:text-blue-700 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
                :class="{
                  'text-blue-700 dark:text-white':
                    $route.name === 'profile-likes'
                }"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  class="h-6 w-6 fill-current mr-3"
                  width="24"
                  height="24"
                >
                  <path fill="none" d="M0 0H24V24H0z" />
                  <path
                    d="M12.001 4.529c2.349-2.109 5.979-2.039 8.242.228 2.262 2.268 2.34 5.88.236 8.236l-8.48 8.492-8.478-8.492c-2.104-2.356-2.025-5.974.236-8.236 2.265-2.264 5.888-2.34 8.244-.228zm6.826 1.641c-1.5-1.502-3.92-1.563-5.49-.153l-1.335 1.198-1.336-1.197c-1.575-1.412-3.99-1.35-5.494.154-1.49 1.49-1.565 3.875-.192 5.451L12 18.654l7.02-7.03c1.374-1.577 1.299-3.959-.193-5.454z"
                  />
                </svg>
                Likes
              </router-link>
              <router-link
                type="button"
                :to="{ name: 'profile-connections' }"
                class="inline-flex relative items-center p-2 w-ful font-medium hover:bg-gray-100 hover:text-blue-700 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
                :class="{
                  'text-blue-700 dark:text-white':
                    $route.name === 'profile-connections'
                }"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  class="h-6 w-6 fill-current mr-3"
                  width="24"
                  height="24"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path
                    d="M2 22a8 8 0 1 1 16 0h-2a6 6 0 1 0-12 0H2zm8-9c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm8.284 3.703A8.002 8.002 0 0 1 23 22h-2a6.001 6.001 0 0 0-3.537-5.473l.82-1.824zm-.688-11.29A5.5 5.5 0 0 1 21 8.5a5.499 5.499 0 0 1-5 5.478v-2.013a3.5 3.5 0 0 0 1.041-6.609l.555-1.943z"
                  />
                </svg>
                Connections
              </router-link>
              <router-link
                type="button"
                :to="{ name: 'profile-about' }"
                class="inline-flex relative items-center p-2 w-ful font-medium hover:bg-gray-100 hover:text-blue-700 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
                :class="{
                  'text-blue-700 dark:text-white':
                    $route.name === 'profile-about'
                }"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  class="h-6 w-6 fill-current mr-3"
                  width="24"
                  height="24"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path
                    d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM11 7h2v2h-2V7zm0 4h2v6h-2v-6z"
                  />
                </svg>
                About
              </router-link>
            </div>

            <!-- Add friend -->
            <button
              type="button"
              @click="addFriend()"
              class="inline-flex items-center justify-center gap-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-7 py-3.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-80"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                class="h-6 w-6 fill-current"
                width="24"
                height="24"
              >
                <path fill="none" d="M0 0h24v24H0z" />
                <path
                  d="M14 14.252v2.09A6 6 0 0 0 6 22l-2-.001a8 8 0 0 1 10-7.748zM12 13c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm6 6v-3h2v3h3v2h-3v3h-2v-3h-3v-2h3z"
                />
              </svg>
              Add Friend
            </button>
          </div>
        </div>

        <!-- Posts -->
        <div
          v-if="$route.name === 'profile'"
          class="flex-1 flex flex-col gap-12 w-full md:w-auto"
        >
          <AlertComponent
            v-show="profileAlert.message"
            :type="profileAlert.type"
            :message="profileAlert.message"
            :dismissible="false"
          />
          <NewPostComponent
            v-if="user.data.handle === userStore.getUser.handle"
          />
          <h4 class="text-2xl font-bold text-gray-800 dark:text-white">
            {{ user.data.first_name }}'s Posts
          </h4>
          <div
            v-if="!!user.data.posts && user.data.posts.length <= 0"
            class="bg-white border border-gray-200 p-2 rounded-lg dark:bg-gray-800 dark:border-gray-700"
          >
            <p class="text-center text-gray-500">No posts found.</p>
          </div>

          <div v-for="post of user.data.posts" :key="post.id">
            <PostComponent :post="post" class="shadow-sm" />
          </div>
        </div>

        <!-- About -->
        <div
          v-if="$route.name === 'profile-about'"
          class="flex-1 flex flex-col gap-12 px-2"
        >
          <div v-if="user.isOwnAccount">
            <AlertComponent
              v-show="profileAlert.message"
              class="my-4"
              :type="profileAlert.type"
              :message="profileAlert.message"
              :dismissible="false"
            />

            <div class="flex items-center justify-between mb-4">
              <h2 class="text-2xl font-bold py-3 dark:text-white">
                About @{{ user.data.handle }}
              </h2>
              <button
                type="button"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                @click="updateUser()"
              >
                Save Changes
              </button>
            </div>

            <!-- Name -->
            <div class="py-2 flex items-center">
              <span
                class="font-semibold mr-2 flex-shrink-0 uppercase text-sm w-64 dark:text-gray-300"
                >Name</span
              >
              <div class="flex items-center gap-2 w-full">
                <input
                  v-model="user.data.first_name"
                  type="text"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder=""
                  required
                />
                <input
                  v-model="user.data.last_name"
                  type="text"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder=""
                  required
                />
              </div>
            </div>
            <!-- Location -->
            <div class="py-2 flex items-center">
              <span
                class="font-semibold mr-2 flex-shrink-0 uppercase text-sm w-64 dark:text-gray-300"
                >Location</span
              >
              <input
                v-model="user.data.location"
                type="text"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder=""
                required
              />
            </div>
            <!-- Bio -->
            <div class="py-2 flex items-start">
              <span
                class="font-semibold mr-2 flex-shrink-0 uppercase text-sm w-64 dark:text-gray-300"
                >Bio</span
              >
              <textarea
                v-model="user.data.bio"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder=""
                rows="4"
              />
            </div>
            <!-- Join Date -->
            <div class="py-2 flex items-center">
              <span
                class="font-semibold mr-2 flex-shrink-0 uppercase text-sm w-64 dark:text-gray-300"
                >Joined</span
              >
              <input
                type="text"
                disabled
                :value="new Date(user.data.created_at).toLocaleDateString()"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder=""
                required
              />
            </div>
            <!-- Education Level -->
            <div class="py-2 flex items-center">
              <span
                class="font-semibold mr-2 flex-shrink-0 uppercase text-sm w-64 dark:text-gray-300"
                >Education Level</span
              >
              <select
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="" :selected="!user.data.education_level">
                  Select
                </option>
                <option
                  value="hs"
                  :selected="user.data.education_level === 'Hs'"
                >
                  High School
                </option>
                <option
                  value="aa"
                  :selected="user.data.education_level === 'Aa'"
                >
                  Associate's of Art/Science
                </option>
                <option
                  value="ba"
                  :selected="user.data.education_level === 'Ba'"
                >
                  Bachelor's of Art/Science
                </option>
                <option
                  value="ma"
                  :selected="user.data.education_level === 'Ma'"
                >
                  Master's of Art/Science
                </option>
                <option
                  value="phd"
                  :selected="user.data.education_level === 'Phd'"
                >
                  Doctorate degree
                </option>
              </select>
            </div>
            <!-- Education institution -->
            <div class="py-2 flex items-center">
              <span
                class="font-semibold mr-2 flex-shrink-0 uppercase text-sm w-64 dark:text-gray-300"
                >Education Institution</span
              >
              <input
                v-model="user.data.education_institution"
                type="text"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder=""
              />
            </div>
            <!-- Education major -->
            <div class="py-2 flex items-center">
              <span
                class="font-semibold mr-2 flex-shrink-0 uppercase text-sm w-64 dark:text-gray-300"
                >Education Major</span
              >
              <input
                v-model="user.data.education_major"
                type="text"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder=""
              />
            </div>
            <!-- Occupation -->
            <div class="py-2 flex items-center">
              <span
                class="font-semibold mr-2 flex-shrink-0 uppercase text-sm w-64 dark:text-gray-300"
                >Occupation</span
              >
              <input
                v-model="user.data.occupation"
                type="text"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder=""
              />
            </div>
            <!-- Interests -->
            <div class="py-2 flex items-start">
              <span
                class="font-semibold mr-2 flex-shrink-0 uppercase text-sm w-64 dark:text-gray-300"
                >Interests</span
              >
              <div class="w-full">
                <div class="relative w-full">
                  <input
                    v-model="newInterest"
                    @keyup.enter="addInterest"
                    type="text"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Add a new interest"
                  />
                  <button
                    @click="addInterest"
                    type="button"
                    class="absolute right-px top-px bottom-px text-sm bg-blue-500 hover:bg-blue-700 text-white font-medium py-2.5 px-2.5 rounded-lg rounded-l-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-5 h-5"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                </div>
                <div class="py-2 flex flex-wrap items-center gap-2">
                  <span
                    v-for="(interest, index) of user.data.interests"
                    :key="interest"
                    class="inline-flex items-center pl-2 text-sm font-medium bg-gray-50 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500"
                  >
                    {{ interest }}
                    <button
                      @click="removeInterest(index)"
                      class="py-1 px-2 ml-2 text-sm text-gray-600 hover:text-gray-900 font-medium rounded dark:text-gray-400 dark:hover:text-white"
                    >
                      x
                    </button>
                  </span>
                </div>
              </div>
            </div>
            <!-- Business Name -->
            <div class="py-2 flex items-center">
              <span
                class="font-semibold mr-2 flex-shrink-0 uppercase text-sm w-64 dark:text-gray-300"
                >Business Name</span
              >
              <input
                v-model="user.data.business_name"
                type="text"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder=""
              />
            </div>
            <!-- In business since -->
            <div class="py-2 flex items-center">
              <span
                class="font-semibold mr-2 flex-shrink-0 uppercase text-sm w-64 dark:text-gray-300"
                >In business since</span
              >
              <input
                v-model="user.data.years_in_business"
                type="text"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder=""
              />
            </div>
          </div>

          <div v-else class="flex flex-col dark:text-gray-200">
            <div class="flex items-center justify-between">
              <h2 class="text-2xl font-bold py-3 dark:text-white">
                About @{{ user.data.handle }}
              </h2>
            </div>
            <!-- Name -->
            <div class="py-2 flex items-center">
              <span class="font-semibold mr-2 uppercase text-sm w-40"
                >Name</span
              >
              <p>{{ user.data.first_name }} {{ user.data.last_name }}</p>
            </div>
            <!-- Location -->
            <div class="py-2 flex items-center">
              <span class="font-semibold mr-2 uppercase text-sm w-40"
                >Location</span
              >
              <p>{{ user.data.location }}</p>
            </div>
            <!-- Bio -->
            <div class="py-2 flex items-start">
              <span class="font-semibold mr-2 uppercase text-sm w-40">Bio</span>
              <p v-if="user.data.bio" class="flex-shrink">
                {{ user.data.bio }}
              </p>
              <p v-else class="italic text-xm">No bio available.</p>
            </div>
            <!-- Join Date -->
            <div class="py-2 flex items-center">
              <span class="font-semibold mr-2 uppercase text-sm w-40"
                >Joined</span
              >
              <p>{{ new Date(user.data.created_at).toLocaleDateString() }}</p>
            </div>
            <!-- Education Level -->
            <div class="py-2 flex items-center">
              <span class="font-semibold mr-2 uppercase text-sm w-40"
                >Education Level</span
              >
              <p>
                <span v-if="user.data.education_level === 'Hs'">
                  High School
                </span>
                <span v-else-if="user.data.education_level === 'Aa'">
                  Associate's of Arts / Science
                </span>
                <span v-else-if="user.data.education_level === 'Ba'">
                  Bachelor's of Arts / Science
                </span>
                <span v-else-if="user.data.education_level === 'Ma'">
                  Master's of Arts / Science
                </span>
                <span v-else-if="user.data.education_level === 'Phd'">
                  Doctorate Degree
                </span>
              </p>
            </div>
            <!-- Education institution -->
            <div class="py-2 flex items-center">
              <span class="font-semibold mr-2 uppercase text-sm w-40"
                >Education Institution</span
              >
              <p>{{ user.data.education_institution }}</p>
            </div>
            <!-- Education major -->
            <div class="py-2 flex items-center">
              <span class="font-semibold mr-2 uppercase text-sm w-40"
                >Education Major</span
              >
              <p>{{ user.data.education_major }}</p>
            </div>
            <!-- Occupation -->
            <div class="py-2 flex items-center">
              <span class="font-semibold mr-2 uppercase text-sm w-40"
                >Occupation</span
              >
              <p>{{ user.data.occupation }}</p>
            </div>
            <!-- Interests -->
            <div class="py-2 flex items-center">
              <span class="font-semibold mr-2 uppercase text-sm w-40"
                >Interests</span
              >
              <div class="py-2 flex flex-wrap items-center gap-2">
                <span
                  v-for="interest of user.data.interests"
                  :key="interest"
                  class="inline-flex items-center px-2 text-sm font-medium bg-gray-50 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white 0"
                >
                  {{ interest }}
                </span>
              </div>
            </div>
            <!-- Business Name -->
            <div class="py-2 flex items-center">
              <span class="font-semibold mr-2 uppercase text-sm w-40"
                >Business Name</span
              >
              <p>{{ user.data.business_name }}</p>
            </div>
            <!-- In business since -->
            <div class="py-2 flex items-center">
              <span class="font-semibold mr-2 uppercase text-sm w-40"
                >In business since</span
              >
              <p>{{ user.data.years_in_business }}</p>
            </div>
            <!-- Friends -->
            <div class="py-2 flex items-start">
              <span
                class="font-semibold mr-2 uppercase text-sm w-40 dark:text-gray-300"
                >Friends</span
              >
              <div
                v-for="friend in user.data.friends"
                :key="friend"
                @click="
                  $router.push({
                    name: 'profile',
                    params: { handle: friend.handle }
                  })
                "
                class="cursor-pointer flex flex-col items-center just-fiy-center p-2 gap-2 text-sm font-medium text-gray-700 bg-gray-50 border rounded border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                <img :src="friend.avatar_uri" class="w-8 h-8 rounded-full" />
                <span class="ml-2">@{{ friend.handle }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Comments -->
        <div
          v-if="$route.name === 'profile-comments'"
          class="flex-1 w-full flex flex-col gap-12 px-2"
        >
          <h4 class="text-2xl font-bold text-gray-800 dark:text-white">
            {{ user.data.first_name }}'s Comments
          </h4>
          <AlertComponent
            v-show="profileAlert.message"
            class="my-4"
            :type="profileAlert.type"
            :message="profileAlert.message"
            :dismissible="false"
          />
          <div
            v-if="!!user.comments && user.comments.length <= 0"
            class="bg-gray-50 border border-gray-200 p-2 rounded-lg dark:bg-gray-800 dark:border-gray-700"
          >
            <p class="text-center text-gray-500">No posts found.</p>
          </div>
          <div v-for="post of user.comments" :key="post.id">
            <PostComponent :post="post" class="shadow-sm" />
          </div>
        </div>

        <!-- Likes -->
        <div
          v-if="$route.name === 'profile-likes'"
          class="flex-1 flex flex-col gap-12 px-2"
        >
          <h4 class="text-2xl font-bold text-gray-800 dark:text-white">
            {{ user.data.first_name }}'s Likes
          </h4>
          <AlertComponent
            v-show="profileAlert.message"
            class="my-4"
            :type="profileAlert.type"
            :message="profileAlert.message"
            :dismissible="false"
          />
          <div
            v-if="!!user.likes && user.likes.length <= 0"
            class="bg-gray-50 border border-gray-200 p-2 rounded-lg dark:bg-gray-800 dark:border-gray-700"
          >
            <p class="text-center text-gray-500">No posts found.</p>
          </div>
          <div v-for="post of user.likes" :key="post.id">
            <PostComponent :post="post" class="shadow-sm" />
          </div>
        </div>

        <!-- Connections -->
        <div
          v-if="$route.name === 'profile-connections'"
          class="flex-1 flex flex-col gap-12 px-2"
        >
          <h4 class="text-2xl font-bold text-gray-800 dark:text-white">
            {{ user.data.first_name }}'s Connections
          </h4>
          <!-- TODO: if own account show suggestions -->
          <AlertComponent
            v-show="profileAlert.message"
            class="my-4"
            :type="profileAlert.type"
            :message="profileAlert.message"
            :dismissible="false"
          />
          <div
            v-if="!!user.connections && user.connections.length <= 0"
            class="bg-gray-50 border border-gray-200 p-2 rounded-lg dark:bg-gray-800 dark:border-gray-700"
          >
            <p class="text-center text-gray-500">No connections found.</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
            <UserCardComponent
              v-for="friend of user.connections"
              :key="friend.id"
              :user="friend"
            />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

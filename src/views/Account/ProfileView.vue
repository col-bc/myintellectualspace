<script setup>
import axios from 'axios'
import { watch, onMounted, reactive, ref, onUpdated } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import AlertComponent from '@/components/AlertComponent.vue'
import NavbarComponent from '@/components/NavbarComponent.vue'
import NewPostComponent from '@/components/NewPostComponent.vue'
import PostComponent from '@/components/PostComponent.vue'
import useUserStore from '@/stores/user'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

const loading = ref(true)
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
  comments: [],
  likes: []
})

onMounted(async () => {
  user.isOwnAccount = false
  loading.value = true
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
    user.isOwnAccount = user.data.handle === userStore.getHandle

    user.data.posts.reverse()
    user.data.interests = JSON.parse(user.data.interests)

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
    loading.value = false
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
  <main class="bg-gray-100 min-h-screen dark:bg-slate-800">
    <div class="max-w-screen-xl mx-auto">
      <NavbarComponent />
      <div v-if="loading" class="text-center">
        <div role="status">
          <AlertComponent
            v-show="profileAlert.message"
            class="my-4"
            :type="profileAlert.type"
            :message="profileAlert.message"
            :dismissible="false"
          />
          <svg
            class="inline mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <div
        v-if="!loading"
        class="container mx-auto flex flex-col md:flex-row items-start px-2 gap-6 md:gap:12 lg:gap-16 py-12"
      >
        <div class="flex flex-col items-start gap-12 w-full md:w-80">
          <!-- Avatar -->
          <div
            class="sm:flex-1 relative group p-2 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl"
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
                class="inline-flex relative items-center p-2 w-ful font-medium hover:bg-gray-100 hover:text-blue-700 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
                :class="{
                  'text-blue-700 dark:text-white': $route.name === 'profile'
                }"
              >
                <svg
                  viewBox="0 0 24 24"
                  class="h-6 w-6 mr-3"
                  width="24"
                  height="24"
                  stroke="currentColor"
                  stroke-width="2"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                  ></path>
                  <path
                    d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                  ></path>
                </svg>
                Posts
              </router-link>
              <router-link
                :to="{ name: 'profile-comments' }"
                class="inline-flex relative items-center p-2 w-ful font-medium hover:bg-gray-100 hover:text-blue-700 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
                :class="{
                  'text-blue-700 dark:text-white':
                    $route.name === 'profile-comments'
                }"
              >
                <svg
                  viewBox="0 0 24 24"
                  class="h-6 w-6 mr-3"
                  width="24"
                  height="24"
                  stroke="currentColor"
                  stroke-width="2"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
                  ></path>
                </svg>
                Comments
              </router-link>
              <router-link
                type="button"
                :to="{ name: 'profile-likes' }"
                class="inline-flex relative items-center p-2 w-ful font-medium hover:bg-gray-100 hover:text-blue-700 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
                :class="{
                  'text-blue-700 dark:text-white':
                    $route.name === 'profile-likes'
                }"
              >
                <svg
                  viewBox="0 0 24 24"
                  class="h-6 w-6 mr-3"
                  width="24"
                  height="24"
                  stroke="currentColor"
                  stroke-width="2"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                  ></path>
                </svg>
                Likes
              </router-link>
              <router-link
                type="button"
                :to="{ name: 'profile-about' }"
                class="inline-flex relative items-center p-2 w-ful font-medium hover:bg-gray-100 hover:text-blue-700 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
                :class="{
                  'text-blue-700 dark:text-white':
                    $route.name === 'profile-about'
                }"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-6 h-6 mr-3"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                About
              </router-link>
            </div>

            <!-- Add friend -->
            <button
              type="button"
              @click="addFriend()"
              class="w-full bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 hover:bg-gradient-to-l focus:ring-4 focus:ring-blue-300 rounded-lg text-white darK:text-gray-900 font-bold text-base px-6 py-2.5 flex items-center justify-center gap-3 shadow-lg dark:text-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
              ADD FRIEND
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
                class="font-semibold mr-2 uppercase text-sm w-64 dark:text-gray-300"
                >Name</span
              >
              <div class="flex items-center gap-2 w-full">
                <input
                  v-model="user.data.first_name"
                  type="text"
                  class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder=""
                  required
                />
                <input
                  v-model="user.data.last_name"
                  type="text"
                  class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder=""
                  required
                />
              </div>
            </div>
            <!-- Location -->
            <div class="py-2 flex items-center">
              <span
                class="font-semibold mr-2 uppercase text-sm w-64 dark:text-gray-300"
                >Location</span
              >
              <input
                v-model="user.data.location"
                type="text"
                class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder=""
                required
              />
            </div>
            <!-- Bio -->
            <div class="py-2 flex items-start">
              <span
                class="font-semibold mr-2 uppercase text-sm w-64 dark:text-gray-300"
                >Bio</span
              >
              <textarea
                v-model="user.data.bio"
                class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder=""
                rows="4"
              />
            </div>
            <!-- Join Date -->
            <div class="py-2 flex items-center">
              <span
                class="font-semibold mr-2 uppercase text-sm w-64 dark:text-gray-300"
                >Joined</span
              >
              <input
                type="text"
                disabled
                :value="new Date(user.data.created_at).toLocaleDateString()"
                class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder=""
                required
              />
            </div>
            <!-- Education Level -->
            <div class="py-2 flex items-center">
              <span
                class="font-semibold mr-2 uppercase text-sm w-64 dark:text-gray-300"
                >Education Level</span
              >
              <select
                class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                class="font-semibold mr-2 uppercase text-sm w-64 dark:text-gray-300"
                >Education Institution</span
              >
              <input
                v-model="user.data.education_institution"
                type="text"
                class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder=""
              />
            </div>
            <!-- Education major -->
            <div class="py-2 flex items-center">
              <span
                class="font-semibold mr-2 uppercase text-sm w-64 dark:text-gray-300"
                >Education Major</span
              >
              <input
                v-model="user.data.education_major"
                type="text"
                class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder=""
              />
            </div>
            <!-- Occupation -->
            <div class="py-2 flex items-center">
              <span
                class="font-semibold mr-2 uppercase text-sm w-64 dark:text-gray-300"
                >Occupation</span
              >
              <input
                v-model="user.data.occupation"
                type="text"
                class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder=""
              />
            </div>
            <!-- Interests -->
            <div class="py-2 flex items-start">
              <span
                class="font-semibold mr-2 uppercase text-sm w-64 dark:text-gray-300"
                >Interests</span
              >
              <div class="w-full">
                <div class="relative w-full">
                  <input
                    v-model="newInterest"
                    @keyup.enter="addInterest"
                    type="text"
                    class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                    class="inline-flex items-center pl-2 text-sm font-medium bg-white border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500"
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
                class="font-semibold mr-2 uppercase text-sm w-64 dark:text-gray-300"
                >Business Name</span
              >
              <input
                v-model="user.data.business_name"
                type="text"
                class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder=""
              />
            </div>
            <!-- In business since -->
            <div class="py-2 flex items-center">
              <span
                class="font-semibold mr-2 uppercase text-sm w-64 dark:text-gray-300"
                >In business since</span
              >
              <input
                v-model="user.data.years_in_business"
                type="text"
                class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder=""
              />
            </div>
            <!-- Friends -->
            <div class="py-2 flex items-start">
              <span
                class="font-semibold mr-2 uppercase text-sm w-44 dark:text-gray-300"
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
                class="cursor-pointer flex flex-col items-center just-fiy-center p-2 gap-2 text-sm font-medium text-gray-700 bg-white border rounded border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                <img :src="friend.avatar_uri" class="w-8 h-8 rounded-full" />
                <span class="ml-2">@{{ friend.handle }}</span>
              </div>
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
                  class="inline-flex items-center px-2 text-sm font-medium bg-white border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white 0"
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
                class="cursor-pointer flex flex-col items-center just-fiy-center p-2 gap-2 text-sm font-medium text-gray-700 bg-white border rounded border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
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
          class="flex-1 flex flex-col gap-12 px-2"
        >
          <AlertComponent
            v-show="profileAlert.message"
            class="my-4"
            :type="profileAlert.type"
            :message="profileAlert.message"
            :dismissible="false"
          />
          <div
            v-if="!!user.comments && user.comments.length <= 0"
            class="bg-white border border-gray-200 p-2 rounded-lg dark:bg-gray-800 dark:border-gray-700"
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
          <AlertComponent
            v-show="profileAlert.message"
            class="my-4"
            :type="profileAlert.type"
            :message="profileAlert.message"
            :dismissible="false"
          />
          <div
            v-if="!!user.likes && user.likes.length <= 0"
            class="bg-white border border-gray-200 p-2 rounded-lg dark:bg-gray-800 dark:border-gray-700"
          >
            <p class="text-center text-gray-500">No posts found.</p>
          </div>
          <div v-for="post of user.likes" :key="post.id">
            <PostComponent :post="post" class="shadow-sm" />
          </div>
        </div>

        <!-- Other content -->
        <div
          class="hidden xl:flex bg-white border shadow-sm w-60 h-80 border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-600"
        >
          &nbsp;
        </div>
      </div>
    </div>
  </main>
</template>

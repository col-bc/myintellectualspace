<script setup>
import AlertComponent from '@/components/AlertComponent.vue'
import LoaderComponent from '@/components/LoaderComponent.vue'
import NavbarComponent from '@/components/NavbarComponent.vue'
import NewPostComponent from '@/components/NewPostComponent.vue'
import PostComponent from '@/components/PostComponent.vue'
import useUserStore from '@/stores/user'
import usePostStore from '@/stores/post'
import { computed, onMounted, onUpdated, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Timestamp } from 'firebase/firestore'

const user = useUserStore()
const post = usePostStore()
const router = useRouter()
const route = useRoute()

const profileAlert = reactive({
  type: 'primary',
  message: ''
})
const state = reactive({
  profileData: null,
  posts: [],
  likes: [],
  loading: true,
  isOwnAccount: false,
  isRecentlyActive: false
})

const EDUCATION_LEVELS = [
  'High School',
  'Associate Degree',
  'Bachelor Degree',
  'Master Degree',
  'Doctorate Degree'
]

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

onMounted(async () => {
  state.isOwnAccount = user.user.handle === route.params.handle
  if (!state.isOwnAccount) {
    // fetch account data
    state.profileData = await user.fetchUserByHandle(route.params.handle)
    if (!state.profileData.uid) {
      // user not found - redirect to social 404 page
      router.push('/social/not-found')
      return
    }
    // fetch posts and likes
    state.posts = await post.fetchPostsByHandle(route.params.handle)
    state.likes = await post.fetchLikedPostsByHandle(route.params.handle)
    state.loading = false
  } else {
    // populate state with data from store
    state.profileData = await user.fetchCurrentUser()
    state.posts = await post.fetchPostsByHandle(route.params.handle)
    state.likes = await post.fetchLikedPostsByHandle(route.params.handle)
    state.loading = false
  }
  // check if user is recently active
  const lastActiveTimestamp = await user.getLastActive(route.params.handle)
  if (!!lastActiveTimestamp) {
    const lastActive = lastActiveTimestamp.toDate()
    const now = new Date()
    const diff = now.getTime() - lastActive.getTime()
    const diffMinutes = Math.round(diff / 60000)
    if (diffMinutes < 15) {
      state.isRecentlyActive = true
    }
  }

  // sort posts by date
  state.posts.sort((a, b) => {
    return b.createdAt.seconds - a.createdAt.seconds
  })
})
onUpdated(async () => {
  state.isOwnAccount = user.user.handle === route.params.handle
  if (state.profileData.handle !== route.params.handle) {
    state.loading = true
    state.isOwnAccount = user.user.handle === route.params.handle
    if (!state.isOwnAccount) {
      state.profileData = await user.fetchUserByHandle(route.params.handle)
      state.posts = await post.fetchPostsByHandle(route.params.handle)
      state.likes = await post.fetchLikedPostsByHandle(route.params.handle)
      state.loading = false
    } else {
      state.profileData = await user.fetchCurrentUser()
      state.posts = post.posts
      state.likes = await post.fetchLikedPostsByHandle(route.params.handle)
      state.loading = false
    }
  }
  // sort posts by date
  state.posts.sort((a, b) => {
    return b.createdAt.seconds - a.createdAt.seconds
  })
  // sort likes by date
  state.likes.sort((a, b) => {
    return b.createdAt.seconds - a.createdAt.seconds
  })
})

async function refreshPosts() {
  state.loading = true
  await post.fetchPosts()
  state.loading = false
}
async function saveUser() {
  profileAlert.message = ''
  profileAlert.type = ''
  console.log(state.profileData)
  user.updateUser(state.profileData)
  profileAlert.type = 'success'
  profileAlert.message = 'Profile updated successfully'
}
async function followUser() {
  if (state.isOwnAccount) {
    profileAlert.message = 'You cannot follow yourself'
    profileAlert.type = 'error'
    return
  }
  await user.toggleFollowUser(state.profileData)
  profileAlert.type = 'success'
  profileAlert.message = 'You are now following @' + state.profileData.handle
}
async function changeAvatar() {
  // show file picker
  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.accept = 'image/*'
  fileInput.onchange = async (e) => {
    const file = e.target.files[0]
    if (!file) {
      return
    }
    const reader = new FileReader()
    reader.onload = async (e) => {
      const result = e.target.result
      const blob = await fetch(result).then((r) => r.blob())
      const file = new File([blob], 'avatar.png', {
        type: 'image/png'
      })
      // upload file
      await user.uploadAvatar(file)
      // refresh user data
      state.profileData = await user.fetchUserByHandle(route.params.handle)
      state.profileAlert = {
        type: 'success',
        message: 'Avatar updated successfully'
      }
    }
    reader.readAsDataURL(file)
  }
  fileInput.click()
}
</script>

<template>
  <main class="bg-white min-h-screen dark:bg-slate-800">
    <div class="max-w-screen-xl mx-auto">
      <NavbarComponent />
      <div
        v-if="state.loading"
        class="h-screen flex items-center justify-center"
      >
        <LoaderComponent size="lg" class="text-gray-900 dark:text-white" />
      </div>
      <div
        v-else
        class="container mx-auto flex flex-col md:flex-row items-start gap-6 md:gap:12 lg:gap-16 py-12 mb-12 px-2 md:px-4"
      >
        <div class="w-full md:max-w-xs lg:max-w-sm">
          <div class="flex flex-col items-start gap-6">
            <!-- Avatar -->
            <div
              class="sm:flex-1 w-full max-w-sm mx-auto relative group p-2 bg-gradient-to-br from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 rounded-lg text-white shadow-lg shadow-purple-400/30 dark:text-gray-900"
            >
              <img
                :src="state.profileData.avatarUrl"
                class="rounded-lg w-full h-auto md:max-w-sm aspect-square object-fit"
              />
              <button
                v-if="state.isOwnAccount"
                @click="changeAvatar"
                class="w-full text-center hover:underline mt-1"
              >
                Change Avatar
              </button>
            </div>

            <!-- Follow/unfollow -->
            <button
              type="button"
              @click="followUser"
              v-if="!state.isOwnAccount"
              :class="[
                user.isFollowing(state.profileData.uid)
                  ? 'inline-flex items-center justify-center gap-3 w-full text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg px-7 py-3.5 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 focus:shadow-sm focus:translate-y-0.5 transition duration-200 ease-in-out'
                  : 'inline-flex items-center justify-center w-full gap-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-7 py-3.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-80 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 focus:shadow-sm focus:translate-y-0.5 transition duration-200 ease-in-out'
              ]"
            >
              <template v-if="user.isFollowing(state.profileData.uid)">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  class="h-6 w-6 fill-current"
                  width="24"
                  height="24"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path
                    d="M14 14.252v2.09A6 6 0 0 0 6 22l-2-.001a8 8 0 0 1 10-7.748zM12 13c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm7 6.586l2.121-2.122 1.415 1.415L20.414 19l2.122 2.121-1.415 1.415L19 20.414l-2.121 2.122-1.415-1.415L17.586 19l-2.122-2.121 1.415-1.415L19 17.586z"
                  />
                </svg>
                Unfollow @{{ state.profileData.handle }}
              </template>
              <template v-else>
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
                Follow @{{ state.profileData.handle }}
              </template>
            </button>

            <!-- Menu/About -->
            <div class="sm:flex-1 w-full flex flex-col gap-6 lg:gap-12 mb-6">
              <!-- User menu -->
              <div
                class="w-full font-medium text-gray-900 bg-white shadow-md rounded-lg border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              >
                <div class="p-4">
                  <div class="flex items-center mb-2">
                    <h3 class="text-3xl font-semibold dark:text-white">
                      {{ state.profileData.fullName }}
                    </h3>
                    <div
                      v-if="!state.isOwnAccount && state.isRecentlyActive"
                      class="mx-4 block w-5 h-5 rounded-full bg-green-600 dark:bg-green-400 animate-pulse"
                    ></div>
                    <div class="ml-auto flex items-center gap-2">
                      <button
                        type="button"
                        @click="
                          $router.push({
                            name: 'messages-compose',
                            params: { to: state.profileData.uid }
                          })
                        "
                        class="p-3 text-blue-700 dark:text-blue-400 dark:hover:text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-200 rounded-full"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-6 w-6 fill-current"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                        >
                          <path fill="none" d="M0 0h24v24H0z" />
                          <path
                            d="M2 8.994A5.99 5.99 0 0 1 8 3h8c3.313 0 6 2.695 6 5.994V21H8c-3.313 0-6-2.695-6-5.994V8.994zM20 19V8.994A4.004 4.004 0 0 0 16 5H8a3.99 3.99 0 0 0-4 3.994v6.012A4.004 4.004 0 0 0 8 19h12zm-6-8h2v2h-2v-2zm-6 0h2v2H8v-2z"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        class="p-3 text-blue-700 dark:text-blue-400 dark:hover:text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-200 rounded-full"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-6 w-6 fill-current"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                        >
                          <path fill="none" d="M0 0h24v24H0z" />
                          <path
                            d="M17 9.2l5.213-3.65a.5.5 0 0 1 .787.41v12.08a.5.5 0 0 1-.787.41L17 14.8V19a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v4.2zm0 3.159l4 2.8V8.84l-4 2.8v.718zM3 6v12h12V6H3zm2 2h2v2H5V8z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <h5
                    class="flex items-center gap-2 text-xl text-gray-700 dark:text-gray-300 mb-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 fill-current"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                    >
                      <path fill="none" d="M0 0h24v24H0z" />
                      <path
                        d="M20 12a8 8 0 1 0-3.562 6.657l1.11 1.664A9.953 9.953 0 0 1 12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10v1.5a3.5 3.5 0 0 1-6.396 1.966A5 5 0 1 1 15 8H17v5.5a1.5 1.5 0 0 0 3 0V12zm-8-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"
                      />
                    </svg>
                    {{ state.profileData.handle }}
                  </h5>
                  <!-- Location -->
                  <p
                    class="flex items-center gap-2 mb-2 text-gray-700 dark:text-gray-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 fill-current"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                    >
                      <path fill="none" d="M0 0h24v24H0z" />
                      <path
                        d="M11 19.945A9.001 9.001 0 0 1 12 2a9 9 0 0 1 1 17.945V24h-2v-4.055zM12 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z"
                      />
                    </svg>
                    <span v-if="state.profileData.location">
                      {{ state.profileData.location }}
                    </span>
                    <span
                      v-else
                      class="italic text-xm text-gray-700 dark:text-gray-300"
                    >
                      No location available.
                    </span>
                  </p>
                  <!-- Bio -->
                  <p class="leading-tight text-gray-700 dark:text-gray-300">
                    <span v-if="state.profileData.bio">
                      {{ state.profileData.bio }}
                    </span>
                    <span
                      v-else
                      class="italic text-xm text-gray-700 dark:text-gray-300"
                    >
                      No bio available.
                    </span>
                  </p>
                </div>

                <div
                  class="flex flex-col border-t border-gray-300 dark:bg-gray-800 dark:border-gray-700"
                >
                  <router-link
                    :to="{ name: 'profile' }"
                    class="flex items-center py-2 px-4 w-full border-b border-gray-300 dark:border-gray-700 cursor-pointer"
                    :class="[
                      route.name === 'profile'
                        ? 'bg-gray-100 dark:bg-gray-700 text-blue-700  dark:text-blue-400 '
                        : '  hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white'
                    ]"
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
                    :to="{ name: 'profile-likes' }"
                    class="flex items-center py-2 px-4 w-full border-b border-gray-300 dark:border-gray-700 cursor-pointer"
                    :class="[
                      route.name === 'profile-likes'
                        ? 'bg-gray-100 dark:bg-gray-700 text-blue-700  dark:text-blue-400 '
                        : '  hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white'
                    ]"
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
                    :to="{ name: 'profile-connections' }"
                    class="flex items-center py-2 px-4 w-full border-b border-gray-300 dark:border-gray-700 cursor-pointer"
                    :class="[
                      route.name === 'profile-connections'
                        ? 'bg-gray-100 dark:bg-gray-700 text-blue-700  dark:text-blue-400 '
                        : '  hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white'
                    ]"
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
                    :to="{ name: 'profile-about' }"
                    class="flex items-center py-2 px-4 w-full rounded-b-lg cursor-pointer"
                    :class="[
                      route.name === 'profile-about'
                        ? 'bg-gray-100 dark:bg-gray-700 text-blue-700  dark:text-blue-400 '
                        : '  hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white'
                    ]"
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
              </div>
            </div>
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
            v-if="state.isOwnAccount"
            @post-created="refreshPosts"
          />
          <h2
            class="flex items-center text-3xl font-bold text-gray-800 dark:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="h-10 w-10 fill-current mr-4"
              width="24"
              height="24"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path
                d="M16.757 3l-2 2H5v14h14V9.243l2-2V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h12.757zm3.728-.9L21.9 3.516l-9.192 9.192-1.412.003-.002-1.417L20.485 2.1z"
              />
            </svg>
            Posts
          </h2>
          <div
            v-if="!!state.posts && state.posts.length <= 0"
            class="bg-white border border-gray-200 p-2 rounded-lg dark:bg-gray-800 dark:border-gray-700"
          >
            <p class="text-center text-gray-500">No posts found.</p>
          </div>

          <div v-for="post of state.posts" :key="post.id">
            <PostComponent
              :post="post"
              class="shadow-sm"
              @delete="refreshPosts"
            />
          </div>
        </div>

        <!-- About -->
        <div
          v-if="$route.name === 'profile-about'"
          class="flex-1 flex flex-col gap-12 px-2 w-full max-w-xl md:mx-auto"
        >
          <!-- Edit profile -->
          <div v-if="state.isOwnAccount" class="flex flex-col gap-6">
            <AlertComponent
              v-show="profileAlert.message"
              class="my-4"
              :type="profileAlert.type"
              :message="profileAlert.message"
              :dismissible="false"
            />

            <h2
              class="flex items-center text-3xl font-bold text-gray-800 dark:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                class="h-10 w-10 fill-current mr-4"
                width="24"
                height="24"
              >
                <path fill="none" d="M0 0h24v24H0z" />
                <path
                  d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM11 7h2v2h-2V7zm0 4h2v6h-2v-6z"
                />
              </svg>
              Update your profile
            </h2>
            <!-- Handle -->
            <div>
              <span
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Handle <span class="align-super text-xs text-red-500">*</span>
              </span>
              <input
                type="text"
                v-model="state.profileData.handle"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder=""
              />
            </div>
            <!-- Name -->
            <div>
              <span
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Name<span class="align-super text-xs text-red-500">*</span>
              </span>
              <input
                type="text"
                v-model="state.profileData.fullName"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder=""
              />
            </div>
            <!-- Phone -->
            <div>
              <span
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Phone Number</span
              >
              <input
                type="text"
                v-model="state.profileData.phone"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder=""
              />
              <span
                class="flex items-center gap-2 text-gray-500 text-sm mt-1 dark:text-gray-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 fill-current flex-shrink-0"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path
                    d="M17.882 19.297A10.949 10.949 0 0 1 12 21c-5.392 0-9.878-3.88-10.819-9a10.982 10.982 0 0 1 3.34-6.066L1.392 2.808l1.415-1.415 19.799 19.8-1.415 1.414-3.31-3.31zM5.935 7.35A8.965 8.965 0 0 0 3.223 12a9.005 9.005 0 0 0 13.201 5.838l-2.028-2.028A4.5 4.5 0 0 1 8.19 9.604L5.935 7.35zm6.979 6.978l-3.242-3.242a2.5 2.5 0 0 0 3.241 3.241zm7.893 2.264l-1.431-1.43A8.935 8.935 0 0 0 20.777 12 9.005 9.005 0 0 0 9.552 5.338L7.974 3.76C9.221 3.27 10.58 3 12 3c5.392 0 9.878 3.88 10.819 9a10.947 10.947 0 0 1-2.012 4.592zm-9.084-9.084a4.5 4.5 0 0 1 4.769 4.769l-4.77-4.769z"
                  />
                </svg>
                Your phone number is always private</span
              >
            </div>
            <!-- Location -->
            <div>
              <span
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Location</span
              >
              <div class="w-full">
                <input
                  type="text"
                  v-model="state.profileData.location"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder=""
                />
                <span
                  class="flex items-center gap-2 text-gray-500 text-sm mt-1 dark:text-gray-400"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 fill-current flex-shrink-0"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path
                      d="M17.882 19.297A10.949 10.949 0 0 1 12 21c-5.392 0-9.878-3.88-10.819-9a10.982 10.982 0 0 1 3.34-6.066L1.392 2.808l1.415-1.415 19.799 19.8-1.415 1.414-3.31-3.31zM5.935 7.35A8.965 8.965 0 0 0 3.223 12a9.005 9.005 0 0 0 13.201 5.838l-2.028-2.028A4.5 4.5 0 0 1 8.19 9.604L5.935 7.35zm6.979 6.978l-3.242-3.242a2.5 2.5 0 0 0 3.241 3.241zm7.893 2.264l-1.431-1.43A8.935 8.935 0 0 0 20.777 12 9.005 9.005 0 0 0 9.552 5.338L7.974 3.76C9.221 3.27 10.58 3 12 3c5.392 0 9.878 3.88 10.819 9a10.947 10.947 0 0 1-2.012 4.592zm-9.084-9.084a4.5 4.5 0 0 1 4.769 4.769l-4.77-4.769z"
                    /></svg
                  >Eg. Atlanta, Georgia. Never share your full address</span
                >
              </div>
            </div>
            <!-- Bio -->
            <div>
              <span
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Bio</span
              >
              <textarea
                v-model="state.profileData.bio"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder=""
                rows="4"
              ></textarea>
            </div>
            <!-- Education Level -->
            <div>
              <span
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Education Level</span
              >
              <select
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                v-model="state.profileData.educationLevel"
              >
                <option value="default" disabled>Select an option</option>
                <template v-for="level in EDUCATION_LEVELS" :key="level">
                  <option :value="level">
                    {{ level }}
                  </option>
                </template>
              </select>
            </div>
            <!-- Education institution -->
            <div>
              <span
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Education Institution</span
              >
              <input
                type="text"
                v-model="state.profileData.educationInstitution"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder=""
              />
            </div>
            <!-- Education major -->
            <div>
              <span
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Education Major</span
              >
              <input
                type="text"
                v-model="state.profileData.educationMajor"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder=""
              />
            </div>
            <!-- Occupation -->
            <div>
              <span
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Occupation</span
              >
              <input
                type="text"
                v-model="state.profileData.occupation"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder=""
              />
            </div>
            <!-- Company -->
            <div>
              <span
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Company</span
              >
              <input
                type="text"
                v-model="state.profileData.company"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder=""
              />
            </div>
            <!-- Interests -->
            <div>
              <span
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Interests</span
              >
              <textarea
                v-model="state.profileData.interests"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder=""
                rows="4"
              ></textarea>
            </div>

            <div class="mt-4">
              <button
                type="button"
                class="ml-auto flex items-center gap-2.5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                @click="saveUser"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  class="h-6 w-6 fill-current"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path
                    d="M5 5v14h14V7.828L16.172 5H5zM4 3h13l3.707 3.707a1 1 0 0 1 .293.707V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm8 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6zM6 6h9v4H6V6z"
                  />
                </svg>
                Save Changes
              </button>
            </div>
          </div>
          <!-- Read profile -->
          <div
            v-else
            class="flex flex-col divide-y divide-gray-300 dark:divide-gray-700"
          >
            <div class="flex items-center justify-between mb-6">
              <h2
                class="flex items-center text-3xl font-bold text-gray-800 dark:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  class="h-10 w-10 fill-current mr-4"
                  width="24"
                  height="24"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path
                    d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM11 7h2v2h-2V7zm0 4h2v6h-2v-6z"
                  />
                </svg>
                About
              </h2>
            </div>
            <div class="flex items-center py-4">
              <span
                class="flex-shrink-0 font-semibold mr-2 uppercase text-sm w-64 dark:text-gray-300"
                >Name</span
              >
              <span class="text-gray-900 text-sm dark:text-white">
                {{ state.profileData.fullName }}
              </span>
            </div>
            <div class="flex items-center py-4">
              <span
                class="flex-shrink-0 font-semibold mr-2 uppercase text-sm w-64 dark:text-gray-300"
                >Location</span
              >
              <span class="text-gray-900 text-sm dark:text-white">
                {{ state.profileData.location || 'Not provided' }}
              </span>
            </div>
            <div class="flex items-start py-4">
              <span
                class="flex-shrink-0 font-semibold mr-2 uppercase text-sm w-64 dark:text-gray-300"
                >Bio</span
              >
              <span class="text-gray-900 text-sm dark:text-white">
                {{ state.profileData.bio || 'Not provided' }}
              </span>
            </div>
            <div class="flex items-center py-4">
              <span
                class="flex-shrink-0 font-semibold mr-2 uppercase text-sm w-64 dark:text-gray-300"
                >Education level</span
              >
              <span class="text-gray-900 text-sm dark:text-white">
                {{ state.profileData.educationLevel || 'Not provided' }}
              </span>
            </div>
            <div class="flex items-center py-4">
              <span
                class="flex-shrink-0 font-semibold mr-2 uppercase text-sm w-64 dark:text-gray-300"
                >Education institution</span
              >
              <span class="text-gray-900 text-sm dark:text-white">
                {{ state.profileData.educationInstitution || 'Not provided' }}
              </span>
            </div>
            <div class="flex items-center py-4">
              <span
                class="flex-shrink-0 font-semibold mr-2 uppercase text-sm w-64 dark:text-gray-300"
                >Education major</span
              >
              <span class="text-gray-900 text-sm dark:text-white">
                {{ state.profileData.educationMajor || 'Not provided' }}
              </span>
            </div>
            <div class="flex items-center py-4">
              <span
                class="flex-shrink-0 font-semibold mr-2 uppercase text-sm w-64 dark:text-gray-300"
                >Occupation</span
              >
              <span class="text-gray-900 text-sm dark:text-white">
                {{ state.profileData.occupation || 'Not provided' }}
              </span>
            </div>
            <div class="flex items-center py-4">
              <span
                class="flex-shrink-0 font-semibold mr-2 uppercase text-sm w-64 dark:text-gray-300"
                >Company</span
              >
              <span class="text-gray-900 text-sm dark:text-white">
                {{ state.profileData.company || 'Not provided' }}
              </span>
            </div>
            <div class="flex items-center py-4">
              <span
                class="flex-shrink-0 font-semibold mr-2 uppercase text-sm w-64 dark:text-gray-300"
                >Business name</span
              >
              <span class="text-gray-900 text-sm dark:text-white">
                {{ state.profileData.businessName || 'Not provided' }}
              </span>
            </div>
            <div class="flex items-center py-4">
              <span
                class="flex-shrink-0 font-semibold mr-2 uppercase text-sm w-64 dark:text-gray-300"
                >In Business Since</span
              >
              <span class="text-gray-900 text-sm dark:text-white">
                {{ state.profileData.inBusinessSince || 'Not provided' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Likes -->
        <div
          v-if="$route.name === 'profile-likes'"
          class="flex-1 flex flex-col gap-12 px-2"
        >
          <h2
            class="flex items-center text-3xl font-bold text-gray-800 dark:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="h-10 w-10 fill-current mr-4"
              width="24"
              height="24"
            >
              <path fill="none" d="M0 0H24V24H0z" />
              <path
                d="M12.001 4.529c2.349-2.109 5.979-2.039 8.242.228 2.262 2.268 2.34 5.88.236 8.236l-8.48 8.492-8.478-8.492c-2.104-2.356-2.025-5.974.236-8.236 2.265-2.264 5.888-2.34 8.244-.228zm6.826 1.641c-1.5-1.502-3.92-1.563-5.49-.153l-1.335 1.198-1.336-1.197c-1.575-1.412-3.99-1.35-5.494.154-1.49 1.49-1.565 3.875-.192 5.451L12 18.654l7.02-7.03c1.374-1.577 1.299-3.959-.193-5.454z"
              />
            </svg>
            Likes
          </h2>
          <AlertComponent
            v-show="profileAlert.message"
            class="my-4"
            :type="profileAlert.type"
            :message="profileAlert.message"
            :dismissible="false"
          />
          <div
            v-if="!!state.likes && state.likes.length <= 0"
            class="bg-gray-50 border border-gray-200 p-2 rounded-lg dark:bg-gray-800 dark:border-gray-700"
          >
            <p class="text-center text-gray-500">No liked posts found.</p>
          </div>
          <div v-for="post of state.likes" :key="post.id">
            <PostComponent :post="post" class="shadow-sm" />
          </div>
        </div>

        <!-- Connections -->
        <div
          v-if="$route.name === 'profile-connections'"
          class="w-full flex-1 flex flex-col gap-12 px-2"
        >
          <h2
            class="w-full flex items-center text-3xl font-bold text-gray-800 dark:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="h-10 w-10 fill-current mr-4"
              width="24"
              height="24"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path
                d="M2 22a8 8 0 1 1 16 0h-2a6 6 0 1 0-12 0H2zm8-9c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm8.284 3.703A8.002 8.002 0 0 1 23 22h-2a6.001 6.001 0 0 0-3.537-5.473l.82-1.824zm-.688-11.29A5.5 5.5 0 0 1 21 8.5a5.499 5.499 0 0 1-5 5.478v-2.013a3.5 3.5 0 0 0 1.041-6.609l.555-1.943z"
              />
            </svg>
            Connections
          </h2>
          <AlertComponent
            v-show="profileAlert.message"
            class="my-4"
            :type="profileAlert.type"
            :message="profileAlert.message"
            :dismissible="false"
          />
          <div
            v-if="
              !state.profileData.following ||
              state.profileData.following.length <= 0
            "
            class="w-full bg-gray-50 border border-gray-200 p-2 rounded-lg dark:bg-gray-800 dark:border-gray-700"
          >
            <p class="text-center text-gray-500">No connections found.</p>
          </div>
          <div v-else class="w-full flex flex-col gap-6 md:gap-12">
            <router-link
              :to="'/social/@' + user.handle"
              v-for="user of state.profileData.following"
              :key="user.id"
              class="w-full p-4 text-gray-900 bg-white rounded-lg border shadow border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white flex items-center gap-4"
            >
              <div class="flex-shrink-0">
                <img
                  :src="user.avatarUrl"
                  class="w-12 h-12 rounded-full"
                  alt="User avatar"
                />
              </div>
              <div class="flex-1">
                <h5 class="text-lg font-semibold text-gray-800 dark:text-white">
                  @{{ user.handle }}
                </h5>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ user.fullName }}
                </p>
              </div>
              <div class="flex-shrink-0">
                <button
                  v-if="state.isOwnAccount"
                  type="button"
                  @click.stop="followUser(user.handle)"
                  class="relative z-30 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Unfollow
                </button>
                <button
                  v-else
                  type="button"
                  @click.stop="followUser(user.handle)"
                  class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-60"
                >
                  Follow
                </button>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import axios from 'axios'
import { onMounted, reactive, ref, watch } from 'vue'

import AlertComponent from '@/components/AlertComponent.vue'
import NavbarComponent from '@/components/NavbarComponent.vue'
import NewPostComponent from '@/components/NewPostComponent.vue'
import PostComponent from '@/components/PostComponent.vue'
import useUserStore from '@/stores/user'

const userStore = useUserStore()

const user = reactive({
  data: {},
})
onMounted(async () => {
  user.data = userStore.getUser
  user.data.posts.reverse()
})
watch(userStore.getUser, (newValue) => (user.data = newValue))

const tab = ref('posts') // posts, friends, about

const profileAlert = reactive({
  type: '',
  message: '',
})

async function changeAvatar() {
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
          Authorization: userStore.getBearerToken,
        },
      })
      // update user avatar
      if (response.status === 200) {
        user.data.avatar_uri = response.data.avatar_uri
        userStore.user.avatar_uri = response.data.avatar_uri
      }
    } catch (error) {
      console.log(error)
    }
  }
  input.click()
}
async function updateUser() {
  profileAlert.message = ''
  profileAlert.type = ''
  try {
    const response = axios.put('/api/user/me', user.data, {
      headers: {
        Authorization: userStore.getBearerToken,
      },
    })
    if (response.status === 200) {
      console.log(response.data)

      userStore.user = response.data.user
      profileAlert.message = response.data.success
      profileAlert.type = 'success'
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
    <NavbarComponent />
    <div class="container mx-auto flex flex-col md:flex-row items-start sm:px-2 gap-12 py-12">
      <div class="flex flex-col gap-12 w-64">
        <!-- Avatar -->
        <div class="relative group p-2  rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400">
          <img :src="user.data.avatar_uri"
               class="rounded-lg w-full h-auto md:w-64 md:h-64" />
          <button type="button"
                  @click="changeAvatar()"
                  class="hidden group-hover:block absolute bottom-0 left-0 w-full py-2.5 bg-gray-800 bg-opacity-40 hover:bg-opacity-60 text-white text-sm font-medium rounded-b-lg">
            Change avatar
          </button>
        </div>
        <!-- Actions/About -->
        <div class="bg-white border border-gray-200 rounded-lg divide-y divide-gray-300 first:rounded-t last:rounded-b dark:bg-gray-800 dark:border-gray-600 dark:divide-gray-600">
          <h3 class="px-4 py-2 text-2xl font-semibold dark:text-white">
            @{{ user.data.handle }}
          </h3>
          <p class="px-4 py-4 leading-tight text-gray-700 dark:text-gray-300">
            <span v-if="user.data.bio">
              {{ user.data.bio }}
            </span>
            <span v-else
                  class="italic text-xm"> No bio available. </span>
          </p>
          <a href="#"
             class="inline-flex items-center gap-2 w-full px-4 py-2 text-sm font-medium text-blue-600 hover:underline hover:bg-gray-100 dark:text-blue-400 dark:hover:bg-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg"
                 class="h-4 w-4"
                 fill="none"
                 viewBox="0 0 24 24"
                 stroke="currentColor"
                 stroke-width="2">
              <path stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>ADD FRIEND
          </a>
          <a href="#"
             class="inline-flex items-center gap-2 w-full px-4 py-2 text-sm font-medium text-blue-600 hover:underline hover:bg-gray-100 dark:text-blue-400 dark:hover:bg-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg"
                 class="h-4 w-4"
                 fill="none"
                 viewBox="0 0 24 24"
                 stroke="currentColor"
                 stroke-width="2">
              <path stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>SEND MESSAGE
          </a>
          <button type="button"
                  @click="() => {
                    if (tab === 'posts') tab = 'about'
                    else tab = 'posts'
                  }"
                  class="inline-flex items-center gap-2 w-full px-4 py-2 text-sm font-medium text-blue-600 hover:underline hover:bg-gray-100 dark:text-blue-400 dark:hover:bg-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg"
                 class="h-4 w-4"
                 fill="none"
                 viewBox="0 0 24 24"
                 stroke="currentColor"
                 stroke-width="2">
              <path stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ tab === 'posts' ? 'SEE ABOUT' : 'SEE POSTS' }}
          </button>
        </div>
      </div>
      <div v-if="tab === 'posts'"
           class="flex-1 flex flex-col gap-12">
        <NewPostComponent />
        <div v-for="post of user.data.posts"
             :key="post.id">
          <PostComponent :post="post" />
        </div>
      </div>
      <div v-if="tab === 'about'"
           class="flex-1 flex flex-col gap-12">
        <div class="flex flex-col bg-white border border-gray-200 shadow-sm rounded-lg p-4 divide-gray-200 dark:bg-gray-800 dark:border-gray-600 dark:divide-gray-600">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold py-3 dark:text-white">About @{{ user.data.handle }}</h2>
            <button type="button"
                    @click="updateUser()"
                    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Save Changes</button>
          </div>
          <AlertComponent v-show="profileAlert.message !== ''"
                          :type="profileAlert.type"
                          :message="profileAlert.message"
                          :dismissible="true" />
          <!-- Name -->
          <div class="py-2 flex items-center">
            <span class="font-semibold mr-2 uppercase text-sm w-64 dark:text-gray-300">Name</span>
            <div class="flex items-center gap-2 w-full">
              <input type="text"
                     v-model="user.data.first_name"
                     class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                     placeholder=""
                     required />
              <input type="text"
                     v-model="user.data.last_name"
                     class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                     placeholder=""
                     required />
            </div>
          </div>
          <!-- Location -->
          <div class="py-2 flex items-center">
            <span class="font-semibold mr-2 uppercase text-sm w-64 dark:text-gray-300">Location</span>
            <input type="text"
                   v-model="user.data.location"
                   class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                   placeholder=""
                   required />
          </div>
          <!-- Bio -->
          <div class="py-2 flex items-start">
            <span class="font-semibold mr-2 uppercase text-sm w-64 dark:text-gray-300">Bio</span>
            <textarea v-model="user.data.bio"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder=""
                      rows="4"></textarea>

          </div>
          <!-- Join Date -->
          <div class="py-2 flex items-center">
            <span class="font-semibold mr-2 uppercase text-sm w-64 dark:text-gray-300">Joined</span>
            <input type="text"
                   disabled
                   :value="new Date(user.data.created_at).toLocaleDateString()"
                   class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                   placeholder=""
                   required />
          </div>
          <!-- Education Level -->
          <div class="py-2 flex items-center">
            <span class="font-semibold mr-2 uppercase text-sm w-64 dark:text-gray-300">Education Level</span>
            <select class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option value=""
                      :selected="!user.data.education_level">Select</option>
              <option value="hs"
                      :selected="user.data.education_level === 'Hs'">High School</option>
              <option value="aa"
                      :selected="user.data.education_level === 'Aa'">Associate's of Art/Science</option>
              <option value="ba"
                      :selected="user.data.education_level === 'Ba'">Bachelor's of Art/Science</option>
              <option value="ma"
                      :selected="user.data.education_level === 'Ma'">Master's of Art/Science</option>
              <option value="phd"
                      :selected="user.data.education_level === 'Phd'">Doctorate degree</option>
            </select>
          </div>
          <!-- Education institution -->
          <div class="py-2 flex items-center">
            <span class="font-semibold mr-2 uppercase text-sm w-64 dark:text-gray-300">Education Institution</span>
            <input type="text"
                   v-model="user.data.education_institution"
                   class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                   placeholder="" />
          </div>
          <!-- Education major -->
          <div class="py-2 flex items-center">
            <span class="font-semibold mr-2 uppercase text-sm w-64 dark:text-gray-300">Education Major</span>
            <input type="text"
                   v-model="user.data.education_major"
                   class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                   placeholder="" />
          </div>
          <!-- Occupation -->
          <div class="py-2 flex items-center">
            <span class="font-semibold mr-2 uppercase text-sm w-64 dark:text-gray-300">Occupation</span>
            <input type="text"
                   v-model="user.data.occupation"
                   class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                   placeholder="" />
          </div>
          <!-- Interests -->
          <div class="py-2 flex items-center">
            <span class="font-semibold mr-2 uppercase text-sm w-64 dark:text-gray-300">Interests</span>
            <span>COMING SOON</span>
          </div>
          <!-- Business Name -->
          <div class="py-2 flex items-center">
            <span class="font-semibold mr-2 uppercase text-sm w-64 dark:text-gray-300">Business Name</span>
            <input type="text"
                   v-model="user.data.business_name"
                   class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                   placeholder="" />
          </div>
          <!-- In business since -->
          <div class="py-2 flex items-center">
            <span class="font-semibold mr-2 uppercase text-sm w-64 dark:text-gray-300">In business since</span>
            <input type="text"
                   v-model="user.data.years_in_business"
                   class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                   placeholder="" />
          </div>
        </div>
      </div>
      <div class="hidden lg:flex flex-col gap-12 w-64 h-80 bg-gray-200"></div>
    </div>
  </main>
</template>

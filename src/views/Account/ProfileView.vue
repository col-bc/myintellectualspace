<script setup>
import axios from 'axios'
import { onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import AlertComponent from '@/components/AlertComponent.vue'
import NavbarComponent from '@/components/NavbarComponent.vue'
import NewPostComponent from '@/components/NewPostComponent.vue'
import PostComponent from '@/components/PostComponent.vue'
import useUserStore from '@/stores/user'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

const user = reactive({
  isOwnAccount: false,
  data: {},
})
onMounted(async () => {
  try {
    const response = await axios.get(
      `/api/user/handle/${route.params.handle}`,
      {
        headers: {
          Authorization: userStore.getBearerToken,
        },
      }
    )
    if (response.status === 200) {
      user.data = response.data
      user.data.posts.reverse()
      if (user.data.handle === userStore.getHandle) {
        user.isOwnAccount = true
      }
    }

  } catch (error) {
    console.log(error)
    if (error.response.status === 404) {
      router.push('/user-not-found')
    }
  }
})

const tab = ref('posts') // posts, friends, about
const profileAlert = reactive({
  type: 'primary',
  message: '',
})

async function updateUser() {
  profileAlert.message = ''
  profileAlert.type = ''
  try {
    const response = await axios.put('/api/user/me', user.data, {
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
          Authorization: userStore.getBearerToken,
        },
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
    <div class="  max-w-screen-xl mx-auto">
      <NavbarComponent />
      <div class="container mx-auto flex flex-col md:flex-row items-start sm:px-2 gap-24 py-12">
        <div class="flex flex-col gap-12 w-80">
          <!-- Avatar -->
          <div class="relative group p-2 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl">
            <img :src="user.data.avatar_uri"
                 class="rounded-lg w-full h-auto md:w-80 md:h-80" />
            <button v-if="user.isOwnAccount"
                    @click="changeAvatar"
                    class="hidden group-hover:flex justify-center absolute right-0 bottom-0 left-0 py-1.5 bg-gray-900 bg-opacity-60 hover:bg-opacity-100 rounded-b-xl text-white">
              Change Avatar
            </button>
          </div>
          <!-- Actions/About -->
          <div class="sm:flex-1 divide-y divide-gray-300 dark:divide-gray-600">
            <h3 class="px-4 py-2 text-3xl font-semibold dark:text-white">
              @{{ user.data.handle }}
            </h3>
            <p class="px-4 py-4 leading-tight text-gray-700 dark:text-gray-300">
              <span v-if="user.data.bio">
                {{ user.data.bio }}
              </span>
              <span v-else
                    class="italic text-xm"> No bio available. </span>
            </p>
            <button @click="addFriend()"
                    class="inline-flex items-center gap-2 w-full px-4 py-2 text-sm font-medium text-blue-600 hover:underline hover:bg-gray-200 dark:text-blue-400 dark:hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg"
                   class="h-5 w-5 fill-current"
                   viewBox="0 0 24 24"
                   width="24"
                   height="24">
                <path fill="none"
                      d="M0 0h24v24H0z" />
                <path d="M14 14.252V22H4a8 8 0 0 1 10-7.748zM12 13c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm6 4v-3h2v3h3v2h-3v3h-2v-3h-3v-2h3z" />
              </svg>ADD FRIEND
            </button>
            <a href="#"
               class="inline-flex items-center gap-2 w-full px-4 py-2 text-sm font-medium text-blue-600 hover:underline hover:bg-gray-200 dark:text-blue-400 dark:hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg"
                   class="h-5 w-5 fill-current"
                   viewBox="0 0 24 24"
                   width="24"
                   height="24">
                <path fill="none"
                      d="M0 0h24v24H0z" />
                <path d="M6.455 19L2 22.5V4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6.455zM11 10H8v2h3v3h2v-3h3v-2h-3V7h-2v3z" />
              </svg>SEND MESSAGE
            </a>
            <button type="button"
                    @click="() => {
                      if (tab === 'posts') tab = 'about'
                      else tab = 'posts'
                    }"
                    class="inline-flex items-center gap-2 w-full px-4 py-2 text-sm font-medium text-blue-600 hover:underline hover:bg-gray-200 dark:text-blue-400 dark:hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg"
                   class="h-5 w-5 fill-current"
                   viewBox="0 0 24 24"
                   width="24"
                   height="24">
                <path fill="none"
                      d="M0 0h24v24H0z" />
                <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z" />
              </svg>
              {{ tab === 'posts' ? 'SEE ABOUT' : 'SEE POSTS' }}
            </button>
          </div>
        </div>

        <div v-if="tab === 'posts'"
             class="flex-1 flex flex-col gap-12">
          <AlertComponent v-show="profileAlert.message"
                          :type="profileAlert.type"
                          :message="profileAlert.message"
                          :dismissible="false" />

          <NewPostComponent v-if="user.data.handle === userStore.getUser.handle" />
          <div v-if="!!user.data.posts && user.data.posts.length <= 0"
               class="bg-white border border-gray-200 p-2 rounded-lg dark:bg-gray-800 dark:border-gray-700">
            <p class="text-center text-gray-500">
              No posts found.
            </p>
          </div>
          <div v-for="post of user.data.posts"
               :key="post.id">
            <PostComponent :post="post"
                           class="shadow-sm" />
          </div>
        </div>

        <div v-if="tab === 'about'"
             class="flex-1 flex flex-col gap-12">
          <div v-if="user.isOwnAccount">
            <AlertComponent v-show="profileAlert.message"
                            class="my-4"
                            :type="profileAlert.type"
                            :message="profileAlert.message"
                            :dismissible="false" />

            <div class="flex items-center justify-between">
              <h2 class="text-2xl font-bold py-3 dark:text-white">About @{{ user.data.handle }}</h2>
              <button type="button"
                      @click="updateUser()"
                      class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Save Changes</button>
            </div>

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

          <div v-else
               class="flex flex-col dark:text-gray-200">
            <div class="flex items-center justify-between">
              <h2 class="text-2xl font-bold py-3 dark:text-white">About @{{ user.data.handle }}</h2>
            </div>
            <!-- Name -->
            <div class="py-2 flex items-center">
              <span class="font-semibold mr-2 uppercase text-sm w-40">Name</span>
              <p>{{ user.data.first_name }} {{ user.data.last_name }}</p>
            </div>
            <!-- Location -->
            <div class="py-2 flex items-center">
              <span class="font-semibold mr-2 uppercase text-sm w-40">Location</span>
              <p>{{ user.data.location }}</p>
            </div>
            <!-- Bio -->
            <div class="py-2 flex items-start">
              <span class="font-semibold mr-2 uppercase text-sm w-40">Bio</span>
              <p v-if="user.data.bio"
                 class="flex-shrink">
                {{ user.data.bio }}
              </p>
              <p v-else
                 class="italic text-xm"> No bio available. </p>
            </div>
            <!-- Join Date -->
            <div class="py-2 flex items-center">
              <span class="font-semibold mr-2 uppercase text-sm w-40">Joined</span>
              <p>{{ new Date(user.data.created_at).toLocaleDateString() }}</p>
            </div>
            <!-- Education Level -->
            <div class="py-2 flex items-center">
              <span class="font-semibold mr-2 uppercase text-sm w-40">Education Level</span>
              <p>
                <span v-if="user.data.education_level === 'Hs'">
                  High School </span>
                <span v-else-if="user.data.education_level === 'Aa'">
                  Associate's of Arts / Science </span>
                <span v-else-if="user.data.education_level === 'Ba'">
                  Bachelor's of Arts / Science </span>
                <span v-else-if="user.data.education_level === 'Ma'">
                  Master's of Arts / Science </span>
                <span v-else-if="user.data.education_level === 'Phd'">
                  Doctorate Degree </span>
              </p>
            </div>
            <!-- Education institution -->
            <div class="py-2 flex items-center">
              <span class="font-semibold mr-2 uppercase text-sm w-40">Education Institution</span>
              <p>{{ user.data.education_institution }}</p>
            </div>
            <!-- Education major -->
            <div class="py-2 flex items-center">
              <span class="font-semibold mr-2 uppercase text-sm w-40">Education Major</span>
              <p>{{ user.data.education_major }}</p>
            </div>
            <!-- Occupation -->
            <div class="py-2 flex items-center">
              <span class="font-semibold mr-2 uppercase text-sm w-40">Occupation</span>
              <p>{{ user.data.occupation }}</p>
            </div>
            <!-- Interests -->
            <div class="py-2 flex items-center">
              <span class="font-semibold mr-2 uppercase text-sm w-40">Interests</span>
              <span>COMING SOON</span>
            </div>
            <!-- Business Name -->
            <div class="py-2 flex items-center">
              <span class="font-semibold mr-2 uppercase text-sm w-40">Business Name</span>
              <p>{{ user.data.business_name }}</p>
            </div>
            <!-- In business since -->
            <div class="py-2 flex items-center">
              <span class="font-semibold mr-2 uppercase text-sm w-40">In business since</span>
              <p>{{ user.data.years_in_business }}</p>
            </div>
          </div>
        </div>
        <div class="hidden xl:flex bg-white border shadow-sm w-60 h-80 border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-600">&nbsp;</div>
      </div>
    </div>
  </main>
</template>

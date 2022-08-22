<script setup>
import { reactive, onMounted, ref } from 'vue'
import NavbarComponent from '../../components/NavbarComponent.vue'
import useUserStore from '../../stores/user'

const userStore = useUserStore()

const user = reactive({
  data: {},
  isLoggedIn: false
})
onMounted(async () => {
  await userStore.fetchUser()
  user.data = userStore.getUser
  user.isLoggedIn = userStore.isLoggedIn
})

const accountForm = ref() // <form> ...
const passwordForm = ref() // <form> ...
const privacyForm = ref() // <form> ...
</script>

<template>
  <main class="bg-white min-h-screen dark:bg-slate-800">
    <div class="max-w-screen-xl mx-auto">
      <NavbarComponent />
      <div class="container flex flex-col mx-auto px-2 py-12">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-whit mb-12">
          Settings
        </h1>
        <div class="flex flex-col md:flex-row items-start gap-12 lg:gap-16">
          <!-- Menu -->
          <div
            class="w-60 text-sm shadow-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <a
              href="#account"
              class="block py-2 px-4 w-full text-white bg-blue-700 rounded-t-lg border-b border-gray-200 cursor-pointer dark:bg-gray-800 dark:border-gray-600"
            >
              Account
            </a>
            <a
              href="#password"
              class="block py-2 px-4 w-full border-b border-gray-200 cursor-pointer hover:bg-white hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
            >
              Password
            </a>
            <a
              href="#2fa"
              class="block py-2 px-4 w-full border-b border-gray-200 cursor-pointer hover:bg-white hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
            >
              2-Factor Authentication
            </a>
            <a
              href="#privacy"
              class="block py-2 px-4 w-full border-b border-gray-200 cursor-pointer hover:bg-white hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
            >
              Privacy
            </a>
            <a
              href="#"
              class="block py-2 px-4 w-full border-b border-gray-200 cursor-pointer hover:bg-white hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
            >
              Messages
            </a>
            <a
              href="#"
              class="block py-2 px-4 w-full rounded-b-lg cursor-pointer hover:bg-white hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
            >
              Download
            </a>
          </div>
          <!-- Content -->
          <div class="flex-1 w-full max-w-xl mx-auto flex flex-col gap-12">
            <!-- Account -->
            <form ref="accountForm" id="account" class="flex flex-col gap-4">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                Account
              </h3>
              <div>
                <label
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >Your email</label
                >
                <input
                  type="email"
                  v-model="user.data.email"
                  class="bg-white cursor-not-allowed border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  disabled
                />
                <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  You cannot change you email.
                </p>
              </div>
              <div>
                <label
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
                  >Account type</label
                >
                <select
                  v-model="user.data.account_type"
                  class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="initial" :selected="!user.data.account_type">
                    Choose account type
                  </option>
                  <option
                    value="Learner"
                    :selected="user.data.account_type === 'Learner'"
                  >
                    Learner
                  </option>
                  <option
                    value="Educator"
                    :selected="user.data.account_type === 'Educator'"
                  >
                    Educator
                  </option>
                  <option
                    value="Employer"
                    :selected="user.data.account_type === 'Employer'"
                  >
                    Employer
                  </option>
                </select>
              </div>
              <div v-if="user.data.account_type === 'Employer'">
                <label
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >Employer name</label
                >
                <input
                  type="email"
                  v-model="user.data.business_name"
                  class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
              <div v-if="user.data.account_type === 'Employer'">
                <label
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >In business since</label
                >
                <input
                  type="number"
                  v-model="user.data.years_in_business"
                  class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
              <div>
                <button
                  type="submit"
                  class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  Save
                </button>
              </div>
            </form>
            <!-- Password -->
            <form ref="passwordForm" id="security" class="flex flex-col gap-4">
              <!-- Password -->
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                Security
              </h3>
              <div
                class="inline-flex items-center p-4 mb-4 text-sm text-blue-700 bg-blue-100 rounded-lg dark:bg-blue-200 dark:text-blue-800"
                role="alert"
              >
                <svg
                  viewBox="0 0 24 24"
                  class="w-4 h-4 mr-2"
                  width="24"
                  height="24"
                  stroke="currentColor"
                  stroke-width="2"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"
                  ></path>
                </svg>
                <span class="font-medium mr-2">Password changed on</span>
                {{
                  new Date(user.data.password_changed_on).toLocaleDateString()
                }}
              </div>
              <div>
                <label
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >Current password</label
                >
                <input
                  type="password"
                  name="current_password"
                  class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >New password</label
                >
                <input
                  type="password"
                  name="new_password"
                  class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >Repeat new password</label
                >
                <input
                  type="password"
                  name="new_password_repeat"
                  class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
              <div>
                <button
                  type="submit"
                  class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  Change Password
                </button>
              </div>
            </form>
            <!-- Privacy -->
            <form ref="privacyForm" id="privacy" class="flex flex-col gap-4">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                Privacy
              </h3>
              <div
                class="flex items-center bg-white pl-4 rounded-lg border border-gray-300 dark:border-gray-700"
              >
                <input
                  type="radio"
                  value="public"
                  :checked="user.data.privacy === 'public'"
                  name="privacy_mode"
                  class="w-4 h-4 text-blue-600 bg-white0 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label class="flex items-center py-4 ml-4 w-full">
                  <svg
                    viewBox="0 0 24 24"
                    class="w-8 h-8 mr-3"
                    width="24"
                    height="24"
                    stroke="currentColor"
                    stroke-width="2"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  <div>
                    <span class="font-medium text-gray-900 dark:text-gray-300"
                      >Public</span
                    >
                    <p class="text-xs text-gray-700 dark:text-gray-300">
                      All of your profile details can be viewed by all other
                      registered users.
                    </p>
                  </div>
                </label>
              </div>
              <div
                class="flex items-center bg-white pl-4 rounded-lg border border-gray-300 dark:border-gray-700"
              >
                <input
                  type="radio"
                  value="friends"
                  :checked="user.data.privacy === 'friends'"
                  name="privacy_mode"
                  class="w-4 h-4 text-blue-600 bg-white0 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label class="flex items-center py-4 ml-4 w-full">
                  <svg
                    viewBox="0 0 24 24"
                    class="w-8 h-8 mr-3"
                    width="24"
                    height="24"
                    stroke="currentColor"
                    stroke-width="2"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <div>
                    <span class="font-medium text-gray-900 dark:text-gray-300"
                      >Friends</span
                    >
                    <p class="text-xs text-gray-700 dark:text-gray-300">
                      All of your profile details can be viewed by all the
                      user's you've connected with.
                    </p>
                  </div>
                </label>
              </div>
              <div
                class="flex items-center bg-white pl-4 rounded-lg border border-gray-300 dark:border-gray-700"
              >
                <input
                  type="radio"
                  value="private"
                  :checked="user.data.privacy === 'private'"
                  name="privacy_mode"
                  class="w-4 h-4 text-blue-600 bg-white0 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label class="flex items-center py-4 ml-4 w-full">
                  <svg
                    viewBox="0 0 24 24"
                    class="w-8 h-8 mr-3"
                    width="24"
                    height="24"
                    stroke="currentColor"
                    stroke-width="2"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path
                      d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                    ></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                  <div>
                    <span class="font-medium text-gray-900 dark:text-gray-300"
                      >Private</span
                    >
                    <p class="text-xs text-gray-700 dark:text-gray-300">
                      All of your profile details can be hidden from all other
                      users.
                    </p>
                  </div>
                </label>
              </div>
              <div>
                <button
                  type="submit"
                  class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

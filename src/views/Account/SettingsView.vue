<script setup>
import { reactive, onMounted, watch } from 'vue'
import AlertComponent from '@/components/AlertComponent.vue'
import NavbarComponent from '@/components/NavbarComponent.vue'
import LoaderComponent from '@/components/LoaderComponent.vue'
import useUserStore from '@/stores/user'
import {
  getAuth,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword
} from 'firebase/auth'

const user = useUserStore()
const auth = getAuth()

const state = reactive({
  loading: true,
  error: null,
  user: null,
  isGoogle: false,
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
  showDeactivateDialog: false,
  deactivationReason: 'default',
  deactivateDetails: '',
  deactivatePassword: ''
})

onMounted(async () => {
  state.user = await user.fetchUserByHandle(user.user.handle)
  state.isGoogle = auth.currentUser.providerData[0].providerId === 'google.com'
  state.loading = false
})

watch(
  () => state.showDeactivateDialog,
  (val) => {
    if (val) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
  }
)

async function updateUser() {
  await user.updateUser(state.user)
}

async function changePassword() {
  state.error = null
  if (state.isGoogle) {
    return
  }

  // check if password is strong enough
  if (!state.newPassword || !state.confirmPassword) {
    state.error = {
      message: 'Please fill out all fields',
      type: 'error'
    }
    return
  }
  if (state.newPassword !== state.confirmPassword) {
    state.error = {
      message: 'Passwords do not match',
      type: 'error'
    }
    return
  }
  if (state.newPassword.length < 8) {
    state.error = {
      message: 'Password must be at least 8 characters',
      type: 'error'
    }
    return
  }
  if (!/\d/.test(state.newPassword)) {
    state.error = {
      message: 'Password must contain at least one number',
      type: 'error'
    }
    return
  }
  if (!/[A-Z]/.test(state.newPassword)) {
    state.error = {
      message: 'Password must contain at least one uppercase letter',
      type: 'error'
    }
    return
  }

  // reauthenticate user
  try {
    const user = auth.currentUser

    const credential = EmailAuthProvider.credential(
      user.email,
      state.oldPassword
    )
    reauthenticateWithCredential(user, credential)
      .then(() => {
        // change password
        updatePassword(user, state.newPassword)
          .then(() => {
            state.oldPassword = ''
            state.newPassword = ''
            state.confirmPassword = ''
            state.error = {
              message: 'Password successfully changed',
              type: 'success'
            }
          })
          .catch((error) => {
            console.log(error)
            state.error = {
              message: error.message,
              type: 'error'
            }
          })
      })
      .catch((error) => {
        console.log(error)
        state.error = {
          message: error.message,
          type: 'error'
        }
      })
  } catch (error) {
    console.log(error)
    if (error.code === 'auth/wrong-password') {
      state.error = {
        message: 'Current password is incorrect',
        type: 'error'
      }
    } else {
      state.error = {
        message: error.message,
        type: 'error'
      }
    }
    return
  }
}

async function deactivateAccount() {}
</script>

<template>
  <main class="bg-white min-h-screen dark:bg-slate-800">
    <div class="max-w-screen-xl mx-auto">
      <NavbarComponent />
      <div class="container flex flex-col mx-auto px-2 py-12">
        <div class="flex flex-col md:flex-row items-start gap-12 lg:gap-16">
          <div class="flex flex-col w-full md:w-auto">
            <h1
              class="w-full text-3xl mb-12 font-bold text-gray-900 dark:text-white"
            >
              Account Settings
            </h1>
            <!-- Menu -->
            <div
              class="w-full md:w-60 text-sm shadow-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <a
                href="#account"
                class="block py-2 px-4 w-full rounded-t-lg border-b border-gray-200 cursor-pointer hover:bg-white hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
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
                href="#privacy"
                class="block py-2 px-4 w-full border-b border-gray-200 cursor-pointer hover:bg-white hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
              >
                Privacy
              </a>
              <a
                href="#deactivate"
                class="block py-2 px-4 w-full rounded-b-lg cursor-pointer hover:bg-white hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
              >
                Deactivate Account
              </a>
            </div>
          </div>
          <div
            v-if="state.loading"
            class="w-full flex items-center justify-center my-12 text-gray-900 dark:text-white"
          >
            <LoaderComponent size="lg" />
          </div>
          <!-- Content -->
          <div
            v-else
            class="flex-1 w-full max-w-xl mx-auto flex flex-col divide-y divide-gray-400 dark:divide-gray-600"
          >
            <!-- Account -->
            <form
              id="account"
              class="flex flex-col gap-5 py-12"
              @submit.prevent="updateUser"
            >
              <h3
                class="text-xl font-semibold text-gray-900 dark:text-white mb-6"
              >
                Account
              </h3>
              <div>
                <label
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >Your email</label
                >
                <input
                  type="email"
                  v-model="user.user.email"
                  class="bg-white cursor-not-allowed border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  disabled
                />
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  You cannot change you email.
                </p>
              </div>
              <div>
                <label
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >Your phone number</label
                >
                <input
                  type="tel"
                  v-model="user.user.phone"
                  class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >Account type</label
                >
                <select
                  v-model="state.user.accountType"
                  class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option
                    value="learner"
                    :selected="
                      (state.user.accountType === 'learner' || !state,
                      user.accountType)
                    "
                  >
                    Learner
                  </option>
                  <option
                    value="instructor"
                    :selected="state.user.accountType === 'instructor'"
                  >
                    Instructor
                  </option>
                  <option
                    value="employer"
                    :selected="state.user.accountType === 'employer'"
                  >
                    Employer
                  </option>
                </select>
              </div>
              <div>
                <button
                  type="submit"
                  class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  Save changes
                </button>
              </div>
            </form>

            <!-- Password -->
            <div id="security" class="flex flex-col gap-6 py-12">
              <!-- Password -->
              <h3
                class="text-xl font-semibold text-gray-900 dark:text-white mb-6"
              >
                Security
              </h3>
              <div
                class="p-4 flex items-center gap-2.5 text-sm text-blue-700 bg-blue-100 rounded-lg dark:bg-blue-200 dark:text-blue-800"
                role="alert"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  class="w-5 h-5 fill-current"
                  width="24"
                  height="24"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path
                    d="M4 15h2v5h12V4H6v5H4V3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6zm6-4V8l5 4-5 4v-3H2v-2h8z"
                  />
                </svg>
                <div>
                  <span class="font-medium">Last login: </span>
                  {{
                    new Date(
                      auth.currentUser?.metadata.lastSignInTime
                    ).toLocaleDateString('en-us')
                  }}
                  @
                  {{
                    new Date(
                      auth.currentUser?.metadata.lastSignInTime
                    ).toLocaleTimeString('en-us')
                  }}
                </div>
              </div>
              <AlertComponent
                v-if="state.error"
                :message="state.error.message"
                :type="state.error.type"
              />
              <template v-if="!state.isGoogle">
                <form
                  @submit.prevent="changePassword"
                  class="flex flex-col gap-6"
                >
                  <div>
                    <label
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >Current password</label
                    >
                    <input
                      type="password"
                      v-model="state.oldPassword"
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
                      v-model="state.newPassword"
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
                      v-model="state.confirmPassword"
                      class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    >
                      Change Password
                    </button>
                  </div>
                </form>
              </template>
              <template v-else>
                <a
                  href="https://myaccount.google.com/security"
                  target="_blank"
                  class="flex items-center gap-2.5 text-blue-700 hover:underline dark:text-blue-400"
                >
                  Change your password on Google
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    class="w-5 h-5 fill-current"
                    width="24"
                    height="24"
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path
                      d="M10 6v2H5v11h11v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6zm11-3v8h-2V6.413l-7.793 7.794-1.414-1.414L17.585 5H13V3h8z"
                    />
                  </svg>
                </a>
              </template>
            </div>

            <!-- Privacy -->
            <form
              id="privacy"
              class="flex flex-col gap-6 py-12"
              @submit.prevent="updateUser"
            >
              <h3
                class="text-xl font-semibold text-gray-900 dark:text-white mb-6"
              >
                Privacy
              </h3>

              <div
                class="flex items-center pl-4 rounded border border-gray-200 dark:border-gray-700"
              >
                <input
                  id="privacy-private"
                  type="radio"
                  v-model="user.user.privacy"
                  name="privacy"
                  value="private"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <div class="flex flex-col ml-4 py-4">
                  <label
                    for="privacy-private"
                    class="w-full mb-2 font-medium text-gray-900 dark:text-gray-300"
                    >Private
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      Only you users who follow you can see your profile, posts
                      and send you messages.
                    </p>
                  </label>
                </div>
              </div>
              <div
                class="flex items-center pl-4 rounded border border-gray-200 dark:border-gray-700"
              >
                <input
                  checked
                  id="privacy-public"
                  type="radio"
                  value="public"
                  name="privacy"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <div class="flex flex-col ml-4 py-4">
                  <label
                    for="privacy-public"
                    class="w-full mb-2 font-medium text-gray-900 dark:text-gray-300"
                    >Public
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      Anyone can see your profile, posts and send you messages.
                    </p>
                  </label>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  Save changes
                </button>
              </div>
            </form>

            <!-- Deactivate -->
            <form
              id="deactivate"
              class="space-y-6 py-12"
              @submit.prevent="deactivateUser"
            >
              <h3
                class="text-xl font-semibold text-gray-900 dark:text-white mb-6"
              >
                Deactivate account
              </h3>
              <button
                type="button"
                @click="state.showDeactivateDialog = true"
                class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
              >
                Begin deactivation
              </button>
            </form>

            <Dialog
              :open="state.showDeactivateDialog"
              @close="state.showDeactivateDialog = false"
              class="relative z-10"
            >
              <div class="fixed inset-0 bg-black bg-opacity-60" />
              <div class="fixed inset-0 overflow-y-auto">
                <div class="flex min-h-full items-center justify-center p-4">
                  <div
                    class="w-full max-w-lg flex flex-col p-6 bg-white rounded-lg shadow dark:bg-gray-700"
                  >
                    <div
                      class="text-white mb-6 block w-auto mx-auto p-4 rounded-full shadow-lg shadow-purple-400/30 bg-gradient-to-br from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        class="w-24 h-24 fill-current"
                        width="24"
                        height="24"
                      >
                        <path fill="none" d="M0 0h24v24H0z" />
                        <path
                          d="M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3zm1 2H6v12h12V8zm-4.586 6l1.768 1.768-1.414 1.414L12 15.414l-1.768 1.768-1.414-1.414L10.586 14l-1.768-1.768 1.414-1.414L12 12.586l1.768-1.768 1.414 1.414L13.414 14zM9 4v2h6V4H9z"
                        />
                      </svg>
                    </div>
                    <h2
                      class="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white"
                    >
                      Deactivate your account
                    </h2>
                    <p class="text-gray-700 dark:text-gray-300 mb-6">
                      Are you sure you want to deactivate your account? All of
                      your data will be permanently removed. This includes all
                      you posts, images, likes, course data, etc. This action
                      cannot be undone. Please enter your password to start the
                      deactivation process.
                    </p>
                    <form
                      class="flex flex-col gap-6 justify-start"
                      @submit.prevent="deactivateAccount"
                    >
                      <div>
                        <label
                          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >Your user ID</label
                        >
                        <input
                          type="text"
                          disabled
                          v-model="state.user.uid"
                          class="bg-gray-50 cursor-not-allowed border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                          required
                        />
                      </div>
                      <div>
                        <label
                          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >Reason</label
                        >
                        <select
                          v-model="state.deactivationReason"
                          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                          required
                        >
                          <option value="default" selected>
                            Select a reason
                          </option>
                          <option value="not_used">
                            I don't use this account anymore
                          </option>
                          <option value="privacy">
                            I'm concerned about my privacy
                          </option>
                          <option value="not_working">
                            Something's not working
                          </option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label
                          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >Details</label
                        >
                        <textarea
                          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                          v-model="state.deactivateDetails"
                          rows="4"
                        ></textarea>
                      </div>
                      <div>
                        <label
                          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >Password</label
                        >
                        <input
                          type="password"
                          v-model="state.deactivatePassword"
                          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                          required
                        />
                      </div>
                      <div class="flex items-center justify-center gap-4">
                        <button
                          type="reset"
                          @click="state.showDeactivateDialog = false"
                          class="w-full text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          class="w-full text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                        >
                          Deactivate account
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

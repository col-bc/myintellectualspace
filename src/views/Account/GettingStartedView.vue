<script setup>
import useUserStore from '@/stores/user';
import axios from 'axios';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)

const user = reactive({
    data: {}
})
onMounted(async () => {
    user.data = await userStore.fetchUser()
    if (localStorage.getItem('color-theme') === 'dark') {
        document.documentElement.classList.add('dark');
        darkMode.value = true
    } else {
        document.documentElement.classList.remove('dark')
        darkMode.value = false
    }
})

async function updateUser() {
    try {
        loading.value = true
        const response = await axios.put('/api/user/me', user.data,
            {
                headers: {
                    Authorization: userStore.getBearerToken
                }
            })
        if (response.status === 200) {
            router.push('/social/me')
        }
    } catch (error) {
        console.log(error)
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <main class="min-h-screen bg-gray-100 py-12 dark:bg-slate-800">
        <div class="max-w-screen-md mx-auto flex flex-col bg-white border border-gray-200 rounded-lg p-6 dark:bg-gray-800 dark:border-gray-700">
            <h1 class="text-3xl font-bold text-center text-gray-800 mb-6 dark:text-white">Account Onboarding</h1>
            <router-link to="/"
                         class="flex w-auto justify-center items-center mr-auto md:mr-0 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400">
                <svg xmlns="http://www.w3.org/2000/svg"
                     class="stroke-gray-900 dark:stroke-white h-8 w-8 mr-2"
                     width="24"
                     height="24"
                     viewBox="0 0 24 24"
                     stroke-width="2"
                     stroke="currentColor"
                     fill="none"
                     stroke-linecap="round"
                     stroke-linejoin="round">
                    <path stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"></path>
                    <path d="M5.931 6.936l1.275 4.249m5.607 5.609l4.251 1.275"></path>
                    <path d="M11.683 12.317l5.759 -5.759"></path>
                    <circle cx="5.5"
                            cy="5.5"
                            r="1.5"></circle>
                    <circle cx="18.5"
                            cy="5.5"
                            r="1.5"></circle>
                    <circle cx="18.5"
                            cy="18.5"
                            r="1.5"></circle>
                    <circle cx="8.5"
                            cy="15.5"
                            r="4.5"></circle>
                </svg>
                <span class="self-center text-3xl font-bold whitespace-nowrap">
                    Intellectual Space
                </span>
            </router-link>

            <p class="text-lg text-center text-gray-700 dark:text-gray-300 mb-6">
                Welcome toIntellectual Space. Help other's get tp know you by adding information to your profile. You can update or remove your information at any time.
            </p>
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
            <div class="py-2 w-full flex gap-4 justify-end">
                <button type="button"
                        @click="$router.push('/social/me')"
                        class="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Skip</button>
                <button type="button"
                        @click="updateUser()"
                        :disabled="loading"
                        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                    <div v-if="loading"
                         role="status">
                        <svg class="inline mr-2 w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                             viewBox="0 0 100 101"
                             fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                  fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                  fill="currentFill" />
                        </svg>
                        <span class="sr-only">Loading...</span>
                    </div>
                    <span v-else>Save and Continue</span>
                </button>
            </div>
        </div>
    </main>
</template>
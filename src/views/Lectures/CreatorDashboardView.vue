<script setup>
import NavbarComponent from '@/components/NavbarComponent.vue'
import LoaderComponent from '@/components/LoaderComponent.vue'
import { reactive, onMounted } from 'vue'
import useUserStore from '@/stores/user'
import useLectureStore from '@/stores/lecture'
import {
  mdiCommentOutline,
  mdiEyeOutline,
  mdiHeart,
  mdiHeartOutline,
  mdiHomeLightningBoltOutline,
  mdiMovieRoll,
  mdiPencilBoxOutline,
  mdiPlayBoxOutline,
  mdiTimerOutline,
  mdiTimerSand,
  mdiTrashCanOutline
} from '@mdi/js'

const user = useUserStore()
const lecture = useLectureStore()
const state = reactive({
  myContent: [],
  loading: true
})

onMounted(async () => {
  const content = await lecture.fetchMyLectures()
  state.myContent = content.reverse()
  state.loading = false
})
</script>

<template>
  <main class="bg-white min-h-screen dark:bg-slate-800">
    <div class="max-w-screen-xl mx-auto">
      <NavbarComponent />
      <div
        class="h-full container mx-auto flex flex-col gap-6 md:gap-12 lg:gap-16 py-12 px-2 md:px-4"
      >
        <template v-if="state.loading">
          <div
            class="w-full py-12 flex justify-center text-gray-900 dark:text-white"
          >
            <LoaderComponent size="lg" />
          </div>
        </template>
        <template v-else>
          <h1
            class="text-5xl font-black leading-loose text-gray-900 dark:text-white mb-6"
          >
            My Lectures
          </h1>

          <div class="flex flex-col gap-6">
            <div
              v-if="state.myContent.length === 0"
              class="flex flex-col items-center gap-4"
            >
              <img
                src="@/assets/images/empty.svg"
                class="w-1/2"
                alt="Empty Illustration"
              />
              <p class="text-lg text-gray-700 dark:text-gray-300">
                You haven't created any content yet.
              </p>
            </div>
            <template v-else v-for="item in state.myContent" :key="item.id">
              <div
                class="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 flex items-center flex-col lg:flex-row md:items-start gap-6 p-6"
              >
                <div class="w-full h-full flex-shrink-0 lg:max-w-xl">
                  <img
                    :src="item.thumbnail"
                    class="w-full h-full object-fit rounded-lg"
                  />
                </div>
                <div class="flex flex-col gap-4 w-full h-full">
                  <div class="flex items-center gap-2 flex-wrap">
                    <h4
                      class="flex-1 text-2xl font-bold text-gray-900 dark:text-white"
                    >
                      {{ item.title }}
                    </h4>
                    <button
                      type="button"
                      @click="$router.push(`/lectures/${item.id}/edit`)"
                      class="flex items-center gap-3 px-3 py-2 text-xs font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    >
                      <svg-icon
                        :path="mdiPencilBoxOutline"
                        type="mdi"
                        class="w-5 h-5"
                      />
                      <span class="hidden md:inline-flex">Edit</span>
                    </button>

                    <button
                      type="button"
                      @click="lecture.deleteLecture(item.id)"
                      class="flex items-center gap-3 px-3 py-2 text-xs font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    >
                      <svg-icon
                        :path="mdiTrashCanOutline"
                        type="mdi"
                        class="w-5 h-5"
                      />
                      <span class="hidden md:inline-flex">Delete</span>
                    </button>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 w-full">
                    <div
                      class="p-6 w-full border-r border-b border-gray-300 dark:border-gray-700"
                    >
                      <p
                        class="flex items-center justify-center gap-4 text-6xl font-bold text-blue-600 dark:text-blue-400 mb-2"
                      >
                        <svg-icon :path="mdiTimerSand" type="mdi" size="48" />
                        {{ item.viewTime || '0' }}
                      </p>
                      <p class="text-center text-gray-700 dark:text-gray-300">
                        View time <small>(seconds)</small>
                      </p>
                    </div>

                    <div
                      class="p-6 w-full border-b border-gray-300 dark:border-gray-700"
                    >
                      <p
                        class="flex items-center justify-center gap-4 text-6xl font-bold text-blue-600 dark:text-blue-400 mb-2"
                      >
                        <svg-icon
                          :path="mdiHeartOutline"
                          type="mdi"
                          size="48"
                        />
                        {{ item.likes.length || '0' }}
                      </p>
                      <p class="text-center text-gray-700 dark:text-gray-300">
                        Likes
                      </p>
                    </div>

                    <div
                      class="p-6 w-full border-r border-gray-300 dark:border-gray-700"
                    >
                      <p
                        class="flex items-center justify-center gap-4 text-6xl font-bold text-blue-600 dark:text-blue-400 mb-2"
                      >
                        <svg-icon
                          :path="mdiCommentOutline"
                          type="mdi"
                          size="48"
                        />
                        {{ item.comments.length || '0' }}
                      </p>
                      <p class="text-center text-gray-700 dark:text-gray-300">
                        Comments
                      </p>
                    </div>

                    <div
                      class="p-6 w-full border-gray-300 dark:border-gray-700"
                    >
                      <p
                        class="flex items-center justify-center gap-4 text-6xl font-bold text-blue-600 dark:text-blue-400 mb-2"
                      >
                        <svg-icon
                          :path="item.isReel ? mdiMovieRoll : mdiPlayBoxOutline"
                          type="mdi"
                          size="48"
                        />
                      </p>
                      <p class="text-center text-gray-700 dark:text-gray-300">
                        {{ item.isReel ? 'Reel' : 'Lecture' }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </template>
      </div>
    </div>
  </main>
</template>

<script setup>
import NavbarComponent from '@/components/NavbarComponent.vue'
import UploadLectureComponent from '@/components/UploadLectureComponent.vue'
import LoaderComponent from '@/components/LoaderComponent.vue'
import useLectureStore from '@/stores/lecture'
import useUserStore from '@/stores/user'
import { onMounted, reactive } from '@vue/runtime-core'
import { useRoute } from 'vue-router'
import {
  mdiHeartOutline,
  mdiHeart,
  mdiEyeOutline,
  mdiCommentOutline,
  mdiMovieEditOutline,
  mdiSendOutline,
  mdiDeleteOutline
} from '@mdi/js'

const user = useUserStore()
const route = useRoute()
const lectureId = route.params.lectureId
const lectures = useLectureStore()

const state = reactive({
  loading: true,
  lecture: null,
  authorData: null,
  commentInput: ''
})

onMounted(async () => {
  if (lectureId) {
    state.lecture = await lectures.fetchLecture(lectureId)
    state.authorData = await user.fetchUserByUid(state.lecture.author)
    if (!state.lecture.isReel) {
      lectures.incrementViews(state.lecture.id)
    }
    state.loading = false
  } else {
    state.loading = false
  }
})

async function handleComment() {
  if (state.commentInput) {
    await lectures.createComment(state.lecture.id, state.commentInput)
    state.commentInput = ''
  }
}
</script>

<template>
  <main class="bg-white min-h-screen dark:bg-slate-800">
    <div class="max-w-screen-xl mx-auto">
      <NavbarComponent />
      <div class="relative h-full container mx-auto py-12 px-2 md:px-4">
        <template v-if="state.loading">
          <div class="w-full py-12 flex justify-center">
            <LoaderComponent size="lg" />
          </div>
        </template>
        <template v-else-if="route.name === 'lectures-new'">
          <h1
            class="text-5xl font-black leading-loose text-gray-900 dark:text-white mb-12"
          >
            Upload Content
          </h1>
          <p
            class="text-lg leading-loose text-gray-700 dark:text-gray-300 mb-12"
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
            voluptates, quod, quia, voluptate quae quidem voluptatem quibusdam
            doloremque quas quos nemo. Quisquam, quae. Quisquam, quae. Quisquam,
            quae. Quisquam, quae.
          </p>
          <div class="max-w-xl mx-auto">
            <UploadLectureComponent />
          </div>
        </template>
        <template v-else-if="route.name === 'lectures-lecture'">
          <div class="flex items-center gap-6 mb-6">
            <img
              :src="state.lecture.thumbnail"
              class="flex-shrink-0 w-16 h-16 rounded-full border"
            />
            <h2
              class="flex-1 text-4xl font-black leading-loose text-gray-900 dark:text-white"
            >
              {{ state.lecture.title }}
            </h2>

            <div class="inline-flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                @click="lectures.toggleLikeLecture(state.lecture.id)"
                class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
              >
                <svg-icon
                  :path="
                    state.lecture.likes?.includes(user.user.uid)
                      ? mdiHeart
                      : mdiHeartOutline
                  "
                  type="mdi"
                  :class="{
                    'text-red-500': state.lecture.likes?.includes(user.user.uid)
                  }"
                />
                <span class="font-medium text-lg">{{
                  state.lecture.likes?.length
                }}</span>
              </button>
              <button
                type="button"
                class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
              >
                <svg-icon :path="mdiCommentOutline" type="mdi" />
                <span class="font-medium text-lg">{{
                  state.lecture.comments?.length
                }}</span>
              </button>
              <div
                class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-r-md hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
              >
                <svg-icon :path="mdiEyeOutline" type="mdi" />
                <span class="font-medium text-lg">{{
                  state.lecture.views || '0'
                }}</span>
              </div>
            </div>
          </div>

          <video class="w-full h-auto max-w-full mb-6" controls>
            <source :src="state.lecture.video" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <div class="flex flex-col w-full items-start">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Description
            </h3>
            <p
              class="flex-1 text-lg leading-loose text-gray-700 dark:text-gray-300 mb-6"
            >
              {{ state.lecture.description }}
            </p>
            <div class="flex flex-col w-full mb-6">
              <h3
                class="text-lg font-medium text-gray-900 dark:text-white mb-2"
              >
                Author
              </h3>
              <div
                class="bg-white dark:bg-gray-800 border rounded-lg border-gray-300 dark:border-gray-700 p-4"
              >
                <div class="flex items-center w-full gap-6">
                  <img :src="state.authorData.avatarUrl" class="w-24 h-24" />
                  <div class="flex flex-col flex-1">
                    <h4
                      class="text-2xl font-bold text-gray-900 dark:text-white"
                    >
                      @{{ state.authorData.handle }}
                    </h4>
                    <span class="text-gray-700 text-lg dark:text-gray-300">
                      {{ state.authorData.fullName }}
                    </span>
                  </div>
                  <div>
                    <button
                      type="button"
                      @click="
                        $router.push({
                          name: 'profile',
                          params: { handle: state.authorData.handle }
                        })
                      "
                      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <!-- Tags -->
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Tags
            </h3>
            <div class="flex items-center gap-2 flex-wrap mb-6">
              <div
                v-for="tag in state.lecture.tags"
                :key="tag"
                class="bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300"
              >
                {{ tag }}
              </div>
            </div>
            <!-- comments -->
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Comments
            </h3>
            <form class="w-full mb-4" @submit.prevent="handleComment">
              <label for="chat" class="sr-only">Your message</label>
              <div class="flex items-center">
                <textarea
                  rows="1"
                  v-model="state.commentInput"
                  class="block shadow mr-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Write something! Be sure to follow the Community Guidelines."
                ></textarea>
                <button
                  type="submit"
                  class="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
                >
                  <svg-icon :path="mdiSendOutline" type="mdi" />
                  <span class="sr-only">Post Comment</span>
                </button>
              </div>
            </form>
            <div class="flex flex-col divide-y dark:divide-gray-400 w-full">
              <div
                v-for="comment of state.lecture.comments"
                class="flex items-center gap-2 w-full"
              >
                <img
                  :src="comment.avatarUrl"
                  class="w-12 h-12 rounded-full border"
                />
                <div class="flex flex-col border-r dark:border-gray-400 pr-2">
                  <span
                    class="text-sm font-medium text-gray-900 dark:text-white"
                  >
                    @{{ comment.handle }}
                  </span>
                  <span class="text-gray-700 text-xs dark:text-gray-300">
                    {{ new Date(comment.created).toLocaleDateString('en-us') }}
                  </span>
                </div>

                <p
                  class="w-full flex-1 px-2 text-gray-700 text-sm dark:text-gray-300"
                >
                  {{ comment.text }}
                </p>
                <button
                  v-if="comment.uid === user.user.uid"
                  @click="lectures.deleteComment(state.lecture.id, comment.id)"
                  type="button"
                  class="px-3 py-2 text-xs font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                >
                  <svg-icon
                    :path="mdiDeleteOutline"
                    type="mdi"
                    class="w-4 hh-4"
                  />
                </button>
              </div>
            </div>
          </div>
        </template>

        <template v-else-if="route.name === 'lectures-edit-lecture'">
          <h1 class="text-5xl font-black text-gray-900 dark:text-white mb-12">
            Edit Lecture
          </h1>
          <UploadLectureComponent :lecture="state.lecture" />
        </template>
      </div>
    </div>
  </main>
</template>

<script setup>
import { reactive, onMounted, ref } from 'vue'
import useUserStore from '@/stores/user'
import useLectureStore from '@/stores/lecture'
import {
  mdiHeart,
  mdiHeartOutline,
  mdiCommentOutline,
  mdiEyeOutline
} from '@mdi/js'

const user = useUserStore()
const lecture = useLectureStore()
const props = defineProps({
  lecture: {
    type: Object,
    required: true
  }
})
const videoEl = ref(null)
const state = reactive({
  lecture: null,
  loading: true,
  isLiked: false,
  secondsInVP: 0,
  timer: null
})

onMounted(async () => {
  state.isLiked = props.lecture.likes?.includes(user.user?.id)
  state.loading = false

  if (props.lecture.isReel) {
    window.addEventListener('scroll', () => {
      if (isInViewport()) {
        videoEl.value.play()
        startTimer()
      } else {
        videoEl.value.pause()
        stopTimer()
        updateViewTime()
      }
    })
  }
})

async function updateViewTime() {
  await lecture.updateViewTime(props.lecture.id, state.secondsInVP)
  state.secondsInVP = 0
}

function isInViewport() {
  // check if video tag is in viewport
  const { top, bottom } = videoEl.value.getBoundingClientRect()
  return top < window.innerHeight && bottom > 0
}

function startTimer() {
  if (state.timer) return
  state.timer = setInterval(() => {
    state.secondsInVP++
  }, 1000)
}

function stopTimer() {
  clearInterval(state.timer)
}
</script>

<template>
  <template v-if="state.loading">
    <div class="w-full py-12 flex justify-center text-gray-900 dark:text-white">
      <LoaderComponent size="lg" />
    </div>
  </template>
  <template v-else-if="props.lecture.isReel">
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-300 dark:border-gray-700 p-4 flex flex-col gap-4 cursor-pointer"
      @click="
        $router.push({
          name: 'lectures-lecture',
          params: { lectureId: props.lecture.id }
        })
      "
    >
      <div class="flex items-center">
        <h4 class="text-2xl flex-1 font-bold text-gray-900 dark:text-white">
          {{ props.lecture.title }}
        </h4>
        <div class="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            @click.stop="lecture.toggleLikeLecture(props.lecture.id)"
            class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
          >
            <svg-icon
              :path="state.isLiked ? mdiHeart : mdiHeartOutline"
              type="mdi"
              :class="{
                'text-red-500': state.isLiked
              }"
            />
            <span class="font-medium text-lg">{{
              props.lecture.likes?.length
            }}</span>
          </button>
          <button
            type="button"
            @click.stop="
              $router.push({
                name: 'lectures-lecture',
                params: { lectureId: props.lecture.id }
              })
            "
            class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
          >
            <svg-icon :path="mdiCommentOutline" type="mdi" />
            <span class="font-medium text-lg">{{
              props.lecture.comments?.length
            }}</span>
          </button>
          <div
            class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-r-md hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
          >
            <svg-icon :path="mdiEyeOutline" type="mdi" />
            <span class="font-medium text-lg">{{
              props.lecture.views || '0'
            }}</span>
          </div>
        </div>
      </div>
      <video
        :src="props.lecture.video"
        ref="videoEl"
        class="w-full h-full flex-shrink-0 object-fit rounded-lg"
        controls
        loop
      ></video>
      <div class="h-full">
        <p class="text-gray-700 dark:text-gray-300 mb-4">
          <template v-if="props.lecture.description.length > 500">
            {{ props.lecture.description.substring(0, 500) }}...
          </template>
          <template v-else>
            {{ props.lecture.description }}
          </template>
        </p>
        <div class="flex flex-wrap gap-2">
          <template v-for="t of props.lecture.tags" :key="t">
            <span
              class="bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300"
            >
              {{ t }}
            </span>
          </template>
        </div>
      </div>
    </div>
  </template>
  <template v-else-if="!props.lecture.isReel">
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-300 dark:border-gray-700 p-4 flex flex-col md:flex-row md:items-stretch gap-4 cursor-pointer"
      @click="
        $router.push({
          name: 'lectures-lecture',
          params: { lectureId: props.lecture.id }
        })
      "
    >
      <div class="w-full h-full flex-shrink-0 md:max-w-lg lg:max-w-xl">
        <img
          :src="props.lecture.thumbnail"
          class="w-full h-full object-fit rounded-lg"
          alt="Lecture Thumbnail"
        />
      </div>
      <div class="w-full h-full flex flex-col gap-4">
        <h4 class="text-lg font-medium text-gray-900 dark:text-white">
          {{ props.lecture.title }}
        </h4>
        <p class="flex-1 text-gray-700 dark:text-gray-300">
          <template v-if="props.lecture.description.length > 500">
            {{ props.lecture.description.substring(0, 500) }}...
          </template>
          <template v-else>
            {{ props.lecture.description }}
          </template>
        </p>
        <div class="flex flex-wrap gap-2">
          <template v-for="t of props.lecture.tags" :key="t">
            <span
              class="bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300"
            >
              {{ t }}
            </span>
          </template>
        </div>
        <div class="flex items-center gap-2">
          <div class="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              @click="lectures.toggleLikeLecture(props.lecture.id)"
              class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
            >
              <svg-icon
                :path="state.isLiked ? mdiHeart : mdiHeartOutline"
                type="mdi"
                :class="{
                  'text-red-500': state.isLiked
                }"
              />
              <span class="font-medium text-lg">{{
                props.lecture.likes?.length
              }}</span>
            </button>
            <button
              type="button"
              class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
            >
              <svg-icon :path="mdiCommentOutline" type="mdi" />
              <span class="font-medium text-lg">{{
                props.lecture.comments?.length
              }}</span>
            </button>
            <div
              class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-r-md hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
            >
              <svg-icon :path="mdiEyeOutline" type="mdi" />
              <span class="font-medium text-lg">{{ props.lecture.views }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>

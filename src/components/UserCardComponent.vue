<script setup>
const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div
    class="bg-white rounded-lg shadow-sm p-4 border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
  >
    <div class="flex flex-col items-start">
      <div class="flex items-start gap-4">
        <img
          :src="props.user.avatar_uri"
          class="w-12 h-12 rounded-full flex-shrink-0"
          alt="instructor image"
        />
        <div>
          <h6 class="text-lg font-bold text-gray-900 dark:text-white">
            @{{ props.user.handle }}
          </h6>
          <p class="text-gray-700 text-sm mb-4 dark:text-gray-300">
            {{ props.user.name }}
          </p>
        </div>
      </div>
      <p class="text-gray-800 text-base mb-4 dark:text-gray-200">
        {{ props.user.bio || 'No bio' }}
      </p>
      <p
        class="text-gray-700 text-sm flex mb-2 items-center gap-2 dark:text-gray-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          class="w-4 h-4 fill-current"
          width="24"
          height="24"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path
            d="M12 23.728l-6.364-6.364a9 9 0 1 1 12.728 0L12 23.728zm4.95-7.778a7 7 0 1 0-9.9 0L12 20.9l4.95-4.95zM12 13a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"
          />
        </svg>
        {{ props.user.location || 'No location' }}
      </p>
      <p
        class="text-gray-700 text-sm flex mb-2 items-center gap-2 dark:text-gray-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          class="w-4 h-4 fill-current"
          width="24"
          height="24"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path
            d="M3 18.5V5a3 3 0 0 1 3-3h14a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5A3.5 3.5 0 0 1 3 18.5zM19 20v-3H6.5a1.5 1.5 0 0 0 0 3H19zM5 15.337A3.486 3.486 0 0 1 6.5 15H19V4H6a1 1 0 0 0-1 1v10.337z"
          />
        </svg>
        <span v-if="props.user.education_level === 'Hs'"> Self-taught </span>
        <span v-if="props.user.education_level === 'Aa'"> Associate's</span>
        <span v-if="props.user.education_level === 'Ba'"> Bachelor's </span>
        <span v-if="props.user.education_level === 'Ma'"> Master's </span>
        <span v-if="props.user.education_level === 'Phd'"> Doctorate </span>
        in
        {{ props.user.education_major }}
      </p>
      <p
        class="text-gray-700 text-sm flex mb-6 items-center gap-2 dark:text-gray-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          class="w-4 h-4 fill-current"
          width="24"
          height="24"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path
            d="M7 5V2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4zM4 16v3h16v-3H4zm0-2h16V7H4v7zM9 3v2h6V3H9zm2 8h2v2h-2v-2z"
          />
        </svg>
        {{ props.user.occupation || 'No occupation' }}
      </p>
      <div class="mt-auto w-full flex justify-start">
        <button
          @click="
            $router.push({
              name: 'profile-about',
              params: { handle: props.user.handle }
            })
          "
          type="button"
          class="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        >
          View Profile
        </button>
      </div>
    </div>
  </div>
</template>

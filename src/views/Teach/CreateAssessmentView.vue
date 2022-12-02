<script setup>
import { reactive, watch, onMounted } from 'vue'
import NavbarComponent from '../../components/NavbarComponent.vue'

const data = reactive({
  title: null,
  instructions: null,
  questions: [],
  createdDate: new Date()
})
const state = reactive({
  selectedIndex: -1,
  autoSave: true
})

onMounted(() => {
  if (localStorage.getItem('questions')) {
    // show load questions dialog
  }
})

function addQuestion() {
  data.questions.push({
    question: '',
    answers: [
      { 0: 'Answer A' },
      { 1: 'Answer B' },
      { 2: 'Answer C' },
      { 3: 'Answer D' }
    ],
    correct: 0
  })
  state.selectedIndex = data.questions.length - 1
}
function deleteQuestion(index) {
  data.questions.splice(index, 1)
  state.selectedIndex = -1
}
function loadQuestions() {
  data.questions = JSON.parse(localStorage.getItem('questions'))
}

watch(
  () => data,
  (val) => {
    if (state.autoSave) {
      localStorage.setItem('questions', JSON.stringify(val.questions))
    }
  },
  { deep: true }
)
</script>

<template>
  <main class="bg-white dark:bg-slate-800">
    <div class="min-h-screen max-w-screen-xl mx-auto">
      <NavbarComponent />
      <div class="container mx-auto px-4 mt-6 mb-24">
        <h1 class="text-3xl font-bold mb-12 text-gray-800 dark:text-white">
          Create an Assessment
        </h1>
        <div
          class="flex w-full border rounded-lg mb-12 text-gray-800 border-gray-300 shadow-sm dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
        >
          <aside
            class="flex flex-col gap-1 w-64 p-2 overflow-y-auto rounded-l-lg border-r border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
          >
            <button
              type="button"
              @click="state.selectedIndex = -1"
              class="py-2.5 px-5 mb-4 text-sm font-medium text-gray-900 focus:outline-none bg-gray-50 rounded-lg border border-gray-300 hover:bg-gray-200 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              Assessment Details
            </button>
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-lg font-bold">Questions</h4>
              <button
                type="button"
                @click="addQuestion"
                class="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z" />
                </svg>
                <span class="sr-only">Add Question</span>
              </button>
            </div>
            <ul class="w-full divide-y divide-gray-300 dark:divide-gray-600">
              <li
                v-for="(q, idx) in data.questions"
                :key="q"
                @click="state.selectedIndex = idx"
                class="truncate text-ellipsis cursor-pointer hover:bg-gray-200 p-2.5 first:rounded-t-md last:rounded-b-md dark:hover:bg-gray-700"
                :class="{
                  'bg-gray-200 dark:bg-gray-700': idx === state.selectedIndex
                }"
              >
                Q{{ idx + 1 }} - {{ q.question }}
              </li>
            </ul>
          </aside>

          <!-- Details -->
          <div
            v-if="state.selectedIndex === -1"
            class="flex flex-col flex-1 gap-4 p-6"
          >
            <div>
              <label
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >Assessment Title</label
              >
              <input
                type="text"
                v-model="data.title"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
            <div>
              <label
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >Instructions</label
              >
              <textarea
                v-model="data.instructions"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                rows="4"
              ></textarea>
            </div>
            <div>
              <label
                for="randomize-questions"
                class="inline-flex relative items-center cursor-pointer"
              >
                <input
                  type="checkbox"
                  value=""
                  id="randomize-questions"
                  class="sr-only peer"
                  checked=""
                />
                <div
                  class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                ></div>
                <span
                  class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >Randomize question order</span
                >
              </label>
            </div>
            <div>
              <label
                for="randomize-order"
                class="inline-flex relative items-center cursor-pointer"
              >
                <input
                  type="checkbox"
                  value=""
                  id="randomize-order"
                  class="sr-only peer"
                  checked=""
                />
                <div
                  class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                ></div>
                <span
                  class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >Randomize answer order</span
                >
              </label>
            </div>
          </div>

          <!-- Active Question -->
          <div
            v-if="!!data.questions[state.selectedIndex]"
            class="flex flex-col flex-1 gap-4 p-6"
          >
            <div>
              <label
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >Question</label
              >
              <input
                type="text"
                v-model="data.questions[state.selectedIndex].question"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
            <div>
              <div class="flex items-center justify-between mb-2">
                <label
                  class="block text-sm font-medium text-gray-900 dark:text-gray-300"
                  >Answers</label
                >
                <label
                  class="block w-16 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >Correct</label
                >
              </div>
              <div class="flex flex-col gap-4 mb-4">
                <div
                  v-for="(a, idx) in data.questions[state.selectedIndex]
                    .answers"
                  :key="a"
                  class="flex gap-4"
                >
                  <div class="flex-1">
                    <input
                      type="text"
                      v-model="
                        data.questions[state.selectedIndex].answers[idx][idx]
                      "
                      :class="[
                        data.questions[state.selectedIndex].correct === idx
                          ? 'bg-green-50 border border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-green-500'
                          : 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 '
                      ]"
                    />
                  </div>
                  <div class="w-16 flex items-center">
                    <input
                      type="radio"
                      v-model="data.questions[state.selectedIndex].correct"
                      :value="idx"
                      class="mx-auto focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 dark:focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="flex items-center">
              <button
                type="button"
                @click="deleteQuestion(state.selectedIndex)"
                class="py-2 px-3 text-xs text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-center mr-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
              >
                Delete Question
              </button>
            </div>
          </div>
        </div>
        <code
          class="block h-96 overflow-y-auto p-4 text-white bg-gray-900 rounded-lg font-mono"
        >
          <pre>{{ JSON.stringify(data, null, 2) }}</pre>
        </code>
      </div>
    </div>
  </main>
</template>

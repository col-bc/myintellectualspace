<script setup>
import { onMounted, defineProps, defineEmits, reactive } from 'vue'

const props = defineProps({
  value: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: ''
  },
  error: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  }
})
const state = reactive({
  value: props.value,
  placeholder: props.placeholder,
  type: props.type,
  disabled: props.disabled,
  icon: props.icon
})

onMounted(() => {})
onUpdated(() => {
  if (props.value !== state.value) {
    state.value = props.value
  }
})

const emits = defineEmits(['update:value'])
</script>

<template>
  <div class="relative">
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
      {{ props.label }}
      <span v-if="props.required" class="text-red-500">*</span>
    </label>
    <input
      :value="state.value"
      :placeholder="state.placeholder"
      :type="state.type"
      :disabled="state.disabled"
      @input="
        ($event) => {
          state.value = $event.target.value
          emits('update:value', $event.target.value)
        }
      "
      class="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:placeholder-gray-400 dark:text-white"
      :class="{
        'border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500':
          !props.error,
        'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-red-600 dark:text-red-100 dark:placeholder-red-400 dark:focus:ring-red-500 dark:focus:border-red-500':
          props.error
      }"
    />
  </div>
</template>

<script setup>
import AlertComponent from '@/components/AlertComponent.vue'
import { reactive, onMounted } from 'vue'
import useUserStore from '@/stores/user'
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage'

const user = useUserStore()
const emit = defineEmits(['close'])
const state = reactive({
  error: null,
  companyName: '',
  companyDescription: '',
  companyWebsite: '',
  companyLogo: '',
  logoPreview: '',
  companyCity: '',
  companyState: '',
  companySize: 'default',
  companyIndustry: 'default',
  companyFounded: ''
})

onMounted(async () => {
  if (user.user.companyProfile) {
    state.companyName = user.user.companyProfile.name
    state.companyDescription = user.user.companyProfile.description
    state.companyWebsite = user.user.companyProfile.website
    state.companyLogo = user.user.companyProfile.logo
    state.companyCity = user.user.companyProfile.city
    state.companyState = user.user.companyProfile.state
    state.companySize = user.user.companyProfile.size
    state.companyIndustry = user.user.companyProfile.industry
    state.companyFounded = user.user.companyProfile.founded
  }
})

function validate() {
  state.error = null
  if (!state.companyName) {
    state.error = {
      message: 'Company name is required',
      type: 'error'
    }
    return false
  }
  if (!state.companyCity || !state.companyState) {
    state.error = {
      message: 'Company location is required',
      type: 'error'
    }
    return false
  }
  if (state.companySize === 'default') {
    state.error = {
      message: 'Company size is required',
      type: 'error'
    }
    return false
  }
  if (state.companyIndustry === 'default') {
    state.error = {
      message: 'Company industry is required',
      type: 'error'
    }
    return false
  }
  if (!state.companyFounded) {
    state.error = {
      message: 'Company founding year is required',
      type: 'error'
    }
    return false
  }
  return true
}
async function onSubmit() {
  if (!validate()) return
  delete state.error
  await user.updateUser({
    companyProfile: {
      name: state.companyName,
      description: state.companyDescription,
      website: state.companyWebsite,
      logo: state.companyLogo,
      city: state.companyCity,
      state: state.companyState,
      size: state.companySize,
      industry: state.companyIndustry,
      founded: state.companyFounded
    }
  })
  state.error = {
    message: 'Company profile updated',
    type: 'success'
  }
}

async function uploadImage(event) {
  const storage = getStorage()
  const storageRef = ref(storage, `company-logos/${user.user.uid}`)
  if (state.companyLogo) {
    await deleteObject(storageRef)
  }
  const file = event.target.files[0]
  await uploadBytes(storageRef, file).then(async (snapshot) => {
    state.companyLogo = await getDownloadURL(snapshot.ref)
  })
}
</script>

<template>
  <form @submit.prevent="onSubmit" class="flex flex-col gap-4">
    <AlertComponent
      v-if="state.error"
      :message="state.error.message"
      :type="state.error.type"
    />
    <p class="text-sm text-gray-500 dark:text-gray-400">
      <span class="align-super text-xs text-red-500">*</span> Required fields
    </p>
    <div>
      <label
        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Company name<span class="align-super text-xs text-red-500">*</span>
      </label>
      <input
        type="text"
        v-model="state.companyName"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Acme Inc."
      />
    </div>
    <div>
      <label
        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Company description</label
      >
      <textarea
        v-model="state.companyDescription"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        rows="4"
      ></textarea>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-300">
        {{ state.companyDescription.length }} / 500
      </p>
    </div>
    <div>
      <label
        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Company website</label
      >
      <input
        type="text"
        v-model="state.companyWebsite"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="https://example.com"
      />
    </div>
    <div>
      <label
        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Company logo</label
      >
      <img
        v-if="state.companyLogo"
        :src="state.companyLogo"
        class="w-32 h-32 mb-2 object-contain rounded-lg"
      />
      <input
        type="file"
        accept="image/*"
        @change="uploadImage($event)"
        class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
      />
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-300">
        SVG, PNG, JPG or GIF (MAX. 800x400px).
      </p>
    </div>
    <div>
      <label
        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Company location<span class="align-super text-xs text-red-500"
          >*</span
        ></label
      >
      <div class="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          v-model="state.companyCity"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Atlanta"
        />
        <input
          type="text"
          v-model="state.companyState"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Georgia"
        />
      </div>
    </div>
    <div>
      <label
        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Company size<span class="align-super text-xs text-red-500"
          >*</span
        ></label
      >
      <select
        v-model="state.companySize"
        class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
      >
        <option value="default" disabled>Choose a size</option>
        <option value="1-10">1-10</option>
        <option value="11-50">11-50</option>
        <option value="51-200">51-200</option>
        <option value="201-500">201-500</option>
        <option value="501-1000">501-1000</option>
        <option value="1001-5000">1001-5000</option>
        <option value="5001-10000">5001-10000</option>
        <option value="10001+">10001+</option>
      </select>
    </div>
    <div>
      <label
        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Company industry<span class="align-super text-xs text-red-500">*</span>
      </label>
      <select
        v-model="state.companyIndustry"
        class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
      >
        <option value="default" disabled>Choose an industry</option>
        <option value="Agriculture">Agriculture</option>
        <option value="Automotive">Automotive</option>
        <option value="Banking">Banking</option>
        <option value="Construction">Construction</option>
        <option value="Education">Education</option>
        <option value="Energy">Energy</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Fashion">Fashion</option>
        <option value="Finance">Finance</option>
        <option value="Food">Food</option>
        <option value="Healthcare">Healthcare</option>
        <option value="Hospitality">Hospitality</option>
        <option value="Insurance">Insurance</option>
        <option value="Manufacturing">Manufacturing</option>
        <option value="Media">Media</option>
        <option value="Real Estate">Real Estate</option>
        <option value="Retail">Retail</option>
        <option value="Technology">Technology</option>
        <option value="Telecommunications">Telecommunications</option>
        <option value="Transportation">Transportation</option>
        <option value="Travel">Travel</option>
      </select>
    </div>
    <div>
      <label
        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Year founded<span class="align-super text-xs text-red-500"
          >*</span
        ></label
      >
      <input
        type="number"
        v-model="state.companyFounded"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="2000"
      />
    </div>

    <div
      class="flex flex-col-reverse md:flex-row items-center justify-center gap-4 mt-4"
    >
      <button
        type="submit"
        class="w-full text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg px-5 py-2.5 text-center mr-2"
      >
        Save
      </button>
      <button
        type="reset"
        @click="emit('close')"
        class="w-full text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
      >
        Close
      </button>
    </div>
  </form>
</template>

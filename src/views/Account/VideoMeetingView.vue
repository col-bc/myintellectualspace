<script setup>
import AgoraRTC from 'agora-rtc-sdk-ng'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import useUserStore from '@/stores/user'
import useInterface from '@/stores/interface'
import LoaderComponent from '@/components/LoaderComponent.vue'
import AlertComponent from '@/components/AlertComponent.vue'
import { useRoute, useRouter } from 'vue-router'
import { Menu, MenuButton, MenuItem, MenuItems, Dialog } from '@headlessui/vue'
import { v4 as uuidv4 } from 'uuid'

const user = useUserStore()
const ui = useInterface()
const route = useRoute()
const router = useRouter()
const agoraEngine = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })

var options = {
  // Pass your App ID here.
  appId: 'b55dcd329c7b4f5c8e02d6b394c88c89',
  // Set the channel name.
  channel: '',
  // Pass your temp token here.
  token: '',
  // Set the user ID.
  uid: 0
}
var channelParameters = {
  // A variable to hold a local audio track.
  localAudioTrack: null,
  // A variable to hold a local video track.
  localVideoTrack: null,
  // A variable to hold a remote audio track.
  remoteAudioTrack: null,
  // A variable to hold a remote video track.
  remoteVideoTrack: null,
  // A variable to hold the remote user id.s
  remoteUid: null
}
const state = reactive({
  enableVideo: true,
  enableAudio: true,
  loading: true,
  error: null,
  showMenu: false,
  quality: {
    up: 0,
    down: 0
  },
  timer: 0,
  showLeaveDialog: false,
  notifications: []
})

const remotePlayerContainer = document.createElement('div')
const localPlayerContainer = document.createElement('div')

onMounted(async () => {
  state.error = null
  // Get the App ID and channel name from the URL.
  console.log(route.params)
  options.channel = route.params.channel
  // Get a token from the Agora Token Server.
  options.token = await getToken()
  // Join the channel.
  await startBasicCall()
  // start timer
  setInterval(() => {
    state.timer++
  }, 1000)
  await onJoinMeeting()
  // Enable dual-stream mode.
  agoraEngine.enableDualStream()
  state.loading = false
})

watch(
  () => state.notifications,
  (notifications) => {
    if (notifications.length > 0) {
      setTimeout(() => {
        state.notifications.shift()
      }, 5000)
    }
  },
  { deep: true }
)

const resolveTimer = computed(() => {
  const minutes = Math.floor(state.timer / 60)
  const seconds = state.timer % 60
  return `${minutes < 10 ? '0' + minutes : minutes}:${
    seconds < 10 ? '0' + seconds : seconds
  }`
})

async function getToken() {
  const TOKEN_URL = `http://127.0.0.1:8000/token/${options.channel}`
  const { token } = await fetch(TOKEN_URL, {
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  })
    .then((res) => {
      if (res.ok) {
        return res.json()
      } else {
        throw new Error('Token request returned non 200 status code.')
      }
    })
    .catch((err) => {
      console.log(err)
    })

  console.log(token)
  return token
}
async function startBasicCall() {
  // Specify the ID of the DIV container. You can use the uid of the local user.
  localPlayerContainer.id = options.uid
  // Set the local video container size.
  localPlayerContainer.style.width = '100%'
  localPlayerContainer.style.height = '100%'
  // Set the remote video container size.
  remotePlayerContainer.style.width = '100%'
  remotePlayerContainer.style.height = '100%'

  // Listen for the "user-published" event to retrieve a AgoraRTCRemoteUser object.
  agoraEngine.on('user-published', async (user, mediaType) => {
    // Subscribe to the remote user when the SDK triggers the "user-published" event.
    await agoraEngine.subscribe(user, mediaType)
    console.log('subscribe success')
    // Subscribe and play the remote video in the container If the remote user publishes a video trauserck.
    if (mediaType == 'video') {
      // Retrieve the remote video track.
      channelParameters.remoteVideoTrack = user.videoTrack
      // Retrieve the remote audio track.
      channelParameters.remoteAudioTrack = user.audioTrack
      // Save the remote user id for reuse.
      channelParameters.remoteUid = user.uid.toString()
      // Specify the ID of the DIV container. You can use the uid of the remote user.
      remotePlayerContainer.id = user.uid.toString()
      channelParameters.remoteUid = user.uid.toString()
      remotePlayerContainer.textContent = 'Remote user ' + user.uid.toString()
      // Append the remote container to the remote-container element.
      document.querySelector('#remote-container').append(remotePlayerContainer)
      // Play the remote video track.
      channelParameters.remoteVideoTrack.play(remotePlayerContainer)
    }
    // Subscribe and play the remote audio track If the remote user publishes the audio track only.
    if (mediaType == 'audio') {
      // Get the RemoteAudioTrack object in the AgoraRTCRemoteUser object.
      channelParameters.remoteAudioTrack = user.audioTrack
      // Play the remote audio track. No need to pass any DOM element.
      channelParameters.remoteAudioTrack.play()
    }
    console.log(user)
  })
  // Listen for the "user-unpublished" event.
  agoraEngine.on('user-unpublished', (user) => {
    console.log(user.uid + 'has left the channel')
  })

  // Get the uplink network condition
  agoraEngine.on('network-quality', (quality) => {
    state.quality.up = quality.uplinkNetworkQuality
    state.quality.down = quality.downlinkNetworkQuality
  })
}
async function onJoinMeeting() {
  // Join a channel.
  await agoraEngine.join(
    options.appId,
    options.channel,
    options.token || null,
    options.uid
  )
  try {
    // Create a local audio track from the audio sampled by a microphone.
    channelParameters.localAudioTrack =
      await AgoraRTC.createMicrophoneAudioTrack()
  } catch (error) {
    state.error =
      'Microphone access is required to join the meeting. Please update your browser settings and try again.'
  }
  try {
    // Create a local video track from the video captured by a camera.
    channelParameters.localVideoTrack = await AgoraRTC.createCameraVideoTrack()
  } catch (error) {
    state.error =
      'Camera access is required to join the meeting Please update your browser settings and try again.'
  }
  // Append the local video container to the local container element.
  document.querySelector('#local-player').append(localPlayerContainer)
  // Publish the local audio and video tracks in the channel.
  await agoraEngine.publish([
    channelParameters.localAudioTrack,
    channelParameters.localVideoTrack
  ])
  // Play the local video track.
  channelParameters.localVideoTrack.play(localPlayerContainer)
  state.notifications.push({
    id: uuidv4(),
    type: 'default',
    message: 'You have joined meeting ' + options.channel
  })
  console.log('publish success!')
}
async function onLeaveMeeting() {
  // Destroy the local audio and video tracks.
  channelParameters.localAudioTrack.close()
  channelParameters.localVideoTrack.close()
  // Close the video/audio

  // Remove the containers you created for the local video and remote video.
  removeVideoDiv(remotePlayerContainer.id)
  removeVideoDiv(localPlayerContainer.id)
  // Leave the channel
  await agoraEngine.leave()
  console.log('You left the channel')
  router.push('/my-meetings')
}
function removeVideoDiv(elementId) {
  // Remove the video stream from the container.
  console.log('Removing ' + elementId + 'Div')
  let Div = document.getElementById(elementId)
  if (Div) {
    Div.remove()
  }
}

function reset() {
  window.location.reload()
}

function toggleAudio() {
  state.enableAudio = !state.enableAudio
  channelParameters.localAudioTrack.setEnabled(state.enableAudio)
  state.notifications.push({
    id: uuidv4(),
    type: 'default',
    message: state.enableAudio
      ? 'You have unmuted your microphone'
      : 'You have muted your microphone'
  })
}
function toggleVideo() {
  state.enableVideo = !state.enableVideo
  channelParameters.localVideoTrack.setEnabled(state.enableVideo)
  document.querySelector('#local-player video').style.display =
    state.enableVideo ? 'block' : 'none'
  state.notifications.push({
    id: uuidv4(),
    type: 'default',
    message: state.enableVideo
      ? 'You have turned on your camera'
      : 'You have turned off your camera'
  })
}

async function copyLink() {
  const text = `https://my-intellectual-space.web.app/meeting/join/${options.channel}`
  try {
    await navigator.clipboard.writeText(text)
    state.notifications.push({
      id: uuidv4(),
      type: 'default',
      message: 'Meeting link copied to clipboard'
    })
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}

function resolveQuality(q) {
  if (q === 1) return 'Excellent'
  if (q === 2) return 'Good'
  if (q === 3) return 'Poor'
  if (q === 4) return 'Bad'
  return 'Unknown'
}
</script>

<template>
  <main class="bg-white dark:bg-slate-800">
    <div
      v-if="!state.error"
      class="min-h-screen flex flex-col container max-w-screen-xl mx-auto"
    >
      <nav
        class="flex-none p-2 flex items-center flex-wrap gap-4 shadow-lg border-b border-gray-300 dark:border-gray-700"
      >
        <button
          type="button"
          @click="state.showLeaveDialog = true"
          class="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm p-2.5 text-center dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6 fill-current"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path
              d="M4 18h2v2h12V4H6v2H4V3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3zm2-7h7v2H6v3l-5-4 5-4v3z"
            />
          </svg>
        </button>
        <h2
          class="flex-1 md:flex-none flex items-center mr-auto md:mr-6 text-gray-900 dark:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="fill-current h-8 w-8 mr-3"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path fill="none" d="M0 0H24V24H0z" />
            <path
              d="M11 2c4.068 0 7.426 3.036 7.934 6.965l2.25 3.539c.148.233.118.58-.225.728L19 14.07V17c0 1.105-.895 2-2 2h-1.999L15 22H6v-3.694c0-1.18-.436-2.297-1.244-3.305C3.657 13.631 3 11.892 3 10c0-4.418 3.582-8 8-8zm0 5c-.552 0-1 .448-1 1v.999L9 9c-.552 0-1 .448-1 1s.448 1 1 1l1-.001V12c0 .552.448 1 1 1s1-.448 1-1v-1h1c.552 0 1-.448 1-1s-.448-1-1-1h-1V8c0-.552-.448-1-1-1z"
            />
          </svg>
          <span
            class="hidden md:block self-center text-xl font-bold whitespace-nowrap"
            >Intellectual Space</span
          >
          <span
            class="block md:hidden self-center text-xl font-bold whitespace-nowrap"
            >MIS</span
          >
        </h2>
        <h5
          class="text-2xl tracking-widest uppercase text-gray-900 dark:text-white font-bold font-mono md:flex-1 md:text-center"
        >
          {{ route.params.channel }}
        </h5>
        <!-- Timer -->
        <div
          class="px-5 py-2.5 flex items-center text-gray-700 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6 fill-gray-800 dark:fill-gray-100 mr-2.5"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path
              d="M17.618 5.968l1.453-1.453 1.414 1.414-1.453 1.453a9 9 0 1 1-1.414-1.414zM12 20a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM11 8h2v6h-2V8zM8 1h8v2H8V1z"
            />
          </svg>
          {{ resolveTimer }}
        </div>
        <!-- Quality -->
        <div
          class="relative group border-r border-gray-200 dark:border-gray-700"
        >
          <div class="px-5 py-2.5 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-6 h-6 fill-gray-800 dark:fill-gray-100 mr-2.5"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path fill="none" d="M0 0L24 0 24 24 0 24z" />
              <path
                d="M3.929 4.929l1.414 1.414C3.895 7.791 3 9.791 3 12c0 2.21.895 4.21 2.343 5.657L3.93 19.07C2.119 17.261 1 14.761 1 12s1.12-5.261 2.929-7.071zm16.142 0C21.881 6.739 23 9.239 23 12s-1.12 5.262-2.929 7.071l-1.414-1.414C20.105 16.209 21 14.209 21 12s-.895-4.208-2.342-5.656L20.07 4.93zM13 5v6h3l-5 8v-6H8l5-8zM6.757 7.757l1.415 1.415C7.448 9.895 7 10.895 7 12c0 1.105.448 2.105 1.172 2.828l-1.415 1.415C5.672 15.157 5 13.657 5 12c0-1.657.672-3.157 1.757-4.243zm10.487.001C18.329 8.844 19 10.344 19 12c0 1.657-.672 3.157-1.757 4.243l-1.415-1.415C16.552 14.105 17 13.105 17 12c0-1.104-.447-2.104-1.17-2.827l1.414-1.415z"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-6 h-6"
              :class="{
                'fill-green-500': state.quality.up === 1,
                'fill-yellow-500': state.quality.up === 2,
                'fill-orange-500': state.quality.up === 3,
                'fill-red-500': state.quality.up === 4,
                'fill-gray-500': state.quality.up === 0
              }"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path d="M13 12h7l-8 8-8-8h7V4h2z" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-6 h-6"
              :class="{
                'fill-green-500': state.quality.down === 1,
                'fill-yellow-500': state.quality.down === 2,
                'fill-orange-500': state.quality.down === 3,
                'fill-red-500': state.quality.down === 4,
                'fill-gray-500': state.quality.down === 0
              }"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path d="M13 12v8h-2v-8H4l8-8 8 8z" />
            </svg>
          </div>
          <div
            class="hidden group-hover:block absolute z-30 right-0 w-52 mt-4 bg-white border border-gray-200 dark:border-gray-700 rounded shadow-lg dark:bg-gray-700 py-1 text-sm text-gray-700 dark:text-gray-200"
          >
            <h6 class="px-4 py-2 text-gray-900 dark:text-white font-bold">
              Stream Quality
            </h6>
            <div
              class="flex flex-col text-gray-700 dark:text-gray-400 px-4 py-2 gap-2"
            >
              <span class="font-bold">
                Upload:
                <span
                  class="ml-2 font-normal"
                  :class="{
                    'text-green-500': state.quality.up === 1,
                    'text-yellow-500': state.quality.up === 2,
                    'text-orange-500': state.quality.up === 3,
                    'text-red-500': state.quality.up === 4
                  }"
                  >{{ resolveQuality(state.quality.up) }}</span
                >
              </span>
              <span class="font-bold">
                Download:
                <span
                  class="ml-2"
                  :class="{
                    'text-green-500': state.quality.down === 1,
                    'text-yellow-500': state.quality.down === 2,
                    'text-orange-500': state.quality.down === 3,
                    'text-red-500': state.quality.down === 4
                  }"
                  >{{ resolveQuality(state.quality.down) }}</span
                >
              </span>
            </div>
          </div>
        </div>
        <Menu as="div" class="relative">
          <MenuButton
            as="button"
            type="button"
            class="text-gray-800 hover:text-gray-900 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-400 font-medium rounded-lg text-sm p-2.5 text-center dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-6 h-6 fill-current"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path
                d="M12 3c-.825 0-1.5.675-1.5 1.5S11.175 6 12 6s1.5-.675 1.5-1.5S12.825 3 12 3zm0 15c-.825 0-1.5.675-1.5 1.5S11.175 21 12 21s1.5-.675 1.5-1.5S12.825 18 12 18zm0-7.5c-.825 0-1.5.675-1.5 1.5s.675 1.5 1.5 1.5 1.5-.675 1.5-1.5-.675-1.5-1.5-1.5z"
              />
            </svg>
          </MenuButton>
          <MenuItems
            as="div"
            class="absolute z-30 right-0 w-52 mt-4 bg-white border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-600 rounded shadow-lg dark:bg-gray-700 py-1 text-sm text-gray-700 dark:text-gray-200"
          >
            <MenuItem
              as="button"
              @click="ui.toggleTheme"
              class="flex items-center gap-2.5 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg
                v-if="ui.getIsDark"
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 fill-current"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path fill="none" d="M0 0h24v24H0z" />
                <path
                  d="M10 7a7 7 0 0 0 12 4.9v.1c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2h.1A6.979 6.979 0 0 0 10 7zm-6 5a8 8 0 0 0 15.062 3.762A9 9 0 0 1 8.238 4.938 7.999 7.999 0 0 0 4 12z"
                />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 fill-current"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path fill="none" d="M0 0h24v24H0z" />
                <path
                  d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z"
                />
              </svg>
              Change Theme
            </MenuItem>
            <MenuItem
              as="button"
              @click="copyLink"
              class="flex items-center gap-2.5 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 fill-current"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path fill="none" d="M0 0h24v24H0z" />
                <path
                  d="M7 6V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-3v3c0 .552-.45 1-1.007 1H4.007A1.001 1.001 0 0 1 3 21l.003-14c0-.552.45-1 1.007-1H7zM5.003 8L5 20h10V8H5.003zM9 6h8v10h2V4H9v2z"
                />
              </svg>
              Copy Link
            </MenuItem>
            <MenuItem
              as="button"
              class="flex items-center gap-2.5 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 fill-current"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path fill="none" d="M0 0h24v24H0z" />
                <path
                  d="M2 22a8 8 0 1 1 16 0h-2a6 6 0 1 0-12 0H2zm8-9c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm8.284 3.703A8.002 8.002 0 0 1 23 22h-2a6.001 6.001 0 0 0-3.537-5.473l.82-1.824zm-.688-11.29A5.5 5.5 0 0 1 21 8.5a5.499 5.499 0 0 1-5 5.478v-2.013a3.5 3.5 0 0 0 1.041-6.609l.555-1.943z"
                />
              </svg>
              Manage participants
            </MenuItem>
          </MenuItems>
        </Menu>
      </nav>
      <!-- Content -->
      <div
        class="relative flex-1 container max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2"
      >
        <!-- notifications -->
        <template v-if="state.notifications.length">
          <div class="absolute top-6 right-6 z-20">
            <AlertComponent
              v-for="n in state.notifications"
              :key="n.id"
              :message="n.message"
              :type="n.type"
              class="shadow-lg mb-4"
            />
          </div>
        </template>
        <!-- Local player -->
        <div
          class="flex-1 flex items-center justify-center p-4 border-b md:border-b-0 md:border-r border-gray-300 dark:border-gray-700"
          id="local-player"
        >
          <LoaderComponent v-if="state.loading" size="lg" />
        </div>
        <!-- Remote player -->
        <div
          class="flex-1 flex flex-wrap items-start p-4"
          id="remote-container"
        ></div>
        <!-- Toolbar -->
        <div
          class="absolute z-10 bottom-6 w-full left-0 right-0 flex items-center justify-center"
          role="group"
        >
          <div
            class="inline-flex rounded-full shadow-lg items-center justify-center"
          >
            <button
              type="button"
              @click="toggleAudio"
              class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-full hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
            >
              <template v-if="!state.enableAudio">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5 mr-3 fill-current"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path
                    d="M12 3a3 3 0 0 0-3 3v4a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zm0-2a5 5 0 0 1 5 5v4a5 5 0 0 1-10 0V6a5 5 0 0 1 5-5zM3.055 11H5.07a7.002 7.002 0 0 0 13.858 0h2.016A9.004 9.004 0 0 1 13 18.945V23h-2v-4.055A9.004 9.004 0 0 1 3.055 11z"
                  />
                </svg>
                Unmute
              </template>
              <template v-else>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5 mr-3 fill-current"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path
                    d="M16.425 17.839A8.941 8.941 0 0 1 13 18.945V23h-2v-4.055A9.004 9.004 0 0 1 3.055 11H5.07a7.002 7.002 0 0 0 9.87 5.354l-1.551-1.55A5 5 0 0 1 7 10V8.414L1.393 2.808l1.415-1.415 19.799 19.8-1.415 1.414-4.767-4.768zm-7.392-7.392l2.52 2.52a3.002 3.002 0 0 1-2.52-2.52zm10.342 4.713l-1.443-1.442c.509-.81.856-1.73.997-2.718h2.016a8.95 8.95 0 0 1-1.57 4.16zm-2.91-2.909l-1.548-1.548c.054-.226.083-.46.083-.703V6a3 3 0 0 0-5.818-1.032L7.686 3.471A5 5 0 0 1 17 6v4a4.98 4.98 0 0 1-.534 2.251z"
                  />
                </svg>
                Mute
              </template>
            </button>
            <button
              type="button"
              @click="toggleVideo"
              class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
            >
              <template v-if="state.enableVideo">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5 mr-3 fill-current"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path
                    d="M9.828 5l-2 2H4v12h16V7h-3.828l-2-2H9.828zM9 3h6l2 2h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4l2-2zm3 15a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11zm0-2a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"
                  />
                </svg>
                Disable video
              </template>
              <template v-else>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5 mr-3 fill-current"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path
                    d="M19.586 21H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h.586L1.393 2.808l1.415-1.415 19.799 19.8-1.415 1.414L19.586 21zm-14-14H4v12h13.586l-2.18-2.18A5.5 5.5 0 0 1 7.68 9.094L5.586 7zm3.524 3.525a3.5 3.5 0 0 0 4.865 4.865L9.11 10.525zM22 17.785l-2-2V7h-3.828l-2-2H9.828l-.307.307-1.414-1.414L9 3h6l2 2h4a1 1 0 0 1 1 1v11.786zM11.263 7.05a5.5 5.5 0 0 1 6.188 6.188l-2.338-2.338a3.515 3.515 0 0 0-1.512-1.512l-2.338-2.338z"
                  />
                </svg>
                Enable video
              </template>
            </button>
            <button
              type="button"
              class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-r-full hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 mr-3 fill-current"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path fill="none" d="M0 0h24v24H0z" />
                <path
                  d="M13 7.22L9.603 10H6v4h3.603L13 16.78V7.22zM8.889 16H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h3.889l5.294-4.332a.5.5 0 0 1 .817.387v15.89a.5.5 0 0 1-.817.387L8.89 16zm9.974.591l-1.422-1.422A3.993 3.993 0 0 0 19 12c0-1.43-.75-2.685-1.88-3.392l1.439-1.439A5.991 5.991 0 0 1 21 12c0 1.842-.83 3.49-2.137 4.591z"
                />
              </svg>
              Volume
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Error state -->
    <div
      v-else
      class="min-h-screen container max-w-screen-xl mx-auto flex items-center justify-center h-full"
    >
      <div class="flex flex-col items-center gap-6 md:gap-12">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-24 h-24 fill-red-700 dark:fill-red-400"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path
            d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z"
          />
        </svg>
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white">
          An error occurred
        </h1>
        <p
          class="text-xl text-center leading-loose text-gray-700 dark:text-gray-300"
        >
          {{ state.error }}
        </p>
        <div>
          <button
            type="button"
            @click="reset"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Reload
          </button>
          <button
            type="button"
            @click="$router.push('/')"
            class="py-2.5 px-5 ml-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            Go to homepage
          </button>
        </div>
      </div>
    </div>

    <!-- Confirm quit dialog -->
    <Dialog
      :open="state.showLeaveDialog"
      @close="state.showLeaveDialog = false"
      class="relative z-10"
    >
      <div class="fixed inset-0 bg-black bg-opacity-60" />
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <div
            class="w-full max-w-lg flex flex-col p-6 bg-white rounded-lg shadow dark:bg-gray-700"
          >
            <div
              class="text-white mb-6 block w-auto mx-auto p-4 rounded-full shadow-lg shadow-purple-400/30 bg-gradient-to-br from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 dark:text-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-24 h-24 fill-current"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path fill="none" d="M0 0h24v24H0z" />
                <path
                  d="M4 18h2v2h12V4H6v2H4V3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3zm2-7h7v2H6v3l-5-4 5-4v3z"
                />
              </svg>
            </div>
            <h2
              class="text-2xl font-bold text-center mb-12 text-gray-900 dark:text-white"
            >
              Are you sure you want to leave?
            </h2>

            <div
              class="flex flex-col-reverse md:flex-row items-center justify-center gap-4"
            >
              <button
                type="submit"
                @click="state.showLeaveDialog = false"
                class="w-full text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg px-5 py-2.5 text-center mr-2"
              >
                Cancel
              </button>
              <button
                type="reset"
                @click="onLeaveMeeting"
                class="w-full text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  </main>
</template>

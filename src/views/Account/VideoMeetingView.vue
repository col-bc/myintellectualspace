<script setup>
import AlertComponent from '@/components/AlertComponent.vue'
import LoaderComponent from '@/components/LoaderComponent.vue'
import useInterface from '@/stores/interface'
import useUserStore from '@/stores/user'
import { Dialog, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import AgoraRTC from 'agora-rtc-sdk-ng'
import IntroJs from 'intro.js'
import 'intro.js/introjs.css'
import { v4 as uuidv4 } from 'uuid'
import { computed, onBeforeUnmount, onMounted, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  mdiLogoutVariant,
  mdiContentCopy,
  mdiTimerOutline,
  mdiSignal,
  mdiArrowUpThin,
  mdiArrowDownThin,
  mdiToolboxOutline,
  mdiPresentation,
  mdiLinkVariant,
  mdiUploadOutline,
  mdiGridLarge,
  mdiDotsVertical,
  mdiWeatherSunny,
  mdiWeatherNight
} from '@mdi/js'

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
  isScreenShare: false,
  quality: {
    up: 0,
    down: 0
  },
  volume: {
    local: 0,
    remote: 0
  },
  timer: 0,
  showLeaveDialog: false,
  notifications: [],
  view: 'split' // split, or stacked
})

const remotePlayerContainer = document.createElement('div')
const localPlayerContainer = document.createElement('div')

onMounted(async () => {
  state.error = null
  // Get the App ID and channel name from the URL.
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

  // check if user has completed tutorial
  if (localStorage.getItem('video-tutorial') != true) {
    IntroJs()
      .setOptions({
        steps: [
          {
            intro:
              'Welcome to the video meeting room! This is a quick tutorial to help you get started.'
          },
          {
            element: '#meeting-id',
            intro:
              'This is the meeting ID. You can share this with others to invite them to the meeting.'
          },
          {
            element: '#toggle-audio',
            intro:
              'Click here to toggle your audio on and off. You can also use the shortcut key "m".',
            position: 'top'
          },
          {
            element: '#toggle-video',
            intro:
              'Click here to toggle your video on and off. You can also use the shortcut key "v".'
          },
          {
            element: '#volume-menu',
            intro:
              'Click here to adjust the volume of your audio and the remote audio.'
          },
          {
            element: '#timer',
            intro: 'This is the amount of time you have been in the meeting.'
          },
          {
            element: '#quality',
            intro:
              'This is the quality of the connection to the streaming server. You can see the upload and download quality.'
          },
          {
            element: '#tools-menu',
            intro:
              'Click here to access the tools menu. You can use this to share your screen, share files, or update your view.'
          },
          {
            element: '#leave-meeting',
            intro: 'When you are done, click here to leave the meeting.'
          },
          {
            title: 'That is it!',
            intro:
              'You are now ready to use the video meeting room. If you need to see this tutorial again, you can access it from the vertical dots menu on the nav bar.'
          }
        ],
        showStepNumbers: false,
        dontShowAgain: true,
        keyboardNavigation: true
      })
      .start()
  }

  // add event listeners
  window.addEventListener('keydown', (e) => {
    if (e.key == 'm') {
      toggleAudio()
    } else if (e.key == 'v') {
      toggleVideo()
    }
  })

  window.addEventListener('beforeunload', (e) => {
    e.preventDefault()
    e.returnValue = ''
    const confirmExit = () => window.confirm('Are you sure you want to leave?')
    if (confirmExit()) {
      onLeaveMeeting()
    }
  })
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
watch(
  () => state.volume,
  (volume) => {
    channelParameters.localAudioTrack.setVolume(parseInt(volume.local))
    channelParameters.remoteAudioTrack?.setVolume(parseInt(volume.remote))
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
  const TOKEN_URL = `https://my-intellectual-space.ue.r.appspot.com/token/${options.channel}?identity=${user.user.uid}`
  const { token } = await fetch(TOKEN_URL, {
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  })
    .then(async (res) => {
      if (res.ok) {
        return await res.json()
      } else {
        throw new Error('Video token request returned non 200 status code.')
      }
    })
    .catch((err) => {
      console.log(err)
    })

  console.log('token: ', token)
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
      state.volume.remote = 100
      state.volume.local = 100
    }
    // add notification
    state.notifications.push({
      type: 'primary',
      message: `${user.uid} has joined the channel`
    })
  })
  // Listen for the "user-unpublished" event.
  agoraEngine.on('user-unpublished', (user) => {
    // Stop playing the remote audio and video when the SDK triggers the "user-unpublished" event.
    channelParameters.remoteVideoTrack.stop()
    channelParameters.remoteAudioTrack.stop()
    // Remove the remote container from the DOM.
    document
      .querySelector('#remote-container')
      .removeChild(remotePlayerContainer)
    state.notifications.push({
      type: 'error',
      message: `${user.uid} has left the channel`
    })
  })

  // Get the uplink network condition
  agoraEngine.on('network-quality', (quality) => {
    state.quality.up = quality.uplinkNetworkQuality
    state.quality.down = quality.downlinkNetworkQuality
  })
}
async function onJoinMeeting() {
  // Join a channel.
  console.log('joining channel. token: ', options.token)
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
    type: 'primary',
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

  // TODO: add meeting duration to recentMeetings in local storage
  window.close()
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
async function copyChannel() {
  const text = options.channel
  try {
    await navigator.clipboard.writeText(text)
    state.notifications.push({
      id: uuidv4(),
      type: 'default',
      message: 'Meeting ID copied to clipboard'
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
async function toggleScreenShare() {
  if (state.isScreenShare == false) {
    // Create a screen track for screen sharing.
    channelParameters.screenTrack = await AgoraRTC.createScreenVideoTrack()
    // Stop playing the local video track.
    channelParameters.localVideoTrack.stop()
    // Unpublish the local video track.
    await agoraEngine.unpublish(channelParameters.localVideoTrack)
    // Publish the screen track.
    await agoraEngine.publish(channelParameters.screenTrack)
    // Play the screen track on local container.
    channelParameters.screenTrack.play(localPlayerContainer)
    // Update the screen sharing state.
    state.isScreenShare = true
  } else {
    // Stop playing the screen track.
    channelParameters.screenTrack.stop()
    // Unpublish the screen track.
    await agoraEngine.unpublish(channelParameters.screenTrack)
    // Publish the local video track.
    await agoraEngine.publish(channelParameters.localVideoTrack)
    // Play the local video on the local container.
    channelParameters.localVideoTrack.play(localPlayerContainer)
    // Update the screen sharing state.
    state.isScreenShare = false
  }
}
</script>

<template>
  <main class="bg-white dark:bg-slate-800">
    <div
      v-if="!state.error"
      class="min-h-screen flex flex-col container max-w-screen-xl mx-auto"
    >
      <nav
        class="flex-none p-2 flex items-center flex-wrap gap-2 md:gap-4 shadow-lg border-b border-gray-300 dark:border-gray-700"
      >
        <button
          id="leave-meeting"
          type="button"
          @click="state.showLeaveDialog = true"
          class="flex items-center justify-center gap-2.5 text-gray-800 hover:text-gray-900 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-400 font-medium rounded-lg text-sm py-2.5 px-5 text-center dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        >
          <svg-icon :path="mdiLogoutVariant" type="mdi" />
          <span class="hidden md:block">LEAVE MEETING</span>
        </button>
        <h5
          id="meeting-id"
          class="flex-1 flex items-center justify-start gap-2 text-2xl tracking-widest uppercase text-gray-900 dark:text-white font-bold font-mono md:flex-1 md:text-center border-l border-gray-300 dark:border-gray-700 pl-4"
        >
          {{ route.params.channel }}
          <button
            type="button"
            @click="copyChannel"
            class="text-gray-700 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-400 p-2 focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-lg"
          >
            <svg-icon
              :path="mdiContentCopy"
              type="mdi"
              class="w-4 h-4 fill-current"
            />
          </button>
        </h5>

        <!-- End scree share -->
        <button
          v-if="state.isScreenShare"
          type="button"
          @click="toggleScreenShare"
          class="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
        >
          End Screen Share
        </button>
        <!-- Timer -->
        <div
          id="timer"
          class="px-5 py-2.5 flex items-center text-gray-700 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700"
        >
          <svg-icon
            :path="mdiTimerOutline"
            type="mdi"
            class="hidden md:block"
          />
          {{ resolveTimer }}
        </div>
        <!-- Quality -->
        <Menu
          as="div"
          id="quality"
          class="relative border-r border-gray-200 dark:border-gray-700"
        >
          <MenuButton
            class="flex items-center justify-center mr-2 md:mr-4 text-gray-800 hover:text-gray-900 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-400 font-medium rounded-lg text-sm py-2.5 px-5 text-center dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          >
            <svg-icon
              :path="mdiSignal"
              type="mdi"
              class="w-6 h-6 fill-gray-800 dark:fill-gray-100 mr-2.5"
            />
            <svg-icon
              :path="mdiArrowUpThin"
              type="mdi"
              class="w-6 h-6 hidden md:block"
              :class="{
                'fill-green-500': state.quality.up === 1,
                'fill-lime-500': state.quality.up === 2,
                'fill-yellow-500': state.quality.up === 3,
                'fill-red-500': state.quality.up === 4,
                'fill-gray-500': state.quality.up === 0
              }"
            />
            <svg-icon
              :path="mdiArrowDownThin"
              type="mdi"
              class="w-6 h-6 hidden md:block"
              :class="{
                'fill-green-500': state.quality.down === 1,
                'fill-lime-500': state.quality.down === 2,
                'fill-yellow-500': state.quality.down === 3,
                'fill-red-500': state.quality.down === 4,
                'fill-gray-500': state.quality.down === 0
              }"
            />
          </MenuButton>
          <MenuItems
            class="absolute z-30 right-1/2 left-1/2 -translate-x-1/2 w-52 mt-4 bg-white border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-600 rounded shadow-lg dark:bg-gray-800 py-1 text-sm text-gray-700 dark:text-gray-200"
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
                    'text-lime-500': state.quality.up === 2,
                    'text-yellow-500': state.quality.up === 3,
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
                    'text-lime-500': state.quality.down === 2,
                    'text-yellow-500': state.quality.down === 3,
                    'text-red-500': state.quality.down === 4
                  }"
                  >{{ resolveQuality(state.quality.down) }}</span
                >
              </span>
            </div>
          </MenuItems>
        </Menu>
        <!-- Tools -->
        <Menu
          as="div"
          class="relative border-r border-gray-200 dark:border-gray-700"
        >
          <MenuButton
            as="button"
            id="tools-menu"
            type="button"
            class="flex items-center justify-center gap-2.5 mr-2 md:mr-4 text-gray-800 hover:text-gray-900 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-400 font-medium rounded-lg text-sm py-2.5 px-5 text-center dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          >
            <svg-icon
              :path="mdiToolboxOutline"
              type="mdi"
              class="w-6 h-6 fill-gray-800 dark:fill-gray-100"
            />
            <span class="hidden md:block"> TOOLS </span>
          </MenuButton>
          <MenuItems
            as="div"
            class="absolute z-30 right-1/2 left-1/2 -translate-x-1/2 w-44 mt-4 bg-white border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-600 rounded shadow-lg dark:bg-gray-800 py-1 text-sm text-gray-700 dark:text-gray-200"
          >
            <div class="flex flex-col gp-4">
              <div class="flex items-center justify-between px-4 py-2">
                <!-- Screen share -->
                <div class="relative group">
                  <button
                    type="button"
                    @click="toggleScreenShare"
                    class="p-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  >
                    <svg-icon :path="mdiPresentation" type="mdi" />
                  </button>
                  <div
                    class="hidden group-hover:block absolute z-40 right-1/2 left-1/2 -translate-x-1/2 w-32 font-medium text-center text-lg mt-2 p-1 bg-white border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-600 rounded shadow-lg dark:bg-gray-800 py-1 text-gray-700 dark:text-gray-200"
                  >
                    Share Screen
                  </div>
                </div>
                <!-- Share link -->
                <div class="relative group">
                  <button
                    type="button"
                    @click="copyLink"
                    class="p-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  >
                    <svg-icon :path="mdiLinkVariant" type="mdi" />
                  </button>
                  <div
                    class="hidden group-hover:block absolute z-40 right-1/2 left-1/2 -translate-x-1/2 w-52 font-medium text-center text-lg mt-2 p-1 bg-white border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-600 rounded shadow-lg dark:bg-gray-800 py-1 text-gray-700 dark:text-gray-200"
                  >
                    Share meeting link
                  </div>
                </div>
              </div>
              <div class="flex items-center justify-between px-4 py-2">
                <!-- Share file -->
                <div class="relative group">
                  <button
                    type="button"
                    class="p-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  >
                    <svg-icon :path="mdiUploadOutline" type="mdi" />
                  </button>
                  <div
                    class="hidden group-hover:block absolute z-40 right-1/2 left-1/2 -translate-x-1/2 w-32 font-medium text-center text-lg mt-2 p-1 bg-white border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-600 rounded shadow-lg dark:bg-gray-800 py-1 text-gray-700 dark:text-gray-200"
                  >
                    Share File
                  </div>
                </div>
                <!-- Change view -->
                <div class="relative group">
                  <button
                    type="button"
                    @click="copyMeetingLink"
                    class="p-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  >
                    <svg-icon :path="mdiGridLarge" type="mdi" />
                  </button>
                  <div
                    class="hidden group-hover:block absolute z-40 right-1/2 left-1/2 -translate-x-1/2 w-32 font-medium text-center text-lg mt-2 p-1 bg-white border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-600 rounded shadow-lg dark:bg-gray-800 py-1 text-gray-700 dark:text-gray-200"
                  >
                    Change View
                  </div>
                </div>
              </div>
            </div>
          </MenuItems>
        </Menu>
        <Menu as="div" class="relative">
          <MenuButton
            as="button"
            type="button"
            class="text-gray-800 hover:text-gray-900 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-400 font-medium rounded-lg text-sm p-2.5 text-center dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          >
            <svg-icon :path="mdiDotsVertical" type="mdi" />
          </MenuButton>
          <MenuItems
            as="div"
            class="absolute z-30 right-0 w-52 mt-4 bg-white border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-600 rounded shadow-lg dark:bg-gray-800 py-1 text-sm text-gray-700 dark:text-gray-200"
          >
            <MenuItem
              as="button"
              @click="copyLink"
              class="flex items-center gap-2.5 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg-icon :path="mdiLinkVariant" type="mdi" />
              Copy Meeting Link
            </MenuItem>
            <MenuItem
              as="button"
              @click="ui.toggleTheme"
              class="flex items-center gap-2.5 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg-icon
                v-if="!ui.getIsDark"
                type="mdi"
                :path="mdiWeatherNight"
              />
              <svg-icon v-else type="mdi" :path="mdiWeatherSunny" />
              Change Theme
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
          class="flex-1 flex items-center justify-center p-4 border-b md:border-b-0 md:border-r border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
          id="local-player"
        >
          <LoaderComponent v-if="state.loading" size="lg" />
        </div>
        <!-- Remote player -->
        <div
          class="flex-1 h-full grid grid-flow-col md:grid-flow-col md:grid-cold-2 p-4"
          id="remote-container"
        ></div>
        <!-- Toolbar -->
        <div
          id="toolbar"
          class="absolute z-10 bottom-6 w-full left-0 right-0 flex items-center justify-center"
          role="group"
        >
          <div
            class="inline-flex rounded-full shadow-lg items-center justify-center"
          >
            <button
              id="toggle-audio"
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
              id="toggle-video"
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
            <Menu as="div" class="relative">
              <MenuButton
                as="button"
                id="volume-menu"
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
              </MenuButton>
              <MenuItems
                class="absolute bottom-full left-1/2 right-1/2 -translate-x-1/2 w-96 mb-2 bg-white dark:bg-gray-800 border rounded-lg border-gray-300 dark:border-gray-700 shadow-lg p-4"
              >
                <div class="flex flex-col">
                  <div>
                    <label
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >Local audio volume</label
                    >
                    <div class="flex items-center w-full">
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        step="1"
                        v-model="state.volume.local"
                        class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                      />
                      <input
                        type="number"
                        min="0"
                        max="1000"
                        step="1"
                        v-model="state.volume.local"
                        class="w-20 ml-2 text-center text-sm rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      class="block mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >Remote audio volume</label
                    >
                    <div class="flex items-center w-full">
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        step="1"
                        v-model="state.volume.remote"
                        class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                      />
                      <input
                        type="number"
                        min="0"
                        max="1000"
                        step="1"
                        v-model="state.volume.remote"
                        class="w-20 ml-2 text-center text-sm rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </MenuItems>
            </Menu>
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

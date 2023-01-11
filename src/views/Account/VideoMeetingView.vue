<script setup>
import AgoraRTC from 'agora-rtc-sdk-ng'
import { onMounted, reactive, ref } from 'vue'
import useUserStore from '@/stores/user'
import { useRoute, useRouter } from 'vue-router'

const user = useUserStore()
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
  enableAudio: true
})
const videoContainer = ref(null)

onMounted(async () => {
  // Get the App ID and channel name from the URL.
  options.channel = route.params.channel
  options.token = await getToken()
  // Get a token from the Agora Token Server.
  // options.token = await getToken()
  // Join the channel.
  await startBasicCall()
  await onJoinMeeting()
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
  // Dynamically create a container in the form of a DIV element to play the remote video track.
  const remotePlayerContainer = document.querySelector('#remote-container')
  // Dynamically create a container in the form of a DIV element to play the local video track.
  const localPlayerContainer = document.querySelector('#local-player')
  // Specify the ID of the DIV container. You can use the uid of the local user.
  localPlayerContainer.id = options.uid
  // Set the textContent property of the local video container to the local user id.
  localPlayerContainer.textContent = 'Local user ' + options.uid
  // Set the local video container size.
  localPlayerContainer.style.width = '640px'
  localPlayerContainer.style.height = '480px'
  localPlayerContainer.style.padding = '15px 5px 5px 5px'
  // Set the remote video container size.
  remotePlayerContainer.style.width = '640px'
  remotePlayerContainer.style.height = '480px'
  remotePlayerContainer.style.padding = '15px 5px 5px 5px'
  // Listen for the "user-published" event to retrieve a AgoraRTCRemoteUser object.
  agoraEngine.on('user-published', async (user, mediaType) => {
    // Subscribe to the remote user when the SDK triggers the "user-published" event.
    await agoraEngine.subscribe(user, mediaType)
    console.log('subscribe success')
    // Subscribe and play the remote video in the container If the remote user publishes a video track.
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
      // Append the remote container to the page body.
      document.body.append(remotePlayerContainer)
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
    // Listen for the "user-unpublished" event.
    agoraEngine.on('user-unpublished', (user) => {
      console.log(user.uid + 'has left the channel')
    })
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
  // Create a local audio track from the audio sampled by a microphone.
  try {
    channelParameters.localAudioTrack =
      await AgoraRTC.createMicrophoneAudioTrack()
  } catch (error) {
    console.log(error)
  }
  // Create a local video track from the video captured by a camera.
  channelParameters.localVideoTrack = await AgoraRTC.createCameraVideoTrack()
  // Append the local video container to the page body.
  document.body.append(localPlayerContainer)
  // Publish the local audio and video tracks in the channel.
  await agoraEngine.publish([
    channelParameters.localAudioTrack,
    channelParameters.localVideoTrack
  ])
  // Play the local video track.
  channelParameters.localVideoTrack.play(localPlayerContainer)
  console.log('publish success!')
}
async function onLeaveMeeting() {
  // Destroy the local audio and video tracks.
  channelParameters.localAudioTrack.close()
  channelParameters.localVideoTrack.close()
  // Remove the containers you created for the local video and remote video.
  removeVideoDiv(remotePlayerContainer.id)
  removeVideoDiv(localPlayerContainer.id)
  // Leave the channel
  await agoraEngine.leave()
  console.log('You left the channel')
  // Refresh the page for reuse
  window.location.reload()
}
function removeVideoDiv(elementId) {
  // Remove the video stream from the container.
  console.log('Removing ' + elementId + 'Div')
  let Div = document.getElementById(elementId)
  if (Div) {
    Div.remove()
  }
}

function toggleAudio() {
  state.enableAudio = !state.enableAudio
}
function toggleVideo() {
  state.enableVideo = !state.enableVideo
}
</script>
<template>
  <main class="bg-white dark:bg-gray-800">
    <div class="h-screen flex flex-col container max-w-screen-xl mx-auto">
      <div
        class="flex-none p-4 flex items-center gap-6 border-b border-gray-300 dark:border-gray-700"
      >
        <button
          type="button"
          @click.stop
          class="text-gray-900 bg-white focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm p-3 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-8 h-8 fill-current"
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
        <h4
          class="text-3xl text-gray-900 dark:text-white font-bold font-mono uppercase mx-auto"
        >
          {{ route.params.channel }}
        </h4>
        <button
          type="button"
          @click.stop="toggleAudio"
          class="text-gray-900 bg-white focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm p-3 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
        >
          <template v-if="state.enableAudio">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-8 h-8 fill-current"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path
                d="M12 3a3 3 0 0 0-3 3v4a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zm0-2a5 5 0 0 1 5 5v4a5 5 0 0 1-10 0V6a5 5 0 0 1 5-5zM3.055 11H5.07a7.002 7.002 0 0 0 13.858 0h2.016A9.004 9.004 0 0 1 13 18.945V23h-2v-4.055A9.004 9.004 0 0 1 3.055 11z"
              />
            </svg>
          </template>
          <template v-else>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-8 h-8 fill-current"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path
                d="M16.425 17.839A8.941 8.941 0 0 1 13 18.945V23h-2v-4.055A9.004 9.004 0 0 1 3.055 11H5.07a7.002 7.002 0 0 0 9.87 5.354l-1.551-1.55A5 5 0 0 1 7 10V8.414L1.393 2.808l1.415-1.415 19.799 19.8-1.415 1.414-4.767-4.768zm-7.392-7.392l2.52 2.52a3.002 3.002 0 0 1-2.52-2.52zm10.342 4.713l-1.443-1.442c.509-.81.856-1.73.997-2.718h2.016a8.95 8.95 0 0 1-1.57 4.16zm-2.91-2.909l-1.548-1.548c.054-.226.083-.46.083-.703V6a3 3 0 0 0-5.818-1.032L7.686 3.471A5 5 0 0 1 17 6v4a4.98 4.98 0 0 1-.534 2.251z"
              />
            </svg>
          </template>
        </button>
        <button
          type="button"
          @click.stop="toggleVideo"
          class="text-gray-900 bg-white focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm p-3 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
        >
          <template v-if="state.enableVideo">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-8 h-8 fill-current"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path
                d="M9.828 5l-2 2H4v12h16V7h-3.828l-2-2H9.828zM9 3h6l2 2h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4l2-2zm3 15a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11zm0-2a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"
              />
            </svg>
          </template>
          <template v-else>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-8 h-8 fill-current"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path
                d="M19.586 21H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h.586L1.393 2.808l1.415-1.415 19.799 19.8-1.415 1.414L19.586 21zm-14-14H4v12h13.586l-2.18-2.18A5.5 5.5 0 0 1 7.68 9.094L5.586 7zm3.524 3.525a3.5 3.5 0 0 0 4.865 4.865L9.11 10.525zM22 17.785l-2-2V7h-3.828l-2-2H9.828l-.307.307-1.414-1.414L9 3h6l2 2h4a1 1 0 0 1 1 1v11.786zM11.263 7.05a5.5 5.5 0 0 1 6.188 6.188l-2.338-2.338a3.515 3.515 0 0 0-1.512-1.512l-2.338-2.338z"
              />
            </svg>
          </template>
        </button>
        <button
          type="button"
          @click.stop
          class="text-gray-900 bg-white focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm p-3 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-8 h-8 fill-current"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path
              d="M12 3c-.825 0-1.5.675-1.5 1.5S11.175 6 12 6s1.5-.675 1.5-1.5S12.825 3 12 3zm0 15c-.825 0-1.5.675-1.5 1.5S11.175 21 12 21s1.5-.675 1.5-1.5S12.825 18 12 18zm0-7.5c-.825 0-1.5.675-1.5 1.5s.675 1.5 1.5 1.5 1.5-.675 1.5-1.5-.675-1.5-1.5-1.5z"
            />
          </svg>
        </button>
      </div>
      <div
        class="flex-1 p-4 container max-w-screen-xl mx-auto flex items-center justify-center gap-6 md:gap-12 lg:gap-16"
      >
        <!-- Local player -->
        <div class="bg-blue-200 rounded-lg flex-1" id="local-player">
          Local Player
        </div>
        <!-- Remote player -->
        <div class="bg-blue-200 rounded-lg flex-1" id="remote-container">
          Remote Player
        </div>
      </div>
    </div>
  </main>
</template>

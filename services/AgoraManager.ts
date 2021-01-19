
let AgoraRTC;
let AgoraImport = import("agora-rtc-sdk-ng").then(mod => {
    AgoraRTC = mod.default
    initializeAgora()
})

const TEMP_TOKEN = "0060214d9fca3c943a5a1dc2e402f7a445eIAAx+VQq45nPFoPfZG2q15G+I/suC5h3ydie9eENf+phMLiT6u4AAAAAEABXvn0FFpAGYAEAAQAWkAZg"
const CHANNEL_NAME = "TEST"
const APP_ID = "0214d9fca3c943a5a1dc2e402f7a445e"


export var rtc = {
  // For the local client.
  client: null,
  // For the local audio track.
  localAudioTrack: null,
};

const checkIfAgoraExist = async () => {
  await AgoraImport
}


const initializeAgora = () => {
  console.log("Initializing Agora")
  if (typeof window !== 'undefined') {
    rtc.client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
  }
}


const publishLocalAudioTrack = async () => {
  await rtc.client.setClientRole("host")
  rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack()
  await rtc.client.publish([rtc.localAudioTrack])
}

export const joinChannel = async () => {
  await checkIfAgoraExist()
  console.log("Joining channel")
  return rtc.client.join(APP_ID, CHANNEL_NAME, TEMP_TOKEN)
}

export const enableAudioAndMic = async () => {
  await publishLocalAudioTrack()
  await listenToRemoteUser()
}

export const leaveChannel = async () => {
  await checkIfAgoraExist()
  rtc.localAudioTrack.close();
  return rtc.client.leave()
}

const listenToRemoteUser = async () => {
  await checkIfAgoraExist()
  rtc.client.on("user-published", async (user, mediaType) => {
    // Subscribe to a remote user.
    await rtc.client.subscribe(user, mediaType);
    console.log("subscribe success");
  
    // If the subscribed track is audio.
    if (mediaType === "audio") {
      // Get `RemoteAudioTrack` in the `user` object.
      const remoteAudioTrack = user.audioTrack;
      // Play the audio track. No need to pass any DOM element.
      remoteAudioTrack.play();
    }
  });

}



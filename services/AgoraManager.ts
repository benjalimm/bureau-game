import { parseConfigFileTextToJson } from "typescript"

// let AgoraRTC;
let AgoraRTC = import("agora-rtc-sdk-ng").then(mod => {
    // AgoraRTC = mod.default
    return mod.default    
})

const TEMP_TOKEN = "0060214d9fca3c943a5a1dc2e402f7a445eIAA6MNi3dhqwb4BYjHA/FzhDIuZoNiD4dxJhIR/TDCKOjbiT6u4AAAAAEABI+NBcsbYYYAEAAQCwthhg"
const CHANNEL_NAME = "TEST"
const APP_ID = "0214d9fca3c943a5a1dc2e402f7a445e"

const checkIfAgoraExist = async () => {
  await AgoraRTC
}

class AgoraManager {
   rtc = {
    // For the local client.
    client: null,
    // For the local audio track.
    localAudioTrack: null,
  };

  currentAgoraUid?: string 

  constructor() {
    this.initializeAgora().then(() => {
      console.log("Agora initialized")
    }).catch(err => {
      console.log("Error with initializing Agora with error")
      console.log(err)
    })
  }

  async initializeAgora() {
    const agoraRtc = await AgoraRTC
    console.log("Initializing Agora")
    if (typeof window !== 'undefined') {
      this.rtc.client = agoraRtc.createClient({ mode: "live", codec: "vp8" });
    }
  }

  async publishLocalAudioTrack() {
    const agoraRtc = await AgoraRTC
    await this.rtc.client.setClientRole("host")
    this.rtc.localAudioTrack = await agoraRtc.createMicrophoneAudioTrack()
    await this.rtc.client.publish([this.rtc.localAudioTrack])
  }

  async joinChannel(): Promise<string> {
    await checkIfAgoraExist()
    console.log("Joining channel")
    const agoraUid = await this.rtc.client.join(APP_ID, CHANNEL_NAME, TEMP_TOKEN)
    this.currentAgoraUid = `${agoraUid}`
    return this.currentAgoraUid;
  }


  async setupAudio()  {
    await this.publishLocalAudioTrack()
    await this.listenToRemoteUser()
  }

  async leaveChannel () {
    await checkIfAgoraExist()
    this.rtc.localAudioTrack.close();
    return this.rtc.client.leave()
  }

  private async listenToRemoteUser()  {
    await checkIfAgoraExist()
    this.rtc.client.on("user-published", async (user, mediaType) => {
      // Subscribe to a remote user.
      await this.rtc.client.subscribe(user, mediaType);
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
}

const agoraManager = new AgoraManager()
export default agoraManager












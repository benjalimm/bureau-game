import { getAgoraToken } from './Networking';
import firebase from 'firebase/app';
import { HashTable } from '../models/Common';
import {
  IAgoraRTCClient,
  IMicrophoneAudioTrack,
  IRemoteAudioTrack
} from 'agora-rtc-sdk-ng';
const AgoraRTC = import('agora-rtc-sdk-ng').then((mod) => {
  return mod.default;
});

const APP_ID = '0214d9fca3c943a5a1dc2e402f7a445e';
const IS_TEST = false;

const checkIfAgoraExist = async () => {
  await AgoraRTC;
};

/* AgoraManager  */
class AgoraManager {
  rtc: RTC = {
  	// For the local client.
  	client:          null,
  	// For the local audio track.
  	localAudioTrack: null
  };

  remoteUserTracks: HashTable<IRemoteAudioTrack> = {};
  volumeIndicatorListenerHashTable: 
  HashTable<VolumeIndicatorResultCallBack> = {};
  currentAgoraUid?: string;

  private volumeIntervalId: NodeJS.Timeout | null = null;
  private currentVolume = 0;

  constructor() {
  	this.initializeAgora()
  		.then(() => {
  			console.log('Agora initialized');
  		})
  		.catch((err) => {
  			console.log('Error with initializing Agora with error');
  			console.log(err);
  		});
  }

  async initializeAgora() {
  	const agoraRtc = await AgoraRTC;
  	console.log('Initializing Agora');
  	if (typeof window !== 'undefined') {
  		this.rtc.client = agoraRtc.createClient({ mode: 'live', codec: 'vp8' });
  	}
  }

  async publishLocalAudioTrack() {
  	const agoraRtc = await AgoraRTC;
  	await this.rtc.client.setClientRole('host');
  	this.rtc.localAudioTrack = await agoraRtc.createMicrophoneAudioTrack();
  	await this.rtc.client.publish([this.rtc.localAudioTrack]);

  	/// Initialize volume
  	this.rtc.localAudioTrack.setVolume(this.currentVolume);
  }

  async joinChannel(roomId: string): Promise<string> {
  	const uid = firebase.auth().currentUser.uid;
  	if (!uid) throw new Error('Uid does not exist');

  	//If test mode, don't join audio channel
  	if (IS_TEST) return uid;

  	await checkIfAgoraExist();
  	console.log('Joining channel');
  	const token = await getAgoraToken(roomId);
  	const agoraUid = await this.rtc.client.join(APP_ID, roomId, token, uid);
  	this.currentAgoraUid = `${agoraUid}`;
  	return this.currentAgoraUid;
  }

  async setupAudio() {
  	if (IS_TEST) return;
  	await this.publishLocalAudioTrack();
  	this.listenToVolumeIndicator();
  }

  async leaveChannel() {
  	await checkIfAgoraExist();
  	this.rtc.localAudioTrack.close();
  	return this.rtc.client.leave();
  }

  async setupListeners() {
  	await checkIfAgoraExist();
  	this.rtc.client.on('user-published', async (user, mediaType) => {
  		// Subscribe to a remote user.
  		await this.rtc.client.subscribe(user, mediaType);
  		console.log('subscribe success');

  		// If the subscribed track is audio.
  		if (mediaType === 'audio') {
  			const remoteAudioTrack = user.audioTrack;

  			/// Keep reference to remote user track
  			this.remoteUserTracks[user.uid] = remoteAudioTrack;
  			remoteAudioTrack.play();
  		}

  		/// Listen
  		await this.rtc.client.on('user-left', async (user, mediaType) => {
  			delete this.remoteUserTracks[user.uid];
  		});
  	});
  }

  private listenToVolumeIndicator() {
  	this.volumeIntervalId = setInterval(() => {
  		const listOfVolumeLevelData: VolumeLevelData[] = [];

  		// 1. Get remote user volume levels
  		for (const key of Object.keys(this.remoteUserTracks)) {
  			const remoteUserTrack = this.remoteUserTracks[key];
  			listOfVolumeLevelData.push({
  				uid:   key,
  				level: remoteUserTrack?.getVolumeLevel() ?? 0
  			});
  		}

  		//2. Get local user volume levels.
  		if (this.rtc.localAudioTrack && this.currentAgoraUid) {
  			listOfVolumeLevelData.push({
  				uid:   this.currentAgoraUid,
  				level: this.rtc.localAudioTrack.getVolumeLevel()
  			});
  		}

  		for (const listenerId of Object.keys(
  			this.volumeIndicatorListenerHashTable
  		)) {
  			const callback = this.volumeIndicatorListenerHashTable[listenerId];
  			callback(listOfVolumeLevelData);
  		}
  	}, 100);
  }

  private stopListeningToVolumeIndicator() {
  	clearInterval(this.volumeIntervalId);
  }

  muteAudio(isMute: boolean) {
  	const volume: number = isMute ? 0 : 100;
  	this.currentVolume = volume;
  	this.rtc.localAudioTrack?.setVolume(volume);
  }

  listenToVolumeIndicatorForCurrentRoom(
  	listenerId: string,
  	indicatorCallback: VolumeIndicatorResultCallBack
  ) {
  	this.volumeIndicatorListenerHashTable[listenerId] = indicatorCallback;
  }

}

/* AgoraManager types */
interface RTC {
  client: IAgoraRTCClient;
  localAudioTrack: IMicrophoneAudioTrack;
}

interface VolumeLevelData {
  level: number;
  uid: string;
}

type VolumeIndicatorResultCallBack = (result: VolumeLevelData[]) => void;

const agoraManager = new AgoraManager();
export default agoraManager;

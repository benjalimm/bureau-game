import { io, Socket } from 'socket.io-client';
import 'firebase/auth';
import { firebase, getCurrentUserId } from '../Authentication';
import { ClientSocketData, SocketListenQueueItem } from '../../models/SocketData';
import { gameManager } from '../../game/GameManager';
import { urlWithPath } from '../Networking';
import agoraManager from '../AgoraManager';
import { listenToBureauGameErrors, listenToDidInitializeEvent, listenToParticipantDidJoinEvent, listenToParticipantDidLeaveEvent, listenToParticipantMovementEvent, listenToParticipantStateChangeEvent } from './Listeners';

const NETWORK_URL = urlWithPath('');

export default class SocketManager {
  socketClient?: Socket;
  currentIdToken: string;

  socketListenQueue: SocketListenQueueItem[] = []

  async init() {
    console.log('Initializing socket');
    this.currentIdToken = await firebase.auth().currentUser.getIdToken();
    this.socketClient = io(NETWORK_URL, {
      transports: ['websocket'],
      auth: (cb) => {
        cb({ token: this.currentIdToken });
      }
    });
  }

  disconnect() {
    console.log('Attempting to disconnect socket');
    this.socketClient?.disconnect();
  }

  async connect() {
    console.log('Attempting to connect to socket');
    if (!this.socketClient) {
      await this.init(); // Init
    }
    // Wait for initial game to initialize
    await gameManager.gameDidInitialize();
    
    /// The original connection can't use listen
    this.socketClient.on('connect', () => {
      this.activateAndClearListenEventQueue()

      this.listen("disconnect" ,() => {
        /// Handle disconnection here
        console.log("Socket disconnected")
      })
    
      this.listen('connect_error', (err) => {
        console.log('client connect_error: ', err);
      });

      this.listen('connect_timeout', (err) => {
        console.log('client connect_timeout: ', err);
      });

      listenToDidInitializeEvent(this)
      listenToParticipantDidJoinEvent(this)
      listenToParticipantDidLeaveEvent(this)
      listenToParticipantStateChangeEvent(this)
      listenToParticipantMovementEvent(this)
      listenToBureauGameErrors(this)
    });
  }

  listen(event: string, onEvent: (data: any) => void) {
  
    if (event === "connect") {
      throw new Error('CANT CONNECT USING LISTEN METHOD. USE SOCKETCLIENT.ON FOR THIS'
      )}

    if (this.socketClient.connected) {
      this.socketClient.on(event, onEvent)
      return 
    }
    /// If socket client is currently disconnected, we append this event to queue
    console.log("Socket client is not connected or not initialized")
    this.appendListenEventToQueue({
      event: event,
      onEvent: onEvent
    })
  }

  stopListening(event: string) {
    this.socketClient?.off(event)
  }

  private appendListenEventToQueue(props: SocketListenQueueItem) {
    console.log("Appending listener to events queue")
    this.socketListenQueue.push(props)
  }

  private activateAndClearListenEventQueue() {
    this.socketListenQueue.map(queueItem => {
      this.listen(queueItem.event, queueItem.onEvent)
    })
    this.socketListenQueue = []
  }

  emit(event: string, props: { 
    roomId: string | null, 
    data: any 
  }) {
    const uid = getCurrentUserId()

    const { roomId, data } = props

    if (uid) {
      const clientSocketData: ClientSocketData = {
        user: {
          uid: uid,
          agoraUid: agoraManager.currentAgoraUid,
          currentRoomId: roomId
        },
        data: data
      };
      console.log(data);
      this.socketClient.emit(event, clientSocketData);
    } else {
      throw new Error(`Can't emit event ${event} - uid does not exist`)
    }
      
  }
  
}
const socketManager = new SocketManager();
export { socketManager };

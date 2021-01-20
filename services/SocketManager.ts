import { io, Socket } from 'socket.io-client';
import 'firebase/auth'
import { firebase } from './Authentication'
// import firebase from 'firebase/app'

const NETWORK_URL = 'http://localhost:8000'

export interface SocketSubscriber {
  onConnect(): void;
  onDisconnect(): void;
}

interface SocketUserDetails {
  uid: string;
  agoraUid: string;
}

export class SocketManager {
  socketClient?: Socket;
  currentIdToken: string;
  subscribers: SocketSubscriber[]

  constructor() {
    this.subscribers = []
  }

 async init() {
    this.currentIdToken = await firebase.auth().currentUser?.getIdToken() ?? ""
    this.socketClient = io(NETWORK_URL, {
      transports: ['websocket'],
      auth: (cb) => {
        cb({ token: this.currentIdToken})
      }
    })
  }

  async connect() {
    if (this.socketClient) {
      this.socketClient.disconnect()
    }
    
    await this.init() /// Reinitialize
    this.socketClient.on('connect' , () => {
      this.subscribers.forEach(s => {
        s.onConnect()
      })

      /// Listen to disconnect 
      this.socketClient.on('disconnect', () => {
        this.subscribers.forEach(s => {
          s.onDisconnect()
        })
      })
    })
  }

  addSubscriber(subscriber: SocketSubscriber) {
    this.subscribers.push(subscriber);
  }


  emit(event: string, data: any) {
    const userId = firebase.auth().currentUser.uid

    const userDetails: SocketUserDetails =  {
      uid: userId,
      agoraUid: "123"
    }
    data.user = userDetails
    this.socketClient.emit(event, data)

  }

  joinRoom(roomId: string) {
    this.emit("joinRoom", { roomId: roomId })
  }
}

const socketManager = new SocketManager()
export { socketManager }


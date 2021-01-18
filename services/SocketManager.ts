import { io, Socket } from 'socket.io-client';
import 'firebase/auth'
import { firebase } from './Authentication'
// import firebase from 'firebase/app'

const NETWORK_URL = 'http://localhost:8000'

export interface SocketSubscriber {
  onConnect(): void;
  onDisconnect(): void;
}

export class SocketManager {
  socketClient: Socket;
  currentIdToken: string;
  subscribers: SocketSubscriber[]

  constructor() {
    this.subscribers = []
  }

 async init() {
    this.currentIdToken = await firebase.auth().currentUser?.getIdToken() ?? ""
    this.socketClient = io(NETWORK_URL, {
      transports: ['websocket'],
      extraHeaders: {
        Authorization: `Bearer: ${this.currentIdToken}`
      }
    })
  }

  async connect() {
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
}

const socketManager = new SocketManager()
export { socketManager }


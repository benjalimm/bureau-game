import { io, Socket } from 'socket.io-client';
import 'firebase/auth'
import { firebase } from './Authentication'
import { ClientSocketData } from '../models/SocketData';
import { GameData, Vector } from '../models/GameStates'
import Game from '../game/game';
// import firebase from 'firebase/app'

const NETWORK_URL = 'https://desolate-anchorage-45430.herokuapp.com'

export interface SocketSubscriber {
  onConnect(): void;
  onDisconnect(): void;
}


export class SocketManager {
  socketClient?: Socket;
  currentIdToken: string;
  subscribers: SocketSubscriber[]

  constructor() {
    this.subscribers = []
  }

 async init() {
   console.log("Initializing socket")
    this.currentIdToken = await firebase.auth().currentUser.getIdToken()
    this.socketClient = io(NETWORK_URL, {
      transports: ['websocket'],
      auth: (cb) => {
        cb({ token: this.currentIdToken})
      }
    })
  }

  disconnect() {
    console.log("Attempting to disconnect socket")
    this.socketClient?.disconnect()
  }

  async connect() {
    console.log("Attempting to connect to socket")
    if (!this.socketClient) {
      await this.init() // Init 
    }
    
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

      this.socketClient.on('movement', (data) => {
        console.log(`Received Socket data: ${data}`)
        console.log(data)
        const gameData = data as GameData 
        Game.current.didReceiveGameData(gameData)
      })

      this.socketClient.on('connect_error', function(err) {
        console.log("client connect_error: ", err);
      });
    
      this.socketClient.on('connect_timeout', function(err) {
        console.log("client connect_timeout: ", err);
      });
    })


  }

  addSubscriber(subscriber: SocketSubscriber) {
    this.subscribers.push(subscriber);
  }


  emit(event: string, currentRoomId: string | null, data: any) {
    const userId = firebase.auth().currentUser.uid

    const clientSocketData: ClientSocketData = {
      user: {
        uid: userId,
        agoraUid: "123",
        currentRoomId: currentRoomId
      },
      data: data
    }
    this.socketClient.emit(event, clientSocketData);
  }

  joinRoom(roomId: string) {
    this.emit("joinRoom", null, { roomId: roomId })
  }

  emitMovement(roomId: string, movement: Vector) {
    this.emit("movement", roomId, movement)
  }
}

const socketManager = new SocketManager()
export { socketManager }


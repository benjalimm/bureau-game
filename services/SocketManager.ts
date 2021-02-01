import { io, Socket } from 'socket.io-client';
import 'firebase/auth'
import { firebase } from './Authentication'
import { ClientSocketData } from '../models/SocketData';
import { GameData, Position, UserState } from '../models/GameStates'
import Game from '../game/game';
import { urlWithPath } from './Networking'
import { RoomParticipant } from '../models/User';
import agoraManager from './AgoraManager';
const NETWORK_URL = urlWithPath('')

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
        Game.current.didReceiveGameData(gameData, firebase.auth().currentUser.uid)
      })

      this.socketClient.on('connect_error', function(err) {
        console.log("client connect_error: ", err);
      });
    
      this.socketClient.on('connect_timeout', function(err) {
        console.log("client connect_timeout: ", err);
      });

      this.socketClient.on('didInitialize', (data) => {
        console.log("didInitialize")
        console.log(data)
        const userStates = data.userStates as UserState[]
        const participants = data.participants as RoomParticipant[]
        const roomId = data.roomId as string;

        /// Initialize initial user states
        Game.current?.initializeInitialUserStates(userStates, firebase.auth().currentUser.uid)

        /// Initialize initial room participants
        Game.current?.initializeRoom(roomId, participants)
      })

      this.socketClient.on('didJoin', (data) => {
        const participant = data.participant as RoomParticipant
        console.log(`${participant.name} just joined`)
        /// Initialize initial room participants
        Game.current?.participantDidJoinRoom(participant)
      })

      this.socketClient.on('didLeave', (data) => {
        const participant = data.participant as RoomParticipant
        Game.current?.participantDidLeaveRoom(participant);
      })

      this.socketClient.on('bureauGameError', (data) => {
        console.log(data)
      })
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
        agoraUid: agoraManager.currentAgoraUid,
        currentRoomId: currentRoomId
      },
      data: data
    }
    this.socketClient.emit(event, clientSocketData);
  }

  joinRoom(roomId: string, agoraUid: string) {
    this.emit("joinRoom", null, {
       roomId: roomId,
       agoraUid: agoraUid
     })
  }

  emitMovement(roomId: string, movement: Position) {
    this.emit("movement", roomId, movement)
  }
}

const socketManager = new SocketManager()
export { socketManager }


import { RoomParticipant } from "../models/User";


export class Room {
  roomId: string
  participants: RoomParticipant[]

  constructor(id: string) {
    this.roomId = id 
  }

  addParticipant(participant: RoomParticipant) {
    this.participants.push(participant)
  }

  removeParticipant(uid: string) {
    const index = this.participants.findIndex(participant => {
      return participant.uid == uid 
    })

    if (index) {
      this.participants.splice(index, 1)
    }
  }
}
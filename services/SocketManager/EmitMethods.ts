import { BVec3 } from '../../models/GameData'
import SocketManager from '../SocketManager'

export function joinRoom(manager: SocketManager, props: { 
  joiningRoomId: string
}) {
  const { joiningRoomId } = props
  console.log(`Attempting to join room ${joiningRoomId}`)
  manager.emit("joinRoom", {
    roomId: null, /// We list this as null as we haven't joined the room yet
    data: { roomId: joiningRoomId }
  })
}

export function emitMovement(manager: SocketManager, props: {
  roomId: string, 
  movement: BVec3
}) {
  const { roomId, movement } = props;
  console.log(`Emitting movement: ${JSON.stringify(movement)}`)
  manager.emit('movement' , {
    roomId: roomId,
    data: { movement: movement }
  })
}
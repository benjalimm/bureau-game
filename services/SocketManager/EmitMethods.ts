import { Position } from '../../models/Game'
import SocketManager from '../SocketManager'

export function joinRoom(manager: SocketManager, props: { 
  joiningRoomId: string
}) {
  const { joiningRoomId } = props
  manager.emit("joinRoom", {
    roomId: null, /// We list this as null as we haven't joined the room yet
    data: { roomId: joiningRoomId }
  })
}

export function emitMovement(manager: SocketManager, props: {
  roomId: string, 
  movement: Position
}) {
  const { roomId, movement } = props;
  manager.emit('movement' , {
    roomId: roomId,
    data: { movement: movement }
  })
}
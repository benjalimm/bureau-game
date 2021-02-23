import { HashTable } from '../../models/Common';
import { UserMovement, Position } from '../../models/Game';
import { getCurrentUserId } from '../../services/Authentication';
import { keyboardManager } from '../../services/KeyboardManager';
import { socketManager } from '../../services/SocketManager';
import { emitMovement } from '../../services/SocketManager/EmitMethods';
import Game from '../Game'
import { moveCamera } from './Camera';
import { moveLocalUser, moveUser } from './Movement';

export function handlePressedKeys(game: Game, 
  props: { pressedKeys: HashTable<boolean> 
  }) {

  const speed = game.player.speed;
  const uid = getCurrentUserId()

  /* Handle camera movement here */
  const camera = game.camera
  if (camera) {
    if (props.pressedKeys['w']) {
      moveCamera(camera, {
        direction: "Forward",
        speed: speed
      })
    
    }
    if (props.pressedKeys['s']) {
      moveCamera(camera, {
        direction: "Backward",
        speed: speed
      })
    }
    if (props.pressedKeys['a']) {
      moveCamera(camera, {
        direction: "Left",
        speed: speed
      })
  
    }
    if (props.pressedKeys['d']) {
      moveCamera(camera, {
        direction: "Right",
        speed: speed
      })
    }

    if (props.pressedKeys['ArrowLeft']) {

      if (uid) {

        const movement: Position = {
          x: speed,
          y: 0,
          z: 0
        }
        moveLocalUser(game, {
          uid: uid,
          movement: movement
        })

        emitMovement(socketManager, {
          roomId: "ABC",
          movement: movement
        })
      }

    }

    if (props.pressedKeys['ArrowUp']) {

      if (uid) {

        const movement: Position = {
          x: 0,
          y: 0,
          z: speed
        }

        moveLocalUser(game, {
          uid: uid,
          movement: movement
        })

        emitMovement(socketManager, {
          roomId: "ABC",
          movement: movement
        })
      }
      
    }
    if (props.pressedKeys['ArrowRight']) {

      if (uid) {      

        const movement: Position = {
          x: -speed,
          y: 0,
          z: 0
        }
        moveLocalUser(game, {
          uid: uid,
          movement: movement
        })

        emitMovement(socketManager, {
          roomId: "ABC",
          movement: movement
        })
      }
      
    }

    if (props.pressedKeys['ArrowDown']) {

      if (uid) {

        const movement: Position = {
          x: 0,
          y: 0,
          z: -speed
        }
        moveLocalUser(game, {
          uid: uid,
          movement: movement
        })

        emitMovement(socketManager, {
          roomId: "ABC",
          movement: movement
        })
       
      }
      
    }
  }
}

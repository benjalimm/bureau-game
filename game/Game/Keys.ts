import { HashTable } from '../../models/Common';
import { UserMovement, BVec3 } from '../../models/GameData';
import { getCurrentUserId } from '../../services/Authentication';
import { keyboardManager } from '../../services/KeyboardManager';
import { socketManager } from '../../services/SocketManager';
import { emitMovement } from '../../services/SocketManager/EmitMethods';
import Game from '../Game'
import { moveCamera } from './Camera';
import { applyJumpForceToUser, moveLocalUser, moveUser } from './Movement';

export function handlePressedKeys(game: Game, 
  props: { pressedKeys: HashTable<boolean> 
  }) {

  const speed = game.player.speed;
  const uid = getCurrentUserId()

  /* Handle camera movement here */
  const camera = game.camera

  if (props.pressedKeys['ArrowLeft']) {

    if (uid) {

      const movement: BVec3 = {
        x: speed,
        y: 0,
        z: 0
      }
      // moveLocalUser(game, {
      //   uid: uid,
      //   movement: movement
      // })

      emitMovement(socketManager, {
        roomId: "ABC",
        movement: movement
      })
    }

  }

  if (props.pressedKeys['ArrowUp']) {

    if (uid) {

      const movement: BVec3 = {
        x: 0,
        y: 0,
        z: speed
      }

      // moveLocalUser(game, {
      //   uid: uid,
      //   movement: movement
      // })

      emitMovement(socketManager, {
        roomId: "ABC",
        movement: movement
      })
    }
      
  }
  if (props.pressedKeys['ArrowRight']) {

    if (uid) {      

      const movement: BVec3 = {
        x: -speed,
        y: 0,
        z: 0
      }
      // moveLocalUser(game, {
      //   uid: uid,
      //   movement: movement
      // })

      emitMovement(socketManager, {
        roomId: "ABC",
        movement: movement
      })
    }
      
  }

  if (props.pressedKeys['ArrowDown']) {

    if (uid) {

      const movement: BVec3 = {
        x: 0,
        y: 0,
        z: -speed
      }
      // moveLocalUser(game, {
      //   uid: uid,
      //   movement: movement
      // })

      emitMovement(socketManager, {
        roomId: "ABC",
        movement: movement
      })
       
    }
      
  }

  if (props.pressedKeys[' ']) {

    if (uid) {

      // const movement: Position = {
      //   x: 0,
      //   y: 1,
      //   z: 0
      // }
      // moveLocalUser(game, {
      //   uid: uid,
      //   movement: movement
      // })

      applyJumpForceToUser(game, {
        uid: uid
      })

      // emitMovement(socketManager, {
      //   roomId: "ABC",
      //   movement: movement
      // })
       
    }

  }
}


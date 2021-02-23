import { HashTable } from '../../models/Common';
import { keyboardManager } from '../../services/KeyboardManager';
import { socketManager } from '../../services/SocketManager';
import { emitMovement } from '../../services/SocketManager/EmitMethods';
import Game from '../Game'
import { moveCamera } from './Camera';

export function handlePressedKeys(game: Game, 
  props: { pressedKeys: HashTable<boolean> 
  }) {

  const speed = game.player.speed;

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
      emitMovement(socketManager, {
        roomId: "ABC",
        movement: {
          x: speed,
          y: 0,
          z: 0
        }
      })
  
    }

    if (props.pressedKeys['ArrowUp']) {

      emitMovement(socketManager, {
        roomId: "ABC",
        movement: {
          x: 0,
          y: 0,
          z: speed
        }
      })
    }
    if (props.pressedKeys['ArrowRight']) {

      emitMovement(socketManager, {
        roomId: "ABC",
        movement: {
          x: -speed,
          y: 0,
          z: 0
        }
      })
      
    }

    if (props.pressedKeys['ArrowDown']) {

      emitMovement(socketManager, {
        roomId: "ABC",
        movement: {
          x: 0,
          y: 0,
          z: -speed
        }
      })
    }
  }
}
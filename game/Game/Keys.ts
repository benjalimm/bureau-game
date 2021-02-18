import { HashTable } from '../../models/Common';
import { keyboardManager } from '../../services/KeyboardManager';
import { socketManager } from '../../services/SocketManager';
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

    if (props.pressedKeys[37]) {
    // left arrow key
    // props.pressedKeys.camera.position.x += speed
    // props.pressedKeys.cube.position.x += speed
      socketManager.emitMovement('ABC', {
        x: speed,
        y: 0,
        z: 0
      });
    }

    if (props.pressedKeys[38]) {
    // Up arrow key
    // this.camera.position.z += speed
    // this.cube.position.z += speed

      socketManager.emitMovement('ABC', {
        x: 0,
        y: 0,
        z: speed
      });
    }
    if (props.pressedKeys[39]) {
    // right arrow key
    // this.camera.position.x -= speed
    // this.cube.position.x -= speed

      socketManager.emitMovement('ABC', {
        x: -speed,
        y: 0,
        z: 0
      });
    }

    if (props.pressedKeys[40]) {
    // down arrow key
    // this.camera.position.z -= speed;
    // this.cube.position.z -= speed

      socketManager.emitMovement('ABC', {
        x: 0,
        y: 0,
        z: -speed
      });
    }
  }
}
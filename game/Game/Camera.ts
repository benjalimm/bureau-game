import Game from '../Game'
import { PerspectiveCamera, Camera } from 'three';

export function setupCamera(game: Game, props: { aspect: number }) {
  game.camera = new PerspectiveCamera(90, props.aspect, 0.1, 1000);
  game.camera.position.set(-1, 20, -10);
}

export function attachCameraToUser(game: Game, props: { uid: string }) {
  const userMesh: THREE.Mesh | undefined = game.userMeshesTable[props.uid];

  if (userMesh) {
    game.camera.lookAt(userMesh.position);
  }
}

export type CameraMovementType = "Forward" | "Backward" | "Left" | "Right"
export function moveCamera(
  camera: Camera , 
  props: { direction: CameraMovementType, speed: number }) {

  switch (props.direction) {

    case "Forward": 
      camera.position.x -= Math.sin(camera.rotation.y) * props.speed;
      camera.position.z -= -Math.cos(camera.rotation.y) * props.speed;
      break

    case "Backward": 
      camera.position.x += Math.sin(camera.rotation.y) * props.speed;
      camera.position.z += -Math.cos(camera.rotation.y) * props.speed;
      break

    case "Left": 
      camera.position.x += 
        Math.sin(camera.rotation.y + Math.PI / 2) * props.speed;
      camera.position.z +=
        -Math.cos(camera.rotation.y + Math.PI / 2) * props.speed;
      break

    case "Right": 
      camera.position.x +=
        Math.sin(camera.rotation.y - Math.PI / 2) * props.speed;
      camera.position.z +=
        -Math.cos(camera.rotation.y - Math.PI / 2) * props.speed;
      break
  }
    
}
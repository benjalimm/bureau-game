import Game from '../Game'
import { PerspectiveCamera, Camera, Mesh } from 'three';
import { BVec3, UserMovement } from '../../models/GameData';

export function setupCamera(game: Game, props: { aspect: number }) {
  game.camera = new PerspectiveCamera(90, props.aspect, 0.1, 1000);
  game.camera.position.set(-1, 20, -10);
}

export function   attachCameraToUser(game: Game, props: { uid: string }) {
  const { uid } = props;
  console.log(`Attaching camera to user with id ${uid}`)
  const userMesh: THREE.Mesh | undefined = game.userMeshesTable[uid];

  if (userMesh) {
    game.camera.lookAt(userMesh.position);
  }
}

export function fixCameraOnMesh(game: Game, props: { mesh: Mesh }) {
  const { mesh } = props;
  const { x, y, z } = mesh.position
  game.camera.position.set(x - 1, y + 20, z - 10)
  game.camera.lookAt(mesh.position)
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

export function moveCameraWithMovement(
  camera: Camera,  
  props:  { movement: BVec3 }) {

  const { movement } = props;
  camera.position.x += movement.x;
  camera.position.y += movement.y;
  camera.position.z += movement.z;

}
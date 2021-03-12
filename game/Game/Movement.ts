import Game from '../Game';
import { Mesh, Vector3 } from 'three'
import { GameObjectState, BVec3, UserMovement } from '../../models/Game';
import { fixCameraOnMesh, moveCameraWithMovement } from './Camera';
import { convertPosition } from './Mesh';
import { Vec3 } from 'cannon-es'
import { off } from 'process';

export function moveMesh(mesh: Mesh, props: {
  movement: BVec3,
}) {
  const { movement } = props
  mesh.position.x += movement.x;
  mesh.position.y += movement.y;
  mesh.position.z += movement.z;
}

export function moveUser(game: Game, props: {
  userMovement: UserMovement,
  uid: string /// This is the playing user id
}) {
  const { userMovement, uid } = props;

  const changeInPosition = userMovement.changeInPosition;
  // const mesh: Mesh | undefined = game.userMeshesTable[userMovement.uid];

  const gameObject = game.gameObjectsHashTable[userMovement.uid]
  if (changeInPosition && gameObject) {

    // moveMesh(mesh, { movement: changeInPosition })
    moveGameObject(game, { 
      uid: uid,
      movement: changeInPosition 
    })

    // / If movement is user's
    if (userMovement.uid === uid) {
      const camera = game.camera 
      if (camera) {
        // moveCameraWithMovement(game.camera, {
        //   movement: changeInPosition
        // }) 

      }
    }
  }
}

export function moveLocalUser(game: Game, props: {
  uid: string,
  movement: BVec3
}) {
  const { uid, movement } = props;
  const mesh: Mesh | undefined = game.userMeshesTable[uid];

  if (mesh) {
    moveGameObject(game, {
      uid, movement
    })
  }

}

export function setMeshAtPosition(mesh: Mesh, props: {
  position: BVec3
}) {
  const { position } = props
  console.log(`Position: ${JSON.stringify(position)}`)
  const { x, y, z } = position
  mesh.position.copy(new Vector3(x, y, z))
}

export async function setUserAtPosition(game: Game, props: {
  uid: string,
  position: BVec3 
}) {
  const { uid, position } = props;
  const userMesh = game.userMeshesTable[uid]

  if (userMesh) {
    setMeshAtPosition(userMesh, { position: position })
  }
}

export async function moveGameObject(game: Game, props: {
  uid: string
  movement: BVec3
}) {
  console.log("Moving gaming object")
  const { movement, uid } = props

  const gameObj = game.gameObjectsHashTable[uid] 
  
  if (gameObj) {
    console.log("Game object exists")
    // 1. Get current position 
    const meshPosition = gameObj.body.position

    // 2. Update position with movement 
    const currentPosition: BVec3 = {
      x: meshPosition.x += movement.x,
      y: meshPosition.y += movement.y,
      z: meshPosition.z += movement.z
    }
    const { threeVec, cannonVec } = convertPosition(currentPosition)

    // 3. Update mesh
    game.gameObjectsHashTable[uid].mesh.position.copy(threeVec)

    // 4. Update body 
    game.gameObjectsHashTable[uid].body.position.copy(cannonVec)

  } else {
    console.log(`Game object uid ${uid} does not exist`)
  }
}

export async function applyJumpForceToUser(game: Game, props: {
  uid: string;
}) {
  console.log("Applying jump impulse")
  const { uid } = props;
  const userGameObject = game.gameObjectsHashTable[uid];
  if (userGameObject) {   
    console.log("Found user object")

    const force = new Vec3(0, 3, 0)
    const offset = new Vec3(0, 0 , 0)
    userGameObject.body.applyImpulse(force,  offset)
  }
}
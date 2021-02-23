import Game from '../Game';
import { Mesh } from 'three'
import { Position, UserMovement } from '../../models/Game';
import { moveCameraWithMovement } from './Camera';

export function moveMesh(mesh: Mesh, props: {
  movement: Position,
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
  const mesh: Mesh | undefined = game.userMeshesTable[userMovement.uid];
  if (changeInPosition && mesh) {

    moveMesh(mesh, { movement: changeInPosition })

    // / If movement is user's
    if (userMovement.uid === uid) {
      const camera = game.camera 
      if (camera) {
        moveCameraWithMovement(game.camera, {
          movement: changeInPosition
        })
      }
    }
  }
}

export function moveLocalUser(game: Game, props: {
  uid: string,
  movement: Position
}) {
  const { uid, movement } = props;
  const mesh: Mesh | undefined = game.userMeshesTable[uid];

  if (mesh) {
    moveMesh(mesh, {
      movement: movement
    })

    moveCameraWithMovement(game.camera, {
      movement: movement
    })
  }

}

export function setMeshAtPosition(mesh: Mesh, props: {
  position: Position
}) {
  const { position } = props
  mesh.position.x = position.x 
  mesh.position.y = position.y 
  mesh.position.z = position.z
}

export async function setUserAtPosition(game: Game, props: {
  uid: string,
  position: Position 
}) {
  const { uid, position } = props;
  const userMesh = game.userMeshesTable[uid]

  if (userMesh) {
    setMeshAtPosition(userMesh, { position: position })
  }
}
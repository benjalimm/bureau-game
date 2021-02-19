import Game from '../Game'
import { Position } from '../../models/Game'
import { SphereGeometry, MeshPhongMaterial, Mesh } from 'three';

export function removeUserMesh(game: Game, props: { uid: string } ) {
  const { uid } = props
  const existingMesh = game.userMeshesTable[uid];
  if (existingMesh) {
    game.scene.remove(existingMesh);
  }
}

export function addUserMesh(game: Game, props: { 
  uid: string, 
  position: Position
}): THREE.Mesh {
  const { uid, position } = props;
  /// Remove existing user mesh if it exists
  removeUserMesh(game, { uid: uid });

  const userMesh = createNewSphereMesh(game);
  game.userMeshesTable[uid] = userMesh;
  game.scene.add(userMesh);

  /// Set initial position
  userMesh.position.x = position.x;
  userMesh.position.z = position.y;
  userMesh.position.y = position.z;
  
  return userMesh;
}

export function createNewSphereMesh(game: Game): THREE.Mesh {
  const geometry = new SphereGeometry(1, 20);
  const material = new MeshPhongMaterial({
    color:     0xff00ff,
    wireframe: false
  });
  const mesh = new Mesh(geometry, material);
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  return mesh;
}


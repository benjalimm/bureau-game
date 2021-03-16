import Game from '../Game'
import { BVec3 } from '../../models/Game'
import { SphereGeometry, MeshPhongMaterial, Mesh, Vector3 } from 'three';
import { Body, Sphere, Vec3 } from 'cannon-es'
import { defaultMaterial } from './Physics/Material';

export function removeUserMesh(game: Game, props: { uid: string } ) {
  const { uid } = props
  const existingMesh = game.userMeshesTable[uid];
  if (existingMesh) {
    game.scene.remove(existingMesh);
  }
}

export function addUserMesh(game: Game, props: { 
  uid: string, 
  position: BVec3
}): Mesh {
  const { uid, position } = props;
  /// Remove existing user mesh if it exists
  removeUserMesh(game, { uid: uid });

  const { threeVec, cannonVec } = convertPosition(position)

  const radius = 1
  const userMesh = createNewSphereMesh(game, { radius: radius });
  game.userMeshesTable[uid] = userMesh;
  game.scene.add(userMesh);

  /// Set initial position
  userMesh.position.copy(threeVec)

  //Adding physics body to sphere
  const sphereShape = new Sphere(radius)
  const sphereBody = new Body({
    mass: 10,
    position: cannonVec,
    shape: sphereShape,
    material: defaultMaterial
  })

  sphereBody.position.copy(cannonVec)
  game.physicsManager.physicsWorld.addBody(sphereBody)

  game.gameObjectsHashTable[uid] = {
    mesh: userMesh,
    body: sphereBody
  }
  
  return userMesh;
}

export function createNewSphereMesh(game: Game, 
  props: { radius: number }): Mesh {
  const { radius } = props;
  const geometry = new SphereGeometry(radius, 20);
  const material = new MeshPhongMaterial({
    color:     0xff00ff,
    wireframe: false
  });
  const mesh = new Mesh(geometry, material);
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  return mesh;
}

export function convertPosition(position: BVec3): {
  threeVec: Vector3,
  cannonVec: Vec3
} {
  return {
    threeVec: new Vector3(position.x, position.y, position.z),
    cannonVec: new Vec3(position.x, position.y, position.z)
  }
}


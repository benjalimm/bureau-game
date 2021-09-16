import Game from '../Game'
import { Position } from '../../models/Game'
import { SphereGeometry, MeshPhongMaterial, Mesh } from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const GLTFLoader = import('three/examples/jsm/loaders/GLTFLoader').then((mod) => {
  return mod.GLTFLoader
});

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

export async function loadGLTFModel(game: Game, { filePath }: { filePath: string})  {
  console.log("Loading GLTF model")
  const gltfLoader = await GLTFLoader
  const loader = new gltfLoader()
  loader.load(filePath, (gltf) => {
    console.log("Loaded model:")
    console.log(gltf.scene)

    game.scene.add(gltf.scene)
    gltf.scene.rotateY(90)
    gltf.scene.receiveShadow = true 
  })
}


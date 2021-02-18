import * as THREE from 'three';
import {
  UserState,
  GameData,
  Position
} from '../../models/Game';
import { HashTable } from '../../models/Common';
import { RoomParticipant } from '../../models/User';
import { Room } from '../Room';
import { onParticipantChange } from './ParticipantMethods';
import { setupLights, setupShadows } from './Lights'
import { setupCamera, attachCameraToUser } from './Camera'
import { setupGround } from './Ground'
import { handlePressedKeys } from './Keys'
import { keyboardManager } from '../../services/KeyboardManager';

export type ParticipantChangeFunction = (
  participant: RoomParticipant | null,
  currentParticipants: RoomParticipant[]
) => void;

export default class Game {
  renderer?: THREE.WebGLRenderer;
  camera?: THREE.PerspectiveCamera;
  scene?: THREE.Scene;
  currentRoom?: Room;

  userStates: UserState[];
  userMeshesTable: HashTable<THREE.Mesh> = {};

  participantChangesListenerHashTable: HashTable<ParticipantChangeFunction> = {};

  player = { height: 1.8, speed: 0.2, turnSpeed: Math.PI * 0.02 };
  
  initialize(height: number, width: number) {
    
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });

    this.renderer.setClearColor('#000000');
    this.renderer.setSize(width, height);
    setupGround(this);
    
    setupCamera(this, { 
      aspect: width / height 
    })
    setupShadows(this);
    setupLights(this);
  }

  renderScene() {
    this.renderer.render(this.scene, this.camera);
  }

  handleResize(height: number, width: number) {
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderScene();
  }

  animate() {
    handlePressedKeys(this, {
      pressedKeys: keyboardManager.pressedKeys
    })
    this.renderScene();
  }

  deinitialize() {
    Object.keys(this.userMeshesTable).forEach((key) => {
      const mesh = this.userMeshesTable[key];
      this.scene.remove(mesh);
    });
  }

  didReceiveGameData(gameData: GameData, uid: string) {
    console.log('didReceiveGameData');
    gameData.userMovements.forEach((movement) => {
      const changeInPosition = movement.changeInPosition;
      const mesh: THREE.Mesh | undefined = this.userMeshesTable[movement.uid];
      if (changeInPosition && mesh) {
        mesh.position.x += changeInPosition.x;
        mesh.position.y += changeInPosition.y;
        mesh.position.z += changeInPosition.z;

        /// If movement is user's
        if (movement.uid === uid) {
          this.camera.position.x += changeInPosition.x;
          this.camera.position.y += changeInPosition.y;
          this.camera.position.z += changeInPosition.z;
        }
      }
    });

    gameData.userStates.forEach((userState) => {
      const mesh: THREE.Mesh | undefined = this.userMeshesTable[userState.uid];

      if (mesh) {
        mesh.position.x = userState.position.x;
        mesh.position.y = userState.position.y;
        mesh.position.z = userState.position.z;
      }
    });
  }

  removeUserMesh(uid: string) {
    const existingMesh = this.userMeshesTable[uid];
    if (existingMesh) {
      this.scene.remove(existingMesh);
    }
  }

  addUserMesh(uid: string, position: Position): THREE.Mesh {
    /// Remove existing user mesh if it exists
    this.removeUserMesh(uid);

    const userMesh = this.createNewSphereMesh();
    this.userMeshesTable[uid] = userMesh;
    this.scene.add(userMesh);

    /// Set initial position
    userMesh.position.x = position.x;
    userMesh.position.z = position.y;
    userMesh.position.y = position.z;
    return userMesh;
  }

  private createNewSphereMesh(): THREE.Mesh {
    const geometry = new THREE.SphereGeometry(1, 20);
    const material = new THREE.MeshPhongMaterial({
      color:     0xff00ff,
      wireframe: false
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    return mesh;
  }

  initializeInitialUserStates(userStates: UserState[], userId: string) {
    this.userStates = userStates;

    userStates.forEach((userState) => {
      this.addUserMesh(userState.uid, userState.position);
    });

    attachCameraToUser(this, { 
      uid: userId
    });
  }

  initializeRoom(roomId: string, participants: RoomParticipant[]) {
    this.currentRoom = new Room(roomId);
    this.currentRoom.participants = participants;
    onParticipantChange(this, {
      event: 'Initialized',
      changingParticipant: null,
      currentParticipants: participants
    });
  }

}

const game = new Game();
export { game };

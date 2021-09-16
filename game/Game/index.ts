import * as THREE from 'three';
import {
  UserState,
  GameData
} from '../../models/Game';
import { HashTable } from '../../models/Common';
import { RoomParticipant } from '../../models/User';
import { Room } from '../Room';
import { onParticipantChange } from './Participants';
import { setupLights, setupShadows } from './Lights'
import { setupCamera, attachCameraToUser } from './Camera'
import { setupGround } from './Ground'
import { handlePressedKeys } from './Keys'
import { keyboardManager } from '../../services/KeyboardManager';
import { moveUser, setMeshAtPosition } from './Movement';
import { addUserMesh, loadGLTFModel } from './Mesh';

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

    loadGLTFModel(this, { filePath: "./3dassets/arcadeMachine.glb"})
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
      moveUser(this, {
        userMovement: movement,
        uid: uid
      })
    });

    gameData.userStates.forEach((userState) => {
      const mesh: THREE.Mesh | undefined = this.userMeshesTable[userState.uid];

      if (mesh) {
        setMeshAtPosition(mesh, {
          position: userState.position
        })
      }
    });
  }

  initializeInitialUserStates(userStates: UserState[], userId: string) {
    this.userStates = userStates;

    userStates.forEach((userState) => {
      
      addUserMesh(this, { 
        uid: userState.uid,
        position: userState.position
      })
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

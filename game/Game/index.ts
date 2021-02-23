import * as THREE from 'three';
import {
  UserState,
  GameData,
  GameObjectState
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
import { addUserMesh } from './Mesh';
import { World } from 'cannon-es'
import { Vector3 } from 'three';
import { setupPhysicsMaterials } from './Physics/Material';

export type ParticipantChangeFunction = (
  participant: RoomParticipant | null,
  currentParticipants: RoomParticipant[]
) => void;

export default class Game {

  /* THREE JS states */
  renderer?: THREE.WebGLRenderer;
  scene?: THREE.Scene;
  camera?: THREE.PerspectiveCamera;

  /* Room or participant states  */
  currentRoom?: Room;
  userStates: UserState[];
  userMeshesTable: HashTable<THREE.Mesh> = {};
  participantChangesListenerHashTable: HashTable<ParticipantChangeFunction> = {}
  gameObjectsHashTable: HashTable<GameObjectState> = {}
  groundObjectState?: GameObjectState

  /* Physics state */
  physicsWorld: World;
  clock: THREE.Clock = new THREE.Clock()
  oldElapsedTime = 0

  player = { height: 1.8, speed: 0.2, turnSpeed: Math.PI * 0.02 };

  constructor() {
    
    this.physicsWorld = new World()
    this.physicsWorld.gravity.set(0, -9.82, 0)
  }
  
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
    setupPhysicsMaterials(this)
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

  tick() {
    const elapsedTime = this.clock.getElapsedTime()
    const deltaTime = elapsedTime - this.oldElapsedTime
    this.oldElapsedTime = elapsedTime 

    this.physicsWorld.step(1 / 60, deltaTime, 3)

    handlePressedKeys(this, {
      pressedKeys: keyboardManager.pressedKeys
    })

    //Update physics
    for (const key of Object.keys(this.gameObjectsHashTable)) {
      const gameObject = this.gameObjectsHashTable[key]
      const { x, y, z } = gameObject.body.position
      gameObject.mesh.position.copy(new Vector3(x, y, z))
    }

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

    // gameData.userMovements.forEach((movement) => {
    //   moveUser(this, {
    //     userMovement: movement,
    //     uid: uid
    //   })
    // });

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

  addGameObjectState(props: {
    gameObjectState: GameObjectState,
    id: string 
  }) {
    const { gameObjectState, id } = props;
    this.gameObjectsHashTable[id] = gameObjectState
  }

}

const game = new Game();
export { game };

import * as THREE from 'three';
import {
  GameObjectState, UserMovement
} from '../../models/GameData';
import { HashTable } from '../../models/Common';
import { RoomParticipant } from '../../models/User';
import { Room } from '../Room';
import { onParticipantChange } from './Participants';
import { setupLights, setupShadows } from './Lights'
import { setupCamera, attachCameraToUser, fixCameraOnMesh } from './Camera'
import { setupGround } from './Ground'
import { handlePressedKeys } from './Keys'
import { keyboardManager } from '../../services/KeyboardManager';
import { moveMesh, moveUser, setMeshAtPosition } from './Movement';
import { addUserMesh } from './Mesh';
import { World, SAPBroadphase } from 'cannon-es'
import { Vector3 } from 'three';
import { setupPhysicsMaterials } from './Physics/Material';
import { getCurrentUserId } from '../../services/Authentication';
import { LoopData, ObjectState } from "../../models/RenderLoop"
import PhysicsManager from './Physics';

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
  userMeshesTable: HashTable<THREE.Mesh> = {};
  participantChangesListenerHashTable: HashTable<ParticipantChangeFunction> = {}
  gameObjectsHashTable: HashTable<GameObjectState> = {}
  groundObjectState?: GameObjectState
  currentLoopData?: LoopData

  /* Physics state */
  // physicsWorld: World;
  // clock: THREE.Clock = new THREE.Clock()
  // oldElapsedTime = 0
  physicsManager = new PhysicsManager()

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
    this.physicsManager.step()
    //Update physics
    for (const key of Object.keys(this.gameObjectsHashTable)) {
      const gameObject = this.gameObjectsHashTable[key]
      const { x, y, z } = gameObject.body.position
      gameObject.mesh.position.copy(new Vector3(x, y, z))

      const uid = getCurrentUserId()
      if (key === uid) {
        fixCameraOnMesh(game, { mesh: gameObject.mesh })
      }
    }

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

  didReceiveRenderLoopData(data: LoopData) {
    
    const uid = getCurrentUserId()
    console.log(`Object states ${JSON.stringify(data.state.objectStates)}`);
    
    //Set user to global state - not working I think
    data.state.objectStates.forEach(objState => {
      const mesh: THREE.Mesh | undefined = this.userMeshesTable[objState.id];

      if (mesh) {
        console.log("Mesh exist, setting position")
        setMeshAtPosition(mesh, {
          position: objState.position
        })
        
      }
    })

    //Move user based on change in state
    data.actions.forEach(action => {
      const movement = action.data.movement as UserMovement

      if (movement.uid === uid) {
        moveUser(this, {
          uid: uid,
          userMovement: movement
        })
      }
      
    })
  }

  initializeInitialObjectStates(objectStates: ObjectState[], userId: string) {
    console.log("Initializing initial object states")
    // this.userStates = userStates;

    objectStates.forEach((state) => {
      
      addUserMesh(this, { 
        uid: state.id,
        position: state.position
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

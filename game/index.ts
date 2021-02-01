import * as THREE from 'three'
import { CameraHelper, Light } from 'three'
import { socketManager } from '../services/SocketManager'
import { UserState, GameData, Position } from '../models/Game'
import { HashTable } from '../models/Common';
import { RoomParticipant } from '../models/User';
import { Room } from './Room'


type ParticipantChangeEvent = "Join" | "Leave"
type ParticipantChangeFunction = (
  participant: RoomParticipant, 
  currentParticipants: RoomParticipant[]) 
  => void

export default class Game {
  static current?: Game
  renderer?: THREE.WebGLRenderer
  camera?: THREE.PerspectiveCamera
  scene?: THREE.Scene
  currentRoom: Room

  pressedKeys = {}

  userStates: UserState[]
  userMeshesTable: HashTable<THREE.Mesh> = {}
  
  listenerHashTable: HashTable<ParticipantChangeFunction> = {}


  player = { height:1.8, speed:0.2, turnSpeed:Math.PI*0.02 };


  initialize(height: number, width: number) {
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x87ceeb)
    this.camera = new THREE.PerspectiveCamera(90, width/height, 0.1, 1000)
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    
    
    this.renderer.setClearColor('#000000')
    this.renderer.setSize(width, height)
    this.setupGround()
    this.setupCamera()
    this.setupShadows()
    this.setupLights()
  }


  private setupCamera() {
    this.camera.position.set(-1, 20, -10);
  }

  private setupGround() {
    const geo = new THREE.PlaneGeometry(100,100, 10, 10)
    const mat = new THREE.MeshPhongMaterial({ color: 0x58d10d, wireframe: false });
    const plane = new THREE.Mesh(geo, mat);
    plane.rotation.x -= Math.PI / 2
    plane.receiveShadow = true
    this.scene.add(plane);
  }

  private setupShadows() {
    //1. Enable shadows in renderer
    this.renderer.shadowMap.enabled = true 
    this.renderer.shadowMap.type = THREE.BasicShadowMap
  }

  private setupLights() {
    /// Ambient light that fills the whole room 
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)

    /// Point light for the camera 
    const pointLight = new THREE.PointLight(0xffffff, 0.5, 18)
    pointLight.position.set(-3, 6, -3)
    pointLight.castShadow = true 
    pointLight.shadow.camera.near = 0.1 
    pointLight.shadow.camera.far = 25 


    this.scene.add(ambientLight)
    this.scene.add(pointLight)
  }

  renderScene() {
    this.renderer.render(this.scene, this.camera)
  }

  handleResize(height: number, width: number) {
    this.renderer.setSize(width, height)
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderScene()
  }

  animate() {
    this.handlePressedKeys()
    this.renderScene()
  }

  deinitialize() {

    Object.keys(this.userMeshesTable).forEach(key => {
      const mesh = this.userMeshesTable[key]
      this.scene.remove(mesh)
    })    
    
  }

  private handlePressedKeys() {
    const speed = this.player.speed
    if(this.pressedKeys[87]){ // W key
      console.log("DidPress W key")
      this.camera.position.x -= Math.sin(this.camera.rotation.y) * this.player.speed;
      this.camera.position.z -= -Math.cos(this.camera.rotation.y) * this.player.speed;
    }
    if(this.pressedKeys[83]){ // S key
      this.camera.position.x += Math.sin(this.camera.rotation.y) * this.player.speed;
      this.camera.position.z += -Math.cos(this.camera.rotation.y) * this.player.speed;
    }
    if(this.pressedKeys[65]){ // A key
      this.camera.position.x += Math.sin(this.camera.rotation.y + Math.PI/2) * this.player.speed;
      this.camera.position.z += -Math.cos(this.camera.rotation.y + Math.PI/2) * this.player.speed;
    }
    if(this.pressedKeys[68]){ // D key
      this.camera.position.x += Math.sin(this.camera.rotation.y - Math.PI/2) * this.player.speed;
      this.camera.position.z += -Math.cos(this.camera.rotation.y - Math.PI/2) * this.player.speed;
    }
    
    if(this.pressedKeys[37]){ // left arrow key
      // this.camera.position.x += speed
      // this.cube.position.x += speed
      socketManager.emitMovement("ABC", {
        x: speed,
        y: 0,
        z: 0
      })
    }

    if(this.pressedKeys[38]){ // Up arrow key
      // this.camera.position.z += speed
      // this.cube.position.z += speed

      socketManager.emitMovement("ABC", {
        x: 0,
        y: 0,
        z: speed
      })
    }
    if(this.pressedKeys[39]){ // right arrow key
      // this.camera.position.x -= speed
      // this.cube.position.x -= speed

      socketManager.emitMovement("ABC", {
        x: -speed,
        y: 0,
        z: 0
      })
    }

    if(this.pressedKeys[40]){ // down arrow key
      // this.camera.position.z -= speed;
      // this.cube.position.z -= speed

      socketManager.emitMovement("ABC", {
        x: 0,
        y: 0,
        z: -speed
      })
    }
  }

  didReceiveGameData(gameData: GameData, uid: string) {
    console.log("didReceiveGameData")
    gameData.userMovements.forEach(movement => {
      const changeInPosition = movement.changeInPosition
      const mesh: THREE.Mesh | undefined = this.userMeshesTable[movement.uid]
      if (changeInPosition && mesh) {
        mesh.position.x += changeInPosition.x
        mesh.position.y += changeInPosition.y
        mesh.position.z += changeInPosition.z


        /// If movement is user's
        if (movement.uid === uid) {
          this.camera.position.x += changeInPosition.x
          this.camera.position.y += changeInPosition.y
          this.camera.position.z += changeInPosition.z
        }
      }
    })

    gameData.userStates.forEach(userState => {
      const mesh: THREE.Mesh | undefined = this.userMeshesTable[userState.uid]

      if (mesh) {
        mesh.position.x = userState.position.x
        mesh.position.y = userState.position.y
        mesh.position.z = userState.position.z
      }
    })
  }

  
  keyDidInteract(keyCode: number, didPress: boolean) {
    this.pressedKeys[keyCode] = didPress 
  }

  removeUserMesh(uid: string) {
    const existingMesh = this.userMeshesTable[uid]
    if (existingMesh) {
      this.scene.remove(existingMesh)
    }
  }

  addUserMesh(uid: string, position: Position): THREE.Mesh {

    /// Remove existing user mesh if it exists
    this.removeUserMesh(uid); 

    const userMesh = this.createNewSphereMesh()
    this.userMeshesTable[uid] = userMesh 
    this.scene.add(userMesh)

    /// Set initial position 
    userMesh.position.x = position.x
    userMesh.position.z = position.y
    userMesh.position.y = position.z
    return userMesh
  }

  participantDidJoinRoom(participant: RoomParticipant) {
    this.currentRoom.addParticipant(participant)
    this.onParticipantChange("Join", participant)
    this.addUserMesh(participant.uid, { x: 1, y: 1, z: 1})
  }

  participantDidLeaveRoom(participant: RoomParticipant) {
    this.currentRoom.removeParticipant(participant.uid)
    this.onParticipantChange("Leave", participant)
    this.removeUserMesh(participant.uid);
  }



  private createNewSphereMesh(): THREE.Mesh {
    const geometry = new THREE.SphereGeometry(1,20)
    const material = new THREE.MeshPhongMaterial({ color: 0xff00ff , wireframe: false })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.receiveShadow = true 
    mesh.castShadow = true
    return mesh 
  }

  initializeInitialUserStates(userStates: UserState[], userId: string) {
    this.userStates = userStates;

    userStates.forEach(userState => {
      this.addUserMesh(userState.uid, userState.position)
    })

    this.attachCameraToUser(userId)
  }

  initializeRoom(roomId: string, participants: RoomParticipant[]) {
    this.currentRoom = new Room(roomId);
    this.currentRoom.participants = participants
  }

  attachCameraToUser(uid: string) {
    const userMesh: THREE.Mesh | undefined = this.userMeshesTable[uid]

    if (userMesh) {
      this.camera.lookAt(userMesh.position);  
    }
  }

  onParticipantChangeEvent(event: ParticipantChangeEvent, func: ParticipantChangeFunction) {
    this.listenerHashTable[event] = func;
  }

  removeParticipantChangeEventListener(event: ParticipantChangeEvent) {
    this.listenerHashTable[event] = undefined;
  }

  private onParticipantChange(
    event: ParticipantChangeEvent, 
    participant: RoomParticipant) {
    const func = this.listenerHashTable[event]
    if(func) {
      func(participant, this.currentRoom.participants)
    }
  }


}


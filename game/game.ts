import * as THREE from 'three'
import { Light } from 'three'


export default class Game {
  renderer?: THREE.WebGLRenderer
  camera?: THREE.PerspectiveCamera
  scene?: THREE.Scene
  cube?: THREE.Mesh

  pressedKeys = {}
  player = { height:1.8, speed:0.2, turnSpeed:Math.PI*0.02 };


  initialize(height: number, width: number) {
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x87ceeb)
    this.camera = new THREE.PerspectiveCamera(90, width/height, 0.1, 1000)
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    
    
    this.renderer.setClearColor('#000000')
    this.renderer.setSize(width, height)
    this.setupCubeMesh()
    this.setupGround()
    this.setupCamera()
    this.setupShadows()
    this.setupLights()
  }
  
  private setupCubeMesh() {
    const geometry = new THREE.SphereGeometry(1)
    const material = new THREE.MeshPhongMaterial({ color: 0xff00ff , wireframe: false })
    this.cube = new THREE.Mesh(geometry, material)
    this.cube.receiveShadow = true 
    this.cube.castShadow = true
    this.cube.position.y += 1
    this.camera.position.z = 20
    this.scene.add(this.cube)
  }

  private setupCamera() {
    this.camera.position.set(-1, 20, -10);
    this.camera.lookAt(new THREE.Vector3(0,this.player.height,0));
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)

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
    this.cube.rotation.x += 0.01
    this.cube.rotation.y += 0.01

    this.handlePressedKeys()
    
    this.renderScene()
  }

  deinitialize() {
    this.scene.remove(this.cube)
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
      this.camera.position.x += speed
      this.cube.position.x += speed
    }

    if(this.pressedKeys[38]){ // Up arrow key
      this.camera.position.z += speed
      this.cube.position.z += speed
    }
    if(this.pressedKeys[39]){ // right arrow key
      this.camera.position.x -= speed
      this.cube.position.x -= speed
    }

    if(this.pressedKeys[40]){ // down arrow key
      this.camera.position.z -= speed;
      this.cube.position.z -= speed
    }
  }

  


  keyDidInteract(keyCode: number, didPress: boolean) {
    this.pressedKeys[keyCode] = didPress 
  }

}


import * as THREE from 'three'


export default class Game {
  renderer?: THREE.WebGLRenderer
  camera?: THREE.PerspectiveCamera
  scene?: THREE.Scene
  cube?: THREE.Mesh

  pressedKeys = {}
  player = { height:1.8, speed:0.2, turnSpeed:Math.PI*0.02 };


  initialize(height: number, width: number) {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(90, 1280/720, 0.1, 1000)
    this.setupCamera()
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: 0xff00ff })
    this.cube = new THREE.Mesh(geometry, material)

    this.camera.position.z = 20
    this.scene.add(this.cube)
    this.renderer.setClearColor('#000000')
    this.renderer.setSize(width, height)

    var geo = new THREE.PlaneGeometry(10,10)
    var mat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    var plane = new THREE.Mesh(geo, mat);

    this.scene.add(plane);
  }

  private setupCamera() {
    // this.camera.position.set(0, this.player.height, -5);
    // this.camera.lookAt(new THREE.Vector3(0,this.player.height,0));
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
      this.camera.rotation.y -= this.player.turnSpeed;
    }

    if(this.pressedKeys[38]){ // Up arrow key
      this.camera.rotation.z += this.player.turnSpeed;
    }
    if(this.pressedKeys[39]){ // right arrow key
      this.camera.rotation.y += this.player.turnSpeed;
    }

    if(this.pressedKeys[40]){ // down arrow key
      this.camera.rotation.z -= this.player.turnSpeed;
    }
  }


  keyDidInteract(keyCode: number, didPress: boolean) {
    this.pressedKeys[keyCode] = didPress 
  }

}
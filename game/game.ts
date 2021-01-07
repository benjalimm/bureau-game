import * as THREE from 'three'


export default class Game {
  renderer?: THREE.WebGLRenderer
  camera?: THREE.PerspectiveCamera
  scene?: THREE.Scene
  cube?: THREE.Mesh

  initialize(height: number, width: number) {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: 0xff00ff })
    this.cube = new THREE.Mesh(geometry, material)

    this.camera.position.z = 4
    this.scene.add(this.cube)
    this.renderer.setClearColor('#000000')
    this.renderer.setSize(width, height)
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
  }

  deinitialize() {
    this.scene.remove(this.cube)
  }
}
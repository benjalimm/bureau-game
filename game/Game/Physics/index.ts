import * as CANNON from 'cannon-es'
import { SAPBroadphase } from 'cannon-es'
import { Clock } from 'three'

export default class PhysicsManager {
  physicsWorld: CANNON.World
  clock: Clock = new Clock()
  oldElapsedTime = 0 

  constructor() {
    console.log("Setting up physics physics")
    this.physicsWorld = new CANNON.World()
    this.physicsWorld.gravity.set(0, -9.83, 0)
    this.physicsWorld.broadphase = new SAPBroadphase(this.physicsWorld)
  }

  addNewMesh(props: { 
    mass: number,
    position: CANNON.Vec3
    shape: CANNON.Shape,
    material: CANNON.Material
  }) {
    const { shape, mass, position, material } = props;

    const body = new CANNON.Body({
      mass: mass,
      position: position,
      shape: shape,
      material: material
    })

    this.physicsWorld.addBody(body)
  }

  applyForce(props: {
    body: CANNON.Body
  }) {
    
  }

  step() {
    const elapsedTime = this.clock.getElapsedTime()
    const deltaTime = elapsedTime - this.oldElapsedTime
    this.oldElapsedTime = elapsedTime
    this.physicsWorld.step(1 / 60, deltaTime, 3)
  }

}


import Game from '../Game';
import { PlaneGeometry, MeshPhongMaterial, Mesh } from 'three';
import { Plane, Body, Vec3 } from 'cannon-es'

export function setupGround(game: Game) {

  // Add 3D object 
  const geo = new PlaneGeometry(100, 100, 10, 10);
  const mat = new MeshPhongMaterial({
    color: 0x58d10d,
    wireframe: false
  });
  const plane = new Mesh(geo, mat);
  plane.rotation.x -= Math.PI / 2;
  plane.receiveShadow = true;
  game.scene.add(plane);

  // Add physics object 
  const floorShape = new Plane()
  const floorBody = new Body()
  floorBody.addShape(floorShape)
  floorBody.mass = 0 //
  floorBody.quaternion.setFromAxisAngle(
    new Vec3(-1, 0 , 0),
    Math.PI * 0.5
  )
  game.physicsManager.physicsWorld.addBody(floorBody)

  game.groundObjectState = {
    mesh: plane,
    body: floorBody
  }
}

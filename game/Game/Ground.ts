import Game from '../Game';
import { PlaneGeometry, MeshPhongMaterial, Mesh } from 'three';

export function setupGround(game: Game) {
  const geo = new PlaneGeometry(100, 100, 10, 10);
  const mat = new MeshPhongMaterial({
    color: 0x58d10d,
    wireframe: false
  });
  const plane = new Mesh(geo, mat);
  plane.rotation.x -= Math.PI / 2;
  plane.receiveShadow = true;
  game.scene.add(plane);
}

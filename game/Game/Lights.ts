import Game from '../Game'
import { AmbientLight, PointLight, BasicShadowMap } from 'three';

export function setupLights(game: Game) {
  /// Ambient light that fills the whole room
  const ambientLight = new AmbientLight(0xffffff, 0.8);

  /// Point light for the camera
  const pointLight = new PointLight(0xffffff, 0.5, 18);
  pointLight.position.set(-3, 6, -3);
  pointLight.castShadow = true;
  pointLight.shadow.camera.near = 0.1;
  pointLight.shadow.camera.far = 25;

  game.scene.add(ambientLight);
  game.scene.add(pointLight);
}

export function setupShadows(game: Game) {
  //1. Enable shadows in renderer
  game.renderer.shadowMap.enabled = true;
  game.renderer.shadowMap.type = BasicShadowMap;
}
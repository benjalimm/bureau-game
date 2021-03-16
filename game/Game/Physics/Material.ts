import { Material, ContactMaterial } from 'cannon-es'
import Game from '../../Game'

export const defaultMaterial = new Material('default')
export const sphereMaterial = new Material('sphere')

export const defaultSphereContactMaterial = new ContactMaterial(
  defaultMaterial,
  sphereMaterial, 
  {
    friction: 1,
    restitution: 0.8
  })

export function setupPhysicsMaterials(game: Game) {
  game.physicsManager.physicsWorld.addContactMaterial(defaultSphereContactMaterial)
  game.physicsManager.physicsWorld.defaultContactMaterial = defaultSphereContactMaterial
}


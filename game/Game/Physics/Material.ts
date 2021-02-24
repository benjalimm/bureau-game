import { Material, ContactMaterial } from 'cannon-es'
import Game from '../../Game'

export const defaultMaterial = new Material('default')
export const sphereMaterial = new Material('sphere')

export const defaultSphereContactMaterial = new ContactMaterial(
  defaultMaterial,
  sphereMaterial, 
  {
    friction: 0.2,
    restitution: 0.8
  })

export function setupPhysicsMaterials(game: Game) {
  game.physicsWorld.addContactMaterial(defaultSphereContactMaterial)
  game.physicsWorld.defaultContactMaterial = defaultSphereContactMaterial
}


import { BVec3 } from './GameData'

export interface PhysicsBodyData { 
  body: {
    mass: number, 
    position: BVec3,
    quarternion: {
      vector: BVec3,
      angle: number
    }, 
    materialType: string
  },
  shapeData: ShapeData
}

export interface ShapeData { 
  type: "PLANE" | "SPHERE" | "BOX",
  metadata: SphereMetadata | PlaneMetadata | CubeMetadata
}

export interface SphereMetadata {
  radius: number
}

export interface PlaneMetadata { 
  width: number,
  height: number, 
}

export interface CubeMetadata { 
  width: number,
  breadth: number,
  height: number
}
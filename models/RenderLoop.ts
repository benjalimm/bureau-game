
import { BVec3 } from './GameData'

export interface LoopData {
  events: GameEvent[],
  actions: GameAction[]
  state: GlobalObjectState
}

export interface GameEvent {
  eventType: string
  data: any
  timestamp: number;
}

export interface GameAction {
  actionType: string
  data: any;
  timestamp: number
}

export interface ObjectState {
  id: string;
  position: BVec3
  quaternion: any
}

export interface GlobalObjectState {
  objectStates: ObjectState[]
}
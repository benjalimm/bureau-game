import { Mesh } from 'three'
import  { Body } from 'cannon-es'

export interface BVec3 {
  x: number;
  y: number;
  z: number;
}

// export interface UserState {
//   uid: string;
//   position: BVec3;
//   // direction: number;
// }

export interface UserMovement {
  uid: string;
  movementType: 'WALK' | 'JOINED';
  changeInPosition?: BVec3;
  // changeInDirection?: number;
}

// export interface GameData {
//   userStates: UserState[];
//   userMovements: UserMovement[];
// }

/*  */
export interface OutgoingParticipantStateChangeData {
  type: 'MIC_MUTE_STATUS';
  data: MicMuteStateChangeData;
}

export interface GameObjectState {
  mesh: Mesh;
  body: Body;
}

/* 
Incoming requires uid to 
specify which user has experienced a state change 
*/
export interface IncomingParticipantStateChangeData
  extends OutgoingParticipantStateChangeData {
  uid: string;
}

export interface MicMuteStateChangeData {
  isMuted: boolean;
}

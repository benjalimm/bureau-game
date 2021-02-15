
export interface Position {
  x: number,
  y: number,
  z: number
}

export interface UserState {
  uid: string;
  position: Position;
  // direction: number;
}

export interface UserMovement {
  uid: string;
  movementType: "WALK" | "JOINED";
  changeInPosition?: Position;
  // changeInDirection?: number; 
}

export interface GameData {
  userStates: UserState[];
  userMovements: UserMovement[];
}

/*  */
export interface OutgoingParticipantStateChangeData {
  type: "MIC_MUTE_STATUS";
  data: MicMuteStateChangeData 
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
  isMuted: boolean 
}
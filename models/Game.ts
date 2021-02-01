
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

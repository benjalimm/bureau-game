
export interface Vector {
  x: number,
  y: number,
  z: number
}

export interface UserState {
  uid: string;
  position: Vector;
  // direction: number;
}

export interface UserMovement {
  uid: string;
  movementType: "WALK" | "JOINED";
  changeInPosition?: Vector;
  // changeInDirection?: number; 
}

export interface GameData {
  userStates: UserState[];
  userMovements: UserMovement[];
}
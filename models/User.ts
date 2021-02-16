export interface User {
  uid: string;
  name: string;
  email: string;
  profileImage?: {
    main: string
  },
  authType: "TWITTER"
}

export interface RoomParticipant {
  uid: string;
  name: string;
  profileImage?: {
    main: string
  }
  agoraUid: string;
  isMuted: boolean;
}

export interface ParticipantState {
  participant: RoomParticipant;
  isTalking: boolean;
}


export function isUser(obj: any): obj is User {
  if (obj === undefined) return false;
  const userObj = (obj as User)
  return (
    userObj.uid !== undefined &&
    userObj.name !== undefined && 
    userObj.email != undefined 
  );
}
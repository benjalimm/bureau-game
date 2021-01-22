/// Incoming


export interface ClientSocketData { 
	user: SocketUserDetails;
	data: any
}

export interface ServerSocketData { 
	data: any
}

export interface SocketUserDetails {
  uid: string;
  currentRoomId?: string | null;
  agoraUid: string;
}
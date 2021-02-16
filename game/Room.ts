import { RoomParticipant } from '../models/User';

export class Room {
  roomId: string;
  participants: RoomParticipant[];

  constructor(id: string) {
  	this.roomId = id;
  }

  addParticipant(participant: RoomParticipant) {
  	this.participants.push(participant);
  }

  removeParticipant(uid: string) {
  	const index = this.participants.findIndex((participant) => {
  		return participant.uid == uid;
  	});

  	if (index) {
  		this.participants.splice(index, 1);
  	}
  }

  participantMuteStateDidChange(props: {
    uid: string;
    isMuted: boolean;
  }): {
      changingParticipant: RoomParticipant;
      currentParticipants: RoomParticipant[];
    } | null {
  	const participantIndex = this.participants.findIndex(
  		(p) => p.uid === props.uid
  	);

  	if (participantIndex != -1) {
  		this.participants[participantIndex].isMuted = props.isMuted;

  		return {
  			changingParticipant: this.participants[participantIndex],
  			currentParticipants: this.participants
  		};
  	}

  	return null;
  }
}

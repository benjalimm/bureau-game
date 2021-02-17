import { RoomParticipant } from '../../models/User';
import Game, { ParticipantChangeEvent } from '../Game'

export function onParticipantChange(game: Game, props: {
  event: ParticipantChangeEvent;
  changingParticipant: RoomParticipant | null;
  currentParticipants: RoomParticipant[];
}) {
  const func = game.listenerHashTable[props.event];
  if (func) {
    func(props.changingParticipant, props.currentParticipants);
  }
}
export function participantDidJoinRoom(game: Game, participant: RoomParticipant) {
  game.currentRoom.addParticipant(participant);
  onParticipantChange(game, {
    event: 'Join',
    changingParticipant: participant,
    currentParticipants: game.currentRoom.participants
  });

  game.addUserMesh(participant.uid, { x: 1, y: 1, z: 1 });
}

export function participantDidLeaveRoom(game: Game, participant: RoomParticipant) {
  game.currentRoom.removeParticipant(participant.uid);
  onParticipantChange(game, {
    event: 'Leave',
    changingParticipant: participant,
    currentParticipants: game.currentRoom.participants
  });
  game.removeUserMesh(participant.uid);
}

export function participantMuteStateDidChange(game: Game, props: { uid: string; isMuted: boolean }) {
  const {
    changingParticipant,
    currentParticipants
  } = game.currentRoom?.participantMuteStateDidChange(props);

  onParticipantChange(game, {
    event: 'StateChange',
    changingParticipant: changingParticipant,
    currentParticipants: currentParticipants
  });
}
  
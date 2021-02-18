import { RoomParticipant } from '../../models/User';
import { socketManager } from '../../services/SocketManager';
import Game, { ParticipantChangeFunction } from '../Game'
import { OutgoingParticipantStateChangeData } from '../../models/Game';

export type ParticipantChangeEvent = 'Join' | 'Leave' | 'Initialized' | 'StateChange';

export function onParticipantChange(game: Game, props: {
  event: ParticipantChangeEvent;
  changingParticipant: RoomParticipant | null;
  currentParticipants: RoomParticipant[];
}) {
  const func = game.participantChangesListenerHashTable[props.event];
  if (func) {
    func(props.changingParticipant, props.currentParticipants);
  }
}

export function participantDidJoinRoom(game: Game, props: {
  participant: RoomParticipant
}) {

  game.currentRoom.addParticipant(props.participant);
  onParticipantChange(game, {
    event: 'Join',
    changingParticipant: props.participant,
    currentParticipants: game.currentRoom.participants
  });

  game.addUserMesh(props.participant.uid, { x: 1, y: 1, z: 1 });
}

export function participantDidLeaveRoom(game: Game, props: { 
  participant: RoomParticipant
}) {
  game.currentRoom.removeParticipant(props.participant.uid);
  onParticipantChange(game, {
    event: 'Leave',
    changingParticipant: props.participant,
    currentParticipants: game.currentRoom.participants
  });
  game.removeUserMesh(props.participant.uid);
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

export function onParticipantChangeEvent(game: Game, props: {
  event: ParticipantChangeEvent,
  onChange: ParticipantChangeFunction;
}): void {
  game.participantChangesListenerHashTable[props.event] = props.onChange;
}

export function removeParticipantChangeEventListener(event: ParticipantChangeEvent) {
  delete this.listenerHashTable[event] 
}

export function setMicToMute(game: Game, props: { state: boolean }) {
  const participantStateChangeData: OutgoingParticipantStateChangeData = {
    type: 'MIC_MUTE_STATUS',
    data: { isMuted: props.state }
  };

  const roomId = game.currentRoom?.roomId;
  if (roomId) {
    socketManager.emit(
      'participantStateChange',
      roomId,
      participantStateChangeData
    );
  }
  
}
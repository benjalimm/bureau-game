import SocketManager from '.'
import { RoomParticipant } from '../../models/User'
import  { IncomingParticipantStateChangeData, GameData, UserState } from '../../models/Game'
import { gameManager } from '../../game/GameManager';
import { participantDidJoinRoom, participantDidLeaveRoom, participantMuteStateDidChange } from '../../game/Game/Participants';
import { getCurrentUserId } from '../Authentication';

export function listenToParticipantDidJoinEvent(manager: SocketManager) {
  manager.listen('didJoin', (data) => {
    const participant = data.participant as RoomParticipant;
    console.log(`${participant.name} just joined`);
    
    const game = gameManager.currentGame

    if (game) {
      participantDidJoinRoom(game, { participant: participant }) 
    }
  });
}

export function listenToParticipantDidLeaveEvent(manager: SocketManager) {
  manager.listen('didLeave', (data) => {
    const participant = data.participant as RoomParticipant;
    const game = gameManager.currentGame
    if (game) {
      participantDidLeaveRoom(game, { participant: participant })
    }

  });
}

export function listenToParticipantStateChangeEvent(manager: SocketManager) {
  manager.listen('participantStateChange', (data) => {
    console.log('participantStateChange');
    const stateChangeData = data as IncomingParticipantStateChangeData;
    
    const game = gameManager.currentGame

    if (game) {
      participantMuteStateDidChange(game, {
        uid: stateChangeData.uid,
        isMuted: stateChangeData.data.isMuted
      })
    }
  });
}

export function listenToParticipantMovementEvent(manager: SocketManager) {
  manager.listen('movement', (data) => {
    
    const gameData = data as GameData;
    const uid = getCurrentUserId()

    if (uid) {
      gameManager.currentGame?.didReceiveGameData(
        gameData,
        uid
      );
    }
  });
}

export function listenToBureauGameErrors(manager: SocketManager) {
  manager.listen('bureauGameError', (data) => {
    console.log("BUREAU_GAME_ERROR:")
    console.log(data);
  });
}

export function listenToDidInitializeEvent(manager: SocketManager) {
  manager.listen('didInitialize', (data) => {
    console.log('didInitialize');
    console.log(data);

    const userStates = data.userStates as UserState[];
    const participants = data.participants as RoomParticipant[];
    const roomId = data.roomId as string;

    const uid = getCurrentUserId()
    /// Initialize initial user states

    if (uid) {
      gameManager.currentGame?.initializeInitialUserStates(
        userStates,
        uid
      );
      /// Initialize initial room participants
      gameManager.currentGame?.initializeRoom(roomId, participants);
    }
    
  });
}
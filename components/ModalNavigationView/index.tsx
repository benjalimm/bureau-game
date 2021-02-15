import styles from './modalNavigation.module.css'
import React, { useEffect, useState, useRef } from 'react'
import { RoomParticipant, ParticipantState } from '../../models/User'
import Game, { game } from '../../game/Game'
import { gameManager } from '../../game/GameManager';
import UserList from './UserList'
import TabBar from './TabBar';
import agoraManager from '../../services/AgoraManager';



export default function ModalNavigationView() {

  const [participantStates, setParticipantStates] = 
  useState<ParticipantState[]>([])
  const [roomParticipants, setRoomParticipants] = 
  useState<RoomParticipant[]>([])

  const [currentGame, setCurrentGame] = useState<Game>(null)
  
  //1. Listen to game changes
  useEffect(() => {
    gameManager.onGameChange((game) => {
      console.log("Game has been changed")
      setCurrentGame(game);
    })
  },[])

  //2. If game changes, reinitialize listeners 
  useEffect(() => {
    console.log("Game use effect triggered")
    
    currentGame?.onParticipantChangeEvent("Join", (joiningParticipant, currentParticipants) => {
      console.log("Participant joined")
      setRoomParticipants([...currentParticipants]);
    })

    currentGame?.onParticipantChangeEvent("Leave", (leavingParticipant, currentParticipants) => {
      console.log("Participant left")
      setRoomParticipants([...currentParticipants]);
    })

    currentGame?.onParticipantChangeEvent("Initialized", (joiningParticipant, currentParticipants) => {
      console.log("Participants initialized")
      console.log(currentParticipants)

      setRoomParticipants([...currentParticipants]);
    })
  }, [currentGame])

  

  useEffect(() => {

    agoraManager.listenToVolumeIndicatorForCurrentRoom("modalNavigation",(result) => {
      let states: ParticipantState[] = []
  
      result.forEach(agoraUser => {        
        const participant = roomParticipants.find(par => {
          return par.agoraUid === agoraUser.uid 
        })
        
        if (participant) {
          states.push({
            participant: participant,
            isTalking: agoraUser.level >= 0.05,
            isMuted: true
          })
        }
      })
      setParticipantStates([...states])
    })

  }, [roomParticipants])

  useEffect(() => {

    let states: ParticipantState[] = []

    if (roomParticipants.length > 0) {
      roomParticipants.forEach(par => {
        states.push({
          participant: par,
          isTalking: false,
          isMuted: true 
        })
      })
      setParticipantStates([...states])
      console.log(roomParticipants)
    } 
    
  }, [roomParticipants])

  return  (<div className={styles.modalView}>
      <h3> Benjamin's lobby</h3>
      <p>{ participantStates.length === 1 ? 
      `1 user online` : 
      `${participantStates.length} users online`
      }</p>
      <UserList participantStates={participantStates}/>
      <TabBar/>
    </div>)
}

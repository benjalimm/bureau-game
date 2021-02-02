import styles from './modalNavigation.module.css'
import React, { useEffect, useState } from 'react'
import { RoomParticipant } from '../../models/User'
import Game from '../../game/Game'
import { gameManager } from '../../game/GameManager';
import UserList from './UserList'

export default function ModalNavigationView() {

  const [participants, setParticipants] = useState<RoomParticipant[]>([])
  const [currentGame, setCurrentGame] = useState<Game>(null)

  useEffect(() => {
    console.log("Game use effect triggered")
    currentGame?.onParticipantChangeEvent("Join", (joiningParticipant, currentParticipants) => {
      console.log("Participant joined")
      console.log(currentParticipants)

      setParticipants(currentParticipants);
    })

    currentGame?.onParticipantChangeEvent("Leave", (leavingParticipant, currentParticipants) => {
      console.log("Participant left")
      console.log(currentParticipants)
      setParticipants(currentParticipants);
    })

    currentGame?.onParticipantChangeEvent("Initialized", (_, currentParticipants) => {
      console.log("Participants initialized")
      setParticipants(currentParticipants);
    })
  }, [currentGame])

  useEffect(() => {
    gameManager.onGameChange((game) => {
      console.log("Game has been changed")
      setCurrentGame(game);
    })
  },[])


  useEffect(() => {
    console.log("Participants state did change")
    console.log(participants)
  }, [participants])

  return  (<div className={styles.modalView}>
      <h3> Benjamin's lobby</h3>
      <p> 8 users online</p>
      <UserList participants={participants}/>
    </div>)
}






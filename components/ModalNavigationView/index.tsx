import styles from './modalNavigation.module.css'
import React, { useEffect, useState } from 'react'
import { RoomParticipant } from '../../models/User'
import Game from '../../game'
import UserList from './UserList'

export default function ModalNavigationView() {

  const [participants, setParticipants] = useState<RoomParticipant[]>()

  const users = [
    { name: "Benjamin Lim" },
    { name: "Lana Toogood" },
    { name: "Steven Lim" },
    { name: "James Stewart" },
    { name: "Cheryl Lim" }
]

useEffect(() => {
  Game.current!.onParticipantChangeEvent("Join", (joiningParticipant, currentParticipants) => {
    setParticipants(currentParticipants);
  })
}, [])

useEffect(() => {
  Game.current!.onParticipantChangeEvent("Leave", (leavingParticipant, currentParticipants) => {
    setParticipants(currentParticipants);
  })
}, [])


  return  (<div className={styles.modalView}>
      <h3> Benjamin's lobby</h3>
      <p> 8 users online</p>
      <UserList participants={participants}/>
    </div>)
}






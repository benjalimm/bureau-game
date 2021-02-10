
import styles from './modalNavigation.module.css'
import React from 'react'
import { RoomParticipant, ParticipantState } from '../../models/User'

interface ListProps { 
  participantStates: ParticipantState[] 
}
export default function UserList(props: ListProps)  {
  return <div className={styles.userList}>
    {
      props.participantStates.map((state, i) => 
      <UserCell name={state.participant.name} 
      imgLink={state.participant.profileImage.main}
      key={state.participant.uid}
      isTalking={state.isTalking}
      />)
    }
  </div>
}

interface CellProps  { 
  name: string, 
  imgLink: string,
  isTalking: boolean
}

const UserCell = (props: CellProps) => {
  const borderStyle = props.isTalking ? '3px solid grey' : '3px solid white'
  return (<div className={styles.userCell}>
    <img className={styles.userCircleImage} src={props.imgLink} style={
      {border: borderStyle}
    }/>
    <h4 className={styles.userName}>{props.name}</h4>
  </div>)

}
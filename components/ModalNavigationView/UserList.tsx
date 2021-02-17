
import styles from './styles.module.scss'
import React from 'react'
import { ParticipantState } from '../../models/User'

interface ListProps { 
  participantStates: ParticipantState[] 
}
export default function UserList(props: ListProps) {
  return <div className={styles.userList}>
    {
      props.participantStates.map((state, i) => 
        <UserCell name={state.participant.name} 
          imgLink={state.participant.profileImage.main}
          key={state.participant.uid}
          isTalking={state.isTalking}
          isMuted={state.participant.isMuted}
        />)
    }
  </div>
}

interface CellProps { 
  name: string, 
  imgLink: string,
  isTalking: boolean
  isMuted: boolean
}

const UserCell = (props: CellProps) => {
  const borderStyle = props.isTalking ? '3px solid #7CBB86' : '3px solid white'
  
  return ( 
    <div className={styles.userCell}>
      <div className={styles.userProfileNameContainer}>
        <img className={styles.userCircleImage} src={props.imgLink} style={
          {border: borderStyle}
        }/>
        <h4 className={styles.userName}>{props.name}</h4>
      </div>
      { props.isMuted ? 
        <img src='./images/ModalNavigationView/mic-muted.svg' className={styles.userCellMuteImage}/> :
        null
      }
    </div>
  )

}
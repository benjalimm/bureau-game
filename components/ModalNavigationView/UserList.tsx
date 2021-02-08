
import styles from './modalNavigation.module.css'
import React from 'react'
import { RoomParticipant } from '../../models/User'

interface ListProps { 
  participants: RoomParticipant[] 
}
export default function UserList(props: ListProps)  {
  return <div className={styles.userList}>
    {
      props.participants.map((user, i) => 
      <UserCell name={user.name} 
      imgLink={user.profileImage.main}
      key={user.uid}
      />)
    }
  </div>
}

interface CellProps  { 
  name: string, 
  imgLink: string,
}

const UserCell = (props: CellProps) => {
  return (<div className={styles.userCell}>
    <img className={styles.userCircleImage} src={props.imgLink}/>
    <h4 className={styles.userName}>{props.name}</h4>
  </div>)

}
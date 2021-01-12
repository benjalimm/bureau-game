
import styles from './modalNavigation.module.css'
import React from 'react'


export default function UserList({ users })  {
  return <div className={styles.userList}>
    {
      users.map(user => <UserCell name={user.name}/>)
    }
  </div>
}

const UserCell = ({ name }) => {
  return (<div className={styles.userCell}>
    <div className={styles.userCircleImage}/>
    <h4 className={styles.userName}>{name}</h4>
  </div>)

}
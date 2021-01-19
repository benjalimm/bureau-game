import styles from './modalNavigation.module.css'
import React from 'react'
import UserList from './UserList'

export default function ModalNavigationView() {

  const users = [
    { name: "Benjamin Lim" },
    { name: "Lana Toogood" },
    { name: "Steven Lim" },
    { name: "James Stewart" },
    { name: "Cheryl Lim" }
]


  return  (<div className={styles.modalView}>
      <h3> Benjamin's lobby</h3>
      <p> 8 users online</p>
      <UserList users={users}/>
    </div>)
}






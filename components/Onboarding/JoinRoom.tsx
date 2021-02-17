import React from 'react'
import styles from './styles.module.scss'

interface Props {
  roomId: string;
  onTap: () => Promise<void>;
}
const JoinRoom = (props: Props) => {

  return(
    <div className={styles.loginWithTwitterContainer}>
      <h2 className={styles.loginText}>Join room </h2>
      <button className={styles.joinRoomButton} 
        onClick={props.onTap}
      >
        <span>Join room {props.roomId}</span>
      </button>
    </div>
  )

}
export default JoinRoom


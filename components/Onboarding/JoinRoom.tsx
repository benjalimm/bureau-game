import React from 'react'
import style from './onboarding.module.css'

interface Props {
  roomId: string;
  onTap: () => Promise<void>;
}
const JoinRoom = (props: Props) => {

  return(
    <div className={style.loginWithTwitterContainer}>
      <h2 className={style.loginText}>Join room </h2>
          <button className={style.joinRoomButton} 
          onClick={props.onTap}
          >
              <span>Join room {props.roomId}</span>
          </button>
    </div>
  )

}
export default JoinRoom
import React, { useEffect, useState } from 'react'
import style from './onboarding.module.css'
import { firebase, loginWithTwitter, isUserLoggedIn } from '../../services/Authentication'
import "firebase/auth"
import { socketManager } from '../../services/SocketManager'
import agoraManager from '../../services/AgoraManager'
import Login from './Login'
import JoinRoom from './JoinRoom'
import Router from 'next/router'
import { join } from 'path'



type OnboardingState = "Login" | "JoinRoom"
export default function LoginPage () {

  const [isLoggedIn, setLoginState] = useState(false)
  const [onboardingState, setOnboardingState] =
   useState<OnboardingState>("Login")
  const [roomId, setRoomId] = useState<string | null>("ABC")

  const didTapLoginWithTwitter = async () => {

    try {
 
      const dbUserResult = await loginWithTwitter()
      console.log(await dbUserResult.json())
      setLoginState(true)
      setOnboardingState("JoinRoom")
    } catch (error) {
      console.log("Error with authenticating Twitter user")
      console.log(error)
    }
  }

  const didTapJoinRoom = async () => {
    await socketManager.connect();
    const agoraUid = await agoraManager.joinChannel()
    socketManager.joinRoom(roomId, `${agoraUid}`)
    await agoraManager.setupAudio()
    Router.push('/')
  }

  useEffect(() => {
    setLoginState(isUserLoggedIn())
  },[])

  const renderOnboardingComponent = 
  (state: OnboardingState) => {
    switch(state) {
      case "Login":
         return <Login onLogin={didTapLoginWithTwitter}/>
      case "JoinRoom":
        return <JoinRoom roomId={roomId} onTap={didTapJoinRoom}/>
    }
  }


  return (
    <div className={style.loginBackground}>
      <div className={style.loginModalView}>
        { renderOnboardingComponent(onboardingState) }
      </div>
    </div>
  )
}
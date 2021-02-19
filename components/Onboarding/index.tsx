import React, { useEffect, useState } from 'react'
import styles from './styles.module.scss'
import { loginWithTwitter, isUserLoggedIn } from '../../services/Authentication'
import "firebase/auth"
import { firebase } from '../../services/Authentication' 
import Login from './Login'
import JoinRoom from './JoinRoom'
import Router from 'next/router'
import { gameManager } from '../../game/GameManager'

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
    try {
      Router.push('/')
      await gameManager.initializeGame(roomId)
    } catch (error) {
      console.log("Failed to join room due to error:")
      console.log(error)
    }
    
  }

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      const loggedIn = (!!user)
      console.log("FOO is user logged in")
      console.log(loggedIn)
      setLoginState(loggedIn)
    })
  }, [])

  useEffect(() => {

    if (isLoggedIn) {
      setOnboardingState("JoinRoom")
    }

  }, [isLoggedIn])

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
    <div className={styles.loginBackground}>
      <div className={styles.loginModalView}>
        { renderOnboardingComponent(onboardingState) }
      </div>
    </div>
  )
}
import React, { useEffect, useState } from 'react'
import style from './onboarding.module.css'
import { loginWithTwitter, isUserLoggedIn } from '../../services/Authentication'
import "firebase/auth"
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
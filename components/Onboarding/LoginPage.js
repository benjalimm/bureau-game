import React, { useEffect, useState } from 'react'
import style from './onboarding.module.css'
import { firebase } from '../../services/Authentication'
import "firebase/auth"
import { createUserWithTwitter } from '../../services/Networking'
import { socketManager } from '../../services/SocketManager'
import Router from "next/router"

const provider = new firebase.auth.TwitterAuthProvider()

export default function LoginPage () {

  const [isLoggedIn, setLoginState] = useState(false)

  const didTapLoginWithTwitter = async () => {

    try {
      const result = await firebase.auth().signInWithPopup(provider)
      const { credential, accessToken, secret, user } = result 
  
      console.log("Successfully authenticated Twitter user")
      const dbUserResult = await createUserWithTwitter(user)
      console.log(await dbUserResult.json())
      setLoginState(true)
      await socketManager.connect()
  
    } catch (error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
      console.log("Error with authenticating Twitter user")
      console.log(error)
    }
  }

  useEffect(() => {
    setLoginState(firebase.auth.isLoggedIn)
  },[])

  useEffect(() => {

    if (isLoggedIn) {
      Router.push('/')
    }

  }, [isLoggedIn])
  

  

  return (
    <div className={style.loginBackground}>
      <div className={style.loginModalView}>
        <h2 className={style.loginText}>Login to Bureau</h2>
          <button className={style.loginWithTwitterButton} 
          onClick={didTapLoginWithTwitter}
          >
              <span>Login with Twitter</span>
          </button>
      </div>
    </div>
  )
}
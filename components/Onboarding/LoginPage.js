import React, { useEffect, useState } from 'react'
import style from './onboarding.module.css'
import firebase from 'firebase/app'
import "firebase/auth"
import { createUserWithTwitter } from '../../services/Networking'

const provider = new firebase.auth.TwitterAuthProvider()

const didTapLoginWithTwitter = async () => {

  try {
    const result = await firebase.auth().signInWithPopup(provider)
    const { credential, accessToken, secret, user } = result 

    console.log("Successfully authenticated Twitter user")
    const dbUserResult = await createUserWithTwitter(user)
    console.log(await dbUserResult.json())

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


export default function LoginPage () {

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
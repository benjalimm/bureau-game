import React, { useEffect, useRef, useState } from 'react'
import GameCanvas from '../components/GameCanvas'
import GameOverlay from '../components/GameOverlay'
import "firebase/auth"
import { firebaseConfig } from '../configs/firebaseConfig'
import {
  FirebaseAuthProvider,
} from "@react-firebase/auth";
import { firebase, isUserLoggedIn } from '../services/Authentication'
import Router from "next/router"

export default function Home() {
  const [isLoggedIn, setLoginState] = useState(null)

  useEffect(() => {
    setLoginState(isUserLoggedIn())
  },[isLoggedIn])

  useEffect(() => {
    if (isLoggedIn === false) {
      Router.push('/login')
    } else {
      Router.push('/')
    }
  }, [isLoggedIn])


  return (
    <FirebaseAuthProvider firebase={firebase} {...firebaseConfig}>
        {isLoggedIn ? <GameView/> : () => {
            setLoginState(false);
            return <div>Loading</div>
        }}
    </FirebaseAuthProvider>
  )
}

const GameView = () => {
  return (
    <div>
      <GameCanvas/>
      <GameOverlay/>
    </div>
  )
}
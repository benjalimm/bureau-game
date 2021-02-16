import React, { useEffect, useRef, useState } from 'react'
import GameCanvas from '../components/GameCanvas'
import GameOverlay from '../components/GameOverlay'
import "firebase/auth"
import { firebaseConfig } from '../configs/firebaseConfig'
import {
  FirebaseAuthProvider,
} from "@react-firebase/auth";
import { firebase, isUserLoggedIn, logout } from '../services/Authentication'
import Game from '../game/Game'
import Router from "next/router"

export default function Home() {
  const [isLoggedIn, setLoginState] = useState(null)

  useEffect(() => {
    setLoginState(isUserLoggedIn())
  },[isLoggedIn])

  useEffect(() => {
    if (isLoggedIn === false) {
      Router.push('/login')
    } else if (isLoggedIn === true){
      Router.push('/')
    }
  }, [isLoggedIn])

  console.log(`isLoggedIn: ${isLoggedIn}`)
  
  return (
    <FirebaseAuthProvider firebase={firebase} {...firebaseConfig} databaseURL=""> 
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
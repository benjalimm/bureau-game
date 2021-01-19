import React, { useEffect, useRef, useState } from 'react'
import GameCanvas from '../components/GameCanvas'
import GameOverlay from '../components/GameOverlay'
import "firebase/auth"
import { firebaseConfig } from '../configs/firebaseConfig'
import {
  FirebaseAuthProvider,
} from "@react-firebase/auth";
import { firebase, isUserLoggedIn, logout } from '../services/Authentication'
import { joinChannel, leaveChannel } from '../services/AgoraManager'
import Router from "next/router"


export default function Home() {
  const [isLoggedIn, setLoginState] = useState(null)

  


  useEffect(() => {
    
    // joinChannel()
    // .then(() => {
    //   console.log("Succesfully joined channel")
    // }).catch(err =>{
    //   console.log(`Error with joining channel ${err}`)
    // })


    
    
  }, [])

  useEffect(() => {
    setLoginState(isUserLoggedIn())
  },[isLoggedIn])

  useEffect(() => {
    logout()
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
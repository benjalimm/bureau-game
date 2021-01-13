import React, { useEffect, useRef, useState } from 'react'
import GameCanvas from '../components/GameCanvas'
import GameOverlay from '../components/GameOverlay'
import { useSocket } from '../services/Networking'
import "firebase/auth"
import firebase from 'firebase/app'
import { firebaseConfig } from '../configs/firebaseConfig'
import {
  FirebaseAuthProvider,
  FirebaseAuthConsumer,
} from "@react-firebase/auth";

export default function Home() {
  const connected = useSocket()

  useEffect(() => {
    console.log(`Connected: ${connected}`)
  }, [connected])

  return (
    <FirebaseAuthProvider firebase={firebase} {...firebaseConfig}>
      <FirebaseAuthConsumer>
         { ({ isSignedIn, user, providerId }) => {
           return (
            isSignedIn ? <Foo/> : <div>Need to login</div>
           )
         } 
        }
      </FirebaseAuthConsumer>
    </FirebaseAuthProvider>
  )
}

const Foo = () => {
  return (
    <div>
      <GameCanvas/>
      <GameOverlay/>
    </div>
  )
}
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
import LoginPage from '../components/Onboarding/LoginPage'
import Router from 'next/router'
import Head from "next/head"

export default function Home() {
  const connected = useSocket()

  useEffect(() => {
    console.log(`Connected: ${connected}`)
  }, [connected])

  return (
    <div>
      <Head>
        <link
          rel="preload"
          href="/fonts/Inter/static/Inter-Regular.ttf"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/Inter/static/Inter-Medium.ttf"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/Inter/static/Inter-Bold.ttf"
          as="font"
          crossOrigin=""
        />
      </Head>
      <FirebaseAuthProvider firebase={firebase} {...firebaseConfig}>
      <FirebaseAuthConsumer>
         { ({ isSignedIn, user, providerId }) => {
           return (
            isSignedIn ? <GameView/> : Router.push('/login')
           )
         } 
        }
      </FirebaseAuthConsumer>
    </FirebaseAuthProvider>
    </div>
    
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
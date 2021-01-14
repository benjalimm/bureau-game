import io from 'socket.io-client';
import React, { useEffect, useState } from 'react'
import { setTokenSourceMapRange } from 'typescript';
import 'firebase/auth'
import firebase from 'firebase/app'

const networkUrl = 'http://localhost:8000'
const socket = io(networkUrl, {transports: ['websocket']})

const urlWithPath = (path) => {
  return networkUrl + path
}

export const useSocket = () => {
  console.log('useSocket')
  const [connected,setConnected] = useState(false);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to socket')
      setConnected(true)
  
      socket.on('disconnect', () => {
        console.log('Disconnected from socket')
        setConnected(false)
      })
    })


  }, [])

  return connected
}

export const makeRequest = async (url, method, body) => {
  const idToken = await firebase.auth().currentUser.getIdToken()
  return fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
    body: JSON.stringify(body)
  })
}

export const createUserWithTwitter = (userDetails) => {
  return makeRequest(urlWithPath('/api/user/twitter'), 'POST', { user: userDetails})
}
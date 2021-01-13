import io from 'socket.io-client';
import React, { useEffect, useState } from 'react'
import { setTokenSourceMapRange } from 'typescript';

const socket = io('http://localhost:8000', {transports: ['websocket']})


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

const useSocketEvents = () => {

}
import io from 'socket.io-client';
import React, { useEffect, useState } from 'react'
import { setTokenSourceMapRange } from 'typescript';
import 'firebase/auth'
import firebase from 'firebase/app'
import { socketManager, SocketSubscriber } from './SocketManager'

let _IS_LOCAL = true 
const networkUrl = 'https://desolate-anchorage-45430.herokuapp.com'
const localUrl = 'localhost:8000'
// const socket = io(networkUrl, {transports: ['websocket']})

export const urlWithPath = (path) => {
  let url = networkUrl
  if (_IS_LOCAL) {
    url = localUrl
  }
  return url + path
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
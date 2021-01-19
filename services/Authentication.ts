import "firebase/auth"
import firebase from 'firebase/app'
import { firebaseConfig } from '../configs/firebaseConfig'
import { createUserWithTwitter } from './Networking'
export const initializeFirebase = () => { 
  if (typeof window !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
  }
}

export const isUserLoggedIn = () => {
  return (firebase.auth().currentUser !== null)
}

export const loginWithTwitter = async () => {
  const provider = new firebase.auth.TwitterAuthProvider()
  const result = await firebase.auth().signInWithPopup(provider)
  const { user } = result 
  console.log("Successfully authenticated Twitter user")
  return createUserWithTwitter(user)
}

export const logout = async () => {
  console.log("Signing out")
  await firebase.auth().signOut()
}

initializeFirebase();
export { firebase };
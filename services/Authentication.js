import "firebase/auth"
import firebase from 'firebase/app'
import { firebaseConfig } from '../configs/firebaseConfig'

export const initializeFirebase = () => { 
  if (typeof window !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
  }
}

export const isUserLoggedIn = () => {
  return (firebase.auth().currentUser !== undefined)
}

initializeFirebase();
export { firebase };
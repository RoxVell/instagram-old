import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/database'

let config = {
  apiKey: "AIzaSyCyuq2D87SM0tS5oA1gDpJ2BmH6NgfqXUg",
  authDomain: "parugram-38ff3.firebaseapp.com",
  databaseURL: "https://parugram-38ff3.firebaseio.com",
  projectId: "parugram-38ff3",
  storageBucket: "parugram-38ff3.appspot.com",
  messagingSenderId: "373552700734"
}


!firebase.apps.length ? firebase.initializeApp(config) : ''
export const GoogleProvider = new firebase.auth.GoogleAuthProvider()
export const auth = firebase.auth()
export const DB = firebase.database()
export const StoreDB = firebase.firestore()
export default firebase
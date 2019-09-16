import firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/storage'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'
import config from './_configFirebase'

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

export default firebase
export const auth = firebase.auth()
export const storage = firebase.storage()
export const functions = firebase.functions()
export const firestore = firebase.firestore()

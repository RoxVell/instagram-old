import firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/database'
import 'firebase/storage'
import 'firebase/auth'
import config from './_configFirebase'

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

export default firebase
export let database = firebase.database()
export let storage = firebase.storage()
export let auth = firebase.auth()

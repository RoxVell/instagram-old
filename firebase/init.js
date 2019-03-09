import firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/database'
import 'firebase/storage'
import 'firebase/auth'
import 'firebase/firestore'
import config from './_configFirebase'

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

export default firebase
export const database = firebase.database()
export const storage = firebase.storage()
export const auth = firebase.auth()

// Setting and export firestore
const firestore = firebase.firestore()
firestore.settings({ timestampsInSnapshots: true })

export {firestore}
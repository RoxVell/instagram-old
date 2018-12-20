import firebase from 'firebase'
import config from './configfb'

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

export default firebase
export let database = firebase.database()

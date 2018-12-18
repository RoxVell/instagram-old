import firebase from 'firebase'
import config from './config'

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

// console.log('app-name', app.name)

export default firebase
export let database = firebase.database()

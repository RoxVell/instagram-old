import firebase from 'firebase'
import { APP_ID } from '~/firebase/init'

function onSnapshot(query: firebase.firestore.Query, cb: Function): Promise<firebase.firestore.QuerySnapshot> {
  return new Promise((resolve, reject) => {
    query.onSnapshot((snapshot) => {
      cb(snapshot)
      resolve(snapshot)
    }, reject)
  })
}

export async function* QueryPaginate(query: firebase.firestore.Query, limit = 15, callback?: Function) {
  let lastSnapshot = null

  query = query.limit(limit)

  do {
    if (lastSnapshot) query = query.startAfter(lastSnapshot)

    let snapshot = callback ? await onSnapshot(query, callback) : await query.get()

    if (snapshot.size < limit) {
      return getDocuments(snapshot)
    } else {
      const { docs } = snapshot
      lastSnapshot = docs[docs.length - 1]
      yield getDocuments(snapshot)
    }
  } while (lastSnapshot)
}

export function getDocuments<T>(documentSnapshots: firebase.firestore.DocumentSnapshot[] | firebase.firestore.QuerySnapshot): Array<T & { id: string }> {
  const documents: Array<T & { id: string }> = []

  documentSnapshots.forEach((snapshot: firebase.firestore.QueryDocumentSnapshot | firebase.firestore.DocumentSnapshot) => {
    if (snapshot.exists) documents.push({
      id: snapshot.id,
      ...snapshot.data() as T
    })
  })

  return documents
}

export function getUserAvatar(username: string) {
  return `https://firebasestorage.googleapis.com/v0/b/${APP_ID}.appspot.com/o/avatars%2F${username}.jpg?alt=media`
}

export function getDefaultUserAvatar(fileName = 'avatar_default.jpg') {
  return `https://firebasestorage.googleapis.com/v0/b/${APP_ID}.appspot.com/o/avatars%2F${fileName}?alt=media`
}

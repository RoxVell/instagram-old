import { APP_ID } from '~/firebase/init'

function onSnapshot(query, cb) {
  return new Promise((resolve, reject) => {
    query.onSnapshot((snapshot) => {
      cb(snapshot)
      resolve(snapshot)
    }, reject)
  })
}

export async function* QueryPaginate(query, limit, cb) {
  let lastSnapshot = null

  query = query.limit(limit)

  do {
    if (lastSnapshot) query = query.startAfter(lastSnapshot)

    let snapshot = null

    if (cb) {
      snapshot = await onSnapshot(query, cb)
    } else {
      snapshot = await query.get()
    }

    if (snapshot.size < limit) {
      return getDocuments(snapshot)
    } else {
      const { docs } = snapshot
      lastSnapshot = docs[docs.length - 1]
      yield getDocuments(snapshot)
    }
  } while (lastSnapshot)
}

export function getDocuments(documentSnapshots) {
  const data = []

  documentSnapshots.forEach((doc) => {
    data.push({
      id: doc.id,
      ...doc.data()
    })
  })

  return data
}

export function getUserAvatar(username) {
  return `https://firebasestorage.googleapis.com/v0/b/${APP_ID}.appspot.com/o/avatars%2F${username}.jpg?alt=media`
}

export function getDefaultUserAvatar(fileName = 'avatar_default.jpg') {
  return `https://firebasestorage.googleapis.com/v0/b/${APP_ID}.appspot.com/o/avatars%2F${fileName}?alt=media`
}

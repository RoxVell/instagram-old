import { APP_ID } from '~/firebase/init'


export async function* QueryPaginate(query, limit, cb) {
  let lastSnapshot = null

  query = query.limit(limit)

  do {
    if (lastSnapshot) query = query.startAfter(lastSnapshot)

    const documentSnapshots = await query.get()
    const { docs } = documentSnapshots

    if (docs.length < limit) {
      return getDocuments(documentSnapshots)
    } else {
      lastSnapshot = docs[docs.length - 1]
      yield getDocuments(documentSnapshots)
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

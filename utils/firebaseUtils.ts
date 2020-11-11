import { storage, APP_ID } from '~/firebase/init'
import DocumentDataWithId from '~/types/DocumentDataWithId'

function onSnapshot(
  query: firebase.firestore.Query,
  cb: Function
): Promise<firebase.firestore.QuerySnapshot> {
  return new Promise((resolve, reject) => {
    query.onSnapshot((snapshot) => {
      cb(snapshot)
      resolve(snapshot)
    }, reject)
  })
}

export async function* QueryPaginate(
  query: firebase.firestore.Query,
  limit: number,
  cb?: Function
): AsyncGenerator<DocumentDataWithId[]> {
  let lastSnapshot: firebase.firestore.DocumentSnapshot | null = null

  query = query.limit(limit)

  do {
    if (lastSnapshot) query = query.startAfter(lastSnapshot)

    let snapshot: firebase.firestore.QuerySnapshot | null = null

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

export function getDocuments(
  documentSnapshots: firebase.firestore.QuerySnapshot
): Array<DocumentDataWithId> {
  const data: Array<DocumentDataWithId> = []

  documentSnapshots.forEach((doc) => {
    data.push({
      id: doc.id,
      ...doc.data()
    })
  })

  return data
}

export function getUserAvatar(username: string) {
  return `https://firebasestorage.googleapis.com/v0/b/${APP_ID}.appspot.com/o/avatars%2F${username}.jpg?alt=media`
}

export function getDefaultUserAvatar(fileName: string = 'avatar_default.jpg') {
  return `https://firebasestorage.googleapis.com/v0/b/${APP_ID}.appspot.com/o/avatars%2F${fileName}?alt=media`
}

// export function uploadPhoto(photo, directory) {
//   return new Promise((resolve, reject) => {
//     const photoReference = storage.ref(directory)
//     const uploadTask = photoReference.put(photo)

//     uploadTask.on(
//       storage.TaskEvent.STATE_CHANGED,
//       () => {},
//       (error) => reject(error),
//       () => {
//         uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
//           resolve(downloadURL)
//         })
//       }
//     )
//   })
// }

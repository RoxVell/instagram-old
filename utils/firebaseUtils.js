export async function* QueryPaginate(query, limit = 15) {
  if (!query) throw new Error('Query is not defined!')

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

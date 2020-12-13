const functions = require('firebase-functions');

module.exports = function(admin) {
  const increment = admin.firestore.FieldValue.increment(1)
  const decrement = admin.firestore.FieldValue.increment(-1)

  const getFavoritesPostsByUsername = functions.https.onCall(async (data, context) => {
    const { username } = data

    const favoritePostsIds = await admin.firestore()
      .collection('favorites_posts')
      .doc(username)
      .collection('favorites')
      .get()

    const favoritePosts = [];

    for (const postDocument of favoritePostsIds.docs) {
      const post = await admin.firestore().doc(`posts/${postDocument.id}`).get()

      favoritePosts.push({
        id: postDocument.id,
        ...post.data()
      })
    }

    return Promise.resolve(favoritePosts)
  });

  const onPostLiked = functions.firestore
    .document('post_likes/{postId}/likes/{username}')
    .onCreate((_, context) => {
      return admin
        .firestore()
        .doc(`posts/${context.params.postId}`)
        .update({ likes: increment })
    })

  const onPostUnliked = functions.firestore
    .document('post_likes/{postId}/likes/{username}')
    .onDelete((_, context) => {
      return admin
        .firestore()
        .doc(`posts/${context.params.postId}`)
        .update({ likes: decrement })
    })

  return {
    onPostLiked,
    onPostUnliked,
    getFavoritesPostsByUsername
  }
}

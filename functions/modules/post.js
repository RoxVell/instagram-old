const functions = require('firebase-functions')

module.exports = function(admin) {
  const increment = admin.firestore.FieldValue.increment(1)
  const decrement = admin.firestore.FieldValue.increment(-1)

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
    onPostUnliked
  }
}

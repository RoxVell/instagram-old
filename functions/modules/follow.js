const functions = require('firebase-functions')

module.exports = function(admin) {
  const increment = admin.firestore.FieldValue.increment(1)
  const decrement = admin.firestore.FieldValue.increment(-1)

  const followUser = functions.https.onCall((data, context) => {
    const { followedUsername } = data
    const followerUsername = context.auth.token.name

    const batch = admin.firestore().batch()

    const followerActionRef = admin
      .firestore()
      .doc(`followers/${followedUsername}/userFollowing/${followerUsername}`)

    const followingActionRef = admin
      .firestore()
      .doc(`following/${followerUsername}/userFollowed/${followedUsername}`)

    batch.set(followerActionRef, {})
    batch.set(followingActionRef, {})

    return batch.commit()
  })

  const unfollowUser = functions.https.onCall((data, context) => {
    const { followedUsername } = data
    const followerUsername = context.auth.token.name

    const batch = admin.firestore().batch()

    const followerActionRef = admin
      .firestore()
      .doc(`followers/${followedUsername}/userFollowing/${followerUsername}`)

    const followingActionRef = admin
      .firestore()
      .doc(`following/${followerUsername}/userFollowed/${followedUsername}`)

    batch.delete(followerActionRef, {})
    batch.delete(followingActionRef, {})

    return batch.commit()
  })

  const onFollowUserCreate = functions.firestore
    .document('followers/{followedUsername}/userFollowing/{followerUsername}')
    .onCreate((_, context) => {
      return admin
        .firestore()
        .doc(`users/${context.params.followedUsername}`)
        .update({ followers: increment })
    })

  const onFollowUserDelete = functions.firestore
    .document('followers/{followedUsername}/userFollowing/{followerUsername}')
    .onDelete((_, context) => {
      return admin
        .firestore()
        .doc(`users/${context.params.followedUsername}`)
        .update({ followers: decrement })
    })

  const onFollowingUserCreate = functions.firestore
    .document('following/{followerUsername}/userFollowed/{followedUsername}')
    .onCreate((_, context) => {
      console.log(context)
      return admin
        .firestore()
        .doc(`users/${context.params.followerUsername}`)
        .update({ following: increment })
    })

  const onFollowingUserDelete = functions.firestore
    .document('following/{followerUsername}/userFollowed/{followedUsername}')
    .onDelete((_, context) => {
      return admin
        .firestore()
        .doc(`users/${context.params.followerUsername}`)
        .update({ following: decrement })
    })

  return {
    followUser,
    unfollowUser,
    onFollowingUserDelete,
    onFollowingUserCreate,
    onFollowUserDelete,
    onFollowUserCreate
  }
}

const functions = require('firebase-functions')

/**
 * Comments Schema
 * collection: post_comments/${post_id}/comments/${commentId}
 *
 * SubComments Schema
 * collection: post_comments/${post_id}/comments/${commentId}/subcomments/${subcommentId}
 */

module.exports = function(admin) {
  const increment = admin.firestore.FieldValue.increment(1)
  const decrement = admin.firestore.FieldValue.increment(-1)

  /**
   * Function name: `Add Comment`
   * Function description: Event fires when user likes a comment
   */

  const addComment = functions.https.onCall(async (data, context) => {
    const Comment = require('../models/Comment')

    try {
      const comment = Comment(data)
      comment.username = context.auth.token.name

      const collection = data.isReply
        ? `post_comments/${data.postId}/comments/${data.commentId}/subcomments`
        : `post_comments/${data.postId}/comments`

      let commentReference = await admin
        .firestore()
        .collection(collection)
        .add(comment)
        .then((commentReference) => {
          return commentReference.get()
        })

      return {
        id: commentReference.id,
        ...commentReference.data()
      }
    } catch (error) {
      throw error
    }
  })

  /**
   * Function name: `On Add Reply`
   * Function description: Event fires when user add a subcomment
   * Need to increment replies on comment and increment comments on post
   */

  const onAddReply = functions.firestore
    .document('post_comments/{postId}/comments/{commentId}/subcomments/{subcommentId}')
    .onCreate((snapshot, context) => {
      const { postId, commentId } = context.params

      const batch = admin.firestore().batch()

      const incrementRepliesOnComment = admin
        .firestore()
        .doc(`post_comments/${postId}/comments/${commentId}`)

      const incrementCommentsOnPost = admin.firestore().doc(`posts/${postId}`)

      batch.update(incrementRepliesOnComment, { repliesCount: increment })
      batch.update(incrementCommentsOnPost, { comments: increment })

      return batch.commit()
    })

  /**
   * Function name: `On Delete Reply`
   * Function description: Event fires when user delete a subcomment
   * Need to decrement replies on comment and decrement comments on post
   */

  const onDeleteReply = functions.firestore
    .document('post_comments/{postId}/comments/{commentId}/subcomments/{subcommentId}')
    .onDelete((snapshot, context) => {
      const { postId, commentId } = context.params

      const batch = admin.firestore().batch()

      const incrementRepliesOnComment = admin
        .firestore()
        .doc(`post_comments/${postId}/comments/${commentId}`)

      const incrementCommentsOnPost = admin.firestore().doc(`posts/${postId}`)

      batch.update(incrementRepliesOnComment, { repliesCount: increment })
      batch.update(incrementCommentsOnPost, { comments: increment })

      return batch.commit()
    })

  /**
   * Function name: `Increment Likes`
   * Function description: Event fires when user add a comment
   */

  const onAddComment = functions.firestore
    .document('post_comments/{postId}/comments/{commentId}')
    .onCreate((snapshot, context) => {
      const { postId } = context.params

      return admin
        .firestore()
        .doc(`posts/${postId}`)
        .update({ comments: increment })
    })

  /**
   * Function name: `Increment Likes`
   * Function description: Event fires when user delete a comment
   */

  const onDeleteComment = functions.firestore
    .document('post_comments/{postId}/comments/{commentId}')
    .onDelete((snapshot, context) => {
      const { postId } = context.params

      return admin
        .firestore()
        .doc(`posts/${postId}`)
        .update({ comments: decrement })
    })

  /**
   * Function name: `Increment Likes`
   * Function description: Event fires when user likes a comment
   */

  const incrementLikes = functions.firestore
    .document('comments_likes/{postId}/{username}/{commentId}')
    .onCreate((_, context) => {
      const { postId, commentId } = context.params

      return admin
        .firestore()
        .doc(`post_comments/${postId}/comments/${commentId}`)
        .update({ likes: increment })
    })

  /**
   * Function name: `Decrement Likes`
   * Function description: Event fires when user unlikes a comment
   */

  const decrementLikes = functions.firestore
    .document('comments_likes/{postId}/{username}/{commentId}')
    .onDelete((_, context) => {
      const { postId, commentId } = context.params

      return admin
        .firestore()
        .doc(`post_comments/${postId}/comments/${commentId}`)
        .update({ likes: decrement })
    })

  return {
    addComment,
    onAddComment,
    onDeleteComment,
    onAddReply,
    onDeleteReply,
    incrementLikes,
    decrementLikes
  }
}

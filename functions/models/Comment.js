const { firestore } = require('firebase-admin')
const {
  https: { HttpsError }
} = require('firebase-functions')

const Comment = function({ text, post_id }) {
  if (!text) {
    throw new HttpsError('field/comment-empty', 'The comment field cannot be empty')
  }

  return {
    text,
    likes: 0,
    created_date: firestore.Timestamp.now()
  }
}

module.exports = Comment

const { firestore } = require('firebase-admin')

const DEFAULT_AVATAR =
  'https://firebasestorage.googleapis.com/v0/b/parugram-38ff3.appspot.com/o/avatars%2Favatar_default.png?alt=media&token=a52f2737-8a1b-4255-921e-177fd9a935e9'

function User(userData) {
  const { email, displayName: username } = userData
  return {
    email,
    username,
    profile_picture: DEFAULT_AVATAR,
    posts: 0,
    followers: 0,
    following: 0,
    created_at: firestore.Timestamp.now(),
    profile_description: '',
    verified: false
  }
}

module.exports.User = User
module.exports.DEFAULT_AVATAR = DEFAULT_AVATAR

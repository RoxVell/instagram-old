const { firestore } = require('firebase-admin')

const DEFAULT_AVATAR =
  'https://firebasestorage.googleapis.com/v0/b/parugram-38ff3.appspot.com/o/photos%2Favatar_default.png?alt=media&token=4107c2b8-0425-4d1c-96ec-c54e3a5fa385'

function User(userData) {
  const { email, displayName: username } = userData
  return {
    email,
    username,
    profile_picture: DEFAULT_AVATAR,
    posts: 0,
    subscribers: [],
    created_at: firestore.Timestamp.now(),
    profile_description: '',
    verified: false
  }
}

exports.User = User

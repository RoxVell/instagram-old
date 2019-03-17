import firebase from '~/firebase/init'

const User = function({ username, email, avatar }) {
  return {
    email,
    username,
    profile_picture: avatar,
    posts: [],
    subscribers: [],
    created_at: firebase.firestore.Timestamp.now(),
    profile_description: '',
    verified: false
  }
}

export default User

import firebase from '~/firebase/init'

const Post = function({ username, description, content }) {
  return {
    username,
    content,
    description,
    likes: 0,
    comments: [],
    created_date: firebase.firestore.Timestamp.now()
  }
}

export default Post

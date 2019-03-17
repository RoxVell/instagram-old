import firebase from '~/firebase/init'

const Post = function({ userId, description, content }) {
  return {
    userId,
    content,
    description,
    likes: 0,
    comments: [],
    created_date: firebase.firestore.Timestamp.now()
  }
}

export default Post

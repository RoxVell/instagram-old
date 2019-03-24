import { auth, database, storage, firestore } from '~/firebase/init'
import firebase from '~/firebase/init'
import User from '../models/User'
import Post from '../models/Post'

const photosRef = storage.ref('photos/')
const databaseRef = database.ref()

export const state = () => ({
  user: null,
  isLoading: 'loading'
})

export const mutations = {
  UPDATE_USER(state) {
    if (!auth.currentUser) {
      state.user = null
      state.isLoading = { status: 'not-auth' }
    } else {
      const userDoc = firestore
        .collection('users')
        .doc(auth.currentUser.uid)
        .get()
        .then(doc => {
          if (doc.exists) {
            state.user = doc.data()
            state.isLoading = { status: false }
          } else {
            state.isLoading = { status: 'user-not-exist' }
          }
        })
        .catch(console.log)
    }
  },
  ADD_POST(state) {
    state.user.posts += 1
  }
}

export const actions = {
  async createUserWithEmailAndPassword({ commit, dispatch }, { email, username, password }) {
    try {
      username = username.toLowerCase()

      const isUsernameAvailable = await dispatch('checkUsername', username)

      if (!isUsernameAvailable) throw Error(`${username} has been taken!`)

      let { user } = await auth.createUserWithEmailAndPassword(email, password)

      const defaultAvatar = await storage.ref('photos/avatar_default.png').getDownloadURL()

      const newUser = User({ email, username, avatar: defaultAvatar })

      await firestore.collection('users').doc(user.uid).set(newUser)
    } catch(error) {
      throw Error(error)
    }
  },
  async signInWithEmailAndPassword({ commit }, { email, password }) {
    return await auth.signInWithEmailAndPassword(email, password)
  },
  async signOut({ commit }) {
    try {
      await auth.signOut()
    } catch(error) {
      throw Error(error)
    }
  },
  async addPost({ state, dispatch, commit }, { photo, description='' }) {
    try {
      const photoURL = await dispatch('uploadPhoto', photo)

      const newPost = Post({
        username: state.user.username,
        content: [photoURL],
        description
      })

      const postReference = await firestore
        .collection('posts')
        .add(newPost)

      firestore
        .collection('users')
        .doc(auth.currentUser.uid)
        .update({
          posts: state.user.posts + 1
        })

      commit('ADD_POST')
    } catch(error) {
      throw new Error(error)
    }
  },
  async uploadPhoto({ state }, photo) {
    return new Promise((resolve, reject) => {
      const dateCreated = firebase.firestore.Timestamp.now().seconds
      const photoName = `${state.user.username}-${dateCreated}`

      // reference -> photos / username / photoName
      const photoReference = storage.ref(`photos/${state.user.username}/${photoName}`)

      const uploadTask = photoReference.put(photo)

      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, () => {}, error => reject(error), () => {
        console.log(`Файл ${photoName} пользователя ${state.user.username} успешно загружен`)

        uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
          resolve(downloadURL)
        })
     })
    })
  },
  async getMyPosts({ state, dispatch }, { limit=15, fromDate }) {
    return await dispatch('getPostsByUsername', { username: state.user.username, limit, fromDate })
  },
  async checkUsername({ state }, username) {
    try {
      let docs = await firestore
        .collection('users')
        .where('username', '==', username)
        .get()

      return (docs.size === 0)
    } catch(error) {
      console.log(error)
      throw Error(error)
    }
  },
  async getUser({}, username) {
    const userDoc = await firestore
      .collection('users')
      .where('username', '==', username)
      .limit(1)
      .get()

    let user = null

    userDoc.forEach(doc => {
      user = doc.data()
    })

    return user
  },
  async getPostsByUsername({}, { username, fromDate, limit = 15, }) {
    const PERFOMANCE_MESSAGE = `Getting posts for username: ${username}`
    console.time(PERFOMANCE_MESSAGE)

    const posts = []

    let query = firestore
      .collection('posts')
      .where('username', '==', username)
      .limit(limit)
      .orderBy('created_date', 'desc')

    if (fromDate) query = query.startAfter(fromDate)

    const snapshot = await query.get()

    snapshot.forEach(doc => posts.push(doc.data()))

    console.timeEnd(PERFOMANCE_MESSAGE)

    return posts
  }
}

export const getters = {
  isAuth: (state) => (state.user !== null)
}

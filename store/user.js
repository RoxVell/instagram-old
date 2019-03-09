import { auth, database, storage, firestore } from '~/firebase/init'
import firebase from '~/firebase/init'

const photosRef = storage.ref('photos/')
const databaseRef = database.ref()

export const state = () => ({
  user: null
})

export const mutations = {
  UPDATE_USER(state) {
    if (!auth.currentUser) {
      state.user = null
    } else {
      const userDoc = firestore.collection('users').doc(auth.currentUser.uid)

      userDoc.get()
        .then(doc => {
          if (doc.exists) {
            state.user = doc.data()
          }
        })
        .catch(console.log)
    }
  },
  ADD_POST(state, id) {
    state.user.posts.push(id)
  }
}

export const actions = {
  async createUserWithEmailAndPassword({ commit }, { email, username, password }) {
    try {
      let { user } = await auth.createUserWithEmailAndPassword(email, password)

      const defaultAvatar = await storage.ref('photos/avatar_default.png').getDownloadURL()

      const newUser = {
        email,
        username,
        profile_picture: defaultAvatar,
        posts: [],
        subscribers: []
      }

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
      if (!state.user) throw Error('User not logged in')

      const photoURL = await dispatch('uploadPhoto', photo)
      const newPost = {
        userId: auth.currentUser.uid,
        content: photoURL,
        description,
        likes: 0,
        comments: []
      }

      const postReference = await firestore.collection('posts').add(newPost)

      firestore
        .collection('users')
        .doc(auth.currentUser.uid)
        .update({
          posts: firebase.firestore.FieldValue.arrayUnion(postReference.id)
        })

      commit('ADD_POST', postReference.id)
    } catch(error) {
      throw new Error(error)
    }
  },
  async uploadPhoto({ state }, photo) {
    return new Promise((resolve, reject) => {
      const photoName = `${state.user.username}-${photo.name}`
      const photoReference = storage.ref(`photos/${photoName}`)

      const uploadTask = photoReference.put(photo)

      uploadTask.on('state_changed', () => {}, error => reject(error), () => {
        console.log(`Файл ${photoName} пользователя ${auth.currentUser.uid} успешно загружен`)

        uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
          resolve(downloadURL)
        })
     })
    })
  },
  async getPosts({ state, dispatch }) {
    let photos = []

    state.user.posts.forEach(async post => {
      let photo = await firestore
        .collection('posts')
        .doc(post)
        .get()

      photos.push(photo.data())
    })

    return photos
  },
  async getPostsByUID({}) {
    let posts = []

    await firestore
      .collection('posts')
      .where("userId", "==", auth.currentUser.uid)
      .get()
      .then(querySnapchot => {
        querySnapchot.forEach(doc => posts.push(doc.data()))
      })

    return posts
  }
}

export const getters = {
  isAuth: (state) => (state.user !== null)
}

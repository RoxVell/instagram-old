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
      state.user = {}

      const userDoc = firestore
        .collection('users')
        .doc(auth.currentUser.uid)
        .get()
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
  async createUserWithEmailAndPassword({ commit, dispatch }, { email, username, password }) {
    try {
      username = username.toLowerCase()

      const isUsernameAvailable = await dispatch('checkUsername', username)

      if (!isUsernameAvailable) throw Error(`${username} has been taken!`)

      let { user } = await auth.createUserWithEmailAndPassword(email, password)

      const defaultAvatar = await storage.ref('photos/avatar_default.png').getDownloadURL()

      const newUser = {
        email,
        username,
        profile_picture: defaultAvatar,
        posts: [],
        subscribers: [],
        created_at: firebase.firestore.Timestamp.now(),
        profile_description: ""
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
      const photoURL = await dispatch('uploadPhoto', photo)

      const newPost = {
        userId: auth.currentUser.uid,
        content: [photoURL],
        description,
        likes: 0,
        comments: [],
        created_date: firebase.firestore.Timestamp.now()
      }

      const postReference = await firestore
        .collection('posts')
        .add(newPost)

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
  async getMyPosts({ state, dispatch }, limit=15) {
    if (!Number.isInteger(limit)) {
      console.error("The limit parameter must be an integer")
      limit = 15
    }

    let photos = []

    for (let i = 0; i < limit; i++) {
      let postID = state.user.posts[i]

      if (!postID) break

      let photo = await firestore
        .collection('posts')
        .doc(postID)
        .get()

      photos.push(photo.data())
    }

    photos = photos
      .filter(photo => Boolean(photo))
      .sort((a, b) => b.created_date.seconds - a.created_date.seconds)

    return photos
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

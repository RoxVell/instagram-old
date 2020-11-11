import { auth, firestore, storage } from '~/firebase/init'
import { getDocuments } from '../utils/firebaseUtils'

export const state = () => ({
  user: null,
  isLoading: 'loading',
  avatar: ''
})

export const mutations = {
  UPDATE_USER(state) {
    if (!auth.currentUser) {
      state.user = null
      state.isLoading = { status: 'not-auth' }
    } else {
      firestore
        .doc(`users/${auth.currentUser.displayName}`)
        .get()
        .then((userDocument) => {
          if (userDocument.exists) {
            state.user = userDocument.data()
            state.isLoading = { status: 'auth' }
          } else {
            state.isLoading = { status: 'user-not-exist' }
          }
        })
        .catch(console.log)
    }
  },
  ADD_POST(state) {
    state.user.posts += 1
  },
  UPDATE_AVATAR(state, avatar) {
    state.avatar = avatar
  },
  UPDATE_FOLLOWING_COUNT(state, count) {
    state.user.following += count
  }
}

export const actions = {
  async checkUsername(_, username) {
    const docs = await this.dispatch('user/getUser', username)
    return !docs
  },
  async getUser(_, username) {
    const userDoc = await firestore.doc(`users/${username}`).get()

    if (!userDoc.exists) return null

    const user = getDocuments([userDoc])[0]
    return user || null
  },
  uploadAvatar({ state, commit }, blob) {
    const uploadTask = storage.ref(`avatars/${state.user.username}.jpg`).put(blob)

    uploadTask.then(() => {
      commit('UPDATE_AVATAR', blob.src)
    })

    return { uploadTask }
  },
  deleteAvatar({ state, commit }) {
    return storage
      .ref(`avatars/${state.user.username}.jpg`)
      .delete()
      .then(() => {
        commit('UPDATE_AVATAR', '')
      })
  }
}

export const getters = {
  isAuth: (state) => state.isLoading.status === 'auth'
}

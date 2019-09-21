import { auth, firestore } from '~/firebase/init'
import { getDocuments } from '../utils/firebaseUtils'

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
      firestore
        .doc(`users/${auth.currentUser.uid}`)
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
  }
}

export const actions = {
  async checkUsername(_, username) {
    const docs = await this.dispatch('user/getUser', username)
    return !docs
  },
  async getUser(_, username) {
    const userDoc = await firestore
      .collection('users')
      .where('username', '==', username)
      .limit(1)
      .get()

    const user = getDocuments(userDoc)[0]

    return user || null
  }
}

export const getters = {
  isAuth: (state) => state.user !== null
}

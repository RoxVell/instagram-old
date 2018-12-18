import firebase from '../firebase/init'

export const state = () => ({
  user: null
})

export const mutations = {
  UPDATE_USER(state) {
    state.user = firebase.auth().currentUser
  }
}

export const actions = {
  async createUserWithEmailAndPassword({ commit }, { email, password }) {
    try {
      let user = await firebase.auth().createUserWithEmailAndPassword(email, password)
      commit('UPDATE_USER')
    } catch(error) {
      let errorCode = error.code
      let errorMessage = error.message

      console.error(`${errorMessage} (${errorCode})`)
      return errorMessage
    }
  },
  async signInWithEmailAndPassword({ commit }, { email, password }) {
    try {
      let user = await firebase.auth().signInWithEmailAndPassword(email, password)
      commit('UPDATE_USER')
    } catch(error) {
      let errorCode = error.code
      let errorMessage = error.message

      console.error(`${errorMessage} (${errorCode})`)
      return errorMessage
    }
  },
  async signOut({ commit }) {
    try {
      let isSignOut = await firebase.auth().signOut()
      commit('UPDATE_USER')
    } catch(error) {
      console.log('Ошибка при выходе из аккаунта', error)
      return error
    }
  },
}

export const getters = {
  isAuth(state) {
    return state.user !== null
  }
}
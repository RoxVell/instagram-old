import { auth, functions } from '~/firebase/init'

export const state = () => ({})

export const mutations = {}

export const actions = {
  async createUserWithEmailAndPassword(_, { email, username, password }) {
    const createUser = functions.httpsCallable('createUser')

    return createUser({ email, username, password })
  },
  async signInWithEmailAndPassword(_, { email, password }) {
    return await auth.signInWithEmailAndPassword(email, password)
  },
  async signOut() {
    try {
      await auth.signOut()
    } catch (error) {
      throw Error(error)
    }
  },
  async checkUsername(_, username) {
    const docs = await this.dispatch('account/getUser', username)
    return !docs
  }
}

export const strict = false

import firebase from '~/firebase/init'

export const state = () => ({})

export const mutations = {}

export const actions = {
  getCurrentServerTime() {
    return firebase.firestore.Timestamp.now().seconds
  }
}

export const strict = false

import { auth } from '~/firebase/init'

export default function({ store }) {
  return auth.onAuthStateChanged(user => {
    store.commit('user/UPDATE_USER')
  })
}
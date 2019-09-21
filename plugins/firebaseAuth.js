import { auth } from '~/firebase/init'

export default function({ store }) {
  return auth.onAuthStateChanged((user) => {
    store.commit('account/UPDATE_USER')
  })
}

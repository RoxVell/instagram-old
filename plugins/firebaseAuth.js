import { auth } from '~/firebase/init'

export default function({ store }) {
  return auth.onAuthStateChanged(() => {
    store.dispatch('account/updateUser')
  })
}

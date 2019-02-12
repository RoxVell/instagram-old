import { auth } from '~/firebase/init'

export default function({ store }) {
  return auth.onAuthStateChanged(user => {
    console.info(`Обновление состояние пользователя: ${user ? user.email : 'не авторизован'}`)
    store.commit('user/UPDATE_USER')
  })
}
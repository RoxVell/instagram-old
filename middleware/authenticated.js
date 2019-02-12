export default function ({ store, redirect }) {
  if (!store.getters['user/isAuth']) {
    return redirect('/auth/login')
  }
}
export default function({ store, redirect }) {
  // redirect if the user is not authenticated
  if (!store.state.account.isAuth) {
    return redirect('/')
  }
}

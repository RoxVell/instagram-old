const AuthenticatedMixin = {
  computed: {
    isAuth() {
      // return this.$store.state.user.isLoading
    }
  },
  beforeRouteEnter(to, from, next) {
    // if ($store.state.user.isLoading !== 'auth') next({ path: '/auth/login' })
  }
}

export default AuthenticatedMixin
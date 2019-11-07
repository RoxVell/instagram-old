import { debounce, scrollHandler } from '~/utils/index'
import ProfilePost from '~/components/ProfilePost'
import Gallery from '~/components/Gallery'

const PROFILE_TYPES = {
  myProfile: 'AuthUserProfile',
  otherProfile: 'OtherUserProfile',
  userNotFound: 'UserNotFound'
}

const ProfilePageMixin = {
  components: {
    ProfilePost,
    Gallery
  },
  beforeRouteLeave(to, from, next) {
    document.onscroll = null
    next()
  },
  data() {
    return {
      user: null,
      posts: [],
      loading: false,
      profileType: null,
      lazyImageObserver: null,
      queryPaginate: null
    }
  },
  methods: {
    async getPosts() {
      this.loading = true

      try {
        let result = await this.queryPaginate.next()
        if (result.done) document.onscroll = null
        this.posts.push(...result.value)
      } catch (error) {
        console.log(error)
      }

      this.loading = false
    },
    async identifyUser(username) {
      if (!this.validateUsername(username)) return PROFILE_TYPES.userNotFound

      const myAccount = this.$store.state.account.user

      if (myAccount && myAccount.username === username) {
        this.user = myAccount
        return PROFILE_TYPES.myProfile
      } else {
        // if it's not my profile try to get it from firestore
        this.user = await this.$store.dispatch('account/getUser', username)

        return this.user ? PROFILE_TYPES.otherProfile : PROFILE_TYPES.userNotFound
      }
    },
    validateUsername(username) {
      // TODO: more complex validation logic
      return username ? true : false
    }
  },
  mounted() {
    document.onscroll = debounce(() => {
      if (!this.loading) scrollHandler(500, this.getPosts)
    }, 200)
  },
  async created() {
    this.profileType = await this.identifyUser(this.$route.params.id)

    if (this.profileType !== PROFILE_TYPES.userNotFound) {
      this.queryPaginate = await this.$store.dispatch('post/getPostsByUsername', this.user.username)
      this.getPosts()
    }
  }
}

export { ProfilePageMixin, PROFILE_TYPES }

import { debounce } from '~/utils/index'
import ProfilePost from '~/components/ProfilePost'
import Gallery from '~/components/Gallery'

const PROFILE_TYPES = {
  myProfile: 'my-profile',
  otherProfile: 'other-profile',
  userNotFound: 'user-not-found'
}

const ProfilePageMixin = {
  components: {
    ProfilePost,
    Gallery
  },
  data() {
    return {
      posts: [],
      loading: false,
      isPostsLoaded: false,
      profileType: null
    }
  },
  watch: {
    user(updatedUser) {
      if (updatedUser.posts.length !== this.user.posts.length) this.getPosts()
    },
    posts(newPosts) {
      this.isPostsLoaded = (newPosts.length >= this.user.posts)
    },
    isPostsLoaded(value) {
      if (value) document.onscroll = null
    }
  },
  methods: {
    async getPosts() {
      this.loading = true

      try {
        const lastDate = (this.posts.length !== 0) ? this.posts[this.posts.length - 1].created_date : null
        const newPosts = await this.$store.dispatch('user/getPostsByUsername', {
          username: this.user.username,
          fromDate: lastDate
        })
        this.posts.push(...newPosts)
      } catch (error) {
        console.log(error)
      }

      this.loading = false
    },
    scrollEvent(e) {
      const HEIGHT_HANDLER = 500
      const currentScroll = window.innerHeight + window.scrollY
      const fullScroll = document.body.offsetHeight

      const isHandlable = (fullScroll - currentScroll <= HEIGHT_HANDLER)

      if (isHandlable && !this.loading && !this.isPostsLoaded) {
        this.getPosts()
      }
    },
    async identifyUser() {
      let profileType = null

      const username = this.$route.params.id

      if (!this.validateUsername(username)) {
        profileType = PROFILE_TYPES['userNotFound']
      } else {
        const myProfile = this.$store.state.user.user

        if (username === myProfile.username) {
          this.user = myProfile
          profileType = PROFILE_TYPES['myProfile']
        } else {
          // if it's not my profile try to get him from firestore
          this.user = await this.$store.dispatch('user/getUser', username)
          profileType = (this.user) ? PROFILE_TYPES['otherProfile'] : PROFILE_TYPES['userNotFound']
        }
      }

      return profileType
    },
    validateUsername(username) {
      // TODO: more complex validation logic
      return (username ? true : false)
    }
  },
  async created() {
    this.profileType = await this.identifyUser()

    if (this.profileType !== PROFILE_TYPES['userNotFound']) {
      this.getPosts()
      document.onscroll = debounce(this.scrollEvent, 200)
    }
  }
}

export { ProfilePageMixin, PROFILE_TYPES }

import Vue from 'vue'
import { debounce, scrollHandler } from '~/utils/index'
import ProfilePost from '~/components/ProfilePost'
import Gallery from '~/components/Gallery'
import DocumentDataWithId from '~/types/DocumentDataWithId'

enum ProfileType {
  Mine = 'AuthUserProfile',
  Other = 'OtherUserProfile',
  notFound = 'UserNotFound'
}

const ProfilePageMixin = Vue.extend({
  components: {
    ProfilePost,
    Gallery
  },
  beforeRouteLeave(to, from, next: Function) {
    document.onscroll = null
    next()
  },
  data() {
    return {
      user: null,
      posts: [],
      loading: false,
      profileType: null as ProfileType | null,
      lazyImageObserver: null,
      queryPaginate: null as AsyncGenerator<DocumentDataWithId[]> | null
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
    async identifyUser(username: string): Promise<ProfileType> {
      if (!this.validateUsername(username)) return ProfileType.notFound

      const myAccount = this.$store.state.account.user

      if (myAccount && myAccount.username === username) {
        this.user = myAccount
        return ProfileType.Mine
      } else {
        // if it's not my profile try to get it from firestore
        this.user = await this.$store.dispatch('account/getUser', username)

        return this.user ? ProfileType.Other : ProfileType.notFound
      }
    },
    validateUsername(username: string) {
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

    if (this.profileType !== ProfileType.notFound) {
      this.queryPaginate = await this.$store.dispatch('post/getPostsByUsername', this.user.username)
      this.getPosts()
    }
  }
})

export { ProfilePageMixin, ProfileType }

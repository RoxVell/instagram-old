import Vue from 'vue'
import ProfilePost from '~/components/ProfilePost'
import Gallery from '~/components/Gallery'
import DocumentDataWithId from '~/types/DocumentDataWithId'
import { debounce, scrollHandler } from '~/utils/index'
import Post from '~/types/Post'

enum AccountPageType {
  Auth = 'AuthUserProfile',
  Common = 'OtherUserProfile',
  NotFound = 'UserNotFound'
}

interface ProfilePageState {
  user: null
  posts: Post[]
  favoritePosts: Post[]
  loading: boolean
  accountPageType: AccountPageType
  lazyImageObserver: null
  postsQueryPaginate: AsyncGenerator<DocumentDataWithId[]>
  favoritePostsQueryPaginate: AsyncGenerator<DocumentDataWithId[]>
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
      favoritePosts: [],
      loading: false,
      accountPageType: null as unknown,
      lazyImageObserver: null,
      postsQueryPaginate: null as unknown,
      favoritePostsQueryPaginate: null as unknown,
    } as ProfilePageState
  },
  methods: {
    async getPosts() {
      this.loading = true

      try {
        let result = await this.postsQueryPaginate.next()
        if (result.done) document.onscroll = null
        this.posts.push(...result.value)
      } catch (error) {
        console.log(error)
      }

      this.loading = false
    },
    async getFavoritePosts() {
      this.loading = true


      const { data } = await this.$store.dispatch('post/getFavoritePosts')
      this.favoritePosts = data
      // console.log(this.favoritePosts.data);

      // try {
      //   let result = await this.favoritePostsQueryPaginate.next()
      //   console.log(result);

      //   if (result.done) {
      //     document.onscroll = null
      //   } else {
      //     this.favoritePosts.push(...result.value)
      //   }
      // } catch (error) {
      //   console.log(error)
      // }

      this.loading = false
    },
    async getAccountPageType(username: string): Promise<AccountPageType> {
      if (!this.validateUsername(username)) return AccountPageType.NotFound

      const currentUser = this.$store.state.account.user

      if (currentUser && currentUser.username === username) {
        this.user = currentUser
        return AccountPageType.Auth
      } else {
        // if it's not my profile try to get it from firestore
        this.user = await this.$store.dispatch('account/getUser', username)

        return this.user ? AccountPageType.Common : AccountPageType.NotFound
      }
    },
    validateUsername(username: string) {
      // TODO: more complex validation logic
      return username ? true : false
    }
  },
  mounted() {
    document.addEventListener('scroll', debounce(() => {
      if (!this.loading) scrollHandler(500, this.getPosts)
    }, 200))
  },
  async created() {
    this.accountPageType = await this.getAccountPageType(this.$route.params.id)

    if (this.accountPageType !== AccountPageType.NotFound) {
      this.postsQueryPaginate = await this.$store.dispatch('post/getPostsByUsername', this.user.username)
      // this.favoritePostsQueryPaginate = await this.$store.dispatch('post/getFavoritePosts')
      this.getPosts()
    }
  }
})

export { ProfilePageMixin, AccountPageType as ProfileType }

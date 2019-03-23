<template>
  <section class="profile container">

    <AuthUserProfile :user="user"/>

    <Gallery class="posts-section">
      <ProfilePost class="gallery-item" v-for="(post, index) in posts" :key="index" :post="post"/>
    </Gallery>

  </section>
</template>

<script>
import { mapState } from 'vuex'
import ProfilePost from '~/components/ProfilePost'
import Gallery from '~/components/Gallery'
import AuthUserProfile from '~/components/UserProfile/Auth'
import { debounce } from '~/utils/index'

export default {
  components: {
    AuthUserProfile,
    ProfilePost,
    Gallery,
  },
  data() {
    return {
      posts: [],
      loading: false,
      isPostsLoaded: false
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
        const newPosts = await this.$store.dispatch('user/getMyPosts', { fromDate: lastDate })
        this.posts.push(...newPosts)
      } catch(error) {
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
        console.log('HANDLE_IT')
      }
    }
  },
  computed: mapState({
    user: state => state.user.user
  }),
  created() {
    this.getPosts()
    document.onscroll = debounce(this.scrollEvent, 200)
  }
}
</script>


<style lang="scss">
@import '~/assets/scss/components/profile.scss';
</style>


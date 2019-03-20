<template>
  <section class="user-page container">
    <UserProfile v-if="user" :user="user"></UserProfile>

    <Gallery class="posts-section">
      <ProfilePost class="gallery-item" v-for="(post, index) in posts" :key="index" :post="post"/>
    </Gallery>
  </section>
</template>

<script>
import UserProfile from '~/components/UserProfile/Default'
import Gallery from '~/components/Gallery'
import ProfilePost from '~/components/ProfilePost'

export default {
  data() {
    return {
      user: null,
      posts: []
    }
  },
  components: {
    UserProfile,
    Gallery,
    ProfilePost
  },
  async created() {
    const { id: username } = this.$route.params

    this.posts = await this.$store.dispatch('user/getPostsByUsername', { username })
  }
}
</script>

<style lang="scss">
@import '~/assets/scss/components/profile.scss';
</style>

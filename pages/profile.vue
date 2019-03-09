<template>
  <div class="profile container">
    <div class="profile-section">
      <img :src="user.profile_picture" class="profile-section__avatar" alt="User Avatar">
      <div class="profile-section__user-info">
        <h2 class="profile-section__username">{{ user.username }}</h2>
        <p>{{ user.posts.length }} постов</p>
        <p>{{ user.subscribers.length }} подписчиков</p>
      </div>
      
    </div>
    <div class="posts-section">
      <div class="post" v-for="(post, index) in posts" :key="index">
        <img :src="post.content">
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  middleware: 'authenticated',
  data() {
    return {
      posts: []
    }
  },
  methods: {
    signOut() {
      this.$store.dispatch('user/signOut').then(console.log).catch(console.log)
    }
  },
  computed: mapState({
    user: state => state.user.user
  }),
  created() {
    this.$store.dispatch('user/getPosts')
      .then(posts => {
        this.posts = posts
      })
  }
}
</script>


<style lang="scss">
@import '~/assets/scss/components/profile.scss';

.posts-section {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 20px;
}

.post img {
  max-width: 30vw;
}
</style>


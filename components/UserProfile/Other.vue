<template>
  <UserProfile :user="user">
    <template slot="username-section">
      <template v-if="isAuth">
        <Button
          :loading="isFollowingLoading"
          :class="{ 'btn_blue': isFollowing }"
          @click="toggleFollow"
        >{{ isFollowing ? 'Вы подписаны' : 'Подписаться' }}</Button>
      </template>
    </template>
  </UserProfile>
</template>

<script>
import UserProfile from '~/components/UserProfile/Default'
import Button from '~/components/Button'
import { mapGetters } from 'vuex'

export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  components: {
    UserProfile,
    Button
  },
  data() {
    return {
      isFollowing: false,
      isFollowingLoading: false
    }
  },
  computed: {
    ...mapGetters({ isAuth: 'account/isAuth' })
  },
  methods: {
    toggleFollow() {
      this.isFollowing ? this.unfollow() : this.follow()
    },
    async follow() {
      this.isFollowingLoading = true

      try {
        await this.$store.dispatch('follow/followUser', this.user.username)
        this.isFollowing = true
        this.user.followers += 1
      } catch (error) {
        console.error(error)
      }

      this.isFollowingLoading = false
    },
    async unfollow() {
      this.isFollowingLoading = true

      try {
        await this.$store.dispatch('follow/unfollowUser', this.user.username)
        this.isFollowing = false
        this.user.followers -= 1
      } catch (error) {
        console.error(error)
      }

      this.isFollowingLoading = false
    },
    async checkIsFollowing() {
      this.isFollowingLoading = true

      try {
        this.isFollowing = await this.$store.dispatch('follow/isFollowing', this.user.username)
      } catch (error) {
        console.error(error)
      }

      this.isFollowingLoading = false
    }
  },
  created() {
    this.checkIsFollowing()
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/components/UserProfile/Other.scss';
</style>
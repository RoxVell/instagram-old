<template>
  <UserProfile :user="user">
    <template slot="username-section">
      <template v-if="isAuth">
        <Button
          ref="followButtonRef"
          :loading="isFollowingLoading"
          :class="{ btn_blue: isFollowing }"
          @click="toggleFollow()"
          >{{ isFollowing ? 'Вы подписаны' : 'Подписаться' }}</Button
        >
      </template>
    </template>
  </UserProfile>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { accountStore, followStore } from '~/store/'

import UserProfile from '~/components/UserProfile/DefaultProfile.vue'
import Button from '~/components/Button.vue'

import User from '~/types/User'

@Component({
  components: {
    UserProfile,
    Button,
  },
})
export default class OtherProfile extends Vue {
  @Prop({ required: true }) user: User

  isFollowing = false
  isFollowingLoading = false

  get isAuth() {
    return accountStore.isAuth
  }

  created() {
    if (this.isAuth) {
      this.checkIsFollowing()
    }
  }

  toggleFollow() {
    this.isFollowing ? this.unfollow() : this.follow()
  }

  async follow() {
    this.isFollowingLoading = true

    try {
      await followStore.followUser(this.user.username)
      this.isFollowing = true
      this.user.followers += 1
    } catch (error) {
      console.error(error)
    }

    this.isFollowingLoading = false
  }

  async unfollow() {
    this.isFollowingLoading = true

    try {
      await followStore.unfollowUser(this.user.username)
      this.isFollowing = false
      this.user.followers -= 1
    } catch (error) {
      console.error(error)
    }

    this.isFollowingLoading = false
  }

  async checkIsFollowing() {
    this.isFollowingLoading = true

    try {
      this.isFollowing = await followStore.isFollowing(this.user.username)
      console.log(this.isFollowing)
    } catch (error) {
      console.error(error)
    }

    this.isFollowingLoading = false
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/components/UserProfile/Other.scss';
</style>

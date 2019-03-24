<template>
  <section class="profile container">

    <AuthUserProfile v-if="profileType === PROFILE_TYPES['myProfile']" :user="user" />
    <OtherUserProfile v-if="profileType === PROFILE_TYPES['otherProfile']" :user="user" />
    <UserNotFound v-if="profileType === PROFILE_TYPES['userNotFound']" :username="this.$route.params.id || ''"/>

    <Gallery class="posts-section">
      <ProfilePost class="gallery-item" v-for="(post, index) in posts" :key="index" :post="post"/>
    </Gallery>

  </section>
</template>

<script>
import AuthUserProfile from '~/components/UserProfile/Auth'
import OtherUserProfile from '~/components/UserProfile/Other'
import UserNotFound from '~/components/UserProfile/UserNotFound'
import { ProfilePageMixin, PROFILE_TYPES } from '~/mixins/ProfilePageMixin'

export default {
  mixins: [ProfilePageMixin],
  components: {
    AuthUserProfile,
    OtherUserProfile,
    UserNotFound
  },
  data() {
    return {
      user: null,
      isMyProfile: null,
      PROFILE_TYPES
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/scss/components/profile.scss';
</style>

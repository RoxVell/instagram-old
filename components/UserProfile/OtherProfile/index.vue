<template>
  <UserProfile :user="user">
    <template slot="username-section">
      <template v-if="isAuth">
        <Button
          ref="followButtonRef"
          :loading="isFollowingLoading"
          :class="{ 'btn_blue': isFollowing }"
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
    async injectAuthActions() {
      const module = await import('./otherProfileAuthActions')
      for (let key in module) this[key] = module[key].bind(this)
      this.setupListenersForReferences()
    },
    setupListenersForReferences() {
      this.$refs.followButtonRef.$on('click', this.toggleFollow)
    }
  },
  async created() {
    if (this.isAuth) {
      await this.injectAuthActions()
      this.checkIsFollowing()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/components/UserProfile/Other.scss';
</style>

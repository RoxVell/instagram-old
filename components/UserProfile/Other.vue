<template>
  <UserProfile :user="user">
    <template slot="username-section">
      <template v-if="isAuth">
        <button class="btn btn-edit" @click="follow">Подписаться</button>
      </template>
      <template v-else></template>
    </template>
  </UserProfile>
</template>

<script>
import UserProfile from '~/components/UserProfile/Default'
import { mapGetters } from 'vuex'

export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  components: {
    UserProfile
  },
  data() {
    return {
      isFollowing: null
    }
  },
  computed: {
    ...mapGetters({ isAuth: 'account/isAuth' })
  },
  methods: {
    follow() {
      console.log(`Follow that user`, this.user.username)
    }
  }
}
</script>

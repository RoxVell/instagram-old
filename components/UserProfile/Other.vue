<template>
  <UserProfile :user="user">
    <template slot="username-section">
      <button
        class="btn btn-edit"
        @click="follow">
        Подписаться
      </button>
      
    </template>
     
  </UserProfile>
</template>

<script>
import UserProfile from '~/components/UserProfile/Default'

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
  methods: {
    follow() {
      console.log(`Follow that user`, this.user.username)
    }
  }
}
</script>

<template>
  <div class="user">
    <img :src="user.avatar" alt="Avatar">
    <p v-if="username && user">{{ user.email }}</p>
    <p v-if="username && user">{{ user.email }}</p>
  </div>
</template>

<script>
export default {
  props: ['username', 'avatar'],
  data() {
    return {
      user: this.$store.state.user.user
    }
  },
  computed: {
    
  }
}
</script>

<template>
  <header class="header">
    <div class="header container">
      <nuxt-link to="/" tag="a">
        <div class="logo"></div>
      </nuxt-link>

      <nuxt-link to="/upload" class="btn" tag="a">Добавить фото</nuxt-link>
      <!-- <button @click="$store.dispatch('user/signOut')">Test</button> -->
      <div>

        <template v-if="$store.getters['user/isAuth']">
          
          <nuxt-link class="user-section" to="/profile">
            <img class="user-avatar" :src="user.profile_picture" alt="User avatar">
            <span class="user-name">{{ user.username }}</span>
          </nuxt-link>
          
          <!-- <button class="link" @click="signOut">Выйти</button> -->
        </template>

        <template v-else>
          <ul class="auth">
            <nuxt-link to="/auth/login" tag="a">
              <li class="auth-login">Войти</li>
            </nuxt-link>
            <nuxt-link to="/auth/signup" tag="a">
              <li class="auth-signup">Зарегистрироваться</li>
            </nuxt-link>
          </ul>
        </template>

      </div>
    </div>
  </header>
</template>

<script>
import { mapState } from 'vuex'
import User from '~/components/User'

export default {
  components: {
    User
  },
  computed: mapState({
    user: state => state.user.user
  }),
  methods: {
    signOut() {
      this.$store.dispatch('user/signOut')
    }
  }
}
</script>


<style lang="scss">
@import '~assets/scss/components/header';
</style>

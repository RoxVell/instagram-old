<template>
  <header class="header">
    <div class="header container">
      <nuxt-link to="/" tag="a">
        <div class="logo"></div>
      </nuxt-link>

      <Search />

      <div class="header-auth">
        <nav>
          <ul class="header-menu">
            <template v-if="$store.getters['user/isAuth']">
              <nuxt-link to="/upload" class="btn" tag="li">
                <img
                  style="width: 18px; margin-right: 7px;"
                  src="/images/icons/upload-min.png"
                  alt="upload icon"
                />
                <span>Добавить фото</span>
              </nuxt-link>

              <nuxt-link :to="`/user/${user.username}`" tag="li">
                <img
                  style="width: 30px; height: 30px; margin-right: 10px;"
                  class="user-avatar"
                  :src="user.profile_picture"
                  alt="avatar"
                />
                <!-- <img
                  style="width: 18px; margin-right: 7px;"
                  src="/images/icons/user-outline.svg"
                  alt
                />-->
                <span class="user-name">{{ user.username }}</span>
              </nuxt-link>

              <li class="header-menu__break"></li>
              <li @click="signOut">Выйти</li>
            </template>

            <template v-else>
              <nuxt-link to="/auth/login" tag="li">Войти</nuxt-link>
              <nuxt-link to="/auth/signup" tag="li">Зарегистрироваться</nuxt-link>
            </template>
          </ul>
        </nav>
      </div>
    </div>
  </header>
</template>

<script>
import { mapState } from 'vuex'
import User from '~/components/User'
import Search from '~/components/Search'

export default {
  components: {
    User,
    Search
  },
  computed: mapState({
    user: (state) => state.user.user
  }),
  methods: {
    signOut() {
      this.$store
        .dispatch('user/signOut')
        .then(() => {
          this.$router.replace('/')
        })
        .catch(console.log)
    }
  }
}
</script>

<style lang="scss">
@import '~assets/scss/components/header';
</style>

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
            <template v-if="user">
              <nuxt-link to="/upload" class="btn" tag="li">
                <img
                  style="width: 18px; margin-right: 7px;"
                  src="/images/icons/upload-min.png"
                  alt="upload icon"
                />
                <span>Добавить фото</span>
              </nuxt-link>

              <nuxt-link :to="`/user/${user.username}`" tag="li">
                <AuthUserAvatar class="user-avatar" :size="30" />
                <span>{{ user.username }}</span>
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
import AuthUserAvatar from '~/components/Avatar/AuthUserAvatar'

export default {
  components: {
    User,
    Search,
    AuthUserAvatar
  },
  computed: mapState({
    user: (state) => state.account.user
  }),
  methods: {
    signOut() {
      this.$store
        .dispatch('auth/signOut')
        .then(() => {
          this.$router.replace('/')
        })
        .catch(console.log)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/scss/components/Header';
</style>


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
              <nuxt-link to="/upload" class="header-menu__item" tag="a">
                <img
                  class="header-item__icon header-item__icon_upload"
                  src="/images/icons/upload-min.png"
                  alt="upload icon"
                />
                <span>Добавить фото</span>
              </nuxt-link>

              <nuxt-link :to="`/user/${user.username}`" class="header-menu__item" tag="a">
                <AuthUserAvatar class="header-item__icon" :size="30" />
                <span>{{ user.username }}</span>
              </nuxt-link>

              <a class="header-menu__item header-menu__break"></a>
              <a class="header-menu__item" @click="signOut">Выйти</a>
            </template>

            <template v-else>
              <nuxt-link to="/auth/login" class="header-menu__item" tag="a">Войти</nuxt-link>
              <nuxt-link to="/auth/signup" class="header-menu__item" tag="a">Зарегистрироваться</nuxt-link>
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
    async signOut() {
      await this.$store.dispatch('auth/signOut')
          this.$router.replace('/')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/scss/components/Header';
</style>


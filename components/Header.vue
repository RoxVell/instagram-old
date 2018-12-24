<template>
  <header>
    <div class="header main-container">
      <nuxt-link to="/" tag="a">
        <div class="logo"></div>
      </nuxt-link>

      <nav>
        <!-- <ul class="header-menu">
          <li class="header-menu__item">
            <svg x="0px" y="0px" viewBox="0 0 512 512">
              <g><path d="M506.555,208.064L263.859,30.367c-4.68-3.426-11.038-3.426-15.716,0L5.445,208.064 c-5.928,4.341-7.216,12.665-2.875,18.593s12.666,7.214,18.593,2.875L256,57.588l234.837,171.943c2.368,1.735,5.12,2.57,7.848,2.57 c4.096,0,8.138-1.885,10.744-5.445C513.771,220.729,512.483,212.405,506.555,208.064z"/></g>
              <g><path d="M442.246,232.543c-7.346,0-13.303,5.956-13.303,13.303v211.749H322.521V342.009c0-36.68-29.842-66.52-66.52-66.52 s-66.52,29.842-66.52,66.52v115.587H83.058V245.847c0-7.347-5.957-13.303-13.303-13.303s-13.303,5.956-13.303,13.303v225.053 c0,7.347,5.957,13.303,13.303,13.303h133.029c6.996,0,12.721-5.405,13.251-12.267c0.032-0.311,0.052-0.651,0.052-1.036v-128.89 c0-22.009,17.905-39.914,39.914-39.914s39.914,17.906,39.914,39.914v128.89c0,0.383,0.02,0.717,0.052,1.024 c0.524,6.867,6.251,12.279,13.251,12.279h133.029c7.347,0,13.303-5.956,13.303-13.303V245.847 C455.549,238.499,449.593,232.543,442.246,232.543z"/></g>
            </svg>
          </li>
          <li class="header-menu__item">
            <svg x="0px" y="0px" viewBox="0 0 56.966 56.966">
              <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23 s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92 c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17 s-17-7.626-17-17S14.61,6,23.984,6z"/>
            </svg>
          </li>
        </ul> -->
      </nav>
      <div>
        <template v-if="$store.getters['user/isAuth']">
          <nuxt-link to="/upload" class="btn" tag="a">Добавить фото</nuxt-link>  
          <span>{{ $store.state.user.user.email }}</span>
          <button class="link" @click="signOut">Выйти</button>
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
export default {
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

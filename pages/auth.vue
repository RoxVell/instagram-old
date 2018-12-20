<template>
  <section class="auth">

    <div class="auth-form form">
      <nuxt-child></nuxt-child>
    </div>

    <div class="auth-switch">
      <p>
        {{ switchMessage.message }}
        <nuxt-link :to="switchMessage.path.link">{{ switchMessage.path.text }}</nuxt-link>
      </p>
    </div>
    
  </section>
</template>

<script>
export default {
  components: {
  },
  data() {
    return {
    }
  },
  computed: {
    switchMessage() {
      switch (this.$nuxt.$route.name) {
        case 'auth-Login':
          return {
            message: 'Нет аккаунта?',
            path: {
              text: 'Создайте',
              link: '/auth/signup'
            }
          }
          break
        case 'auth-Signup':
          return {
            message: 'Уже есть аккаунт?',
            path: {
              text: 'Войти',
              link: '/auth/login'
            }
          }
          break
      }
    },
    isAuth() {
      return this.$store.getters['user/isAuth']
    }
  },
  methods: {

  },
}
</script>

<style lang="scss">
@import '~assets/scss/components/auth';
</style>

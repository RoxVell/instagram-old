<template>
  <section class="auth">
    <div class="auth-form form">
      <component :is="currentComponent"></component>
    </div>

    <div class="auth-switch">
      <p @click="switchComponent" v-html="switchMessage"></p>
    </div>
    
  </section>
</template>

<script>
import Login from '~/components/Login'
import Signup from '~/components/Signup'

export default {
  components: {
    Login,
    Signup
  },
  data() {
    return {
      currentComponent: 'login',
    }
  },
  computed: {
    switchMessage() {
      return (this.currentComponent === 'login') ?
        'Нет аккаунта? <span>Создайте</span>' : 'Уже есть аккаунт? <span>Войти</span>'
    },
    isAuth() {
      return this.$store.getters['user/isAuth']
    }
  },
  methods: {
    switchComponent() {
      this.currentComponent = (this.currentComponent === 'login') ? 'signup' : 'login' 
    }
  },
}
</script>

<style lang="scss">
@import '~assets/scss/components/auth';
</style>

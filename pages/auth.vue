<template>
  <section class="auth">
    <div class="auth-form form">
      <component :is="currentComponent"></component>
    </div>

    <div>
      <button @click="switchComponent">Переключить</button>
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
      currentComponent: "login"
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

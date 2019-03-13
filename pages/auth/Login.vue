<template>
  <div class="login">
    <p class="form-title">Авторизуйтесь</p>

    <div class="form-element">
      <label for="auth-login">Email</label>
      <input id="auth-login" type="text" v-model="email">
      <p class="form-element__desc form-element__error">{{ emailError }}</p>
    </div>
    
    <div class="form-element">
      <label for="login-password" >Пароль</label>
      <input id="login-password" type="password" v-model="password" @keyup.enter="signInWithEmailAndPassword">
      <p class="form-element__desc">Пароль должен содержать не менее 8 символов</p>
      <p class="form-element__desc form-element__error">{{ passwordErorr }}</p>
    </div>

    <div class="form-element">
      <button class="btn btn-primary" @click="signInWithEmailAndPassword">Войти</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      emailError: '',
      passwordErorr: ''
    }
  },
  methods: {
    signInWithEmailAndPassword() {
      this.$store.dispatch('user/signInWithEmailAndPassword', {
        email: this.email,
        password: this.password
      })
      .then(this.authSuccess)
      .catch(this.authFailed)
    },
    authSuccess(...args) {
      this.$nuxt.$router.push('/')
    },
    authFailed(error) {
      console.log(error)

      switch(error.code) {
        case 'auth/invalid-email':
          this.emailError = 'Неправильный e-mail'
          break
        case 'auth/wrong-password':
          this.passwordErorr = 'Пароль имеет неверный формат'
          break
        case 'auth/user-not-found':
          this.passwordErorr = 'Такого пользователя не найдено'
          break
      }
      
    }
  }
}
</script>

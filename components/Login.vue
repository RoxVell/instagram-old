<template>
  <div class="login">
    <p class="form-title">Авторизуйтесь</p>

    <div class="form-element">
      <label for="auth-login">Логин</label>
      <input id="auth-login" type="text" v-model="email">
    </div>
    
    <div class="form-element">
      <label for="login-password" >Пароль</label>
      <input id="login-password" type="password" v-model="password">
      <p class="form-element__desc">Пароль должен содержать не менее 8 символов</p>
    </div>

    <div class="form-element">
      <button class="btn btn-primary" @keyup.enter="signInWithEmailAndPassword" @click="signInWithEmailAndPassword">Войти</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
    }
  },
  methods: {
    signInWithEmailAndPassword() {
      this.$store.dispatch('user/signInWithEmailAndPassword', { email: this.email, password: this.password })
    },
  }
}
</script>

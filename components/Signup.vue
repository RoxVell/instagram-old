<template>
  <div class="signup">
    <p class="form-title">Зарегистрируйтесь</p>
    <div class="form-element">
      <label class="required" for="signup-mail">E-mail</label>
      <input id="signup-mail" type="email" v-model="email">
    </div>
    
    <div class="form-element">
      <label class="required" for="signup-password">Пароль</label>
      <input id="signup-password" type="password" v-model="password">
    </div>

    <div class="form-element">
      <label class="required" for="signup-password-repeat">Подтвердите пароль</label>
      <input id="signup-password-repeat" type="password" v-model="repeatPassword">
    </div>
   
    <div class="form-element">
      <button
        class="btn btn-primary"
        @keyup.enter="createUserWithEmailAndPassword"
        @click="createUserWithEmailAndPassword">
        Регистрация
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      repeatPassword: ''
    }
  },
  methods: {
    createUserWithEmailAndPassword() {
      if (!this.isValidUser) return
      
      this.$store.dispatch('user/createUserWithEmailAndPassword', {
        email: this.email,
        password: this.password
      })
    },
    isValidUser() {
      return (this.password === this.repeatPassword)
    }
  }
}
</script>

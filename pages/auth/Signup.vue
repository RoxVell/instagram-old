<template>
  <div class="signup">
    <p class="form-title">Зарегистрируйтесь</p>
    <div class="form-element">
      <label class="required" for="signup-mail">E-mail</label>
      <input id="signup-mail" type="email" v-model="signupForm.email">
    </div>

    <div class="form-element">
      <label class="required" for="signup-login">Имя пользователя</label>
      <input id="signup-login" v-model="signupForm.username">
    </div>
    
    <div class="form-element">
      <label class="required" for="signup-password">Пароль</label>
      <input id="signup-password" type="password" v-model="signupForm.password">
      <p class="form-element__desc">Пароль должен содержать не менее 8 символов</p>
    </div>

    <div class="form-element">
      <label class="required" for="signup-password-repeat">Подтвердите пароль</label>
      <input id="signup-password-repeat" type="password" v-model="signupForm.repeatPassword">
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
      signupForm: {
        email: '',
        password: '',
        repeatPassword: '',
        username: ''
      }
    }
  },
  methods: {
    createUserWithEmailAndPassword() {
      if (!this.isValidUser) return

      const { email, username, password } = this.signupForm

      this.$store.dispatch('user/createUserWithEmailAndPassword', {
        email,
        username,
        password
      }).then(response => {
        this.$router.push({
          path: '/'
        })
      })
    },
    isValidUser() {
      return (this.password === this.repeatPassword)
    }
  }
}
</script>

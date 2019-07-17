<template>
  <div class="signup">
    <p class="form-title">Зарегистрируйтесь</p>
    <div class="form-element">
      <label class="required" for="signup-mail">E-mail</label>
      <input id="signup-mail" type="email" v-model="signupForm.email" />
    </div>

    <div class="form-element">
      <label class="required" for="signup-login">Имя пользователя</label>
      <input
        id="signup-login"
        v-model.trim="signupForm.username"
        @change="checkUsername"
        @input="usernameToLowerCase"
      />
      <p class="form-element__desc form-element__error">{{ usernameError }}</p>
    </div>

    <div class="form-element">
      <label class="required" for="signup-password">Пароль</label>
      <input id="signup-password" type="password" v-model="signupForm.password" />
      <p class="form-element__desc">Пароль должен содержать не менее 8 символов</p>
    </div>

    <div class="form-element">
      <label class="required" for="signup-password-repeat">Подтвердите пароль</label>
      <input
        id="signup-password-repeat"
        type="password"
        v-model="signupForm.repeatPassword"
        @keyup.enter="createUserAndLogin"
      />
      <p class="form-element__desc form-element__error">{{ passwordsCompareError }}</p>
    </div>

    <div class="form-element">
      <button class="btn btn-primary" @click="createUserAndLogin">Регистрация</button>
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
      },
      usernameError: '',
      passwordsCompareError: ''
    }
  },
  methods: {
    usernameToLowerCase(e) {
      let username = e.target.value
      this.signupForm.username = username.toLowerCase()
    },
    checkUsername(e) {
      this.usernameError = ''

      const username = e.target.value.toLowerCase()

      this.$store
        .dispatch('user/checkUsername', username)
        .then((response) => {
          if (!response) {
            this.usernameError = `Никнейм ${username} занят`
          }
        })
        .catch()
    },
    async createUserAndLogin() {
      if (!this.signupDataIsValid()) return

      const userData = this.signupForm

      try {
        const message = await this.createUserWithEmailAndPassword(userData)
        console.log(message)
        await this.signInWithEmailAndPassword(userData)
        this.$router.push({ path: '/' })
      } catch (error) {
        console.log(error)
      }
    },
    createUserWithEmailAndPassword({ email, username, password }) {
      return this.$store.dispatch('user/createUserWithEmailAndPassword', {
        email,
        username,
        password
      })
    },
    signInWithEmailAndPassword({ email, password }) {
      return this.$store.dispatch('user/signInWithEmailAndPassword', {
        email,
        password
      })
    },
    signupDataIsValid() {
      return this.usernameIsValid() && this.passwordsIsValid()
    },
    usernameIsValid() {
      return this.usernameError === ''
    },
    passwordsIsValid() {
      const { password, repeatPassword } = this.signupForm
      const passwordIsEnoughLength = password.length >= 8
      const passwordsIsCompare = password === repeatPassword

      if (!this.passwordIsEnoughLength) {
        this.passwordsCompareError = 'Пароль недостаточно сложный'
      } else if (!this.passwordsIsCompare) {
        this.passwordsCompareError = 'Пароли не совпадают'
      } else {
        this.passwordsCompareError = ''
      }

      return passwordIsEnoughLength && passwordsIsCompare
    }
  }
}
</script>

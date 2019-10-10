<template>
  <form class="login" @submit.prevent="signInWithEmailAndPassword">
    <p class="form-title">Авторизуйтесь</p>

    <div class="form-element">
      <label for="auth-login">Email</label>
      <input id="auth-login" type="text" v-model.trim="email" />
      <p class="form-element__desc form-element__error">
        <template v-if="$v.email.$dirty && !$v.email.required">Поле обязательно для заполнения</template>
        <template v-else-if="$v.email.$dirty && !$v.email.email">Поле должно иметь формат email</template>
        <template v-else-if="emailError">{{ emailError }}</template>
      </p>
    </div>

    <div class="form-element">
      <label for="login-password">Пароль</label>
      <input
        id="login-password"
        type="password"
        v-model="password"
        @input="passwordError = ''"
        @keyup.enter="signInWithEmailAndPassword"
      />
      <p class="form-element__desc form-element__error">
        <template v-if="$v.password.$dirty && !$v.password.required">Поле обязательно для заполнения</template>
        <template
          v-else-if="$v.password.$dirty && !$v.password.minLength"
        >Пароль должен содержать не менее {{ $v.password.$params.minLength.min }} символов</template>
        <template v-else-if="passwordError">{{ passwordError }}</template>
      </p>
    </div>

    <div class="form-element">
      <Button type="submit" :loading="loading" class="btn btn_blue">Войти</Button>
    </div>
  </form>
</template>

<script>
import Vue from 'vue'
import Button from '~/components/Button'
import { validationMixin } from 'vuelidate'
import { required, minLength, email } from 'vuelidate/lib/validators'

const LoginComponent = Vue.extend({
  mixins: [validationMixin],
  components: {
    Button
  },
  data() {
    return {
      email: '',
      password: '',
      emailError: '',
      passwordError: '',
      loading: false
    }
  },
  validations: {
    email: {
      required,
      email
    },
    password: {
      required,
      minLength: minLength(8)
    }
  },
  methods: {
    async signInWithEmailAndPassword() {
      // Validate form
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }

      this.loading = true

      await this.$store
        .dispatch('auth/signInWithEmailAndPassword', {
          email: this.email,
          password: this.password
        })
        .then(this.authSuccess)
        .catch(this.authFailed)

      this.loading = false
    },
    authSuccess() {
      this.$nuxt.$router.push('/')
    },
    authFailed(error) {
      switch (error.code) {
        case 'auth/invalid-email':
          this.emailError = 'Неправильный e-mail'
          break
        case 'auth/wrong-password':
          this.passwordError = 'Пароль имеет неверный формат'
          break
        case 'auth/user-not-found':
          this.passwordError = 'Такого пользователя не найдено'
          break
      }
    }
  }
})

export default LoginComponent
</script>

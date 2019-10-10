<template>
  <form class="signup" @submit.prevent="createUserAndLogin">
    <p class="form-title">Зарегистрируйтесь</p>
    <div class="form-element">
      <label class="required" for="signup-mail">E-mail</label>
      <input id="signup-mail" type="email" v-model.trim="email" />
      <p class="form-element__desc form-element__error">
        <template v-if="$v.email.$dirty && !$v.email.required">Поле обязательно для заполнения</template>
        <template v-else-if="$v.email.$dirty && !$v.email.email">Поле должно иметь формат email</template>
      </p>
    </div>

    <div class="form-element">
      <label class="required" for="signup-login">Имя пользователя</label>
      <input id="signup-login" v-model.lazy.trim="username" @blur="usernameCheck" />
      <p class="form-element__desc form-element__error">
        <template v-if="$v.username.$dirty && !$v.username.required">Поле обязательно для заполнения</template>
        <template
          v-else-if="$v.username.$dirty && !$v.username.$pending && !$v.username.isUnique"
        >Имя пользователя {{ $v.username.$model }} занято</template>
      </p>
    </div>

    <div class="form-element">
      <label class="required" for="signup-password">Пароль</label>
      <input id="signup-password" type="password" v-model="password" />
      <p class="form-element__desc form-element__error">
        <template v-if="$v.password.$dirty && !$v.password.required">Поле обязательно для заполнения</template>
        <template
          v-else-if="$v.password.$dirty && !$v.password.minLength"
        >Пароль должен содержать не менее {{ $v.password.$params.minLength.min }} символов</template>
      </p>
    </div>

    <div class="form-element">
      <label class="required" for="signup-password-repeat">Подтвердите пароль</label>
      <input
        id="signup-password-repeat"
        type="password"
        v-model="repeatPassword"
        @keyup.enter="createUserAndLogin"
      />
      <p class="form-element__desc form-element__error">
        <template v-if="!$v.repeatPassword.sameAsPassword">Введённые пароли не совпадают</template>
      </p>
    </div>

    <div class="form-element">
      <Button type="submit" :loading="loading" class="btn btn_blue">Регистрация</Button>
    </div>
  </form>
</template>

<script>
import Vue from 'vue'
import Button from '~/components/Button'
import { validationMixin } from 'vuelidate'
import { required, minLength, email, sameAs } from 'vuelidate/lib/validators'

const RegisterComponent = Vue.extend({
  mixins: [validationMixin],
  components: {
    Button
  },
  data() {
    return {
      email: '',
      username: '',
      password: '',
      repeatPassword: '',
      loading: false
    }
  },
  validations: {
    username: {
      required,
      minLength: minLength(3),
      isUnique(username) {
        if (username === '') return false

        return this.$store
          .dispatch('auth/checkUsername', username)
          .then((isUnique) => isUnique)
          .catch(() => false)
      }
    },
    email: {
      required,
      email
    },
    password: {
      required,
      minLength: minLength(8)
    },
    repeatPassword: {
      required,
      sameAsPassword: sameAs('password')
    }
  },
  methods: {
    usernameCheck() {
      this.username = this.username.toLowerCase()
      this.$v.username.$touch()
    },
    usernameToLowerCase(e) {
      let username = e.target.value
      this.username = username.toLowerCase()
    },
    async createUserAndLogin() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }

      this.loading = true

      const userData = {
        email: this.email,
        username: this.username,
        password: this.password
      }

      try {
        const message = await this.createUserWithEmailAndPassword(userData)
        await this.signInWithEmailAndPassword(userData)
        this.$router.push({ path: '/' })
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },
    createUserWithEmailAndPassword({ email, username, password }) {
      return this.$store.dispatch('auth/createUserWithEmailAndPassword', {
        email,
        username,
        password
      })
    },
    signInWithEmailAndPassword({ email, password }) {
      return this.$store.dispatch('auth/signInWithEmailAndPassword', {
        email,
        password
      })
    }
  }
})

export default RegisterComponent
</script>

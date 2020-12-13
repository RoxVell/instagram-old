<template>
  <div class="user-not-found-page">
    <p class="title">Пользователь {{ username }} не найден!</p>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component({})
export default class UserNotFoundProfile extends Vue {
  username: string

  beforeMount() {
    this.username = this.$route.params.id
  }
}
</script>

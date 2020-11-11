<template>
  <div class="user-not-found-page">
    <p class="title">Пользователь {{ username }} не найден!</p>
  </div>
</template>

<script>
export default {
  beforeMount() {
    this.username = this.$route.params.id
  }
}
</script>

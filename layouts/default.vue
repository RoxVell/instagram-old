<template>
  <div>
    <template v-if="loading">
      <Spinner />
    </template>

    <template v-else>
      <div class="wrapper">
        <Header />
        <nuxt />
      </div>
    </template>
  </div>
</template>

<script>
import Header from '~/components/Header'
import Spinner from '~/components/Spinner'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      loading: true
    }
  },
  components: {
    Header,
    Spinner
  },
  computed: mapState({
    isLoading: (state) => state.account.isLoading
  }),
  watch: {
    isLoading: {
      handler(value) {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss">
@import '~assets/scss/build.scss';
</style>

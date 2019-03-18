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
    isLoading: state => state.user.isLoading
  }),
  watch: {
    isLoading(value) {
      if (value) this.$router.push('/auth/login')
      
      this.loading = false
    }
  },
}
</script>


<style lang="scss">
@import '~assets/scss/build.scss';
</style>

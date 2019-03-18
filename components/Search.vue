<template>
  <div class="search-component">
    <input type="text" :class="[ loading ? 'input-loading': 'input-search' ]">
    <div class="suggestions">
      <a class="suggestions-item" href="#">
        <span class="suggestions-item__title">Some</span>
        <span class="suggestions-item__desc">Some lionger</span>
      </a>
      <a class="suggestions-item" href="#">
        <span class="suggestions-item__title">Some</span>
        <span class="suggestions-item__desc">Some lionger</span>
      </a>
      <a class="suggestions-item" href="#">
        <span class="suggestions-item__title">Some</span>
        <span class="suggestions-item__desc">Some lionger</span>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    suggestions: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss">
@import '~assets/scss/components/search.scss';
</style>


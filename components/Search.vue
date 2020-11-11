<template>
  <div class="search-component">
    <input type="text" :class="[ loading ? 'input-loading': 'input-search' ]" />
    <div class="suggestions" v-if="suggestions.length !== 0">
      <a
        class="suggestions-item"
        v-for="(suggestion, index) in suggestions"
        :href="suggestion.link"
        :key="index"
      >
        <span class="suggestions-item__title">{{ suggestion.title }}</span>
        <span class="suggestions-item__desc">{{ suggestion.desc }}</span>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    suggestions: {
      type: Array,
      default: () => []
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

<template>
  <button
    v-bind="$attrs"
    class="btn"
    @click="$emit('click')"
    :disabled="loading"
    :class="{ 'btn-loading': loading }"
  >
    <span class="text">
      <slot></slot>
    </span>
    <IconBase v-if="loading" width="25" height="25" viewbox="0 0 100 100">
      <IconSpinner :color="loadingColor"></IconSpinner>
    </IconBase>
  </button>
</template>

<script>
import IconBase from '~/components/Icons/IconBase'
import IconSpinner from '~/components/Icons/IconSpinner'

export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    loadingColor: {
      type: String,
      default: 'white'
    }
  },
  components: {
    IconBase,
    IconSpinner
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/elements/button/button.btn';
@import '~/assets/scss/elements/button/button.btn_loading';
</style>
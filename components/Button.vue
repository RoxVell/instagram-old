<template>
  <button v-bind="$attrs" class="btn btn-primary" :class="{ 'btn-loading': loading }">
    <span class="text">
      <slot></slot>
    </span>
    <IconBase v-if="loading" width="25" height="25" viewbox="0 0 100 100">
      <IconSpinner color="white"></IconSpinner>
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
    }
  },
  components: {
    IconBase,
    IconSpinner
  }
}
</script>

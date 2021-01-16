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

<script lang="ts">
import { Vue, Component, namespace, Prop } from 'nuxt-property-decorator'

import IconBase from '~/components/Icons/IconBase.vue'
import IconSpinner from '~/components/Icons/IconSpinner.vue'

@Component({
  components: {
    IconBase,
    IconSpinner,
  },
})
export default class Button extends Vue {
  @Prop({ type: Boolean, default: false }) loading: boolean
  @Prop({ type: String, default: '#ffffff' }) loadingColor: string
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/elements/button/button.btn';
@import '~/assets/scss/elements/button/button.btn_loading';
</style>
<template>
  <div class="spinner-component">
    <IconBase width="45" height="45" viewbox="0 0 100 100">
      <IconSpinner />
    </IconBase>
    <!-- <span class="spinner-icon"></span> -->
    <span class="spinner-text">Загрузка...</span>
  </div>
</template>

<script>
import IconBase from '~/components/Icons/IconBase'
import IconSpinner from '~/components/Icons/IconSpinner'

export default {
  components: {
    IconBase,
    IconSpinner
  }
}
</script>

<style lang="scss">
@import '~assets/scss/components/spinner.scss';
</style>

<template>
  <transition name="fade">
    <div class="modal-component" v-if="show">
      <div class="modal-wrapper" @click="handleClick($event)">
        <div class="modal-content">
          <slot></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  methods: {
    handleClick(event) {
      if (event.target.className === 'modal-wrapper') this.$emit('click')
    }
  }
}
</script>

<style lang="scss">
@import '~assets/scss/components/Modal.scss';
</style>

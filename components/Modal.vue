<template>
  <div
    role="dialog"
    aria-labelledby="modalTitle"
    aria-describedby="modalDescription"
    v-show="value"
    class="modal"
    @click="handleClick($event)"
    :class="{'modal_no-border': noBorder}"
    v-bind="$attrs"
  >
    <transition v-bind="transition">
      <div class="modal__wrapper" v-if="value">
        <template v-if="$slots.header">
          <header id="modalTitle" class="modal__header">
            <slot name="header"></slot>
          </header>
        </template>

        <section id="modalDescription" class="modal__content">
          <slot></slot>
        </section>

        <template v-if="$slots.footer">
          <footer class="modal__footer">
            <slot name="footer"></slot>
          </footer>
        </template>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      required: true,
      default: false
    },
    transition: {
      type: Object
    },
    noBorder: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value(value) {
      document.body.style.overflow = value ? 'hidden' : ''
    }
  },
  methods: {
    handleClick(event) {
      if (event.target.classList.contains('modal')) this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
@import '~assets/scss/components/Modal/Modal.scss';
</style>

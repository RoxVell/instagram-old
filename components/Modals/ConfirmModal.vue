<template>
  <Modal @close="$emit('close')" v-model="value" v-bind="$attrs">
    <template #header>
      <slot name="header"></slot>
    </template>

    <slot></slot>

    <template #footer>
      <button @click="$emit('cancel')" class="btn btn_blue">{{cancelTitle}}</button>
      <button @click="$emit('confirm')" class="btn btn_red">{{confirmTitle}}</button>
    </template>
  </Modal>
</template>

<script>
import Modal from '~/components/Modal'

export default {
  props: {
    value: {
      type: Boolean,
      required: true
    },
    cancelTitle: {
      type: String,
      default: 'Отменить'
    },
    confirmTitle: {
      type: String,
      default: 'Подтвердить'
    }
  },
  components: {
    Modal
  }
}
</script>

<style lang="scss">
</style>
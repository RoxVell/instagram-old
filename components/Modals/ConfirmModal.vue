<template>
  <Modal @close="$emit('close')" v-model="value" v-bind="$attrs">
    <template #header>
      <slot name="header"></slot>
    </template>

    <slot></slot>

    <template #footer>
      <button @click="$emit('cancel')" class="btn btn_blue">{{ cancelTitle }}</button>
      <button @click="$emit('confirm')" class="btn btn_red">{{ confirmTitle }}</button>
    </template>
  </Modal>
</template>

<script lang="ts">
import Modal from '~/components/Modal.vue'
import { Vue, Component, namespace, Prop } from 'nuxt-property-decorator'

@Component({
  components: {
    Modal,
  },
})
export default class ConfirmModal extends Vue {
  @Prop({ type: Boolean, required: true }) value: boolean
  @Prop({ type: String, default: 'Отменить' }) cancelTitle: string
  @Prop({ type: String, default: 'Подтвердить' }) confirmTitle: string
}
</script>

<style lang="scss">
</style>
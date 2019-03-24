<template>
  <section>
    <button class="btn" @click="open">Open modal</button>
    <Modal :show="show" @click="close">
      <p>Something</p>
    </Modal>
  </section>
</template>

<script>
import Modal from '~/components/Modal'

export default {
  components: {
    Modal
  },
  data() {
    return {
      show: false
    }
  },
  methods: {
    close() {
      this.show = false
    },
    open() {
      this.show = true
    }
  }
}
</script>

<style>
.main-container {
  padding: 0 50px;
}
</style>

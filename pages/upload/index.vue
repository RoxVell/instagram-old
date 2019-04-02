<template>
  <section class="upload-page container">
    <FileUploader :acceptFileFormats="['image', 'video']"></FileUploader>
    <button class="btn-next" @click="next" v-if="currentFiles.length !== 0">Далее</button>
  </section>
</template>

<script>
import FileUploader from '~/components/FileUploader'

export default {
  data() {
    return {
      previewImg: null,
      currentFiles: []
    }
  },
  components: {
    FileUploader
  },
  methods: {
    next() {
      
    }
  }
}
</script>

<style lang="scss">
@import '~assets/scss/components/uploadPage.scss';
</style>

<template>
  <section class="upload-page container">
    <div class="upload-elements">
      <div class="upload-formats">
        <div class="format">
          <span class="format-icon format-icon__photo"></span>
          <div class="format-info">
            <span class="format-title">High resolution images</span>
            <span class="format-desc">PNG, JPG, GIF up to 10MB</span>
          </div>
        </div>
        <div class="format">
          <span class="format-icon format-icon__video"></span>
          <div class="format-info">
            <span class="format-title">Video</span>
           <span class="format-desc">MP4 or WEBM, 4:3, 24 sec</span>
          </div>
        </div>
      </div>

      <div class="upload-section">
        <input id="file" class="upload-media" type="file" accept="image/*" @change="selectFile($event)">
        <label class="upload-button" for="file">Загрузить</label>
      </div>

      
    </div>


    <!-- <img :src="previewImg" class="preview-img" style="{width: 200px;}"> <br> -->
    <textarea v-model="post.description" cols="30" rows="10"></textarea> <br>
    <button class="btn" @click="uploadPhoto" v-if="currentFile">Залить фото</button>
  </section>
</template>

<script>
import { storage } from '~/firebase/init'

export default {
  data() {
    return {
      previewImg: null,
      currentFile: null,
      totalBytes: 100,
      bytesTransferred: 0,
      post: {
        description: ''
      }
    }
  },
  methods: {
    selectFile(event) {
      let file = event.target.files[0]

      if (!file.type.includes('image/')) return

      this.showPreviewImg(file)
      this.currentFile = file
    },
    showPreviewImg(file) {
      this.previewImg = window.URL.createObjectURL(file)
    },
    uploadPhoto({ getters }, event) {
      let photo = this.currentFile

      this.$store.dispatch('user/addPost', { photo, description: this.post.description })
        .then(() => {
        })
        .catch(error => {
          console.log(error)
        })
      
    }
  },
  computed: {
    isAuth() {
      return this.$store.getters['user/isAuth']
    }
  },
  watch: {
    isAuth(isAuth) {
      if (!isAuth) this.$router.push('/auth/login')
    }
  }
}
</script>

<style lang="scss">
@import '~assets/scss/components/uploadPage.scss';
</style>

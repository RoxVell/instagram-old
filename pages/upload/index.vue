<template>
  <section class="upload container">
    <h1>Залей своё фото</h1>
    <input type="file" accept="image/*" @change="selectFile($event)"> <br>
    <img :src="previewImg" class="preview-img" style="{width: 200px;}"> <br>
    <textarea v-model="post.description" cols="30" rows="10"></textarea> <br>
    <button class="btn" @click="uploadPhoto" v-if="currentFile">Залить фото</button>
    <progress :max="totalBytes" :value="bytesTransferred">
      Загружено на <span id="value">{{ (bytesTransferred / totalBytes) * 100 }}</span>%
    </progress>
  </section>
</template>

<script>
import { storage } from '~/firebase/init'

export default {
  middleware: 'authenticated',
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

<style>
.preview-img {
  width: 500px;
}
</style>

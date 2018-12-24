<template>
  <section class="upload">
    <h1>Залей своё фото</h1>
    <input type="file" accept=".jpg, .jpeg, .png" @change="selectFile($event)"> <br>
    <img :src="previewImg" class="preview-img"> <br>
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
      bytesTransferred: 0
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
    async uploadPhoto({ getters }, event) {
      let photo = this.currentFile

      this.totalBytes = photo.size

      let fileRef = storage.ref(`photos/${photo.name}`)
      let fileUpload = fileRef.put(photo)

      fileUpload.on('state_changed', snapshot => {
        this.bytesTransferred = snapshot.bytesTransferred
      }, error => {
        console.log('Произошла ошибка при загрузке файла', error)
      }, () => {
        // Успешная загрузка файла
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

<template>
  <Modal class="upload-modal" @close="clear" v-model="value" v-bind="$attrs">
    <template #header>
      <slot name="header">
        <div class="upload-modal__header">
          <span>Изменить аватар</span>
          <Button
            @click="deleteAvatar"
            loadingColor="#cb2431"
            :loading="deleteAvatarLoading"
            class="btn btn_red btn-delete"
          >Удалить аватар</Button>
        </div>
      </slot>
    </template>

    <div class="upload-modal__body">
      <div class="upload-progress" v-if="loadingStatus">
        <CircleProgress v-model="progress" colorCircle="white" colorProgress="blue"></CircleProgress>
        <br />
        <p
          v-if="loadingStatus === 'loaded'"
          class="upload-progress__text"
        >Фото профиля успешно загружено</p>
      </div>

      <template v-else>
        <template v-if="imageToUpload">
          <img v-if="blobImage" style="max-width: 500px;" :src="blobImage.src" alt />

          <Cropper
            v-else
            class="cropper"
            :stencilComponent="$options.components.CircleStencil"
            :stencilProps="{ minAspectRatio: 1/1 }"
            :src="imageToUpload"
            @change="onChangeCoordinates"
          ></Cropper>
        </template>

        <template v-else>
          <!-- <div class="upload-modal__choice"> -->
          <FileUploader
            :acceptFileFormats="['image']"
            @updateFileList="updateUploadImage"
            :showUploadIcon="false"
          ></FileUploader>
          <!-- </div> -->
        </template>
      </template>
    </div>
    <template class="upload-modal__footer" #footer>
      <template v-if="imageToUpload && !loadingStatus">
        <button
          class="btn btn_blue"
          @click="toggleImage"
        >{{ blobImage ? 'Изменить размеры' : 'Сохранить размеры' }}</button>

        <button @click="uploadImage" :disabled="!blobImage" class="btn btn_red">Загрузить</button>
      </template>
    </template>
  </Modal>
</template>

<script>
import Modal from '~/components/Modal'
import CircleProgress from '~/components/CircleProgress'
import FileUploader from '~/components/FileUploader'
import Button from '~/components/Button'
import { Cropper, CircleStencil } from 'vue-advanced-cropper'

export default {
  props: {
    value: {
      type: Boolean,
      required: true
    }
  },
  components: {
    Modal,
    Button,
    Cropper,
    CircleStencil,
    FileUploader,
    CircleProgress
  },
  data() {
    return {
      imageToUpload: null,
      blobImage: null,
      coordinates: null,
      canvas: null,
      loadingStatus: false,
      deleteAvatarLoading: false,
      progress: 0
    }
  },
  methods: {
    toggleImage() {
      if (this.blobImage) this.blobImage = null
      else {
        this.canvas.toBlob((blob) => {
          blob.src = URL.createObjectURL(blob)
          this.blobImage = blob
        })
      }
    },
    async deleteAvatar() {
      this.deleteAvatarLoading = true

      try {
        await this.$store.dispatch('account/deleteAvatar')
        this.$emit('avatarChange', '')
      } catch (error) {
        console.error(error)
      }

      this.deleteAvatarLoading = false
    },
    onChangeCoordinates({ canvas, coordinates }) {
      this.coordinates = coordinates
      this.canvas = canvas
    },
    updateUploadImage(files) {
      this.imageToUpload = files[0].src
    },
    async uploadImage() {
      try {
        const { uploadTask } = await this.$store.dispatch('account/uploadAvatar', this.blobImage)

        this.loadingStatus = 'loading'

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            this.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          },
          (error) => {},
          () => {
            this.loadingStatus = 'loaded'
            this.$emit('avatarChange', this.blobImage.src)
          }
        )
      } catch (error) {
        console.error(error)
      }
    },
    clear() {
      /**
       * if photo is loaded then clear component state when a user close modal
       */
      this.$emit('close')

      if (this.loadingStatus === 'loaded') {
        this.imageToUpload = null
        this.blobImage = null
        this.coordinates = null
        this.canvas = null
        this.loadingStatus = false
        this.progress = 0
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/scss/components/Modal/AvatarChangeModal.scss';
</style>
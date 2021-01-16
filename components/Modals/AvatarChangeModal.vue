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
            >Удалить аватар</Button
          >
        </div>
      </slot>
    </template>

    <div class="upload-modal__body">
      <div class="upload-progress" v-if="loadingStatus">
        <CircleProgress
          v-model="loadingProgress"
          colorCircle="white"
          colorProgress="blue"
        ></CircleProgress>
        <br />
        <p v-if="loadingStatus === 'loaded'" class="upload-progress__text">
          Фото профиля успешно загружено
        </p>
      </div>

      <template v-else>
        <template v-if="imageToUpload">
          <img v-if="blobImage" style="max-width: 500px" :src="blobImage.src" alt />

          <Cropper
            v-else
            class="cropper"
            :stencilComponent="$options.components.CircleStencil"
            :stencilProps="{ minAspectRatio: 1 / 1 }"
            :src="imageToUpload"
            @change="onChangeCoordinates"
          ></Cropper>
        </template>

        <FileUploader
          v-else
          :showUploadIcon="false"
          :acceptFileFormats="['image']"
          @updateFileList="updateUploadImage"
        ></FileUploader>
      </template>
    </div>

    <template class="upload-modal__footer" #footer>
      <template v-if="imageToUpload && !loadingStatus">
        <button class="btn btn_blue" @click="toggleImage">
          {{ blobImage ? 'Изменить размеры' : 'Сохранить размеры' }}
        </button>

        <button @click="uploadImage" :disabled="!blobImage" class="btn btn_red">Загрузить</button>
      </template>
    </template>
  </Modal>
</template>

<script lang="ts">
import { Vue, Component, namespace, Prop } from 'nuxt-property-decorator'
import { accountStore, authStore } from '~/store'

import { Cropper, CircleStencil } from 'vue-advanced-cropper'

import Modal from '~/components/Modal.vue'
import CircleProgress from '~/components/CircleProgress.vue'
import FileUploader from '~/components/FileUploader.vue'
import Button from '~/components/Button.vue'

enum AvatarLoadingStatus {
  None,
  Loading,
  Loaded,
}

type CropperCoordinates = {
  width: number
  height: number
  top: number
  left: number
}

@Component({
  components: {
    Modal,
    Button,
    Cropper,
    FileUploader,
    CircleStencil,
    CircleProgress,
  },
})
export default class AvatarChangeModal extends Vue {
  @Prop({ required: true, type: Boolean }) value!: false

  imageToUpload: string = null
  blobImage: Blob = null
  coordinates: CropperCoordinates = null
  canvas: HTMLCanvasElement = null
  deleteAvatarLoading = false
  loadingStatus: AvatarLoadingStatus = AvatarLoadingStatus.None
  loadingProgress = 0

  toggleImage() {
    if (this.blobImage) {
      this.blobImage = null
    } else {
      this.canvas.toBlob((blob) => {
        console.log(blob)

        blob.src = URL.createObjectURL(blob)
        this.blobImage = blob
      })
    }
  }

  async deleteAvatar() {
    this.deleteAvatarLoading = true

    try {
      await accountStore.deleteAvatar()
      this.$emit('avatarChange', '')
    } catch (error) {
      console.error(error)
    }

    this.deleteAvatarLoading = false
  }

  onChangeCoordinates({
    canvas,
    coordinates,
  }: {
    canvas: HTMLCanvasElement
    coordinates: CropperCoordinates
  }) {
    this.canvas = canvas
    this.coordinates = coordinates
  }

  updateUploadImage(files: { name: string; src: string }[]) {
    this.imageToUpload = files[0].src
  }

  async uploadImage() {
    try {
      const { uploadTask } = await accountStore.uploadAvatar({
        blobImage: this.blobImage,
        avatarSrc: this.imageToUpload,
      })

      this.loadingStatus = AvatarLoadingStatus.Loading

      uploadTask.on(
        'state_changed',
        (snapshot) =>
          (this.loadingProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100),
        (error) => (this.loadingStatus = AvatarLoadingStatus.None),
        () => {
          this.loadingStatus = AvatarLoadingStatus.Loaded
          this.$emit('avatarChange', this.imageToUpload)
        }
      )
    } catch (error) {
      console.error(error)
    }
  }

  clear() {
    /**
     * if photo is loaded then clear component state when a user close modal
     */
    this.$emit('close')

    if (this.loadingStatus === AvatarLoadingStatus.Loaded) {
      this.imageToUpload = null
      this.blobImage = null
      this.coordinates = null
      this.canvas = null
      this.loadingStatus = AvatarLoadingStatus.None
      this.loadingProgress = 0
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/scss/components/Modal/AvatarChangeModal.scss';
</style>
<template>
  <div class="upload-elements">
    <header>
      <slot name="header"></slot>
    </header>

    <div class="upload-section" ref="uploadSectionRef">
      <div id="drop-mask" ref="dropMaskRef"></div>
      <div key="1" v-if="files && files.length !== 0" class="upload-section__images">
        <div class="images">
          <transition-group name="flip-list">
            <div
              class="images-item"
              v-for="(image, index) in files"
              :key="image.src"
              :itemOrder="index"
              draggable="true"
              @dragstart="handleDragStart($event)"
              @dragleave="handleDragLeave($event)"
              @dragend="handleDragEnd($event)"
              @drop="handleDragDrop($event)"
            >
              <div class="images-drop-mask" @dragenter="handleDragEnter($event)"></div>
              <div class="images-item__picture" :style="{ backgroundImage: `url(${image.src})`}"></div>
              <p class="images-item__name">{{ image.name }}</p>
              <div class="images-item__actions">
                <button class="btn-link">Редактировать</button>
                <button class="btn-link" @click="deleteFile(index)">Удалить</button>
              </div>
            </div>
          </transition-group>
        </div>
      </div>

      <div key="2" v-else class="upload-section__input">
        <div class="input-upload">
          <input
            id="file"
            class="upload-media"
            type="file"
            v-bind="$attrs"
            :accept="acceptFileFormats.map(f => f + '/*').join(',')"
            @change="selectFiles($event)"
          />
          <label v-if="showUploadIcon" for="file">
            <IconBase
              class="icon-upload"
              viewbox="0 0 486 486"
              :width="uploadIconSize.width"
              :height="uploadIconSize.height"
            >
              <IconUpload />
            </IconBase>
          </label>
        </div>

        <div class="upload-section__description">
          <p>Переместите файл для загрузки</p>
          <p>
            или
            <label for="file">нажмите</label> для выбора файла
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IconBase from '~/components/Icons/IconBase'
import IconUpload from '~/components/Icons/IconUpload'
import { swapArrayElement } from '~/utils/index.js'

export default {
  props: {
    files: {
      type: Array,
      default() {
        return []
      }
    },
    acceptFileFormats: {
      type: Array,
      required: true,
      default() {
        return ['']
      }
    },
    showUploadIcon: {
      type: Boolean,
      default: true
    },
    uploadIconSize: {
      type: Object,
      default() {
        return { width: 100, height: 100 }
      }
    }
  },
  components: {
    IconBase,
    IconUpload
  },
  data() {
    return {
      currentItem: null
    }
  },
  watch: {
    files(files) {
      this.$emit('updateFileList', files)
    }
  },
  methods: {
    handleDragStart(event) {
      this.currentItem = event.target
      this.toggleDropMaskShow(true)
      event.target.classList.add('drag')
    },
    handleDragLeave(event) {
      event.target.parentNode.style.borderTopColor = ''
    },
    handleDragEnter(event) {
      const currentTargetItem = event.target.parentNode
      currentTargetItem.style.borderTopColor = '#0366D6'
    },
    handleDragEnd(event) {
      event.target.classList.remove('drag')
      this.toggleDropMaskShow(false)
      this.currentItem = null
    },
    handleDragDrop(event) {
      const changeItem = event.target.parentNode
      const selectedItemOrder = changeItem.attributes['itemorder'].value
      const changeItemOrder = this.currentItem.attributes['itemorder'].value

      if (!changeItem.isSameNode(this.currentItem)) {
        swapArrayElement.call(this, this.files, selectedItemOrder, changeItemOrder)
      }

      changeItem.style.borderTopColor = ''
      this.currentItem = null
    },
    toggleDropMaskShow(isShow) {
      document
        .querySelectorAll('.images-drop-mask')
        .forEach((item) => (item.style.display = isShow ? 'block' : 'none'))
    },
    selectFiles(event) {
      const files = this.getFilesFromEvent(event)
      const storedFiles = files.filter(this.isValidFileFormat).map(this.transformFilesToBlob)
      if (storedFiles.length) this.files.push(...storedFiles)
    },
    getFilesFromEvent(event) {
      return Array.from(event.type === 'change' ? event.target.files : event.dataTransfer.files)
    },
    isValidFileFormat(file) {
      return this.acceptFileFormats.some((format) => file.type.startsWith(format))
    },
    transformFilesToBlob(file) {
      const fileName = file.name
      const fileImage = window.URL.createObjectURL(file)

      return { name: fileName, src: fileImage }
    },
    deleteFile(index) {
      this.files.splice(index, 1)
    },
    initListeners() {
      const uploadSection = this.$refs.uploadSectionRef
      const dropMask = this.$refs.dropMaskRef

      uploadSection.ondragover = (event) => event.preventDefault()

      uploadSection.ondrop = (event) => event.preventDefault()

      uploadSection.ondragenter = (event) => {
        if (this.containsFiles(event)) {
          dropMask.style.display = 'block'
          uploadSection.classList.add('drag-active')
        }
      }

      dropMask.ondragleave = (event) => {
        dropMask.style.display = 'none'
        uploadSection.classList.remove('drag-active')
      }

      dropMask.ondrop = (event) => {
        event.preventDefault()
        dropMask.style.display = 'none'
        uploadSection.classList.remove('drag-active')
        this.selectFiles(event)
      }
    },
    removeListeners() {
      const uploadSection = this.$refs.uploadSectionRef
      const dropMask = this.$refs.dropMaskRef
      uploadSection.ondragenter = null
      uploadSection.ondragover = null
      uploadSection.ondrop = null
      dropMask.ondragleave = null
      dropMask.ondrop = null
    },
    containsFiles(event) {
      const { types } = event.dataTransfer
      return types && types.some((type) => type === 'Files')
    }
  },
  beforeDestroy() {
    this.removeListeners()
  },
  mounted() {
    this.initListeners()
  }
}
</script>

<style lang="scss">
@import '~assets/scss/components/FileUploader.scss';
</style>

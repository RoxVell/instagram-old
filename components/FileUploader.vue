<template>
  <div class="upload-elements">
    <header>
      <slot name="header"></slot>
    </header>

    <div class="upload-section" ref="uploadSectionRef">
      <div id="drop-mask" ref="dropMaskRef"></div>
      <div key="1" v-if="files && files.length !== 0" class="upload-section__images">
        <div class="images" v-if="files.length !== 0">
          <transition-group name="flip-list">
            <div
              class="images-item"
              v-for="(image, index) in files"
              :key="image.src"
              :itemOrder="index"
              draggable="true"
              @dragstart="handleDragStart($event)"
              @drop="handleDragDrop($event)"
              @dragend="handleDragEnd($event)"
              @dragleave="handleDragLeave($event)"
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
    handleDragEnd(event) {
      event.target.classList.remove('drag')

      const dropItemMasks = Array.from(document.querySelectorAll('.images-drop-mask'))
      dropItemMasks.forEach((item) => (item.style.display = 'none'))

      this.currentItem = null
    },
    handleDragDrop(event) {
      const changeItem = event.target.parentNode
      const selectedItemOrder = changeItem.attributes['itemorder'].value
      const changeItemOrder = this.currentItem.attributes['itemorder'].value

      if (!changeItem.isSameNode(this.currentItem)) {
        this.swapElement(this.files, selectedItemOrder, changeItemOrder)
      }

      changeItem.style.borderTopColor = ''
      this.currentItem = null
    },
    handleDragStart(event) {
      this.currentItem = event.target

      document
        .querySelectorAll('.images-drop-mask')
        .forEach((item) => (item.style.display = 'block'))

      event.target.classList.add('drag')
    },
    handleDragEnter(event) {
      const currentTargetItem = event.target.parentNode
      currentTargetItem.style.borderTopColor = '#0366D6'
      const items = document.querySelectorAll('div.images-item')
    },
    handleDragLeave(event) {
      event.target.parentNode.style.borderTopColor = ''
    },
    selectFiles(event) {
      const files = Array.from(
        event.type === 'change' ? event.target.files : event.dataTransfer.files
      )

      const isFilesFormats = files.every((file) => {
        return this.acceptFileFormats.some((format) => file.type.startsWith(format))
      })

      if (isFilesFormats) {
        const media = files.map((file) => {
          return {
            name: file.name,
            src: window.URL.createObjectURL(file)
          }
        })

        this.files.push(...media)
      } else {
        // TODO: wrong formats
      }
    },
    swapElement(arr, oldIndex, newIndex) {
      const temp0 = arr[oldIndex]
      const temp1 = arr[newIndex]
      this.$set(arr, newIndex, temp0)
      this.$set(arr, oldIndex, temp1)
    },
    deleteFile(index) {
      this.files.splice(index, 1)
    },
    initListeners() {
      const uploadSection = this.$refs.uploadSectionRef
      const dropMask = this.$refs.dropMaskRef

      uploadSection.ondragover = (event) => event.preventDefault()

      dropMask.ondragleave = (event) => {
        dropMask.style.display = 'none'
        uploadSection.classList.remove('drag-active')
      }

      uploadSection.ondragenter = (event) => {
        if (this.containsFiles(event)) {
          dropMask.style.display = 'block'
          uploadSection.classList.add('drag-active')
        }
      }

      uploadSection.ondrop = (event) => event.preventDefault()

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

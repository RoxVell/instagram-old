<template>
  <section class="upload-page container">
    <Stepper class="upload-page-container" ref="stepperRef" :transition="transition">
      <Step :nextCondition="this.files.length !== 0">
        <FileUploader multiple :acceptFileFormats="['image', 'video']" :files="files">
          <template #header>
            <div style="margin-bottom: 20px;" class="upload-formats">
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
          </template>
        </FileUploader>
      </Step>

      <Step>
        <Slider :imgs="previews"></Slider>
      </Step>
    </Stepper>

    <div>
      <button class="btn-next" @click="backStep">Назад</button>
      <button class="btn-next" @click="nextStep">Далее</button>
    </div>
  </section>
</template>

<script>
import FileUploader from '~/components/FileUploader'
import Stepper from '~/components/Stepper/Stepper'
import Step from '~/components/Stepper/Step'
import Slider from '~/components/Slider'

export default {
  data() {
    return {
      files: [],
      transition: {
        name: 'slide-right',
        mode: 'out-in'
      }
    }
  },
  components: {
    FileUploader,
    Stepper,
    Step,
    Slider
  },
  computed: {
    previews() {
      return this.files.map((file) => file.src)
    }
  },
  methods: {
    nextStep() {
      this.transition.name = 'slide-left'
      this.$refs.stepperRef.nextStep()
    },
    backStep() {
      this.transition.name = 'slide-right'
      this.$refs.stepperRef.backStep()
    }
  }
}
</script>

<style lang="scss">
@import '~assets/scss/pages/upload.scss';
@import '~assets/scss/transitions/slide-left.scss';
@import '~assets/scss/transitions/slide-right.scss';
</style>

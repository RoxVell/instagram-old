<template>
  <div class="slider-component" :style="{ 'width': width }">
    <div class="slider-offset" :style="sliderOffset">
      <div class="slide-wrapper" v-for="(img, index) in imgs" :key="slideKey(img, index)">
        <img class="slider-item" :src="img" />
      </div>
    </div>
  </div>
</template>

<script>
import StepperMixin from '~~/mixins/StepperMixin'

export default {
  mixins: [StepperMixin],
  props: {
    width: {
      type: Number,
      default: 300
    },
    imgs: {
      type: Array,
      required: true
    }
  },
  computed: {
    sliderOffset() {
      return `transform: translateX(-${(this.currentStep - 1) * 100}%)`
    }
  },
  methods: {
    slideKey(slideValue, index) {
      return `${slideValue.slice(-7)}-${index}`
    }
  },
  data() {
    return {
      stepsCount: this.imgs.length
    }
  }
}
</script>

<style lang="scss" scoped>
// @import '~assets/scss/components/Slider.scss';
</style>
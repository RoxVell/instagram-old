<template>
  <div
    class="progress-container"
    :class="{ 'progress-container_loaded': loaded }"
    :data-progress="Math.floor(value)"
  >
    <div class="progress-overlay" v-if="showPercents" :style="{ 'line-height': `${radius * 2}px` }">
      <template v-if="!loaded">{{ Math.floor(value) }}%</template>
      <IconBase
        v-else
        class="progress-container__check"
        viewbox="0 0 512 512"
        width="50"
        height="50"
      >
        <IconCheck />
      </IconBase>
    </div>
    <svg
      :width="radius * 2"
      :height="radius * 2"
      viewPort="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        :style="circleStyle"
        :stroke="colorCircle"
        :stroke-width="stroke"
        :stroke-dasharray="`${circumference} ${circumference}`"
      />
      <circle
        ref="circle"
        id="bar"
        :style="circleStyle"
        :stroke="colorProgress"
        :stroke-width="stroke"
        :stroke-dasharray="`${circumference} ${circumference}`"
      />
    </svg>
  </div>
</template>

<script>
import IconBase from '~/components/Icons/IconBase'
import IconCheck from '~/components/Icons/IconCheck'

export default {
  props: {
    value: {
      type: Number,
      default: 0,
      required: true,
    },
    stroke: {
      type: Number,
      default: 10,
    },
    radius: {
      type: Number,
      default: 100,
    },
    showPercents: {
      type: Boolean,
      default: true,
    },
    colorCircle: {
      type: String,
      default: 'black',
    },
    colorProgress: {
      type: String,
      default: 'red',
    },
  },
  components: { IconCheck, IconBase },
  data() {
    const normalizedRadius = this.radius - this.stroke * 2
    const circumference = normalizedRadius * 2 * Math.PI

    return {
      normalizedRadius,
      circumference,
      loaded: false,
    }
  },
  computed: {
    strokeDashoffset() {
      return this.circumference - (this.value / 100) * this.circumference
    },
    circleStyle() {
      const halfSize = this.size / 2

      return {
        strokeDashoffset: this.strokeDashoffset,
        r: this.normalizedRadius,
        cx: this.radius,
        cy: this.radius,
      }
    },
  },
  watch: {
    value(value) {
      if (value < 0) this.value = 0
      if (value > 100) this.value = 100

      const radius = this.$refs.circle.getAttribute('r')
      const c = Math.PI * (radius * 2)

      const pct = ((100 - value) / 100) * c

      this.$refs.circle.style.strokeDashoffset = pct

      if (value === 100) {
        this.loaded = true
        this.$emit('done')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.progress-container {
  position: relative;
  display: inline-block;
}

.progress-container_loaded {
  #bar {
    stroke: green;
  }

  .progress-container__check {
    fill: green;
  }
}

.progress-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  line-height: 200px;
  font-size: 25px;
  color: black;
  font-weight: 600;
}

circle {
  stroke-dashoffset: 0;
  transition: stroke-dashoffset 1s linear;
  fill: transparent;
}
</style>
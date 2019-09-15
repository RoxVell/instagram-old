<template>
  <div class="step-component">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    // parameters determine whether the Stepper component can take steps
    previousCondition: {
      type: Boolean,
      default: true
    },
    nextCondition: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    // pass changed condition to parent component Stepper
    previousCondition: {
      handler(value) {
        this.$parent.$emit('conditionChanged', {
          key: 'currentStepPreviousCondition',
          value
        })
      },
      immediate: true
    },
    nextCondition: {
      handler(value) {
        this.$parent.$emit('conditionChanged', {
          key: 'currentStepNextCondition',
          value
        })
      },
      immediate: true
    }
  }
}
</script>

<style scoped>
.step-component {
  height: 100%;
}
</style>

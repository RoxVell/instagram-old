const StepperMixin = {
  data() {
    return {
      currentStep: 1
    }
  },
  computed: {
    hasPreviousStep() {
      return this.currentStep > 1
    },
    hasNextStep() {
      return this.currentStep !== this.stepsCount
    }
  },
  methods: {
    backStep() {
      if (this.hasPreviousStep) this.currentStep -= 1
    },
    nextStep() {
      if (this.hasNextStep) this.currentStep += 1
    }
  }
}

export default StepperMixin

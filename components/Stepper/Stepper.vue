<script>
import StepperMixin from '~~/mixins/StepperMixin'
import { isComponent } from '~~/utils/index'

export default {
  mixins: [StepperMixin],
  props: {
    transition: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      currentStepPreviousCondition: true,
      currentStepNextCondition: true
    }
  },
  computed: {
    // overload mixins properties
    hasNextStep() {
      return this.currentStep !== this.stepsCount && this.currentStepNextCondition
    },
    hasPreviousStep() {
      return this.currentStep > 1 && this.currentStepPreviousCondition
    }
  },
  render(h) {
    const data = { props: this.transition }

    return (
      <div>
        <div class="step-content">
          <transition {...data}>{this.getCurrentStepSlot()}</transition>
        </div>
      </div>
    )
  },
  methods: {
    getStepsNumbers(slots) {
      const steps = []

      for (const [index, slot] of slots.entries()) {
        if (isComponent(slot, 'Step')) steps.push(index)
      }

      return steps
    },
    getCurrentStepSlot() {
      const slotNumber = this.steps[this.currentStep - 1]
      return this.$slots.default[slotNumber]
    }
  },
  beforeMount() {
    this.steps = this.getStepsNumbers(this.$slots.default)
    this.stepsCount = this.steps.length
  },
  created() {
    // listen to change conditon on child Step component
    this.$on('conditionChanged', ({ key, value }) => (this[key] = value))
  }
}
</script>

<style lang="scss">
@import '~assets/scss/components/Stepper.scss';
</style>

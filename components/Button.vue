<template>
  <button v-bind="$attrs" class="btn btn-primary" :class="{ 'btn-loading': loading }">
    <span class="text">
      <slot></slot>
    </span>

    <svg
      v-if="loading"
      width="25"
      height="25"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
    >
      <circle
        cx="50"
        cy="50"
        fill="none"
        stroke="white"
        stroke-width="10"
        r="35"
        stroke-dasharray="165 57"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          calcMode="linear"
          values="0 50 50;360 50 50"
          keyTimes="0;1"
          dur="0.7s"
          begin="0s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  </button>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>


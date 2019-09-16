<template>
  <circle
    cx="50"
    cy="50"
    fill="none"
    :stroke="color"
    :stroke-width="strokeWidth"
    r="35"
    stroke-dasharray="165 57"
  >
    <animateTransform
      attributeName="transform"
      type="rotate"
      calcMode="linear"
      values="0 50 50;360 50 50"
      keyTimes="0;1"
      dur="1s"
      begin="0s"
      repeatCount="indefinite"
    />
  </circle>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: '#28292f'
    },
    strokeWidth: {
      type: Number,
      default: 10
    }
  }
}
</script>
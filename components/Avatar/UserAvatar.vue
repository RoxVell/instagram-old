<template>
  <img
    :src="avatarUrl"
    :style="avatarStyle"
    ref="avatarImg"
    :alt="`${username} user avatar`"
    v-bind="$attrs"
  />
</template>

<script>
import { getUserAvatar, getDefaultUserAvatar } from '~/utils/firebaseUtils.js'

export default {
  props: {
    username: String,
    image: String,
    size: {
      type: Number
    },
    circle: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    avatarUrl() {
      // If image prop is passed then it will be used as avatar
      if (this.image) return this.image

      return getUserAvatar(this.username)
    },
    avatarStyle() {
      const styles = {}

      if (this.circle) styles['borderRadius'] = '50%'

      if (this.size) {
        styles['width'] = this.size + 'px'
        styles['height'] = this.size + 'px'
      } else {
        styles['width'] = '100%'
        styles['height'] = '100%'
      }

      return styles
    }
  },
  mounted() {
    const avatarImg = this.$refs.avatarImg

    /**
     * onerror event fires when user has no avatar
     * In this case replace avatar with default one
     */
    avatarImg.onerror = () => (avatarImg.src = getDefaultUserAvatar())
  }
}
</script>
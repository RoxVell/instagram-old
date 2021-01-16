<template>
  <img
    :src="avatarUrl"
    :style="avatarStyle"
    :alt="`${username} user avatar`"
    ref="avatarImageRef"
    v-bind="$attrs"
  />
</template>

<script lang="ts">
import { Vue, Component, Prop, Ref } from 'nuxt-property-decorator'

import { getUserAvatar, getDefaultUserAvatar } from '~/utils/firebaseUtils'

@Component
export default class DefaultUserProfile extends Vue {
  @Prop({ type: String }) username: string
  @Prop({ type: String }) image: string
  @Prop({ type: Number }) size: string
  @Prop({ type: Boolean, default: true }) circle: boolean

  @Ref('avatarImageRef') readonly avatarImageRef: HTMLImageElement

  get avatarUrl() {
    // If image prop is passed then it will be used as an avatar
    return this.image || getUserAvatar(this.username)
  }

  get avatarStyle() {
    const styles: { [key in string]: any } = {}

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

  mounted() {
    /**
     * onerror event fires when user has no avatar
     * In this case replace avatar with default one
     */
    this.avatarImageRef.onerror = () => (this.avatarImageRef.src = getDefaultUserAvatar())
  }
}
</script>

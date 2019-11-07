<template>
  <div class="post" @click="$emit('click')">
    <img
      ref="profilePostImage"
      class="profile-post__image"
      :class="{ 'lazy': lazy }"
      :data-src="post.content[0]"
      alt="Image"
    />
    <ul class="post-stats">
      <li>
        <span class="post-stats__icon icon-like"></span>
        {{ post.likes }}
      </li>
      <li>
        <span class="post-stats__icon icon-comments"></span>
        {{ post.comments }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
      required: true
    },
    lazy: {
      type: Boolean,
      default: true
    }
  },
  mounted() {
    const { profilePostImage } = this.$refs
    this.$emit('postCreated', profilePostImage)
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/scss/components/ProfilePost.scss';
</style>

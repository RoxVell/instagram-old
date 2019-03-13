<template>
  <div class="post">
    <img :src="post.content" alt="Image">
    <div>
      <ul class="post-stats">
        <!-- <div> -->
        <li><span class="post-stats__icon icon-like"></span>{{ post.likes }}</li>
        <li><span class="post-stats__icon icon-comments"></span>{{ post.comments.length }}</li>
        <!-- </div> -->
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/scss/components/ProfilePost.scss';
</style>

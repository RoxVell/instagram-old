<template>
  <div class="comment-component comment-component-owner">
    <div class="user-info">
      <div class="user-avatar">
        <img :src="postOwner.profile_picture" :alt="postOwner.username" />
      </div>
      <div class="user-comment">
        <p class="comment-username">{{ postOwner.username }}</p>
        <p class="comment-date">{{ post.timeAgo }}</p>
      </div>
    </div>
    <p
      class="comment-text"
      v-if="post.description"
      v-html="post.description.replace(/\s\s/gm, '<br><br>')"
    ></p>
  </div>
</template>

<script>
import { computeTimeAgo } from '~/utils/index'

export default {
  props: {
    postOwner: {
      type: Object,
      required: true
    },
    post: {
      type: Object,
      required: true
    },
    date: {
      type: String
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/components/Comment.scss';
</style>

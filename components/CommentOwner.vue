<template>
  <div class="comment-component comment-component-owner">
    <div class="user-info">
      <div class="user-avatar">
        <AuthUserAvatar />
      </div>
      <div class="user-comment">
        <p class="comment-username">{{ post.username }}</p>
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
import AuthUserAvatar from '~/components/Avatar/AuthUserAvatar'
import { computeTimeAgo } from '~/utils/index'

export default {
  props: {
    post: {
      type: Object,
      required: true
    },
    date: {
      type: String
    }
  },
  components: {
    AuthUserAvatar
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/components/Comment.scss';
</style>

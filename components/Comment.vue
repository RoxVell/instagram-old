<template>
  <div class="comment-component" :class="{'no-likes': comment.likes === 0}">
    <div class="comment">
      <UserAvatar class="comment-avatar" :size="25" :username="comment.username" />
      <div class="comment-body">
        <div class="comment-username">
          <nuxt-link :to="comment.username">{{ comment.username }}</nuxt-link>
          <div @click="deleteComment">
            <IconBase
              class="comment-delete"
              v-if="comment.isMine"
              name="delete"
              width="10"
              height="10"
              viewbox="0 0 400 400"
            >
              <IconClose />
            </IconBase>
          </div>
        </div>

        <p class="comment-text">{{ comment.text }}</p>
        <div class="comment-action">
          <div>
            <span class="comment-date">{{ comment.timeAgo }}</span>
            <span
              v-if="$store.getters['account/isAuth']"
              class="comment-action__answer"
              @click="replyToComment"
            >Ответить</span>
          </div>
          <div
            v-if="$store.getters['account/isAuth']"
            class="comment-like__section"
            @click="toggleLike"
            :class="{ 'comment-liked': comment.isLiked }"
          >
            <IconBase name="like" width="12" height="12" viewbox="0 0 50 50">
              <IconLike />
            </IconBase>
            <span class="comment-likes">{{ comment.likes }}</span>
          </div>
        </div>

        <div v-if="comment.repliesCount" class="comment-subcomments">
          <button
            class="comment-subcomments__button"
            @click="toggleReplies"
          >{{ comment.isRepliesLoaded ? '― Скрыть ответы' : `― Посмотреть ответы (${comment.repliesCount})` }}</button>
          <div>
            <div v-if="showReplies">
              <Comment v-for="comment in comment.replies" :comment="comment" :key="comment.id" />
            </div>
          </div>
        </div>

        <div class="comment-reply" v-if="isReplying">
          <textarea
            ref="commentReplyInputRef"
            class="comment-reply__input"
            @input="resizeComment"
            @keypress="addReply"
            rows="1"
            type="text"
            v-model="replyText"
            placeholder="Написать комментарий"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IconBase from '~/components/Icons/IconBase'
import IconLike from '~/components/Icons/IconLike'
import IconClose from '~/components/Icons/IconClose'
import UserAvatar from '~/components/Avatar/UserAvatar'

export default {
  name: 'Comment',
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  components: {
    IconBase,
    IconLike,
    IconClose,
    UserAvatar
  },
  data() {
    return {
      isReplying: false,
      showReplies: true,
      replyText: '',
      replies: [],
      repliesPaginate: null
    }
  },
  watch: {
    comment(newValue) {
      console.log('Коммент изменился')
      console.log(newValue)
    }
  },
  methods: {
    toggleReplies() {
      if (this.comment.isRepliesLoaded) {
        this.showReplies = false
      } else {
        this.showReplies = true
        this.loadReplies()
      }
    },
    async addReply(event) {
      if (event.keyCode === 13 && event.shiftKey && this.replyText) {
        event.preventDefault()

        const { data: comment } = await this.$store.dispatch('comment/addComment', {
          postId: this.postId,
          commentId: this.comment.id,
          text: this.replyText,
          isReply: true
        })
      }
    },
    loadReplies() {
      if (!this.comment.isRepliesLoading) this.$emit('loadReplies', this.comment.id)
    },
    resizeComment(event) {
      const textarea = event.target
      textarea.style.height = 'auto'
      textarea.style.height = textarea.scrollHeight + 2 + 'px'
    },
    toggleLike() {
      this.comment.isLiked ? this.unlikeComment() : this.likeComment()
    },
    async likeComment() {
      try {
        // FIXME: likeComment function should take comment id and post id
        await this.$store.dispatch('comment/likeComment', this.comment)
        this.$emit('likeComment', this.comment)
      } catch (error) {
        console.error(error)
      }
    },
    async unlikeComment() {
      try {
        // FIXME: likeComment function should take comment id and post id
        await this.$store.dispatch('comment/unlikeComment', this.comment)
        this.$emit('unlikeComment', this.comment)
      } catch (error) {
        console.error(error)
      }
    },
    async deleteComment() {
      try {
        await this.$store.dispatch('comment/deleteComment', {
          commentId: this.comment.id,
          postId: this.postId
        })
        this.$emit('deleteComment', this.comment)
      } catch (error) {
        console.error(error)
      }
    },
    replyToComment() {
      this.isReplying = true

      this.$nextTick(() => {
        this.$refs.commentReplyInputRef.focus()
      })
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/scss/components/Comment.scss';
</style>

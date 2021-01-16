<template>
  <div class="comment-component">
    <div class="comment">
      <UserAvatar class="comment-avatar" :size="isReply ? 20 : 25" :username="comment.username" />

      <div class="comment-body">
        <div class="comment-username">
          <nuxt-link :to="comment.username">{{ comment.username }}</nuxt-link>
          <div ref="deleteCommentRef">
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
            <span ref="replyToCommentRef" v-if="isAuth" class="comment-action__answer"
              >Ответить</span
            >
          </div>
          <div
            ref="toggleLikeRef"
            v-if="isAuth"
            class="comment-like__section"
            :class="{
              'no-likes': comment.likes === 0,
              'comment-liked': comment.isLiked,
            }"
          >
            <IconBase name="like" width="12" height="12" viewbox="0 0 50 50">
              <IconLike />
            </IconBase>
            <span class="comment-likes">{{ comment.likes }}</span>
          </div>
        </div>

        <div v-if="comment.repliesCount" class="comment-subcomments">
          <button
            ref="toggleRepliesRef"
            class="comment-subcomments__button"
            @click="toggleReplies()"
          >
            {{ showReplies ? '― Скрыть ответы' : `― Показать ответы (${comment.repliesCount})` }}
          </button>
          <div>
            <div v-if="showReplies">
              <Comment
                v-for="comment in comment.replies"
                :comment="comment"
                :isReply="true"
                :key="comment.id"
              />
            </div>
          </div>
        </div>

        <div class="comment-reply" v-if="isReplying">
          <textarea
            ref="commentReplyInputRef"
            class="comment-reply__input"
            @input="autoResizeTextarea($event.target, 2)"
            @blur="onBlur($event)"
            v-on:keyup.enter="addReply($event)"
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
import { mapState, mapGetters } from 'vuex'

import IconBase from '~/components/Icons/IconBase'
import IconLike from '~/components/Icons/IconLike'
import IconClose from '~/components/Icons/IconClose'
import UserAvatar from '~/components/Avatar/UserAvatar'

import { autoResizeTextarea } from '~/utils/index'

export default {
  name: 'Comment',
  props: {
    comment: {
      type: Object,
      required: true,
    },
    isReply: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    IconBase,
    IconLike,
    IconClose,
    UserAvatar,
  },
  data() {
    return {
      isReplying: false,
      showReplies: false,
      replyText: '',
      replies: [],
      repliesPaginate: null,
    }
  },
  computed: {
    ...mapGetters({ isAuth: 'account/isAuth' }),
  },
  methods: {
    autoResizeTextarea,
    onBlur(event) {
      if (!this.replyText) this.isReplying = false
    },
    toggleReplies() {
      if (this.comment.isRepliesLoaded) {
        this.showReplies = !this.showReplies
      } else {
        this.showReplies = true
        this.loadReplies()
      }
    },
    loadReplies() {
      if (!this.comment.isRepliesLoading) this.$emit('loadReplies', this.comment.id)
    },
    async injectAuthActions() {
      const module = await import('./commentAuthActions')
      for (let key in module) this[key] = module[key].bind(this)
      this.setupListenersForReferences()
    },
    setupListenersForReferences() {
      this.$nextTick(() => {
        this.$refs.deleteCommentRef.onclick = this.deleteComment
        this.$refs.replyToCommentRef.onclick = this.replyToComment
        this.$refs.toggleLikeRef.onclick = this.toggleLike
        // this.$refs.commentReplyInputRef.onkeydown = this.addReply
        // this.$refs.toggleRepliesRef.onclick = this.toggleReplies
      })
    },
  },
  async mounted() {
    if (this.isAuth) {
      this.injectAuthActions()
    }
  },
}
</script>

<style lang="scss">
@import '~/assets/scss/components/Comment.scss';
</style>

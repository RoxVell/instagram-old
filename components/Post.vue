<template>
  <article class="post-component">
    <div class="post-content">
      <img :src="post.content[0]" :alt="post.username" />
    </div>
    <div class="post-comments">
      <div class="users-comments" ref="usersComments">
        <CommentOwner :postOwner="postOwner" :post="post" />
        <transition-group name="disapear">
          <Comment
            v-for="comment in comments"
            :key="comment.id"
            :comment="comment"
            @loadReplies="loadReplies"
            @deleteComment="onDeleteComment"
          />
        </transition-group>
      </div>

      <div class="comment-actions">
        <div>
          <div
            class="comment-actions__item comment-actions__item-like"
            :class="{ 'comment-actions__item-like_liked': post.isLiked }"
            @click="toggleLikePost"
          >
            <IconBase :viewbox="likeLoading ? '0 0 100 100' : '0 0 50 50'" width="25" height="25">
              <IconSpinner v-if="likeLoading" />
              <IconLike v-else fill="transparent" stroke="black" stroke-width="3" />
            </IconBase>
            <span>{{ post.likes }}</span>
          </div>

          <div class="comment-actions__item">
            <IconBase viewbox="0 0 30 30" stroke-width="0" stroke="black" width="25" height="25">
              <IconComments fill="black" />
            </IconBase>
            <span>{{ post.comments }}</span>
          </div>
        </div>

        <div v-if="isAuth">
          <div
            class="comment-actions__item comment-actions__item-bookmark"
            :class="{ 'comment-actions__item-bookmark_saved': post.isSaved }"
            @click="toggleSavePost"
          >
            <IconBase
              :viewbox="saveLoading ? '0 0 100 100' : '0 0 60 60'"
              stroke-width="4"
              stroke="black"
              width="25"
              height="28"
            >
              <IconSpinner v-if="saveLoading" />
              <IconBookmark v-else />
            </IconBase>
          </div>
        </div>
      </div>

      <div v-if="isAuth" class="add-comment">
        <textarea
          class="add-comment__input"
          v-model="commentText"
          :disabled="commentAdding"
          placeholder="Добавьте свой комментарий"
          rows="1"
          @input="resizeComment"
          @keypress="addComment"
        ></textarea>
      </div>
    </div>
  </article>
</template>

<script>
import PerfectScrollbar from 'perfect-scrollbar'
import Comment from '~/components/Comment'
import CommentOwner from '~/components/CommentOwner'
import IconBase from '~/components/Icons/IconBase'
import IconLike from '~/components/Icons/IconLike'
import IconComments from '~/components/Icons/IconComments'
import IconBookmark from '~/components/Icons/IconBookmark'
import IconSpinner from '~/components/Icons/IconSpinner'
import { computeTimeAgo } from '~/utils/index'
import { mapState, mapGetters } from 'vuex'

export default {
  props: {
    post: {
      type: Object,
      required: true
    },
    postOwner: {
      type: Object,
      required: true
    }
  },
  components: {
    Comment,
    CommentOwner,
    IconBase,
    IconLike,
    IconComments,
    IconBookmark,
    IconSpinner
  },
  computed: {
    ...mapState({
      user: (state) => state.account.user
    }),
    ...mapGetters({ isAuth: 'account/isAuth' }),
    defaultCommentHandlers() {
      // return handlers based on auth status
      const handlers = [this.handleTimeAgo, this.addPostId]
      if (this.commentsLikes && this.commentsLikes.size > 0) handlers.push(this.handleIsLiked)
      return this.isAuth ? [...handlers, this.handleIsMine] : handlers
    }
  },
  watch: {
    comments() {
      this.scrollbar.update()
    }
  },
  data() {
    return {
      commentText: '',
      comments: [],
      timeWatchers: [], // contains comments for which you need to update the time
      likeLoading: false,
      saveLoading: false,
      commentsLoading: false,
      commentAdding: false,
      intervalTimeUpdate: null,
      commentsLikes: null,
      scrollbar: null
    }
  },
  methods: {
    async loadReplies(commentId) {
      try {
        const currentComment = this.comments.find((comment) => comment.id === commentId)

        currentComment.isRepliesLoading = true

        let queryPaginate = await this.$store.dispatch('comment/loadReplies', {
          postId: this.post.id,
          commentId: commentId
        })

        const replies = await queryPaginate.next()

        currentComment.isRepliesLoading = false
        currentComment.isRepliesLoaded = true

        this.onAddReply(replies.value, commentId)
      } catch (error) {
        console.error(error)
      }
    },
    async addComment(event) {
      if (event.keyCode === 13 && event.shiftKey && this.commentText) {
        event.preventDefault()
        this.commentAdding = true

        try {
          let { data: comment } = await this.$store.dispatch('comment/addComment', {
            text: this.commentText,
            postId: this.post.id
          })

          // this.onAddComment(comment)
        } catch (error) {
          console.error(error)
        }

        this.commentAdding = false
      }
    },
    onAddReply(replies, commentId) {
      replies = this.handleComments(replies, this.defaultCommentHandlers)

      const comment = this.comments.find((comment) => comment.id === commentId)

      comment.isRepliesLoaded = true

      comment.replies.push(...replies)
    },
    onAddComment(comment) {
      console.log(this.defaultCommentHandlers)
      comment = this.handleComments([comment], this.defaultCommentHandlers)[0]
      comment.replies = []
      comment.isRepliesLoading = false
      comment.isRepliesLoaded = false

      this.comments.push(comment)
    },
    resizeComment(event) {
      const textarea = event.target
      textarea.style.height = 'auto'
      textarea.style.height = textarea.scrollHeight + 'px'
    },
    async getComments() {
      this.commentsLoading = true

      try {
        let result = await this.queryPaginate.next()
        let comments = result.value

        if (result.done) {
          this.$refs.usersComments.removeEventListener('ps-scroll-y', this.scrollHandler)
        }
      } catch (error) {
        console.log(error)
      }

      this.commentsLoading = false
    },
    async getCommentsLikes() {
      this.commentsLikes = await this.$store.dispatch('comment/getCommentsLikes', this.post.id)
    },
    onDeleteComment({ id }) {
      const commentIndex = this.comments.findIndex((comment) => comment.id === id)
      this.comments.splice(commentIndex, 1)
      this.post.comments -= 1
    },
    addPostId(comment) {
      comment.postId = this.post.id
    },
    handleIsMine(comment) {
      comment.isMine = this.user.username === comment.username
    },
    handleIsLiked(comment) {
      comment.isLiked = this.commentsLikes.has(comment.id)
    },
    handleTimeAgo(comment) {
      const currentTime = Math.floor(Date.now() / 1000)
      const timeAgo = computeTimeAgo(currentTime, comment.created_date.seconds)
      comment.timeAgo = timeAgo.time

      /**
       * If the time is static there is no need to update this comment time
       * otherwise we add a comment to the watchers
       */

      if (timeAgo.description === 'minutes' || timeAgo.description === 'seconds')
        this.timeWatchers.push(comment)
    },
    handleComments(comments, handlers) {
      return comments.map((comment) => {
        handlers.forEach((handler) => handler(comment))
        return comment
      })
    },
    updateCommentsTime(comments = this.timeWatchers) {
      const currentTime = Math.floor(Date.now() / 1000)

      return comments.map((comment) => {
        comment.timeAgo = computeTimeAgo(currentTime, comment.created_date.seconds).time
        return comment
      })
    },
    scrollHandler() {
      if (this.commentsLoading) return

      const heightHandler = 300
      const { contentHeight, lastScrollTop, containerHeight } = this.scrollbar

      if (contentHeight - containerHeight - lastScrollTop <= heightHandler) {
        this.getComments()
      }
    },
    toggleLikePost() {
      this.post.isLiked ? this.unlikePost() : this.likePost()
    },
    async likePost() {
      this.likeLoading = true

      try {
        await this.$store.dispatch('post/like', this.post.id)
        this.post.isLiked = true
        this.post.likes += 1
      } catch (error) {
        console.error(error)
      }

      this.likeLoading = false
    },
    async unlikePost() {
      this.likeLoading = true

      try {
        await this.$store.dispatch('post/unlike', this.post.id)
        this.post.isLiked = false
        this.post.likes -= 1
      } catch (error) {
        console.error(error)
      }

      this.likeLoading = false
    },
    async checkPostIsLiked() {
      this.likeLoading = true

      try {
        this.post.isLiked = await this.$store.dispatch('post/isLiked', this.post.id)
      } catch (error) {
        console.error(error)
      }

      this.likeLoading = false
    },
    async checkPostIsSaved() {
      this.saveLoading = true

      try {
        this.post.isSaved = await this.$store.dispatch('post/isSaved', this.post.id)
      } catch (error) {
        console.error(error)
      }

      this.saveLoading = false
    },
    toggleSavePost() {
      if (this.post.isSaved) this.unsavePost()
      else this.savePost()
    },
    async savePost() {
      this.saveLoading = true

      try {
        await this.$store.dispatch('post/save', this.post.id)
        this.post.isSaved = true
      } catch (error) {
        console.error(error)
      }

      this.saveLoading = false
    },
    async unsavePost() {
      this.saveLoading = true

      try {
        await this.$store.dispatch('post/unsave', this.post.id)
        this.post.isSaved = false
      } catch (error) {
        console.error(error)
      }

      this.saveLoading = false
    },
    handleCommentActions(snapshot) {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          console.log('Added: ', change.doc.id)

          this.onAddComment({
            ...change.doc.data(),
            id: change.doc.id
          })
        }
        if (change.type === 'modified') {
          console.log('Modified: ', change.doc.id)
        }
        if (change.type === 'removed') {
          console.log('Removed: ', change.doc.id)
        }
      })
    }
  },
  beforeDestroy() {
    clearInterval(this.intervalTimeUpdate)
    this.$refs.usersComments.removeEventListener('ps-scroll-y', this.scrollHandler)
    this.scrollbar.destroy()
    this.scrollbar = null
  },
  mounted() {
    console.log(this.mixins)

    // import('./test').then((module) => {
    //   for (let key in module) {
    //     this[key] = module[key]
    //   }
    // })

    const container = this.$refs.usersComments
    const scrollbar = new PerfectScrollbar(container)
    container.addEventListener('ps-scroll-y', this.scrollHandler)
    this.scrollbar = scrollbar
  },
  async created() {
    this.handleTimeAgo(this.post)

    if (this.isAuth) {
      await Promise.all([this.checkPostIsLiked(), this.checkPostIsSaved()])
      await this.getCommentsLikes()
    }

    this.queryPaginate = await this.$store.dispatch('comment/getCommentsByPostId', {
      postId: this.post.id,
      cb: this.handleCommentActions
    })

    await this.getComments()
    this.intervalTimeUpdate = setInterval(this.updateCommentsTime, 10000)
  }
}
</script>

<style lang="scss">
@import '~/assets/scss/components/PostModal.scss';
@import 'perfect-scrollbar/css/perfect-scrollbar.css';

.disapear {
  &-enter {
    opacity: 0;
    transform: translateY(-100%);
  }

  &-enter-active {
    transition: all 300ms ease-in-out;
  }

  &-enter-to {
    opacity: 1;
    transform: none;
  }

  &-leave {
    opacity: 1;
  }

  &-leave-active {
    perspective: 100px;
    transition: all 0.5s cubic-bezier(0.36, -0.64, 0.34, 1.76);
  }

  &-leave-to {
    transform: rotateX(-90deg);
    opacity: 0;
  }
}
</style>

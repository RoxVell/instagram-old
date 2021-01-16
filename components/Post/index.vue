<template>
  <article class="post-component">
    <div class="post-content">
      <img :src="post.content[0]" :alt="post.username" />
    </div>
    <div class="post-comments">
      <div class="users-comments" ref="usersComments">
        <CommentOwner :postOwner="postOwner" :post="post" />
        <!-- <transition-group name="disapear-to-center"> -->
        <Comment
          v-for="comment in comments"
          :key="comment.id"
          :comment="comment"
          @loadReplies="loadReplies"
        />
        <!-- </transition-group> -->
      </div>

      <div class="comment-actions">
        <div>
          <div
            class="comment-actions__item comment-actions__item-like"
            :class="{ 'comment-actions__item-like_liked': post.isLiked }"
            ref="likePostRef"
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

        <div v-if="isAuth && !isMine">
          <div
            class="comment-actions__item comment-actions__item-bookmark"
            :class="{ 'comment-actions__item-bookmark_saved': post.isSaved }"
            ref="savePostRef"
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
          ref="addCommentRef"
          class="add-comment__input"
          v-model="commentText"
          :disabled="commentAdding"
          placeholder="Добавьте свой комментарий"
          rows="1"
          @input="autoResizeTextarea($event.target)"
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
import { computeTimeAgo, autoResizeTextarea } from '~/utils/index'
import { mapState, mapGetters } from 'vuex'

const ENTER_KEY_CODE = 13

export default {
  props: {
    post: {
      type: Object,
      required: true,
    },
    postOwner: {
      type: Object,
      required: true,
    },
  },
  components: {
    Comment,
    CommentOwner,
    IconBase,
    IconLike,
    IconComments,
    IconBookmark,
    IconSpinner,
  },
  computed: {
    ...mapState({
      user: (state) => state.account.user,
    }),
    ...mapGetters({ isAuth: 'account/isAuth' }),
    defaultCommentHandlers() {
      // return handlers based on auth status
      const handlers = [this.handleTimeAgo, this.addPostId]
      if (this.commentsLikes && this.commentsLikes.size > 0) handlers.push(this.handleIsLiked)
      return this.isAuth ? [...handlers, this.handleIsMine] : handlers
    },
    isMine() {
      return this.postOwner === this.user
    },
  },
  watch: {
    comments() {
      this.scrollbar.update()
    },
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
      scrollbar: null,
    }
  },
  methods: {
    autoResizeTextarea,
    async loadReplies(commentId) {
      try {
        const currentComment = this.comments.find((comment) => comment.id === commentId)

        currentComment.isRepliesLoading = true

        let queryPaginate = await this.$store.dispatch('comment/loadReplies', {
          postId: this.post.id,
          commentId: commentId,
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
      if (event.keyCode === ENTER_KEY_CODE && event.shiftKey && this.commentText) {
        event.preventDefault()
        this.commentAdding = true

        try {
          let { data: comment } = await this.$store.dispatch('comment/addComment', {
            text: this.commentText,
            postId: this.post.id,
          })
        } catch (error) {
          console.error(error)
        }

        this.commentAdding = false
      }
    },
    onAddReply(replies, commentId) {
      console.log(`[Post] onAddReply: commentId: ${commentId}`, replies)
      replies = this.handleComments(replies, this.defaultCommentHandlers)
      const comment = this.comments.find((comment) => comment.id === commentId)
      console.log(comment)
      comment.isRepliesLoaded = true
      comment.replies.push(...replies)
    },
    onAddComment(comment) {
      comment = this.handleComments([comment], this.defaultCommentHandlers)[0]
      comment.replies = []
      comment.isRepliesLoading = false
      comment.isRepliesLoaded = false

      this.comments.push(comment)
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
    getCommentIndexById(id) {
      return this.comments.findIndex((comment) => comment.id === id)
    },
    handleCommentActions(snapshot) {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          console.log('Added: ', change.doc.id)

          this.onAddComment({
            ...change.doc.data(),
            id: change.doc.id,
          })
        }
        if (change.type === 'modified') {
          const updatedComment = change.doc.data()
          updatedComment.id = change.doc.id

          let commentIndexToUpdate = this.comments.findIndex(
            (comment) => comment.id === change.doc.id
          )

          if (commentIndexToUpdate !== -1) {
            // console.log(commentToUpdate)
            console.log(commentIndexToUpdate)
            // this.comments[commentIndexToUpdate] = this.handleComments(
            //   [updatedComment],
            //   this.defaultCommentHandlers
            // )[0]

            this.comments.splice(
              commentIndexToUpdate,
              1,
              this.handleComments([updatedComment], this.defaultCommentHandlers)[0]
            )
          }

          // comment =
          console.log('Modified: ', change.doc.id)
        }

        if (change.type === 'removed') {
          console.log('Removed: ', change.doc.id)
          const commentIndexToRemove = this.getCommentIndexById(change.doc.id)
          console.log(commentIndexToRemove)
          if (commentIndexToRemove !== -1) this.comments.splice(commentIndexToRemove, 1)
        }
      })
    },
    async injectAuthActions() {
      const module = await import('./postAuthActions')
      for (let key in module) this[key] = module[key].bind(this)
      this.setupListenersForReferences()
    },
    setupListenersForReferences() {
      if (this.$refs.savePostRef) this.$refs.savePostRef.onclick = this.toggleSavePost
      this.$refs.likePostRef.onclick = this.toggleLikePost
      this.$refs.addCommentRef.onkeydown = this.addComment
    },
  },
  beforeDestroy() {
    clearInterval(this.intervalTimeUpdate)
    this.$refs.usersComments.removeEventListener('ps-scroll-y', this.scrollHandler)
    this.scrollbar.destroy()
    this.scrollbar = null
  },
  mounted() {
    const container = this.$refs.usersComments
    const scrollbar = new PerfectScrollbar(container)
    container.addEventListener('ps-scroll-y', this.scrollHandler)
    this.scrollbar = scrollbar
  },
  async created() {
    this.handleTimeAgo(this.post)

    if (this.isAuth) {
      await this.injectAuthActions()
      await Promise.all([this.checkPostIsLiked(), this.checkPostIsSaved()])
      await this.getCommentsLikes()
    }

    this.queryPaginate = await this.$store.dispatch('comment/getCommentsByPostId', {
      postId: this.post.id,
      cb: this.handleCommentActions,
    })

    await this.getComments()
    this.intervalTimeUpdate = setInterval(this.updateCommentsTime, 10000)
  },
}
</script>

<style lang="scss">
@import '~/assets/scss/components/Post.scss';
@import '~/assets/scss/transitions/disapear-to-center.scss';
@import 'perfect-scrollbar/css/perfect-scrollbar.css';
</style>

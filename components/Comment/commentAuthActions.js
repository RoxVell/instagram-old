const ENTER_KEY_CODE = 13

export async function addReply(event) {
  if (event.keyCode === ENTER_KEY_CODE && event.shiftKey && this.replyText) {
    event.preventDefault()

    const { data: comment } = await this.$store.dispatch('comment/addComment', {
      postId: this.postId,
      commentId: this.comment.id,
      text: this.replyText,
      isReply: true
    })
  }
}

export function toggleLike() {
  this.comment.isLiked ? this.unlikeComment() : this.likeComment()
}

export async function likeComment() {
  try {
    await this.$store.dispatch('comment/likeComment', this.comment)
    this.comment.isLiked = true
    this.comment.likes++
  } catch (error) {
    console.error(error)
  }
}

export async function unlikeComment() {
  try {
    await this.$store.dispatch('comment/unlikeComment', this.comment)
    this.comment.isLiked = false
    this.comment.likes--
  } catch (error) {
    console.error(error)
  }
}

export async function deleteComment() {
  try {
    await this.$store.dispatch('comment/deleteComment', this.comment)
    this.$emit('deleteComment', this.comment)
  } catch (error) {
    console.error(error)
  }
}

export function replyToComment() {
  this.isReplying = true

  this.$nextTick(() => {
    this.$refs.commentReplyInputRef.focus()
  })
}

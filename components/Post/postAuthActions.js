export async function likePost() {
  this.likeLoading = true

  try {
    await this.$store.dispatch('post/like', this.post.id)
    this.post.isLiked = true
    this.post.likes += 1
  } catch (error) {
    console.error(error)
  }

  this.likeLoading = false
}

export async function unlikePost() {
  this.likeLoading = true

  try {
    await this.$store.dispatch('post/unlike', this.post.id)
    this.post.isLiked = false
    this.post.likes -= 1
  } catch (error) {
    console.error(error)
  }

  this.likeLoading = false
}

export async function checkPostIsLiked() {
  this.likeLoading = true

  try {
    this.post.isLiked = await this.$store.dispatch('post/isLiked', this.post.id)
  } catch (error) {
    console.error(error)
  }

  this.likeLoading = false
}

export async function checkPostIsSaved() {
  this.saveLoading = true

  try {
    this.post.isSaved = await this.$store.dispatch('post/isSaved', this.post.id)
  } catch (error) {
    console.error(error)
  }

  this.saveLoading = false
}

export async function toggleSavePost() {
  if (this.post.isSaved) this.unsavePost()
  else this.savePost()
}

export async function savePost() {
  this.saveLoading = true

  try {
    await this.$store.dispatch('post/save', this.post.id)
    this.post.isSaved = true
  } catch (error) {
    console.error(error)
  }

  this.saveLoading = false
}

export async function unsavePost() {
  this.saveLoading = true

  try {
    await this.$store.dispatch('post/unsave', this.post.id)
    this.post.isSaved = false
  } catch (error) {
    console.error(error)
  }

  this.saveLoading = false
}

export function toggleLikePost() {
  this.post.isLiked ? this.unlikePost() : this.likePost()
}

export async function addComment(event) {
  console.log('trigger')
  console.log(event)
  const ENTER_KEY_CODE = 13
  if (event.keyCode === ENTER_KEY_CODE && event.shiftKey && this.commentText) {
    event.preventDefault()
    this.commentAdding = true

    try {
      let { data: comment } = await this.$store.dispatch('comment/addComment', {
        text: this.commentText,
        postId: this.post.id
      })
    } catch (error) {
      console.error(error)
    }

    this.commentAdding = false
  }
}

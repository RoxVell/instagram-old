export function toggleFollow() {
  this.isFollowing ? this.unfollow() : this.follow()
}

export async function follow() {
  this.isFollowingLoading = true

  try {
    await this.$store.dispatch('follow/followUser', this.user.username)
    this.isFollowing = true
    this.user.followers += 1
  } catch (error) {
    console.error(error)
  }

  this.isFollowingLoading = false
}

export async function unfollow() {
  this.isFollowingLoading = true

  try {
    await this.$store.dispatch('follow/unfollowUser', this.user.username)
    this.isFollowing = false
    this.user.followers -= 1
  } catch (error) {
    console.error(error)
  }

  this.isFollowingLoading = false
}

export async function checkIsFollowing() {
  this.isFollowingLoading = true

  try {
    this.isFollowing = await this.$store.dispatch('follow/isFollowing', this.user.username)
  } catch (error) {
    console.error(error)
  }

  this.isFollowingLoading = false
}

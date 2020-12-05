import { functions, firestore } from '~/firebase/init'
import { QueryPaginate } from '~/utils/firebaseUtils'
import { accountStore } from '~/store'
import { Module, VuexModule, VuexAction, } from 'nuxt-property-decorator'
import { NotAuthenticatedError } from '~/store/auth'

@Module({
  name: 'post',
  stateFactory: true,
  namespaced: true,
})
export default class PostStore extends VuexModule {
  @VuexAction
  like(postId: number) {
    if (!accountStore.user) throw new NotAuthenticatedError()

    const { username } = accountStore.user
    return firestore.doc(`post_likes/${postId}/likes/${username}`).set({})
  }

  @VuexAction
  unlike(postId: number) {
    if (!accountStore.user) throw new NotAuthenticatedError()

    const { username } = accountStore.user
    return firestore.doc(`post_likes/${postId}/likes/${username}`).delete()
  }

  @VuexAction
  async isLiked(postId: number) {
    if (!accountStore.user) throw new NotAuthenticatedError()

    const { username } = accountStore.user
    return firestore
      .doc(`post_likes/${postId}/likes/${username}`)
      .get()
      .then((snapshot) => snapshot.exists)
  }

  @VuexAction
  save(postId: number) {
    if (!accountStore.user) throw new NotAuthenticatedError()

    const { username } = accountStore.user
    return firestore.doc(`favorites_posts/${username}/favorites/${postId}`).set({})
  }

  @VuexAction
  unsave(postId: number) {
    if (!accountStore.user) throw new NotAuthenticatedError()

    const { username } = accountStore.user
    return firestore.doc(`favorites_posts/${username}/favorites/${postId}`).delete()
  }

  @VuexAction
  isSaved(postId: number) {
    if (!accountStore.user) throw new NotAuthenticatedError()

    const { username } = accountStore.user
    return firestore
      .doc(`favorites_posts/${username}/favorites/${postId}`)
      .get()
      .then((snapshot) => snapshot.exists)
  }

  @VuexAction({ rawError: true })
  getPostsByUsername(username: string) {
    if (!accountStore.user) throw new NotAuthenticatedError()

    const query = firestore
      .collection('posts')
      .where('username', '==', username)
      .orderBy('created_date', 'desc')

    return QueryPaginate(query, 15)
  }

  @VuexAction
  async getFavoritePosts() {
    if (!accountStore.user) throw new NotAuthenticatedError()

    const getFavoritePosts = functions.httpsCallable('getFavoritesPostsByUsername')
    return getFavoritePosts({ username: accountStore.user.username })
  }
}

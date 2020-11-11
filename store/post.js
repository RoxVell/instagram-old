import { firestore } from '~/firebase/init'
import { QueryPaginate } from '../utils/firebaseUtils'

export const state = () => ({})

export const mutations = {}

export const actions = {
  like({ rootState }, postId) {
    const { username } = rootState.account.user
    return firestore.doc(`post_likes/${postId}/likes/${username}`).set({})
  },
  unlike({ rootState }, postId) {
    const { username } = rootState.account.user
    return firestore.doc(`post_likes/${postId}/likes/${username}`).delete()
  },
  async isLiked({ rootState }, postId) {
    const { username } = rootState.account.user

    return firestore
      .doc(`post_likes/${postId}/likes/${username}`)
      .get()
      .then((snapshot) => snapshot.exists)
  },
  save({ rootState }, postId) {
    const { username } = rootState.account.user

    return firestore.doc(`favorites_posts/${username}/favorites/${postId}`).set({})
  },
  unsave({ rootState }, postId) {
    const { username } = rootState.account.user

    return firestore.doc(`favorites_posts/${username}/favorites/${postId}`).delete()
  },
  isSaved({ rootState }, postId) {
    const { username } = rootState.account.user

    return firestore
      .doc(`favorites_posts/${username}/favorites/${postId}`)
      .get()
      .then((snapshot) => snapshot.exists)
  },
  getPostsByUsername(_, username) {
    const query = firestore
      .collection('posts')
      .where('username', '==', username)
      .orderBy('created_date', 'desc')

    return QueryPaginate(query, 15)
  }
}

export const strict = false

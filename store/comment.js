import { firestore, functions } from '~/firebase/init'
import { QueryPaginate } from '../utils/firebaseUtils.ts'

export const state = () => ({})

export const mutations = {}

export const actions = {
  addComment(_, data) {
    const createComment = functions.httpsCallable('addComment')
    return createComment(data)
  },
  deleteComment(_, { commentId, postId }) {
    return firestore.doc(`post_comments/${postId}/comments/${commentId}`).delete()
  },
  loadReplies({}, { postId, commentId, cb }) {
    const query = firestore
      .collection(`post_comments/${postId}/comments/${commentId}/subcomments`)
      .orderBy('created_date', 'asc')

    return QueryPaginate(query, 10, cb)
  },
  getCommentsByPostId(_, { postId, cb }) {
    const query = firestore
      .collection(`post_comments/${postId}/comments`)
      .orderBy('created_date', 'desc')

    return QueryPaginate(query, 15, cb)
  },
  likeComment({ rootState }, comment) {
    if (!rootState.account.user) throw Error('Authorization required')

    const { id, post_id } = comment

    return firestore
      .collection('comments_likes')
      .doc(post_id)
      .collection(rootState.account.user.username)
      .doc(String(id))
      .set({})
  },
  unlikeComment({ rootState }, comment) {
    if (!rootState.account.user) throw Error('Authorization required')

    const { id, post_id } = comment

    return firestore
      .collection('comments_likes')
      .doc(post_id)
      .collection(rootState.account.user.username)
      .doc(String(id))
      .delete()
  },
  getCommentsLikes({ rootState }, post_id) {
    return firestore
      .collection('comments_likes')
      .doc(post_id)
      .collection(rootState.account.user.username)
      .get()
      .then((response) => {
        const likesIDs = new Map()
        for (let snapshot of response.docs) likesIDs.set(snapshot.id)
        return likesIDs
      })
  }
}

export const strict = false

import { firestore, functions } from '~/firebase/init'
import { QueryPaginate } from '../utils/firebaseUtils'

export const state = () => ({})

export const mutations = {}

export const actions = {
  addComment(_, data) {
    const createComment = functions.httpsCallable('addComment')
    return createComment(data)
  },
  deleteComment(_, comment) {
    const { id: commentId, postId } = comment
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

    const { id, postId } = comment

    return firestore
      .doc(`comments_likes/${postId}/${rootState.account.user.username}/${id}`)
      .set({})
  },
  unlikeComment({ rootState }, comment) {
    if (!rootState.account.user) throw Error('Authorization required')

    const { id, postId } = comment

    return firestore
      .doc(`comments_likes/${postId}/${rootState.account.user.username}/${id}`)
      .delete()
  },
  getCommentsLikes({ rootState }, postId) {
    return firestore
      .collection(`comments_likes/${postId}/${rootState.account.user.username}`)
      .get()
      .then((response) => {
        const likesIDs = new Set()
        for (let snapshot of response.docs) likesIDs.add(snapshot.id)
        return likesIDs
      })
  }
}

export const strict = false

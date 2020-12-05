import { firestore, functions } from '~/firebase/init'
import { Module, VuexModule, VuexAction } from 'nuxt-property-decorator'
import { NotAuthenticatedError } from '~/store/auth'
import { accountStore } from '~/store'
import { QueryPaginate } from '../utils/firebaseUtils'
import Comment from '~/types/Comment/Comment'

interface CommentWithPostId extends Comment {
  postId: number
}

@Module({
  name: 'comment',
  stateFactory: true,
  namespaced: true,
})
export default class CommentStore extends VuexModule {
  @VuexAction
  addComment(data: CommentWithPostId) {
    const createComment = functions.httpsCallable('addComment')
    return createComment(data)
  }

  @VuexAction
  deleteComment(comment: CommentWithPostId) {
    const { id: commentId, postId } = comment
    return firestore.doc(`post_comments/${postId}/comments/${commentId}`).delete()
  }

  @VuexAction
  loadReplies({ postId, commentId, cb }: { postId: number; commentId: number; cb: Function }) {
    const query = firestore
      .collection(`post_comments/${postId}/comments/${commentId}/subcomments`)
      .orderBy('created_date', 'asc')
    return QueryPaginate(query, 10, cb)
  }

  @VuexAction
  getCommentsByPostId({ postId, cb }: { postId: number; cb: Function }) {
    const query = firestore
      .collection(`post_comments/${postId}/comments`)
      .orderBy('created_date', 'desc')
    return QueryPaginate(query, 15, cb)
  }

  @VuexAction
  likeComment(comment: CommentWithPostId) {
    if (!accountStore.user) throw new NotAuthenticatedError()

    const { id, postId } = comment
    return firestore
      .doc(`comments_likes/${postId}/${accountStore.user.username}/${id}`)
      .set({})
  }

  @VuexAction
  unlikeComment(comment: CommentWithPostId) {
    if (!accountStore.user) throw new NotAuthenticatedError()

    const { id, postId } = comment
    return firestore
      .doc(`comments_likes/${postId}/${accountStore.user.username}/${id}`)
      .delete()
  }

  @VuexAction
  getCommentsLikes(postId: number) {
    if (!accountStore.user) throw new NotAuthenticatedError()

    return firestore
      .collection(`comments_likes/${postId}/${accountStore.user.username}`)
      .get()
      .then((response) => {
        const likesIDs = new Set<number>()
        for (let snapshot of response.docs) likesIDs.add(Number(snapshot.id))
        return likesIDs
      })
  }
}

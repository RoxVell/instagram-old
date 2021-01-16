import { functions, firestore } from '~/firebase/init'
import { QueryPaginate } from '~/utils/firebaseUtils'
import { accountStore } from '~/store'
import { Module, VuexModule, VuexAction, } from 'nuxt-property-decorator'
import { NotAuthenticatedError } from '~/store/auth'

@Module({
  name: 'follow',
  stateFactory: true,
  namespaced: true,
})
export default class FollowStore extends VuexModule {
  @VuexAction
  followUser(followedUsername: string) {
    const followUserAction = functions.httpsCallable('followUser')

    return followUserAction({ followedUsername })
      .then(() => accountStore.INCREMENT_FOLLOWING_COUNT())
  }

  @VuexAction
  unfollowUser(followedUsername: string) {
    const unfollowUserAction = functions.httpsCallable('unfollowUser')

    return unfollowUserAction({ followedUsername })
      .then(() => accountStore.DECREMENT_FOLLOWING_COUNT())
  }

  @VuexAction({ rawError: true })
  isFollowing(followedUsername: string) {
    if (!accountStore.user) throw new NotAuthenticatedError()

    const followerUsername = accountStore.user.username

    return firestore
      .doc(`followers/${followedUsername}/userFollowing/${followerUsername}`)
      .get()
      .then((snapshot) => snapshot.exists)
  }

  @VuexAction
  getFollowersByUsername(username: string) {
    const query = firestore
      .collection('followers')
      .doc(username)
      .collection('userFollowing')

    return QueryPaginate(query)
  }
}

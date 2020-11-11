import { functions, firestore } from '~/firebase/init'
import { QueryPaginate } from '../utils/firebaseUtils'

export const state = () => ({})

export const mutations = {}

export const actions = {
  followUser({ commit }, followedUsername) {
    const followUserAction = functions.httpsCallable('followUser')

    return followUserAction({ followedUsername }).then(() => {
      commit('account/UPDATE_FOLLOWING_COUNT', 1, { root: true })
    })
  },
  unfollowUser({ commit }, followedUsername) {
    const unfollowUserAction = functions.httpsCallable('unfollowUser')

    return unfollowUserAction({ followedUsername }).then(() => {
      commit('account/UPDATE_FOLLOWING_COUNT', -1, { root: true })
    })
  },
  isFollowing({ rootState }, followedUsername) {
    const followerUsername = rootState.account.user.username

    return firestore
      .doc(`followers/${followedUsername}/userFollowing/${followerUsername}`)
      .get()
      .then((snapshot) => snapshot.exists)
  },
  getFollowersByUsername(_, username) {
    const query = firestore
      .collection('followers')
      .doc(username)
      .collection('userFollowing')

    return QueryPaginate(query)
  }
}

export const strict = false

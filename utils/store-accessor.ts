import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'

import AccountStore from '~/store/account'
import FollowStore from '~/store/follow'
import AuthStore from '~/store/auth'
import CommentStore from '~/store/comment'
import PostStore from '~/store/post'

let accountStore: AccountStore
let followStore: FollowStore
let authStore: AuthStore
let commentStore: CommentStore
let postStore: PostStore

function initialiseStores(store: Store<any>): void {
  accountStore = getModule(AccountStore, store)
  followStore = getModule(FollowStore, store)
  authStore = getModule(AuthStore, store)
  commentStore = getModule(CommentStore, store)
  postStore = getModule(PostStore, store)
}

export { initialiseStores, accountStore, followStore, authStore, commentStore, postStore }
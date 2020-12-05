import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import AccountStore from '~/store/account'
import FollowStore from '~/store/follow'

let accountStore: AccountStore
let followStore: FollowStore

function initialiseStores(store: Store<any>): void {
  accountStore = getModule(AccountStore, store)
  followStore = getModule(FollowStore, store)
}

export { initialiseStores, accountStore, followStore }
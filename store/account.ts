import { auth, firestore, storage } from '~/firebase/init'
import { getDocuments } from '~/utils/firebaseUtils'
import { Module, VuexModule, VuexMutation, VuexAction } from 'nuxt-property-decorator'
import { NotAuthenticatedError } from '~/store/auth'
import { accountStore } from '~/store'
import User from '~/types/User'

type LoadingStatus = 'loading' | 'auth' | 'user-not-exist' | 'not-auth'

@Module({
  name: 'account',
  stateFactory: true,
  namespaced: true,
})
export default class AccountStore extends VuexModule {
  public user: User | null = null
  public isLoading: { status: LoadingStatus } = { status: 'loading' }
  public avatar = ''

  get isAuth() {
    return Boolean(this.user)
  }

  @VuexMutation
  SET_USER(user: User | null) {
    this.user = user
  }

  @VuexMutation
  SET_LOADING_STATE(loadingStatus: LoadingStatus) {
    this.isLoading = { status: loadingStatus }
  }

  @VuexAction
  updateUser() {
    if (!auth.currentUser) {
      this.SET_USER(null)
      this.SET_LOADING_STATE('not-auth')
    } else {
      if (!auth.currentUser.displayName) return;

      this.getUser(auth.currentUser.displayName)
        .then((user) => {
          if (!user) {
            this.SET_LOADING_STATE('user-not-exist')
            return;
          }

          this.SET_USER(user)
          this.SET_LOADING_STATE('auth')
        })
        .catch(console.log)
    }
  }

  @VuexMutation
  ADD_POST() {
    if (this.user) this.user.posts += 1
  }

  @VuexMutation
  UPDATE_AVATAR(avatar: string) {
    this.avatar = avatar
  }

  @VuexMutation
  UPDATE_FOLLOWING_COUNT(count: number) {
    if (this.user) this.user.following = count
  }

  @VuexMutation
  INCREMENT_FOLLOWING_COUNT() {
    if (this.user) this.user.following++
  }

  @VuexMutation
  DECREMENT_FOLLOWING_COUNT() {
    if (!this.user) throw new NotAuthenticatedError()
    this.user.following++
  }

  @VuexAction
  async checkUsername(username: string) {
    const docs = await accountStore.getUser(username)
    return !docs
  }

  @VuexAction({ rawError: true })
  async getUser(username: string) {
    const userDoc = await firestore.doc(`users/${username}`).get()
    if (!userDoc.exists) return null
    const user = getDocuments<User>([userDoc])[0]
    return user || null
  }

  @VuexAction
  uploadAvatar({ blobImage, avatarSrc }: { blobImage: Blob, avatarSrc: string }) {
    if (!this.user) throw new NotAuthenticatedError()

    const uploadTask = storage.ref(`avatars/${this.user.username}.jpg`).put(blobImage)
    uploadTask.then(() => this.UPDATE_AVATAR(avatarSrc))
    return { uploadTask }
  }

  @VuexAction
  deleteAvatar() {
    if (!this.user) throw new NotAuthenticatedError()

    return storage
      .ref(`avatars/${this.user.username}.jpg`)
      .delete()
      .then(() => this.UPDATE_AVATAR(''))
  }
}

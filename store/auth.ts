import { Module, VuexModule, VuexAction } from 'nuxt-property-decorator'
import { auth, functions } from '~/firebase/init'
import { accountStore } from '~/store'

interface SignInCredentials {
  email: string
  username: string
  password: string
}

interface SignUpCredentials extends SignInCredentials {
  username: string
}

@Module({
  name: 'auth',
  stateFactory: true,
  namespaced: true,
})
export default class AuthStore extends VuexModule {
  @VuexAction
  async createUserWithEmailAndPassword({ email, username, password }: SignInCredentials) {
    const createUser = functions.httpsCallable('createUser')
    return createUser({ email, username, password })
  }

  @VuexAction
  async signInWithEmailAndPassword({ email, password }: SignUpCredentials) {
    return await auth.signInWithEmailAndPassword(email, password)
  }

  @VuexAction
  async signOut() {
    try {
      await auth.signOut()
    } catch (error) {
      throw Error(error)
    }
  }

  @VuexAction
  async checkUsername(username: string): Promise<boolean> {
    const user = await accountStore.getUser(username)
    return Boolean(user)
  }
}

export class NotAuthenticatedError extends Error {
  constructor(message: string = '') {
    super(message);
    this.name = 'NotAuthenticatedError'
  }
}

import { auth, database, storage } from '~/firebase/init'


let photosRef = storage.ref('photos/')

export const state = () => ({
  user: auth.currentUser
})

export const mutations = {
  UPDATE_USER(state) {
    state.user = auth.currentUser
  }
}

export const actions = {
  async createUserWithEmailAndPassword({ commit }, { email, password }) {
    try {
      let user = await auth.createUserWithEmailAndPassword(email, password)
    } catch(error) {
      throw Error(error)
    }
  },
  async signInWithEmailAndPassword({ commit }, { email, password }) {
    let user = await auth.signInWithEmailAndPassword(email, password)
  },
  async signOut({ commit }) {
    try {
      let isSignOut = await auth.signOut()
    } catch(error) {
      console.log('Ошибка при выходе из аккаунта', error)
      throw Error(error)
    }
  },
  async fetchSignInMethodsForEmail(_, email) {
    return await auth.fetchSignInMethodsForEmail(email)
  },
  uploadPhoto(_, photoBlob) {
    let fileRef = storage.ref(`photos/${photoBlob.name}`)
    return fileRef.put(photoBlob)

    console.log(fileUpload);

    return fileUpload

    // fileUpload.on('state_changed', snapshot => {
    //   console.log(snapshot)
    // })
      
    //   console.log('Загрузка файла прошла успешно', result)
    // } catch(error) {
    //   console.error('При загрузке файла произошла ошибка', error)
    // }
  }
}

export const getters = {
  isAuth(state) {
    return state.user !== null
  }
}

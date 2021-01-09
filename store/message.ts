import { functions, firestore } from '~/firebase/init'
import { QueryPaginate } from '~/utils/firebaseUtils'
import { accountStore } from '~/store'
import { Module, VuexModule, VuexAction, } from 'nuxt-property-decorator'
import { NotAuthenticatedError } from '~/store/auth'

@Module({
  name: 'message',
  stateFactory: true,
  namespaced: true,
})
export default class MessageStore extends VuexModule {
  @VuexAction
  getGroupsByUsername(username: string) {
    firestore.collection('group')
  }

  @VuexAction
  getMessagesByGroupId(groupId: string) {
    return firestore.collection('message')
      .doc(groupId)
      .collection('messages')
      .orderBy('sentAt')
      .onSnapshot((querySnapshot) => {
        console.log(`Vuex [message]: getMessagesByGroupId`, querySnapshot);
        
        const allMessages = []

        querySnapshot.forEach((doc) => {
          if (doc) allMessages.push(doc.data())
        })
      })
  }

  @VuexAction
  
}
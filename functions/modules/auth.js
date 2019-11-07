const functions = require('firebase-functions')

module.exports = function(admin) {
  /**
   * Function name: `On Create User`
   * Function description: `Function fires when user is created`
   */

  const onCreateUser = functions.auth.user().onCreate((user) => {
    const { User } = require('../models/User')
    const newUser = User(user)

    return admin
      .firestore()
      .collection('users')
      .doc(user.displayName)
      .set(newUser)
  })

  /**
   * Function name: `Delete User From Firebase`
   * Function description: Delete a user globally if his entry has been deleted from firestore
   */

  const deleteUserFromFirebase = functions.auth.user().onDelete((user) => {
    return admin
      .firestore()
      .doc(`users/${user.displayName}`)
      .delete()
      .then(() => {
        console.log(`The user ${user.displayName} was successfully removed!`)
      })
      .catch((error) => {
        console.log(`An error occurred while deleting the user ${user.displayName}!`)
        console.error(error)
      })
  })

  /**
   * Function name: `Delete User From Firestore`
   * Function description: Delete a user globally if his entry has been deleted from firestore
   */

  const deleteUserFromFirestore = functions.firestore
    .document('users/{userId}')
    .onDelete((snapshot, context) => {
      const { id } = snapshot

      return admin
        .auth()
        .deleteUser(id)
        .then(() => {
          console.log(`Пользователь ${id} успешно удалён!`)
        })
        .catch((error) => {
          if (error.code === 'auth/user-not-found') {
            console.error(`Function 'deleteFromFirestore': ${id} user not found!`)
          } else {
            console.error(`An error occurred while deleting the user: ${id}!`)
            console.error(error)
          }
        })
    })

  /**
   * Function name: `Create User`
   * Function description: `Function that check username is not taken by other user`
   */

  const createUser = functions.https.onCall(async (data) => {
    let { email, username, password } = data

    username = username.toLowerCase()

    const usernameIsValid = await hasUsernameInFirestore(username)

    if (!(typeof username === 'string') || username.length === 0) {
      throw new functions.https.HttpsError(
        'invalid-username',
        'The field username can not be empty'
      )
    }

    if (!usernameIsValid) {
      throw new functions.https.HttpsError('invalid-username', 'This username has been taken')
    }

    try {
      const { DEFAULT_AVATAR } = require('../models/User')

      return admin
        .auth()
        .createUser({
          email,
          password,
          displayName: username,
          photoURL: DEFAULT_AVATAR
        })
        .then((user) => {
          return {
            success: true,
            message: 'User was created successfully'
          }
        })
    } catch (error) {
      console.log(`В процессе выполнения функции 'createUser' произошла ошибка`)
      console.log(error)

      if (error.code === 'auth/email-already-exists') {
        throw new functions.https.HttpsError(
          'auth/email-already-exists',
          'The email address is already in use by another account.'
        )
      }

      throw error
    }
  })

  /**
   * Function name: `Has Username In Database`
   * Function description: `Function that check username is not taken by other user`
   */

  async function hasUsernameInFirestore(username) {
    try {
      const docs = await admin
        .firestore()
        .collection('users')
        .where('username', '==', username)
        .get()

      return docs.size === 0
    } catch (error) {
      // return new Error(error)
      return false
    }
  }

  return {
    createUser,
    onCreateUser,
    deleteUserFromFirebase,
    deleteUserFromFirestore
  }
}

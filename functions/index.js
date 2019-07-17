const functions = require('firebase-functions')
const admin = require('firebase-admin')
const { Storage } = require('@google-cloud/storage')
const path = require('path')
const os = require('os')
const dotenv = require('dotenv')
const imagemin = require('imagemin')
const imageminJpegtran = require('imagemin-jpegtran')
const sharp = require('sharp')
const { User } = require('./models/User')

dotenv.config()

const storage = new Storage()

admin.initializeApp()

/**
 * Function name: `On Create User`
 * Function description: `Create user in firestore`
 */

exports.onCreateUser = functions.auth.user().onCreate((user) => {
  const newUser = User(user)

  return admin
    .firestore()
    .collection('users')
    .doc(user.uid)
    .set(newUser)
})

/**
 * Function name: `Create User`
 * Function description: `Function that check username is not taken by other user`
 */

exports.createUser = functions.https.onCall(async (data) => {
  let { email, password, username, photoURL } = data

  username = username.toLowerCase()

  const usernameIsValid = await hasUsernameInFirestore(username)

  if (!usernameIsValid) {
    throw new functions.https.HttpsError('invalid-username', 'This username has been taken')
  }

  if (!(typeof username === 'string') || username.length === 0) {
    throw new functions.https.HttpsError('invalid-username', 'The field username can not be empty')
  }

  return admin.auth().createUser({
    email,
    password,
    displayName: username,
    photoURL
  })
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

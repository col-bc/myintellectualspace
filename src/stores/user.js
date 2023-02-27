import { getAuth } from '@firebase/auth'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
  where
} from '@firebase/firestore'
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes
} from '@firebase/storage'
import usePostStore from './post'
import useMessageStore from './message'
import { defineStore } from 'pinia'

/*
  Functions and state for user data existing in 
  user and notification documents in firestore

*/

const useUserStore = defineStore({
  id: 'user',
  persist: true,
  state: () => ({
    user: undefined,
    posts: [],
    notifications: []
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
    getUser: (state) => state.user,
    getPosts: (state) => state.posts
  },
  actions: {
    /**
     * Sets the user state and fetches posts and messages
     * @param {object} user the payload to set the user state
     */
    async setUser(user) {
      this.user = user
      console.log('Updating user document ', this.user.uid)
      // fetch posts
      const post = usePostStore()
      await post.fetchPosts()
      // check for new messages
      const message = useMessageStore()
      await message.checkForNewMessages()
      // update lastActive field in user
      const db = getFirestore()
      const userRef = doc(db, 'users', this.user.uid)
      await setDoc(userRef, { lastActive: serverTimestamp() }, { merge: true })
    },
    /**
     *   Fetches the current user from firestore
     * @returns {object} user object from firestore
     */
    async fetchCurrentUser() {
      // update user state with current user data
      const db = getFirestore()
      const userRef = doc(db, 'users', this.user.uid)
      const docSnap = await getDoc(userRef)
      this.user = { ...docSnap.data(), id: docSnap.id }
      return this.user
    },
    /**
     *  Fetches a user from firestore by handle (omitting the @)
     * @param {string} handle
     * @returns {object} user
     */
    async fetchUserByHandle(handle) {
      // query firestore for user by handle
      const db = getFirestore()
      const userRef = collection(db, 'users')
      const q = query(userRef, where('handle', '==', handle))
      const querySnapshot = await getDocs(q)
      var userData = {}
      querySnapshot.forEach((doc) => {
        userData = { ...doc.data(), id: doc.id }
      })
      return userData
    },
    /**
     * Fetches a user from firestore by uid
     * @param {string} handle the handle to search for
     * @returns {string} the uid of the user
     */
    async fetchUidByHandle(handle) {
      // query firestore for user uid1 by handle
      const db = getFirestore()
      const userRef = collection(db, 'users')
      const q = query(userRef, where('handle', '==', handle))
      const querySnapshot = await getDocs(q)
      var uid = ''
      querySnapshot.forEach((doc) => {
        if (doc.data().handle === handle) uid = doc.id
      })
      return uid
    },
    async getUserUidByHandle(handle) {
      // query firestore for user uid by handle
      const db = getFirestore()
      const userRef = collection(db, 'users')
      const q = query(userRef, where('handle', '==', handle))
      const documents = await getDocs(q)
      var uid = ''
      documents.forEach((doc) => {
        if (doc.data().handle === handle) uid = doc.id
      })
      return uid
    },
    /**
     * Fetches a user from firestore by uid
     * @param {string} uid the uid to search for
     * @returns {object} user
     */
    async fetchUserByUid(uid) {
      // query firestore for user by uid
      const db = getFirestore()
      const userRef = doc(db, 'users', uid)
      const docSnap = await getDoc(userRef)
      if (docSnap.exists()) {
        return { ...docSnap.data(), id: docSnap.id }
      } else {
        return {}
      }
    },
    /**
     * Updates user document in firestore with data
     * @param {object} data the data to update the user with
     */
    async updateUser(data) {
      // strip empty or unfilled fields
      const filteredData = Object.keys(data).reduce((acc, key) => {
        if (data[key] !== undefined && data[key] !== '' && data[key] !== null) {
          acc[key] = data[key]
        }
        return acc
      }, {})
      // update user in firestore
      const db = getFirestore()
      const docRef = doc(db, 'users', this.user.uid)
      await setDoc(docRef, filteredData, { merge: true })
      this.setUser({ ...this.user, ...filteredData })
    },
    /**
     *  Removes a field from the user document in firestore
     * @param {string} field the field to remove from the user document
     */
    async dropField(field) {
      // remove field from user doc in firestore
      const db = getFirestore()
      const docRef = doc(db, 'users', this.user.uid)
      const fieldExists = this.user[field] !== undefined
      if (fieldExists) {
        await setDoc(docRef, { [field]: null }, { merge: true })
        this.setUser({ ...this.user, [field]: null })
      } else {
        throw new Error(`Field does not exist on user's document`)
      }
    },
    /**
     * Clears the user state
     * @returns {void}
     */
    clearUser() {
      this.user = undefined
      this.posts = []
    },
    /**
     * Toggles the follow status of a user
     * @param {object} user the user to toggle the follow status of
     */
    async toggleFollowUser(user) {
      // append or remove object from user's following array
      const db = getFirestore()
      const docRef = doc(db, 'users', this.user.uid)
      const following = this.user.following || []
      // check if user's handle is in following array
      const userIndex = following.findIndex((handle) => handle.uid === user.uid)
      if (userIndex === -1) {
        // user is not in following array, add them
        following.push({
          uid: user.uid,
          handle: user.handle,
          avatarUrl: user.avatarUrl,
          fullName: user.fullName
        })
        const uid = await this.getUserUidByHandle(user.handle)
        this.createNotification(
          {
            message: `@${this.user.handle} started following you`,
            created: new Date().toISOString('en-US'),
            read: false,
            type: 'follow'
          },
          uid
        )
      } else {
        // user is in following array, remove them
        following.splice(userIndex, 1)
      }
      await setDoc(docRef, { following: following }, { merge: true })
      this.setUser({ ...this.user, following })
    },
    /**
     * Uploads file to storage and updates user.avatarUrl in firestore
     * @param {object} file the file to upload
     */
    async uploadAvatar(file) {
      const storage = getStorage()
      const storageRef = ref(storage, `avatars/${this.user.uid}`)
      // delete old avatar
      if (!this.user.avatarUrl.includes('avatar.png')) {
        try {
          await deleteObject(storageRef)
          console.log('Old avatar deleted')
        } catch (error) {
          console.log('Cannot delete old avatar from storage, ', error)
        }
      }
      // upload new avatar
      const uploadTask = await uploadBytes(storageRef, file)
      const downloadUrl = await getDownloadURL(uploadTask.ref)
      this.user.avatarUrl = downloadUrl
      console.log('Uploaded file. Available at ', downloadUrl)
      // update user.avatarUrl in firestore
      const db = getFirestore()
      const docRef = doc(db, 'users', this.user.uid)
      console.log('updating user avatarUrl in firestore...')
      await setDoc(docRef, { avatarUrl: downloadUrl }, { merge: true })
      // change avatar in posts collection
      const postsRef = collection(db, 'posts')
      const q = query(postsRef, where('author.handle', '==', this.user.handle))
      const posts = await getDocs(q)
      console.log('changing avatarUrl in ', posts.size, ' posts...')
      posts.forEach(async (post) => {
        const postRef = doc(db, 'posts', post.id)
        await setDoc(
          postRef,
          { author: { ...this.user.author, avatarUrl: downloadUrl } },
          { merge: true }
        )
      })
      // change avatar in comments
      const allPosts = await getDocs(postsRef)
      allPosts.forEach(async (post) => {
        const data = post.data()
        console.log(
          'data',
          data.comments?.forEach((comment) => {
            console.log(comment.author.handle)
          })
        )
        const comments = data.comments || []
        var commentIndex = comments.findIndex((comment) => {
          return comment.author.handle === this.user.handle
        })
        if (commentIndex !== -1) {
          comments[commentIndex].author.avatarUrl = downloadUrl
          const postRef = doc(db, 'posts', post.id)
          await setDoc(postRef, { comments: comments }, { merge: true })
        }
      })
      // TODO: change avatar in messages collection
      console.log('done')
    },
    /**
     * Gets a list of users that the current user is not following
     * @returns {array} an array of users
     */
    async getSuggestedUsers() {
      // get all users
      const db = getFirestore()
      const usersRef = collection(db, 'users')
      const allUsers = await getDocs(usersRef)
      // filter out current user and users already followed
      const following = this.user.following || []
      const suggestedUsers = allUsers.docs
        .map((doc) => {
          return { ...doc.data(), id: doc.id }
        })
        // remove current user
        .filter((user) => user.handle !== this.user.handle)
        // remove users already followed
        .filter((user) => {
          return !following.some((followingUser) => {
            return followingUser.handle === user.handle
          })
        })
      return suggestedUsers
    },
    /**
     * Gets the last active date of a user by handle
     * @param {string} handle the handle of the user
     * @returns {serverTimestamp} the last active date
     */
    async getLastActive(handle) {
      const db = getFirestore()
      const usersRef = collection(db, 'users')
      const q = query(usersRef, where('handle', '==', handle))
      const querySnapshot = await getDocs(q)
      if (querySnapshot.empty) return null
      var lastActive = null
      querySnapshot.forEach((doc) => {
        lastActive = doc.data().lastActive
      })
      return lastActive
    },
    /**
     * Fetches the notifications for the current user
     * @returns {array} an array of notifications
     */
    async fetchNotifications() {
      const db = getFirestore()
      const docRef = doc(db, 'notifications', this.user.uid)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        this.notifications = docSnap.data().notifications
      } else {
        this.notifications = []
      }
      return this.notifications
    },
    /**
     * Creates a notification for a user
     * @param {object} notification the notification to create
     * @param {*} uid the uid of the user to create the notification for
     */
    async createNotification(notification, uid) {
      const db = getFirestore()
      const docRef = doc(db, 'notifications', uid)

      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const notifications = docSnap.data().notifications
        notifications.push({
          ...notification,
          created: new Date().toISOString('en-US')
        })
        await setDoc(docRef, { notifications }, { merge: true })
      } else {
        await setDoc(docRef, { notifications: [notification] })
      }
    },
    /**
     * Dismisses a notification for the current user
     * @param {number} idx the index of the notification to dismiss
     */
    async dismissNotification(idx) {
      const db = getFirestore()
      const docRef = doc(db, 'notifications', this.user.uid)
      const notifications = this.notifications
      notifications.splice(idx, 1)
      await setDoc(docRef, { notifications }, { merge: true })
      this.notifications = notifications
    },
    /**
     * Dismisses all notifications for the current user
     * @returns {array} an empty array of notifications
     */
    async dismissAllNotifications() {
      const db = getFirestore()
      const docRef = doc(db, 'notifications', this.user.uid)
      await setDoc(docRef, { notifications: [] }, { merge: true })
      this.notifications = []
    },
    /**
     * Checks if the current user is following another user
     * @param {string} uid the uid of the user to check if the current user is following
     * @returns {boolean} `true` if the current user is following the user, `false` otherwise
     */
    isFollowing(uid) {
      // check if user is following another user
      if (!this.user) return false
      const following = this.user.following || []
      return following.some((user) => user.uid === uid)
    },
    /**
     * Searches for users by handle
     * @param {string} queryText the text to search for
     * @returns {array} an array of users
     */
    async searchUser(queryText) {
      const db = getFirestore()
      const usersRef = collection(db, 'users')
      const q = query(
        usersRef,
        where(
          'handle',
          '>=',
          queryText.charAt(0).toUpperCase() + queryText.slice(1)
        ),
        where('handle', '<=', queryText + '\uf8ff')
      )
      const querySnapshot = await getDocs(q)
      if (querySnapshot.empty) return []
      var users = []
      querySnapshot.forEach((doc) => {
        users.push({ ...doc.data(), id: doc.id })
      })
      return users
    },

    /**
     * Clears user data from the store and firebase auth
     */
    logout() {
      this.clearUser()
      getAuth().signOut()
    }
  }
})

export default useUserStore

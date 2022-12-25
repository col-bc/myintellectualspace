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
    async setUser(user) {
      this.user = user
      // fetch posts
      await this.fetchPosts()
      // update lastActive field in user
      const db = getFirestore()
      const userRef = doc(db, 'users', this.user.uid)
      await setDoc(userRef, { lastActive: serverTimestamp() }, { merge: true })
    },
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
    clearUser() {
      this.user = undefined
      this.posts = []
    },
    async toggleFollowUser(user) {
      // append or remove object from user's following array
      const db = getFirestore()
      const docRef = doc(db, 'users', this.user.uid)
      const following = this.user.following || []
      // check if user's handle is in following array
      const userIndex = following.findIndex((handle) => handle === user.handle)
      if (userIndex === -1) {
        // user is not in following array, add them
        following.push({
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
    async uploadAvatar(file) {
      const storage = getStorage()
      const storageRef = ref(storage, `avatars/${this.user.uid}`)
      if (!this.user.avatarUrl.includes('avatar.png'))
        await deleteObject(storageRef)
      const uploadTask = await uploadBytes(storageRef, file)
      const downloadUrl = await getDownloadURL(uploadTask.ref)
      this.user.avatarUrl = downloadUrl
      // update user in firestore
      const db = getFirestore()
      const docRef = doc(db, 'users', this.user.uid)
      await setDoc(docRef, { avatarUrl: downloadUrl }, { merge: true })
      // update user in state
      // change avatar in posts
      const postsRef = collection(db, 'posts')
      const q = query(postsRef, where('author.handle', '==', this.user.handle))
      const posts = await getDocs(q)
      posts.forEach(async (post) => {
        const postRef = doc(db, 'posts', post.id)
        console.log(postRef.data().author)
        await setDoc(
          postRef,
          { 'author.avatarUrl': downloadUrl },
          { merge: true }
        )
      })
    },
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
    async createNotification(notification, uid) {
      const db = getFirestore()
      console.log(uid)
      const docRef = doc(db, 'notifications', uid)

      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const notifications = docSnap.data().notifications
        notifications.push(notification)
        await setDoc(docRef, { notifications }, { merge: true })
      } else {
        await setDoc(docRef, { notifications: [notification] })
      }
    },
    async dismissNotification(idx) {
      const db = getFirestore()
      const docRef = doc(db, 'notifications', this.user.uid)
      const notifications = this.notifications
      notifications.splice(idx, 1)
      await setDoc(docRef, { notifications }, { merge: true })
      this.notifications = notifications
    },
    async dismissAllNotifications() {
      const db = getFirestore()
      const docRef = doc(db, 'notifications', this.user.uid)
      await setDoc(docRef, { notifications: [] }, { merge: true })
      this.notifications = []
    },

    // POST ACTIONS

    logout() {
      this.clearUser()
      getAuth().signOut()
    }
  }
})

export default useUserStore

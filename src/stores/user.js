import { getAuth } from '@firebase/auth'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  deleteDoc,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
  where
} from '@firebase/firestore'
import {
  getStorage,
  ref,
  deleteObject,
  uploadBytes,
  getDownloadURL
} from '@firebase/storage'
import { defineStore } from 'pinia'
import { v4 } from 'uuid'

/*
  Functions and state for user data existing in 
  user & post documents in firestore

  TODO:
    - move post state/actions to separate store
*/

export const useUserStore = defineStore({
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
    // USER ACTIONS
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
            read: false
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
    async fetchPosts() {
      const db = getFirestore()
      const postsRef = collection(db, 'posts')
      if (!this.user.handle) {
        // user has not completed onboarding
        this.posts = []
        return
      }
      const q = query(postsRef, where('author.handle', '==', this.user.handle))
      const posts = await getDocs(q)
      this.posts = posts.docs.map((doc) => {
        return { ...doc.data(), id: doc.id }
      })
      return this.posts
    },
    async fetchAllPosts() {
      const db = getFirestore()
      const postsRef = collection(db, 'posts')
      const posts = await getDocs(postsRef)
      return posts.docs.map((doc) => {
        return { ...doc.data(), id: doc.id }
      })
    },
    async fetchPostsByHandle(handle) {
      const db = getFirestore()
      const postsRef = collection(db, 'posts')
      const q = query(postsRef, where('author.handle', '==', handle))
      const posts = await getDocs(q)
      return posts.docs.map((doc) => {
        return { ...doc.data(), id: doc.id }
      })
    },
    async getNetworkPosts() {
      const db = getFirestore()
      const postsRef = collection(db, 'posts')
      const following = this.user.following || []
      if (following.length === 0) {
        return []
      }
      const q = query(
        postsRef,
        where(
          'author.handle',
          'in',
          following.map((user) => user.handle)
        )
      )
      const posts = await getDocs(q)
      return posts.docs.map((doc) => {
        return { ...doc.data(), id: doc.id }
      })
    },
    async getEducationPosts() {
      const db = getFirestore()
      // get all users with education
      const usersRef = collection(db, 'users')
      const q = query(usersRef, where('educationLevel', '!=', null))
      const users = await getDocs(q)
      const usersWithEducation = users.docs.map((doc) => {
        return { ...doc.data(), id: doc.id }
      })
      // get all posts by users with education
      const postsRef = collection(db, 'posts')
      const posts = await getDocs(postsRef)
      const postsByUsersWithEducation = posts.docs
        .map((doc) => {
          return { ...doc.data(), id: doc.id }
        })
        .filter((post) => {
          return usersWithEducation.some((user) => {
            return user.handle === post.author.handle
          })
        })
      return postsByUsersWithEducation
    },
    async addPost(data) {
      // remove null or empty fields
      const filteredData = Object.keys(data).reduce((acc, key) => {
        if (data[key] !== undefined && data[key] !== '' && data[key] !== null) {
          acc[key] = data[key]
        }
        return acc
      }, {})
      const newPost = {
        ...filteredData,
        createdAt: serverTimestamp(),
        author: {
          fullName: this.user.fullName,
          handle: this.user.handle,
          avatarUrl: this.user.avatarUrl
        }
      }
      // add post to posts collection
      const db = getFirestore()
      const postsRef = collection(db, 'posts')
      await setDoc(doc(postsRef), newPost)
      const post = await getDoc(doc(postsRef))
      // update state with new post
      this.posts.push({
        ...newPost,
        id: post.id
      })
      // update lastActive field in user
      const userRef = doc(db, 'users', this.user.uid)
      await setDoc(userRef, { lastActive: serverTimestamp() }, { merge: true })
      return this.posts[this.posts.length - 1]
    },
    async deletePost(data) {
      // delete post from posts collection
      const db = getFirestore()
      const postRef = collection(db, 'posts')
      if (!!data.image) {
        // remove image from storage
        console.log(data.image)
        const storage = getStorage()
        const storageRef = ref(
          storage,
          this.posts.find((post) => post.id === data.id).image
        )
        await deleteObject(storageRef)
      } else {
        // remove post from firestore
        await deleteDoc(doc(postRef, data.id))
      }
      v
      // update state
      console.log(
        'removing post: ',
        this.posts.filter((posts) => posts.id !== data.id)
      )
      this.posts = this.posts.filter((post) => post.id !== data.id)
      // update lastActive field in user
      const userRef = doc(db, 'users', this.user.uid)
      await setDoc(userRef, { lastActive: serverTimestamp() }, { merge: true })
    },
    async toggleLike(post) {
      // toggle like in firestore
      const db = getFirestore()
      const postsRef = collection(db, 'posts')
      const docRef = doc(postsRef, post.id)
      const likes = post.likes || []
      // check if user's handle is in likes array
      const userIndex = likes.findIndex((like) => like === this.user.handle)
      if (userIndex === -1) {
        // user has not liked post, append handle
        likes.push(this.user.handle)
        const uid = await this.getUserUidByHandle(post.author.handle)
        this.createNotification(
          {
            message: `@${this.user.handle} liked your post`,
            created: new Date().toISOString('en-US'),
            read: false
          },
          uid
        )
      } else {
        // user has liked post, remove index of user's handle
        likes.splice(userIndex, 1)
      }
      // save changes to firestore
      await setDoc(docRef, { likes }, { merge: true })
      if (this.user.handle === post.author.handle) {
        // update post in state
        const postIndex = this.posts.findIndex((p) => p.id === post.id)
        this.posts[postIndex].likes = likes
      }
      // update lastActive field in user
      const userRef = doc(db, 'users', this.user.uid)
      await setDoc(userRef, { lastActive: serverTimestamp() }, { merge: true })
      return likes
    },
    async addComment(postId, comment) {
      // add comment to post in firestore
      const db = getFirestore()
      const postsRef = collection(db, 'posts')
      const docRef = doc(postsRef, postId)
      const docData = await getDoc(docRef)
      const comments = docData.data().comments || []
      comments.push({
        id: v4(),
        content: comment,
        author: {
          fullName: this.user.fullName,
          handle: this.user.handle,
          avatarUrl: this.user.avatarUrl
        }
      })
      // save changes to firestore
      await setDoc(docRef, { comments }, { merge: true })
      // create notification
      const uid = await this.getUserUidByHandle(docData.data().author.handle)
      this.createNotification(
        {
          message: `@${this.user.handle} commented on one of your post`,
          created: new Date().toISOString('en-US'),
          read: false
        },
        uid
      )
      // update state if user is author of post
      if (this.user.handle === docData.data().author.handle) {
        // update post in state
        const postIndex = this.posts.findIndex((p) => p.id === postId)
        this.posts[postIndex].comments = comments
      }
      // update lastActive field of user
      const userRef = doc(db, 'users', this.user.uid)
      await setDoc(userRef, { lastActive: serverTimestamp() }, { merge: true })
      return comments
    },
    async deleteComment(postId, commentId) {
      const db = getFirestore()
      const postsRef = collection(db, 'posts')
      const docRef = doc(postsRef, postId)
      const docData = await getDoc(docRef)
      const comments = docData.data().comments || []
      const commentIndex = comments.findIndex(
        (comment) => comment.id === commentId
      )
      comments.splice(commentIndex, 1)
      // save changes to firestore
      await setDoc(docRef, { comments }, { merge: true })
      // update state if user is author of post
      if (this.user.handle === docData.data().author.handle) {
        // update post in state
        const postIndex = this.posts.findIndex((p) => p.id === postId)
        this.posts[postIndex].comments = comments
      }
      // update lastActive field for user
      const userRef = doc(db, 'users', this.user.uid)
      await setDoc(userRef, { lastActive: serverTimestamp() }, { merge: true })
      return comments
    },
    async fetchLikedPostsByHandle(handle) {
      const db = getFirestore()
      const postsRef = collection(db, 'posts')
      const q = query(postsRef, where('likes', 'array-contains', handle))
      const posts = await getDocs(q)
      return posts.docs.map((doc) => {
        return { ...doc.data(), id: doc.id }
      })
    },

    logout() {
      this.clearUser()
      getAuth().signOut()
    }
  }
})

export default useUserStore

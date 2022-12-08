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
import { defineStore } from 'pinia'

export const useUserStore = defineStore({
  id: 'user',
  persist: true,
  state: () => ({
    user: undefined,
    posts: []
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
      const docRef = doc(db, 'users', this.user.email)
      console.log('Updating doc', this.user.email, filteredData)
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
      const docRef = doc(db, 'users', this.user.email)
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
      } else {
        // user is in following array, remove them
        following.splice(userIndex, 1)
      }
      await setDoc(docRef, { following: following }, { merge: true })
      this.setUser({ ...this.user, following })
    },
    async changeAvatar(avatarUrl) {
      // update user in firestore
      const db = getFirestore()
      const docRef = doc(db, 'users', this.user.email)
      await setDoc(docRef, { avatarUrl }, { merge: true })
      this.setUser({ ...this.user, avatarUrl })
      // update posts in firestore
      const postsRef = collection(db, 'posts')
      const q = query(postsRef, where('author.handle', '==', this.user.handle))
      const posts = await getDocs(q)
      posts.forEach(async (post) => {
        const postRef = doc(db, 'posts', post.id)
        await setDoc(postRef, { author: { avatarUrl } }, { merge: true })
      })
      // update posts in state
      this.posts = this.posts.map((post) => {
        return {
          ...post,
          id: post.id
        }
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
        .filter((user) => !following.includes(user.handle))

      return suggestedUsers
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
    async fetchPostsByHandle(handle) {
      const db = getFirestore()
      const postsRef = collection(db, 'posts')
      const q = query(postsRef, where('author.handle', '==', handle))
      const posts = await getDocs(q)
      return posts.docs.map((doc) => {
        return { ...doc.data(), id: doc.id }
      })
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
      // update state with new post
      this.posts.push({
        ...newPost,
        id: newPost.id
      })
    },
    async deletePost(id) {
      // delete post from posts collection
      const db = getFirestore()
      const postsRef = collection(db, 'posts')
      await deleteDoc(doc(postsRef, id))
      // update state
      this.posts = this.posts.filter((post) => post.id !== id)
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
    },
    async addComment(postId, comment) {
      // add comment to post in firestore
      const db = getFirestore()
      const postsRef = collection(db, 'posts')
      const docRef = doc(postsRef, postId)
      const docData = await getDoc(docRef)
      const comments = docData.data().comments || []
      comments.push({
        content: comment,
        author: {
          fullName: this.user.fullName,
          handle: this.user.handle,
          avatarUrl: this.user.avatarUrl
        }
      })
      // save changes to firestore
      await setDoc(docRef, { comments }, { merge: true })
      if (this.user.handle !== docData.data().author.handle) {
        // update post in state
        const postIndex = this.posts.findIndex((p) => p.id === postId)
        this.posts[postIndex].comments = comments
      }
    },
    async deleteComment(postId, comment) {
      // TODO
      return
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

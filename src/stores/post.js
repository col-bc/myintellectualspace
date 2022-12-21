import { defineStore } from 'pinia'
import useUserStore from './user'

export const usePostStore = defineStore({
  id: 'post',
  state: () => ({
    posts: []
  }),
  getters: {
    getPosts: (state) => state.posts,
    getPostById: (state) => (id) => state.posts.find((post) => post.id === id)
  },
  actions: {
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
      // remove image from storage
      // check if post has an image
      console.log(data)
      if (!!data.image) {
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
      // update lastActive field in user
      const userRef = doc(db, 'users', this.user.uid)
      await setDoc(userRef, { lastActive: serverTimestamp() }, { merge: true })
      // update state
      this.posts = this.posts.filter((post) => post.id !== data.id)
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
        content: comment,
        author: {
          fullName: this.user.fullName,
          handle: this.user.handle,
          avatarUrl: this.user.avatarUrl
        }
      })
      // save changes to firestore
      await setDoc(docRef, { comments }, { merge: true })
      if (this.user.handle === docData.data().author.handle) {
        // update post in state
        const postIndex = this.posts.findIndex((p) => p.id === postId)
        this.posts[postIndex].comments = comments
        // update lastActive field in user
        const userRef = doc(db, 'users', this.user.uid)
        await setDoc(
          userRef,
          { lastActive: serverTimestamp() },
          { merge: true }
        )
        return comments
      } else {
        // update lastActive field in user
        const userRef = doc(db, 'users', this.user.uid)
        await setDoc(
          userRef,
          { lastActive: serverTimestamp() },
          { merge: true }
        )
        return comments
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
    }
  }
})

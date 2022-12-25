import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
  where
} from '@firebase/firestore'
import { deleteObject, getStorage, ref } from '@firebase/storage'
import { defineStore } from 'pinia'
import { v4 } from 'uuid'
import useUserStore from './user'

const usePostStore = defineStore({
  id: 'post',
  state: () => ({
    posts: []
  }),
  getters: {
    getPosts: (state) => state.posts,
    getPostById: (state) => (id) => state.posts.find((post) => post.id === id)
  },
  actions: {
    async fetchPosts() {
      const user = useUserStore()
      const db = getFirestore()
      const postsRef = collection(db, 'posts')
      if (user.user.handle) {
        // user has not completed onboarding
        this.posts = []
        return
      }
      const q = query(postsRef, where('author.handle', '==', user.user.handle))
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
      const user = useUserStore()
      const db = getFirestore()
      const postsRef = collection(db, 'posts')
      const following = user.user.following || []
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
      const user = useUserStore()
      const newPost = {
        ...filteredData,
        createdAt: serverTimestamp(),
        author: {
          fullName: user.user.fullName,
          handle: user.user.handle,
          avatarUrl: user.user.avatarUrl
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
      const userRef = doc(db, 'users', user.user.uid)
      await setDoc(userRef, { lastActive: serverTimestamp() }, { merge: true })
      return this.posts[this.posts.length - 1]
    },
    async deletePost(data) {
      // delete post from posts collection
      const user = useUserStore()
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
      // update state
      this.posts = this.posts.filter((post) => post.id !== data.id)
      // update lastActive field in user
      const userRef = doc(db, 'users', user.user.uid)
      await setDoc(userRef, { lastActive: serverTimestamp() }, { merge: true })
    },
    async toggleLike(post) {
      // toggle like in firestore
      const user = useUserStore()
      const db = getFirestore()
      const postsRef = collection(db, 'posts')
      const docRef = doc(postsRef, post.id)
      const likes = post.likes || []
      // check if user's handle is in likes array
      const userIndex = likes.findIndex((like) => like === user.user.handle)
      if (userIndex === -1) {
        // user has not liked post, append handle
        likes.push(user.user.handle)
        const uid = await user.getUserUidByHandle(post.author.handle)
        user.createNotification(
          {
            message: `@${user.user.handle} liked your post`,
            created: new Date().toISOString('en-US'),
            read: false,
            type: 'like'
          },
          uid
        )
      } else {
        // user has liked post, remove index of user's handle
        likes.splice(userIndex, 1)
      }
      // save changes to firestore
      await setDoc(docRef, { likes }, { merge: true })
      if (user.user.handle === post.author.handle) {
        // update post in state
        const postIndex = this.posts.findIndex((p) => p.id === post.id)
        this.posts[postIndex].likes = likes
      }
      // update lastActive field in user
      const userRef = doc(db, 'users', user.user.uid)
      await setDoc(userRef, { lastActive: serverTimestamp() }, { merge: true })
      return likes
    },
    async addComment(postId, comment) {
      // add comment to post in firestore
      const user = useUserStore()
      const db = getFirestore()
      const postsRef = collection(db, 'posts')
      const docRef = doc(postsRef, postId)
      const docData = await getDoc(docRef)
      const comments = docData.data().comments || []
      comments.push({
        id: v4(),
        content: comment,
        author: {
          fullName: user.user.fullName,
          handle: user.user.handle,
          avatarUrl: user.user.avatarUrl
        }
      })
      // save changes to firestore
      await setDoc(docRef, { comments }, { merge: true })
      // create notification
      const uid = await user.getUserUidByHandle(docData.data().author.handle)
      user.createNotification(
        {
          message: `@${user.user.handle} commented on one of your post`,
          created: new Date().toISOString('en-US'),
          read: false,
          type: 'comment'
        },
        uid
      )
      // update state if user is author of post
      if (user.user.handle === docData.data().author.handle) {
        // update post in state
        const postIndex = this.posts.findIndex((p) => p.id === postId)
        this.posts[postIndex].comments = comments
      }
      // update lastActive field of user
      const userRef = doc(db, 'users', user.user.uid)
      await setDoc(userRef, { lastActive: serverTimestamp() }, { merge: true })
      return comments
    },
    async deleteComment(postId, commentId) {
      // delete comment from post in firestore
      const user = useUserStore()
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
      if (user.user.handle === docData.data().author.handle) {
        // update post in state
        const postIndex = this.posts.findIndex((p) => p.id === postId)
        this.posts[postIndex].comments = comments
      }
      // update lastActive field for user
      const userRef = doc(db, 'users', user.user.uid)
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
    }
  }
})

export default usePostStore

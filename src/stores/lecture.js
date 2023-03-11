/**
 * Lecture store
 * @file lecture.js
 * @module stores/lecture
 * @author Colby Cooper
 * @copyright 2023
 * @license Apache-2.0
 * @description This store is used to create and manipulate lectures in firestore and storage
 */
import useUserStore from '@/stores/user'
import {
  addDoc,
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
} from 'firebase/firestore'
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes
} from 'firebase/storage'
import { defineStore } from 'pinia'
import { v4 as uuid4 } from 'uuid'

const useLectureStore = defineStore({
  id: 'lecture',
  state: () => ({
    lectures: [],
    lecture: null
  }),
  getters: {
    getLectures: (state) => state.lectures,
    getLecture: (state) => state.lecture
  },
  actions: {
    /**
     * Fetches all lectures from firebase
     * @returns {array} lectures
     */
    async fetchLectures() {
      const db = getFirestore()
      // get all lectures from the lectures collection in firebase
      const querySnapshot = await getDocs(collection(db, 'lectures'))
      const lectures = []
      querySnapshot.forEach((doc) => {
        lectures.push({ id: doc.id, ...doc.data() })
      })
      this.lectures = lectures
      return lectures
    },

    /**
     * Fetches a single lecture from firebase
     * @param {string} id
     * @returns {object} lecture
     */
    async fetchLecture(id) {
      const db = getFirestore()
      const docRef = doc(db, 'lectures', id)
      const docSnap = await getDoc(docRef)
      if (!docSnap.exists()) {
        throw new Error('lecture not found.')
      }
      const lecture = { id: docSnap.id, ...docSnap.data() }
      this.lecture = lecture
      return lecture
    },

    /**
     * Fetches all lectures from firebase that belong to the user with the given handle
     * @param {string} handle
     * @returns {array} lectures
     */
    async fetchLecturesByUserHandle(handle) {
      const db = getFirestore()
      const userCollection = collection(db, 'users')
      const q = query(userCollection, where('handle', '==', handle))
      const querySnapshot = await getDocs(q)
      const user = querySnapshot.docs[0].data()
      const lecturesCollection = collection(db, 'lectures')
      const q2 = query(lecturesCollection, where('author', '==', user.uid))
      const querySnapshot2 = await getDocs(q2)
      const lectures = []
      querySnapshot2.forEach((doc) => {
        lectures.push({ id: doc.id, ...doc.data() })
      })
      this.lectures = lectures
      return lectures
    },

    /**
     * Fetches all lectures from firebase that belong to the current user
     * @returns {array} lectures
     */
    async fetchMyLectures() {
      const userStore = useUserStore()
      const db = getFirestore()
      const lecturesCollection = collection(db, 'lectures')
      const q = query(
        lecturesCollection,
        where('author', '==', userStore.user.uid)
      )
      const querySnapshot = await getDocs(q)
      const lectures = []
      querySnapshot.forEach((doc) => {
        lectures.push({ id: doc.id, ...doc.data() })
      })
      this.lectures = lectures
      return lectures
    },

    /**
     * Uploads a video to firebase storage and returns the download url
     * @param {ile} file
     * @param {string} lectureId
     * @returns {string} downloadUrl
     */
    async uploadLectureVideo(file, lectureId) {
      const userStore = useUserStore()
      const storage = getStorage()
      const storageRef = ref(storage, `lectures/${lectureId}/${uuid4()}.mp4`)
      let downloadUrl
      try {
        console.log('uploading video file: ', file)
        const uploadTask = await uploadBytes(storageRef, file)
        downloadUrl = await getDownloadURL(uploadTask.ref)
        console.log('Success! downloadUrl: ', downloadUrl)
      } catch (error) {
        throw new Error('Error uploading video.', error)
      }
      return downloadUrl
    },

    /**
     *  Uploads a thumbnail to firebase storage and returns the download url
     * @param {file} file
     * @param {string} lectureId
     * @returns {string} downloadUrl
     */
    async uploadThumbnail(file, lectureId) {
      const userStore = useUserStore()
      const storage = getStorage()
      const fileExtension = file.name.split('.').pop()
      const storageRef = ref(
        storage,
        `lectures/${lectureId}/${uuid4()}.${fileExtension}`
      )
      let downloadUrl
      try {
        console.log('uploading thumbnail file: ', file)
        const uploadTask = await uploadBytes(storageRef, file)
        downloadUrl = await getDownloadURL(uploadTask.ref)
        console.log('Success! downloadUrl: ', downloadUrl)
      } catch (error) {
        throw new Error('Error uploading thumbnail.', error)
      }
      return downloadUrl
    },

    /**
     * Creates a new lecture in firebase from the payload
     * Payload should contain the following properties:
     * - title: string
     * - description: string
     * - video: file
     * - thumbnail: file
     * @param {object} payload
     */
    async createLecture(payload) {
      const userStore = useUserStore()
      const db = getFirestore()
      const lectureCollection = collection(db, 'lectures')
      const docRef = await addDoc(lectureCollection, {
        title: payload.title,
        description: payload.description,
        video: '',
        thumbnail: '',
        author: userStore.user.uid,
        tags: payload.tags,
        duration: payload.duration,
        isReel: payload.isReel,
        likes: [],
        comments: [],
        views: 0,
        viewTime: 0,
        createdAt: serverTimestamp()
      })
      const lectureId = docRef.id
      const videoUrl = await this.uploadLectureVideo(
        payload.videoFile,
        lectureId
      )
      const thumbnailUrl = await this.uploadThumbnail(
        payload.thumbnailFile,
        lectureId
      )
      await setDoc(
        docRef,
        {
          video: videoUrl,
          thumbnail: thumbnailUrl
        },
        { merge: true }
      )
      const data = await getDoc(docRef)
      const userLectures = userStore.user.lectures || []
      userLectures.push(lectureId)
      userStore.updateUser({
        lectures: userLectures
      })
      return { id: data.id, ...data.data() }
    },

    /**
     * Toggles the like of a lecture for the current user
     * @param {string} id lecture id
     */
    async toggleLikeLecture(id) {
      const userStore = useUserStore()
      const db = getFirestore()
      const lectureRef = doc(db, 'lectures', id)
      const lectureSnap = await getDoc(lectureRef)
      if (!lectureSnap.exists()) {
        throw new Error('lecture not found.')
      }
      const lecture = { id: lectureSnap.id, ...lectureSnap.data() }
      const likes = lecture.likes || []
      const userIndex = likes.indexOf(userStore.user.uid)
      if (userIndex > -1) {
        likes.splice(userIndex, 1)
      } else {
        likes.push(userStore.user.uid)
      }
      await setDoc(lectureRef, { likes }, { merge: true })
      // create notification
      await userStore.createNotification(
        {
          type: 'like',
          subject: id,
          message: `@${userStore.user.handle} liked your Lecture: ${lecture.title}`
        },
        lecture.author
      )
      // update state
      const lectureIndex = this.lectures.findIndex((l) => l.id === id)
      this.lectures[lectureIndex].likes = likes
      return likes
    },

    /**
     * Increments the views of a lecture by 1
     * @param {string} id lecture id
     */
    async incrementViews(id) {
      const db = getFirestore()
      const lectureRef = doc(db, 'lectures', id)
      const lectureSnap = await getDoc(lectureRef)
      if (!lectureSnap.exists()) {
        throw new Error('lecture not found.')
      }
      const lecture = { id: lectureSnap.id, ...lectureSnap.data() }
      const views = lecture.views || 0
      await setDoc(lectureRef, { views: views + 1 }, { merge: true })
      // update state
      const lectureIndex = this.lectures.findIndex((l) => l.id === id)
      this.lectures[lectureIndex].views = views + 1
    },

    /**
     * Increments the view time of a lecture by the given time
     * @param {number} id the lecture id
     * @param {number} time the time in seconds
     */
    async updateViewTime(id, time) {
      const db = getFirestore()
      const lectureRef = doc(db, 'lectures', id)
      const lectureSnap = await getDoc(lectureRef)
      if (!lectureSnap.exists()) {
        throw new Error('lecture not found.')
      }
      const lecture = { id: lectureSnap.id, ...lectureSnap.data() }
      const viewTime = lecture.viewTime || 0
      await setDoc(lectureRef, { viewTime: viewTime + time }, { merge: true })
      // update state
      const lectureIndex = this.lectures.findIndex((l) => l.id === id)
      this.lectures[lectureIndex].viewTime = viewTime + time
    },

    /**
     * Updates the lecture with the given id
     * @param {string} id lecture id
     * @param {object} lecture lecture object
     * @returns {object} updated lecture object
     */
    async updateLecture(id, lecture) {
      const db = getFirestore()
      const lectureRef = doc(db, 'lectures', id)
      const lectureSnap = await getDoc(lectureRef)
      if (!lectureSnap.exists()) {
        throw new Error('lecture not found.')
      }
      await setDoc(lectureRef, lecture, { merge: true })
      // update state
      const lectureIndex = this.lectures.findIndex((l) => l.id === id)
      this.lectures[lectureIndex] = { id, ...lecture }
      return { id, ...lecture }
    },

    /**
     * Deletes the lecture with the given id
     * @param {string} id lecture id
     */
    async deleteLecture(id) {
      const userStore = useUserStore()
      const storage = getStorage()
      const db = getFirestore()
      const lectureRef = doc(db, 'lectures', id)
      const lectureSnap = await getDoc(lectureRef)
      if (!lectureSnap.exists()) {
        throw new Error('lecture not found.')
      }
      const lecture = { id: lectureSnap.id, ...lectureSnap.data() }
      // delete video and thumbnail
      const videoRef = ref(storage, lecture.video)
      const thumbnailRef = ref(storage, lecture.thumbnail)
      try {
        await deleteObject(videoRef)
        await deleteObject(thumbnailRef)
      } catch (error) {
        console.log('Failed to delete object from storage', error)
      }
      // delete lecture
      await deleteDoc(lectureRef)
      // update user
      const userLectures = userStore.user.lectures || []
      const userLectureIndex = userLectures.indexOf(id)
      if (userLectureIndex > -1) {
        userLectures.splice(userLectureIndex, 1)
      }
      userStore.updateUser({
        lectures: userLectures
      })
      // update state
      const lectureIndex = this.lectures.findIndex((l) => l.id === id)
      this.lectures.splice(lectureIndex, 1)
    },

    /**
     * Creates a comment for the given lecture
     * @param {string} lectureId lecture id
     * @param {object} payload comment payload
     * @returns {object} created comment
     */
    async createComment(lectureId, body) {
      const userStore = useUserStore()
      const db = getFirestore()
      const lectureRef = doc(db, 'lectures', lectureId)
      const lectureSnap = await getDoc(lectureRef)
      if (!lectureSnap.exists()) {
        throw new Error('lecture not found.')
      }
      const lecture = { id: lectureSnap.id, ...lectureSnap.data() }
      const comments = lecture.comments || []
      const comment = {
        id: uuid4(),
        uid: userStore.user.uid,
        avatarUrl: userStore.user.avatarUrl,
        handle: userStore.user.handle,
        text: body,
        created: new Date().toISOString()
      }
      comments.push(comment)
      await setDoc(lectureRef, { comments }, { merge: true })
      // create notification
      if (userStore.user.uid !== lecture.author.uid) {
        await userStore.createNotification(
          {
            type: 'comment',
            subject: lecture.id,
            message: `${userStore.user.handle} commented on your lecture: ${lecture.title}`
          },
          lecture.author.uid
        )
      }
      // update state
      const lectureIndex = this.lectures.findIndex((l) => l.id === lectureId)
      this.lectures[lectureIndex].comments = comments
      return comment
    },

    /**
     * Deletes the comment with the given id
     * @param {string} lectureId lecture id
     * @param {string} commentId comment id
     */
    async deleteComment(lectureId, commentId) {
      const db = getFirestore()
      const lectureRef = doc(db, 'lectures', lectureId)
      const lectureSnap = await getDoc(lectureRef)
      if (!lectureSnap.exists()) {
        throw new Error('lecture not found.')
      }
      const lecture = { id: lectureSnap.id, ...lectureSnap.data() }
      const comments = lecture.comments || []
      const commentIndex = comments.findIndex((c) => c.id === commentId)
      if (commentIndex > -1) {
        comments.splice(commentIndex, 1)
      }
      await setDoc(lectureRef, { comments }, { merge: true })
      // update state
      const lectureIndex = this.lectures.findIndex((l) => l.id === lectureId)
      this.lectures[lectureIndex].comments = comments
    }
  }
})

export default useLectureStore

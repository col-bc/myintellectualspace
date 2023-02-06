import { defineStore } from 'pinia'
import {
  getFirestore,
  doc,
  collection,
  getDoc,
  getDocs,
  setDoc,
  serverTimestamp,
  addDoc,
  deleteDoc
} from 'firebase/firestore'
import useUserStore from './user'

const useJobStore = defineStore({
  id: 'job',
  state: () => ({
    jobs: []
  }),
  actions: {
    async fetchJobs() {
      this.jobs = []
      const db = getFirestore()
      const querySnapshot = await getDocs(collection(db, 'jobs'))
      querySnapshot.forEach((doc) => {
        this.jobs.push({ id: doc.id, ...doc.data() })
      })
      return this.jobs
    },
    async fetchJob(id) {
      const db = getFirestore()
      const docRef = doc(db, 'jobs', id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() }
      }
      return null
    },
    async fetchMyJobs() {
      const user = useUserStore()
      const jobIds = user.user.jobIds || []
      var jobs = []
      for (const jobId of jobIds) {
        const job = await this.fetchJob(jobId)
        jobs.push(job)
      }
      return jobs
    },
    async createJob(payload) {
      // ** strip mode from job data payload
      delete payload.mode
      const user = useUserStore()
      const jobData = {
        ...payload,
        created: serverTimestamp(),
        updated: serverTimestamp(),
        companyProfile: {
          ...user.user.companyProfile
        },
        ownerUid: user.user.uid
      }
      const db = getFirestore()
      const jobsRef = collection(db, 'jobs')
      const docRef = await addDoc(jobsRef, { ...jobData })
      this.jobs.push({ id: docRef.id, ...jobData })
      // update jobIds in user
      user.updateUser({ jobIds: [...user.user.jobIds, docRef.id] })
      return { id: docRef.id, ...jobData }
    },
    async updateJob(id, payload) {
      const db = getFirestore()
      const docRef = doc(db, 'jobs', id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const jobData = {
          ...payload,
          updated: serverTimestamp()
        }
        await setDoc(docRef, jobData, { merge: true })
        const job = { id: docSnap.id, ...docSnap.data() }
        this.jobs = this.jobs.map((j) => (j.id === job.id ? job : j))
        return job
      }
      return null
    },
    async deleteJob(id) {
      const user = useUserStore()
      const db = getFirestore()
      const docRef = doc(db, 'jobs', id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        await deleteDoc(docRef)
        this.jobs = this.jobs.filter((j) => j.id !== id)

        // update user doc
        const userJobs = user.user.jobIds.filter((j) => j.id !== id)
        try {
          await user.updateUser({ jobIds: userJobs })
        } catch (e) {
          throw new Error(e)
        }
        return true
      }
      return false
    },
    async createJobApplication(jobId, payload) {
      const user = useUserStore()
      const jobApplicationData = {
        ...payload,
        ownerUid: user.user.uid,
        status: 'new',
        created: serverTimestamp(),
        updated: serverTimestamp(),
        resume: user.user.resume.url || null
      }
      const db = getFirestore()
      const docRef = await doc(db, 'jobs', jobId, 'applications', user.user.uid)
      const docSnap = await getDoc(docRef)
      if (!docSnap.exists()) {
        await setDoc(docRef, jobApplicationData)
        const userApplications = user.user.jobApplications || []
        await user.updateUser({
          jobApplications: [
            ...userApplications,
            { jobId: jobId, date: new Date().toISOString() }
          ]
        })
        const data = await this.fetchJob(jobId)
        await user.createNotification(
          {
            type: 'job_application',
            message: 'You have a new application to review for ' + data.title
          },
          data.ownerUid
        )
      } else {
        throw new Error('Job application already exists')
      }
    },
    async fetchJobApplications(id) {
      const db = getFirestore()
      const querySnapshot = await getDocs(
        collection(db, 'jobs', id, 'applications')
      )
      const applications = []
      querySnapshot.forEach((doc) => {
        applications.push({ id: doc.id, ...doc.data() })
      })
      return applications
    },
    async fetchJobApplicationCount(id) {
      const db = getFirestore()
      const querySnapshot = await getDocs(
        collection(db, 'jobs', id, 'applications')
      )
      return querySnapshot.size
    },
    async fetchJobApplication(jobId, applicationId) {
      const db = getFirestore()
      const docRef = doc(db, 'jobs', jobId, 'applications', applicationId)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() }
      }
      return null
    }
  }
})

export default useJobStore

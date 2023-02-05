import { defineStore } from 'pinia'
import {
  getFirestore,
  doc,
  collection,
  getDoc,
  getDocs,
  setDoc,
  serverTimestamp
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
      const user = useUserStore().user
      const jobData = {
        ...payload,
        created: serverTimestamp(),
        updated: serverTimestamp(),
        companyProfile: {
          ...user.companyProfile
        }
      }
      console.log(jobData)
      const db = getFirestore()
      const jobsRef = collection(db, 'jobs')
      const docRef = await setDoc(doc(jobsRef), jobData)
      this.jobs.push({ id: docRef.id, ...jobData })
      // update jobIds in user
      user.updateUser({ jobIds: [...user.jobIds, docRef.id] })
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
      const db = getFirestore()
      const docRef = doc(db, 'jobs', id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        await docRef.delete()
        this.jobs = this.jobs.filter((j) => j.id !== id)
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
      console.log(jobApplicationData)
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

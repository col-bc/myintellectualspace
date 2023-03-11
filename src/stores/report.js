import { defineStore } from 'pinia'
import useUserStore from './user'
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  serverTimestamp
} from '@firebase/firestore'

const useReportStore = defineStore({
  id: 'report',
  state: () => ({
    reports: []
  }),
  getters: {
    getReports() {
      return this.reports
    }
  },
  actions: {
    /**
     * Fetch all reports from report collection
     * @returns {array} reportList
     */
    async fetchReports() {
      const db = getFirestore()
      const reportCollection = collection(db, 'reports')
      const reportSnapshot = await getDocs(reportCollection)
      const reportList = []
      reportSnapshot.forEach((doc) => {
        reportList.push({ id: doc.id, ...doc.data() })
      })
      this.reports = reportList
      return reportList
    },

    /**
     * Fetch a single report from report collection
     * @param {string} id
     * @returns {object} report
     */
    async fetchReport(id) {
      const db = getFirestore()
      const reportDoc = doc(db, 'reports', id)
      const reportSnapshot = await getDoc(reportDoc)
      if (reportSnapshot.exists()) {
        return { id: reportSnapshot.id, ...reportSnapshot.data() }
      } else {
        throw new Error('Report does not exist')
      }
    },

    /**
     * Create a new report in report collection
     * @param {string} path - path to the content that is being reported
     * @param {object} payload - report data
     * @returns {object} report
     */
    async createReport(path, payload) {
      const db = getFirestore()
      const reportCollection = collection(db, 'reports')
      const reportDoc = doc(reportCollection)
      const userStore = useUserStore()
      const report = {
        ...payload,
        path: path,
        user: {
          id: userStore.user.id,
          name: userStore.user.fullName,
          email: userStore.user.email
        },
        status: 'pending',
        created: serverTimestamp(),
        updated: serverTimestamp()
      }
      await setDoc(reportDoc, report)
      return report
    },

    /**
     * Update a report in report collection
     * @param {string} id - report id
     * @param {object} payload - report data
     * @returns {object} report
     */
    async updateReport(id, payload) {
      const db = getFirestore()
      const reportDoc = doc(db, 'reports', id)
      const report = {
        ...payload,
        updated: serverTimestamp()
      }
      await updateDoc(reportDoc, report, { merge: true })
      return report
    },
    async deleteReport(id) {}
  }
})

export default useReportStore

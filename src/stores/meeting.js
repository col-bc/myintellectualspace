import { defineStore } from 'pinia'
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore'
import useUserStore from './user'

const useMeetingStore = defineStore({
  id: 'meeting',
  state: () => ({
    meetings: []
  }),
  actions: {
    async fetchMeetings() {
      // fetch from firestore
      const user = useUserStore()
      const db = getFirestore()
      const docRef = doc(db, 'meetings', user.user.uid)
      const docSnap = await getDoc(docRef)
      this.meetings = docSnap.data()
      return this.meetings
    },
    addMeeting(m) {
      // add map to firestore doc
      const user = useUserStore()
      const db = getFirestore()
      const docRef = doc(db, 'meetings', user.user.uid)
      setDoc(docRef, { ...this.meetings, [m.id]: m }, { merge: true })
      this.meetings = { ...this.meetings, [m.id]: m }
      return m
    },
    removeMeeting(id) {
      // remove meeting from state
      const index = this.meetings.findIndex((meet) => meet.id === id)
      this.meetings.splice(index, 1)
      // update firestore dox
      const user = useUserStore()
      const db = getFirestore()
      const docRef = doc(db, 'meetings', user.user.uid)
      setDoc(docRef, { ...this.meetings }, { merge: true })
      return this.meetings
    },
    updateMeeting(m) {
      // update meeting in state
      const index = this.meetings.findIndex((meet) => meet.id === m.id)
      this.meetings[index] = m
      // update firestore doC
      const user = useUserStore()
      const db = getFirestore()
      const docRef = doc(db, 'meetings', user.user.uid)
      setDoc(docRef, { ...this.meetings }, { merge: true })
      return this.meetings
    }
  }
})

export default useMeetingStore

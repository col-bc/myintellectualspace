import { defineStore } from 'pinia'
import useUserStore from './user'
import {
  getFirestore,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  doc,
  setDoc,
  Timestamp
} from 'firebase/firestore'
import { v4 } from 'uuid'

const useMessageStore = defineStore({
  id: 'message',
  state: () => ({
    rooms: []
  }),
  getters: {
    getRoomById: (state) => (roomId) => {
      return state.rooms.find((room) => room.id === roomId)
    },
    getRoomByRecipient: (state) => (recipientId) => {
      return state.rooms.find((room) => room.recipient.uid === recipientId)
    },
    getRoomMessages: (state) => (roomId) => {
      const room = state.rooms.find((room) => room.id === roomId)
      return room ? room.messages : []
    }
  },
  actions: {
    async checkForNewMessages() {
      // check if user is in any new message rooms recipient fields
      const user = useUserStore()
      const db = getFirestore()
      const messageRooms = collection(db, 'messages')
      const q = query(messageRooms, where('recipient', '!=', ''))
      const querySnapshot = await getDocs(q)
      const newRooms = []
      querySnapshot.forEach((doc) => {
        const roomData = doc.data()
        Object.keys(roomData.recipient).forEach((key) => {
          if (key === user.user.uid) {
            // check if room id is already in user doc
            if (user.user.messageRooms?.includes(doc.id)) {
              return
            } else {
              user.user.messageRooms.push(doc.id)
              user.setUser(user.user)
              newRooms.push({ id: doc.id, ...roomData })
              user.createNotification(
                {
                  type: 'message',
                  message: `You have a new message from ${roomData.owner.name}`,
                  link: `/messages/${doc.id}`,
                  created: Timestamp.now()
                },
                user.user.uid
              )
            }
          }
        })
      })
      // add new message rooms to user doc
      const userDoc = doc(db, 'users', user.user.uid)
      const docData = await getDoc(userDoc)
      const messageIds = docData.data().messageRooms || []
      for (const room of newRooms) {
        if (!messageIds.includes(room.id)) {
          messageIds.push(room.id)
        }
      }
      await setDoc(userDoc, { messageRooms: messageIds }, { merge: true })
      return newRooms
    },
    async fetchMessageRooms() {
      // get message rooms array from user doc
      await this.checkForNewMessages()

      const user = useUserStore()
      const db = getFirestore()
      const userDoc = doc(db, 'users', user.user.uid)
      const docSnap = await getDoc(userDoc)
      const roomIds = docSnap.data().messageRooms || []
      // get message room data from firestore
      const messageRooms = []
      for (const roomId of roomIds) {
        const messageDoc = doc(db, 'messages', roomId)
        const docSnap = await getDoc(messageDoc)
        if (docSnap.exists()) {
          messageRooms.push({ id: docSnap.id, ...docSnap.data() })
        }
      }
      this.rooms = messageRooms
      return this.rooms
    },
    async createRoom(roomName, roomRecipient) {
      // create message room in firestore
      const user = useUserStore()
      const db = getFirestore()
      const roomId = v4()
      const messageDoc = doc(db, 'messages', roomId)
      const messageData = {
        name: roomName,
        owner: {
          uid: user.user.uid,
          name: user.user.fullName,
          avatarUrl: user.user.avatarUrl
        },
        recipient: roomRecipient,
        messages: [],
        created: Timestamp.fromDate(new Date()),
        updated: Timestamp.fromDate(new Date())
      }
      await setDoc(messageDoc, messageData, { merge: true })
      // add message room id to user doc
      const userDoc = doc(db, 'users', user.user.uid)
      const docData = await getDoc(userDoc)
      const messageIds = docData.data().messageRooms || []
      messageIds.push(roomId)
      await setDoc(userDoc, { messageRooms: messageIds }, { merge: true })
      // update state
      this.rooms.push({ id: roomId, ...messageData })
      return this.rooms
    },
    async deleteRoom(roomId) {
      // delete message room from firestore
      const db = getFirestore()
      const messageDoc = doc(db, 'messages', roomId)
      const docSnap = await getDoc(messageDoc)
      if (docSnap.exists()) {
        const roomOwner = docSnap.data().owner.uid
        if (roomOwner === user.user.uid) {
          await deleteDoc(messageDoc)
        } else {
          throw new Error('You are not the owner of this room')
        }
      } else {
        throw new Error('Room does not exist')
      }
    },
    async sendMessage(roomId, message) {
      // add message to message room in firestore
      const user = useUserStore()
      const db = getFirestore()
      const messageDoc = doc(db, 'messages', roomId)
      const docSnap = await getDoc(messageDoc)
      if (docSnap.exists()) {
        const roomMessages = docSnap.data().messages || []
        roomMessages.push({
          uid: user.user.uid,
          message,
          created: Timestamp.fromDate(new Date())
        })
        await setDoc(messageDoc, { messages: roomMessages }, { merge: true })
        // update state
        const messageRooms = this.rooms
        const roomIndex = messageRooms.findIndex((room) => room.id === roomId)
        messageRooms[roomIndex].messages = roomMessages
        this.rooms = messageRooms
        return roomMessages
      } else {
        throw new Error('Room does not exist')
      }
    },
    async deleteMessage(roomId, messageId) {
      // delete message from message room in firestore
      const db = getFirestore()
      const messageDoc = doc(db, 'messages', roomId)
      const docSnap = await getDoc(messageDoc)
      if (docSnap.exists()) {
        const roomMessages = docSnap.data().messages || []
        const messageIndex = roomMessages.findIndex(
          (message) => message.id === messageId
        )
        if (roomMessages[messageIndex].user === user.user.uid) {
          roomMessages.splice(messageIndex, 1)
          await setDoc(messageDoc, { messages: roomMessages }, { merge: true })
          // update state
          const messageRooms = this.rooms
          const roomIndex = messageRooms.findIndex((room) => room.id === roomId)
          messageRooms[roomIndex].messages = roomMessages
          this.rooms = messageRooms
        } else {
          throw new Error('You are not the owner of this message')
        }
      } else {
        throw new Error('Room does not exist')
      }
    }
  }
})

export default useMessageStore

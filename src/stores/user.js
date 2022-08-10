import { defineStore } from 'pinia'
import axios from 'axios'

export const useUserStore = defineStore({
  id: 'user',
  persist: true,
  state: () => ({
    token: undefined,
    user: undefined,
  }),
  getters: {
    getBearerToken: (state) =>
      state.token ? `Bearer ${state.token}` : undefined,
    getUser: (state) => state.user,
    getHandle: (state) => state.user ? state.user.handle : undefined,
    getUserId: (state) => (state.user ? state.user.id : undefined),
    isLoggedIn: (state) => !!state.token,
  },
  actions: {
    setToken(token) {
      this.token = token
    },
    async fetchUser() {
      if (this.isLoggedIn) {
        try {
          const response = await axios.get('/api/user/me', {
            headers: { Authorization: this.getBearerToken },
          })
          this.user = response.data
          return this.user
        } catch (exception) {
          if (exception.response.status === 401) {
            this.logout()
          }
          return undefined
        }
      }
    },
    addPost(post) {
      this.user.posts.push(post)
    },
    removePost(id) {
      this.user.posts = this.user.posts.filter((post) => post.id !== id)
    },
    updatePost(id, post) {
      const index = this.user.posts.findIndex((p) => p.id === id)
      this.user.posts[index] = post
    },
    logout() {
      this.token = undefined
      this.user = undefined
    },
  },
})

export default useUserStore

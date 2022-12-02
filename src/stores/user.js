import { defineStore } from 'pinia'

export const useUserStore = defineStore({
  id: 'user',
  persist: true,
  state: () => ({
    token: undefined,
    user: undefined
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    getToken: (state) => (state.token ? state.token : undefined),
    getUser: (state) => state.user
  },
  actions: {
    setToken(token) {
      this.token = token
    },
    setUser(user) {
      this.user = user
    },
    clearUser() {
      this.token = undefined
      this.user = undefined
    }
  }
})

export default useUserStore

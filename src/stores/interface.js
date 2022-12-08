import { defineStore } from 'pinia'

const useInterface = defineStore('interface', {
  state: () => ({
    isDark: false
  }),
  getters: {
    getIsDark: (state) => state.isDark
  },
  actions: {
    toggleTheme() {
      this.isDark = !this.isDark
      document.documentElement.classList.toggle('dark')
      localStorage.setItem('color-theme', this.isDark ? 'dark' : 'light')
    },
    setDarkTheme(state) {
      this.isDark = state
      document.documentElement.classList.toggle('dark', state)
      localStorage.setItem('color-theme', state ? 'dark' : 'light')
    }
  }
})

export default useInterface

import { defineStore } from 'pinia'

const useInterface = defineStore('interface', {
  state: () => ({
    isDark: false,
    viewportWidth: undefined
  }),
  getters: {
    getIsDark: (state) => state.isDark,
    getViewportPrefix: (state) => {
      if (state.viewportWidth < 640) return 'sm'
      if (state.viewportWidth < 768) return 'md'
      if (state.viewportWidth < 1024) return 'lg'
      if (state.viewportWidth < 1280) return 'xl'
      return '2xl'
    }
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
    },
    setViewportWidth(width) {
      this.viewportWidth = width
    }
  }
})

export default useInterface

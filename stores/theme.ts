export const useThemeStore = defineStore('theme', {
  state: () => ({
    followSystem: true, // 是否跟随系统
    theme: 'light', // 主题
  }),
  getters: {
    isDark: state => state.theme === 'dark', // 是否是暗黑模式
  },
  actions: {
    setTheme(theme: 'light' | 'dark' | boolean) {
      this.theme = theme === true ? 'dark' : theme === false ? 'light' : theme
      const colorMode = useColorMode()
      colorMode.preference = this.theme
    },
  },
  persist: {
    storage: piniaPluginPersistedstate.localStorage(),
  },
})

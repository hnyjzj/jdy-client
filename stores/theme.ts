export const useThemeStore = defineStore('theme', {
  state: () => ({
    followSystem: false as boolean, // true 是跟随系统
  }),
  getters: {

  },
  actions: {},
  persist: {
    pick: ['followSystem'],
    storage: piniaPluginPersistedstate.localStorage(),
  },

})

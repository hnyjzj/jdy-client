export const useUser = defineStore('userStore', {
  state: () => ({
    userinfo: {
      Attributes: {
        userID: '',
      },
    },
  }),
  getters: {

  },
  actions: {

  },
  persist: {
    storage: piniaPluginPersistedstate.localStorage(),
  },

})

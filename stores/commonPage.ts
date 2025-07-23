export const usePages = defineStore('Pages', {
  state: () => ({
    searchPage: 1 as number,
    showtype: 'list' as 'list' | 'table',
  }),

})

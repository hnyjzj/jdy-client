export const useSaveOrder = defineStore('saveOrder', {
  state: () => ({
    formSave: {} as Orders,
  }),
  persist: [
    {
      pick: ['formSave'],
      storage: typeof window !== 'undefined' ? localStorage : undefined,
    },
  ],
})

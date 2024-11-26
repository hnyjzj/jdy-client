export const useWorkbenche = defineStore('workbencheStore', {
  state: (): {
    workBenchList: WorkBench[]
  } => ({
    workBenchList: [],
  }),
  getters: {
  },
  actions: {
    async addWorkbench(params: AddWorkbencheReq) {
      try {
        const { data } = await https.post<any, AddWorkbencheReq>('/workbench/add', params)
        if (data.value?.code === HttpCode.SUCCESS) {
          //   window.location.href = data.value.data.redirect_url
        }
        return data.value
      }
      catch (error) {
        console.error('添加失败:', error)
        throw error
      }
    },
    async getWorkbenchList() {
      try {
        const { data } = await https.get<WorkBench[], void>('/workbench/list')
        if (data.value?.code === HttpCode.SUCCESS) {
          this.workBenchList = data.value.data
        }
      }
      catch (error) {
        throw new Error(`获取工作台列表失败: ${error || '未知错误'}`)
      }
    },
  },
})

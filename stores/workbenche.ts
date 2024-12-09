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
        const { data } = await https.post<any, AddWorkbencheReq>('/workbench/add', params, true)
        return data.value
      }
      catch (error) {
        console.error('添加失败:', error)
        throw error
      }
    },
    async getWorkbenchList() {
      try {
        const { data } = await https.get<WorkBench[], null>('/workbench/list', null, true)
        if (data.value?.code === HttpCode.SUCCESS) {
          this.workBenchList = data.value.data
        }
      }
      catch (error) {
        throw new Error(`获取工作台列表失败: ${error || '未知错误'}`)
      }
    },
    async delWorkbench(id: string) {
      try {
        const { data } = await https.delete<any, { id: string }>('/workbench/del', { id }, true)
        return data.value
      }
      catch (error) {
        throw new Error(`删除工作台失败: ${error || '未知错误'}`)
      }
    },
    async updateWorkbench(params: AddWorkbencheReq) {
      try {
        const { data } = await https.put<any, AddWorkbencheReq>('/workbench/update', params, true)
        return data.value
      }
      catch (error) {
        throw new Error(`更新工作台失败: ${error || '未知错误'}`)
      }
    },
    async uploadIcon(req: UploadBencheReq) {
      return await https.upload<uploadFileRes, UploadBencheReq>('/upload/workbench', req)
    },
  },
})

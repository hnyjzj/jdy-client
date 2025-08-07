export const useSystemPrint = defineStore('SystemPrint', {
  state: (): {
    printList: PrintTemplate[]
    PrintTemplate: PrintTemplate
    defaultTemplate?: PrintTemplate
    printListTotal: number
    searchPage: number
  } => ({
    printList: [],
    PrintTemplate: {} as PrintTemplate,
    defaultTemplate: {} as PrintTemplate,
    printListTotal: 0,
    searchPage: 1,
  }),

  actions: {
    /**
     * 获取模板列表
     */
    async getPrintTempList(params: ReqList<PrintTemplate>) {
      if (params.page === 1) {
        this.printList = []
      }
      const { data } = await https.post<ResList<PrintTemplate>, ReqList<PrintTemplate>>('/setting/print/list', params, true, false)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.printListTotal = data.value.data.total
        if (data.value.data.list.length > 0) {
          this.printList = data.value.data.list
          if (this.printList.length === this.printListTotal) {
            return false
          }
          return true
        }
        else {
          return false
        }
      }
    },

    /**
     * 新增模板
     */
    async createPrintTemplate(req: Partial<PrintTemplate>) {
      try {
        const { data } = await https.post<undefined, Partial<PrintTemplate>>('/setting/print/create', req)
        return data.value
      }
      catch (error) {
        throw new Error(`新增打印模板失败: ${error || '未知错误'}`)
      }
    },

    /**
     * 更新模板
     */
    async updatePrintTemplate(req: Partial<PrintTemplate>) {
      try {
        const { data } = await https.put<PrintTemplate, Partial<PrintTemplate>>('/setting/print/update', req)
        return data.value
      }
      catch (error) {
        throw new Error(`更新失败: ${error || '未知错误'}`)
      }
    },

    /**
     * 保存默认模板
     */
    setSelectedTemplate(template: PrintTemplate) {
      this.defaultTemplate = template
    },

    /**
     * 获取模板详情
     */
    async getTempInfo<T extends { id: string, type: number, store_id: string }>(params: T) {
      try {
        const { data } = await https.post<PrintTemplate, T>('/setting/print/info', params)
        if (data.value?.code === HttpCode.SUCCESS) {
          this.PrintTemplate = data.value.data
        }
      }
      catch (error) {
        throw new Error(`获取打印模板失败: ${error || '未知错误'}`)
      }
    },

    /**
     * 删除模板
     */
    async deletePrintTemplate(id: string) {
      try {
        const { data } = await https.delete<undefined, { id: string }>('/setting/print/delete', { id })
        return data.value
      }
      catch (error) {
        throw new Error(`删除打印模板失败: ${error || '未知错误'}`)
      }
    },

    /**
     * 复制模板
     */
    async copyPrintTemplate(params: { id: string, store_id: string, name: string }) {
      try {
        const { data } = await https.put<undefined, { id: string, store_id: string, name: string }>('/setting/print/copy', params)
        return data.value
      }
      catch (error) {
        throw new Error(`复制打印模板失败: ${error || '未知错误'}`)
      }
    },
  },
})

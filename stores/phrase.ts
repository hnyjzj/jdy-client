export const usePhrase = defineStore('Phrase', {
  state: () => ({
    filter: {} as Where<Phrase>,
    List: [] as Phrase[],
    filterListToArray: [] as FilterWhere<Where<Phrase>>[],
    page: 1,
    total: 0,
  }),
  actions: {
    // 获取where 条件
    async getPhraseWhere() {
      const { data } = await https.get<Where<Phrase>>('/setting/remark/where')
      if (data.value?.code === HttpCode.SUCCESS) {
        this.filter = data.value?.data
        this.filterListToArray = sortArr(this.filter)
      }
    },
    // 获取备注列表
    async getPhraseList(params: ReqList<Phrase>) {
      const { data } = await https.post<ResList<Phrase>, ReqList<Phrase>>('/setting/remark/list', params, true, false)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.List = data.value?.data.list
        this.total = data.value?.data.total
        return data.value?.data.list
      }
    },
    // 新增
    async addPhrase(params: Partial<Phrase>) {
      const { data } = await https.post<any, Partial<Phrase>>('/setting/remark/create', params)
      if (data.value?.code === HttpCode.SUCCESS) {
        return true
      }
      else {
        return false
      }
    },
    async deletePhrase(params: { id: string }) {
      const { data } = await https.delete<any, Partial<Phrase>>('/setting/remark/delete', params)
      return data.value
    },
    async updatePhrase(params: Partial<Phrase>) {
      const { data } = await https.put<any, Partial<Phrase>>('/setting/remark/update', params)
      if (data.value?.code === HttpCode.SUCCESS) {
        return true
      }
      else {
        return false
      }
    },
  },
})

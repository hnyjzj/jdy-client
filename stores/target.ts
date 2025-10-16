export const useTarget = defineStore('Target', {
  state: () => ({
    targetFilterList: {} as Where<any>,
    targetFilterListToArray: [] as FilterWhere<any>[],
    groupFilterList: {} as Where<any>,
    groupFilterListToArray: [] as FilterWhere<any>[],
    personalFilterList: {} as Where<any>,
    personalFilterListToArray: [] as FilterWhere<any>[],
  }),
  actions: {
    /** 销售目标筛选条件 */
    async getTargetWhere() {
      const { data } = await https.get<Where<any>, null>('/target/where', null, true, false)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.targetFilterList = data.value.data
        this.targetFilterListToArray = sortArr(data.value.data)
      }
    },
    async getGroupWhere() {
      const { data } = await https.get<Where<any>, null>('/target/where_group', null, true, false)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.groupFilterList = data.value.data
        this.groupFilterListToArray = sortArr(data.value.data)
      }
    },
    async getPersonalWhere() {
      const { data } = await https.get<Where<any>, null>('/target/where_personal', null, true, false)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.personalFilterList = data.value.data
        this.personalFilterListToArray = sortArr(data.value.data)
      }
    },
    async createTarget(params: any) {
      const { data } = await https.post<any, any>('/target/create', params)
      return data.value
    },
  },
})

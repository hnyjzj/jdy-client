export const useTarget = defineStore('Target', {
  state: () => ({
    targetFilterList: {} as Where<Target>,
    targetFilterListToArray: [] as FilterWhere<Target>[],
    groupFilterList: {} as Where<TargetGroup>,
    groupFilterListToArray: [] as FilterWhere<TargetGroup>[],
    personalFilterList: {} as Where<TargetPersonal>,
    personalFilterListToArray: [] as FilterWhere<TargetPersonal>[],
    targetList: [] as Target[],
    targetListTotal: 0,
    targetInfo: {} as TargetInfo,
  }),
  actions: {
    /** 销售目标筛选条件 */
    async getTargetWhere() {
      const { data } = await https.get<Where<Target>, null>('/target/where', null, true, false)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.targetFilterList = data.value.data
        this.targetFilterListToArray = sortArr(data.value.data)
      }
    },
    // 销售目标列表
    async getTargetList(pamars: ReqList<Target>) {
      try {
        pamars = { ...pamars, where: { ...pamars.where, store_id: useStores().myStore.id } }
        const { data } = await https.post<ResList<Target>, ReqList<Target>>('/target/list', pamars)
        if (data.value?.code === HttpCode.SUCCESS) {
          this.targetListTotal = data.value.data.total
          this.targetList = data.value.data.list
        }
        return data.value
      }
      catch (error) {
        throw new Error(`获取货品列表失败: ${error || '未知错误'}`)
      }
    },
    async getGroupWhere() {
      const { data } = await https.get<Where<TargetGroup>, null>('/target/where_group', null, true, false)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.groupFilterList = data.value.data
        this.groupFilterListToArray = sortArr(data.value.data)
      }
    },
    async getPersonalWhere() {
      const { data } = await https.get<Where<TargetPersonal>, null>('/target/where_personal', null, true, false)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.personalFilterList = data.value.data
        this.personalFilterListToArray = sortArr(data.value.data)
      }
    },
    async createTarget(params: any) {
      const { data } = await https.post<any, any>('/target/create', params)
      return data.value
    },
    // 销售目标详情
    async getTargetInfo(id: string) {
      const { data } = await https.post<TargetInfo, { id: string }>('/target/info', { id })
      if (data.value?.code === HttpCode.SUCCESS) {
        this.targetInfo = data.value.data
      }
    },

  },
})

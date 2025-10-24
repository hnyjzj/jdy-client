<script lang="ts" setup>
const { myStore } = storeToRefs(useStores())

const { getTargetWhere, getTargetList } = useTarget()
const { targetFilterListToArray, targetFilterList, targetList, targetListTotal } = storeToRefs(useTarget())
const { searchPage, showtype } = storeToRefs(usePages())

useSeoMeta({
  title: '销售目标管理',
})
const route = useRoute()
const limits = ref(20)
const filterData = ref({} as Partial<ExpandPage<any>>)
const filterRef = ref()
const tableLoading = ref(false)
// 筛选框显示隐藏
const isFilter = ref(false)
/** 打开高级筛选 */
const openFilter = () => {
  isFilter.value = true
}
// 重置高级筛选
const resetWhere = async () => {
  filterData.value = {}
}

/** 跳转并刷新列表 */
const listJump = () => {
  const url = UrlAndParams('/target/list', filterData.value)
  navigateTo(url, { external: true, replace: true, redirectCode: 200 })
}

/** 获取成品列表 */
const getList = async (where = {} as Partial<Target>) => {
  tableLoading.value = true
  const params = { page: searchPage.value, limit: limits.value, where: { store_id: myStore.value.id } } as ReqList<Target>
  if (JSON.stringify(where) !== '{}') {
    params.where = { ...params.where, ...where }
  }

  const res = await getTargetList(params)
  tableLoading.value = false
  return res
}

/** 切换门店 */
function changeMyStore() {
  filterData.value.searchPage = 1
  listJump()
}

/** 提交筛选 */
const submitWhere = async (f: Partial<ExpandPage<Check>>) => {
  filterData.value = {
    ...f,
    searchPage: 1,
    limits: limits.value,
  }
  listJump()
}

/** 读取参数并初始化列表 */
const handleQueryParams = async () => {
  const f = getQueryParams<ExpandPage<Target>>(route.fullPath, targetFilterList.value)
  filterData.value = f
  if (f.searchPage)
    searchPage.value = Number(f.searchPage)
  if (f.showtype) {
    showtype.value = f.showtype
  }
  if (f.limits)
    limits.value = Number(f.limits)
  await getList(filterData.value)
}

if (myStore.value.id || myStore.value.id === '') {
  await getTargetWhere()
  await handleQueryParams()
}
</script>

<template>
  <div>
    <product-filter
      :is-export="true"
      :product-list-total="targetListTotal"
      @filter="openFilter"
    >
      <template #company>
        <product-manage-company @change="changeMyStore" />
      </template>
    </product-filter>
    <product-manage-card :list="targetList">
      <template #top="{ info }">
        <div class="status-title">
          {{ info.name }}
        </div>
      </template>
      <template #info="{ info }">
        <div class="px-[16px] py-[8px] text-size-[14px] line-height-[20px] text-black dark:text-[#FFF]">
          <template v-for="(item, index) in targetFilterListToArray" :key="index">
            <template v-if="item.list">
              <div class="flex py-[4px] justify-between">
                <div class="label">
                  {{ item.label }}
                </div>
                <div class="text-align-end">
                  <template v-if="item.name === 'store_id'">
                    {{ info?.store?.name }}
                  </template>
                  <template v-else>
                    <template v-if="item.input === 'radio'">
                      {{ item.preset[String(info[item.name])] || '' }}
                    </template>
                    <template v-else-if="item.input === 'date' || item.input === 'datetime'">
                      {{ info[item.name] ? formatTimestampToDateTime(String(info[item.name])) : '' }}
                    </template>
                    <template v-else-if="item.input === 'switch'">
                      {{ info[item.name] ? '是' : '否' }}
                    </template>
                    <template v-else>
                      {{ info[item.name] }}
                    </template>
                  </template>
                </div>
              </div>
            </template>
          </template>
          <div class="flex py-[4px] justify-between">
            <div class="label">
              状态
            </div>
            <div class="text-align-end">
              {{ getTimeStatus(formatTimestampToDateTime(info.start_time), formatTimestampToDateTime(info.end_time)) }}
            </div>
          </div>
        </div>
      </template>
      <template #bottom="{ info }">
        <div class="flex-end text-size-[14px]">
          <common-button-irregular text="详情" @click="jump('/target/info', { id: info.id })" />
        </div>
      </template>
    </product-manage-card>
    <common-filter-where
      ref="filterRef"
      v-model:show="isFilter"
      :data="filterData"
      :filter="targetFilterListToArray"
      @submit="submitWhere"
      @reset="resetWhere"
    />
    <common-create @create="jump('/target/add')" />
  </div>
</template>

<style lang="scss" scoped>

</style>

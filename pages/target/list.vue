<script lang="ts" setup>
const { myStore } = storeToRefs(useStores())

const { getTargetWhere, getTargetList, deleteTarget } = useTarget()
const { targetFilterListToArray, targetFilterList, targetList, targetListTotal } = storeToRefs(useTarget())
const { searchPage, showtype } = storeToRefs(usePages())

useSeoMeta({
  title: '销售目标管理',
})
const { $toast } = useNuxtApp()

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

// 重置高级筛选
const resetWhere = async () => {
  filterData.value = {}
  listJump()
}
/** 提交筛选 */
const submitWhere = async (f: Partial<ExpandPage<Target>>) => {
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

function getStatusClass(start_time: string, end_time: string) {
  const status = getTimeStatus(formatTimestampToDateTime(start_time), formatTimestampToDateTime(end_time))
  switch (status) {
    case '进行中':
      return 'running'
    case '已结束':
      return 'cancel'
    default:
      return 'notStarted'
  }
}

if (myStore.value.id || myStore.value.id === '') {
  await getTargetWhere()
  await handleQueryParams()
}

/** 删除销售目标 */
async function delTarget(id: string) {
  const res = await deleteTarget(id)
  if (res?.code === HttpCode.SUCCESS) {
    $toast.success('删除成功')
    setTimeout(() => {
      filterData.value.searchPage = 1
      listJump()
    }, 1000)
  }
  else {
    $toast.error(res?.message ?? '删除失败')
  }
}
</script>

<template>
  <div>
    <product-filter
      :is-export="false"
      :product-list-total="targetListTotal"
      @filter="openFilter"
    >
      <template #company>
        <product-manage-company @change="changeMyStore" />
      </template>
    </product-filter>
    <product-manage-card :list="targetList">
      <template #top="{ info }">
        <div class="w-auto flex justify-between items-center flex-1">
          <div class="status-title">
            编号：{{ info.id }}
          </div>
          <div class="status-text" :class="getStatusClass(info.start_time, info.end_time)">
            {{ getTimeStatus(formatTimestampToDateTime(info.start_time), formatTimestampToDateTime(info.end_time)) }}
          </div>
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
        <div class="flex justify-between items-center">
          <div class="cursor-pointer pl-[16px]" @click="delTarget(info.id)">
            <icon name="i-svg:delete" :size="16" />
          </div>
          <div class="flex-end text-size-[14px]">
            <common-button-irregular text="详情" @click="jump('/target/info', { id: info.id })" />
          </div>
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
    <template v-if="myStore.id">
      <common-create @create="jump('/target/add')" />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.status-text {
  --uno: 'px-2 rounded-[8px] text-#FFF';
}
.notStarted {
  --uno: 'bg-[rgba(221,146,0,1)]';
}
.running {
  --uno: 'bg-#1b6ceb';
}
.cancel {
  --uno: 'bg-[#999]';
}
</style>

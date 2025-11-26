<script lang="ts" setup>
const { myStore } = storeToRefs(useStores())

const { getTargetWhere, getTargetList, deleteTarget } = useTarget()
const { targetFilterListToArray, targetFilterList, targetList, targetListTotal } = storeToRefs(useTarget())
const { searchPage, showtype } = storeToRefs(usePages())
const { userinfo } = storeToRefs(useUser())

useSeoMeta({
  title: '销售目标管理',
})
const { $toast } = useNuxtApp()

const route = useRoute()
const limits = ref(20)
const filterData = ref({} as Partial<ExpandPage<any>>)
const filterRef = ref()
const tableLoading = ref(false)
/** 删除确认框 */
const delDialog = ref(false)
/** 要删除的销售单id */
const comingDelId = ref()
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
async function delTarget() {
  const res = await deleteTarget(comingDelId.value)
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
    <common-layout-center>
      <div class="px-[16px]" uno-lg="grid grid-cols-[1fr_1fr] gap-x-4">
        <template v-for="(info, index) in targetList" :key="index">
          <common-card-list>
            <template #top>
              <div class="w-auto flex justify-between items-center flex-1">
                <div class="status-title">
                  编号：{{ info.id }}
                </div>
              </div>
            </template>
            <template #status>
              <div class="status-text" :class="getStatusClass(info.start_time, info.end_time)">
                {{ getTimeStatus(formatTimestampToDateTime(info.start_time), formatTimestampToDateTime(info.end_time)) }}
              </div>
            </template>
            <template #info>
              <div class="py-[8px] text-size-[14px] line-height-[20px] text-black dark:text-[#FFF]">
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
            <template #footer>
              <div class="flex justify-between items-center">
                <template v-if="userinfo.identity < UserLevel.IdentityShopkeeper">
                  <div />
                </template>
                <template v-else>
                  <div class="cursor-pointer pl-[16px]" @click="delDialog = true;comingDelId = info.id">
                    <icon name="i-svg:delete" :size="16" />
                  </div>
                </template>
                <div class="flex-end text-size-[14px]">
                  <div>
                    <common-button-rounded
                      padding="4px 36px"
                      content="详情" @button-click="jump('/target/info', { id: info.id })"
                    />
                  </div>
                </div>
              </div>
            </template>
          </common-card-list>
        </template>
      </div>
    </common-layout-center>
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
    <common-confirm
      v-model:show="delDialog" icon="error" title="删除提醒" text="确认要删除此销售目标吗?" @submit="() => {
        delTarget()
      }" />
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

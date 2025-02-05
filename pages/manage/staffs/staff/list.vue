<script lang="ts" setup>
import type { SelectOption } from 'naive-ui'

const { staffList, filterListToArray, total, staffInfo } = storeToRefs(useStaff())
const { getStaffWhere, getStaffList, getStaffInfo } = useStaff()
const { staffGetStoreList } = useStores()
const complate = ref(0)
const searchKey = ref('')
const show = ref<boolean>(false)
const showModal = ref<boolean>(false)
// 搜索条件 页码
const searchPage = ref<number>(1)
// 是否有更多数据
const nomore = ref<boolean>(false)
// 筛选请求数据
const filterData = ref({} as StaffWhere)
// 获取列表
const getList = async (where = {} as StaffWhere) => {
  if (nomore.value)
    return
  const params = { page: searchPage.value, limit: 12 } as ReqList<Staff>
  if (JSON.stringify(where) !== '{}') {
    params.where = where
  }
  const res = await getStaffList(params)
  res ? nomore.value = false : nomore.value = true
}

// 筛选列表
const submitWhere = async (f: StaffWhere) => {
  filterData.value = f
  staffList.value = []
  nomore.value = false
  searchPage.value = 1
  await getList(filterData.value)
}
// 获取筛选条件
await getStaffWhere()
// 获取列表数据
await getList()

const heightSearchFn = () => {
  show.value = !show.value
}

// 获取头部高度
const height = ref<number | undefined>(0)
onMounted(() => {
  height.value = getHeight('header')
})

const getInfo = async (val: string) => {
  await getStaffInfo({ id: val })
  showModal.value = true
}
const newAdd = () => {
  navigateTo('/manage/staffs/staff/add')
}

const storeList = ref<SelectOption[]>([])
//
const loading = ref(false)
const getStore = useDebounceFn(async (query) => {
  const res = await staffGetStoreList({ page: 1, limit: 10, where: { name: query } })
  loading.value = false
  if (res.length) {
    storeList.value = res.map(item => ({
      label: item.name,
      value: item.id,
    }))
  }
}, 500)

const handleSearch = (query: string) => {
  loading.value = true
  getStore(query)
}
</script>

<template>
  <div>
    <div id="header">
      <product-filter
        v-model:id="complate" v-model:search="searchKey" :product-list-total="total" @filter="heightSearchFn">
        <template #company>
          <product-manage-company />
        </template>
      </product-filter>
    </div>

    <common-list-pull
      :distance="height"
      :nomore="nomore"
      @pull="() => {
        searchPage += 1
        getList()
      }">
      <staff-manage-card :list="staffList" @get-detail="getInfo" />
    </common-list-pull>
    <n-modal v-model:show="showModal">
      <staff-manage-info :info-detail="staffInfo" />
    </n-modal>
    <common-create @create="newAdd()" />
    <common-filter-where v-model:show="show" :data="filterData" :filter="filterListToArray" @submit="submitWhere">
      <template #store_id>
        <n-select
          v-model:value="filterData.store_id"
          filterable
          placeholder="搜索"
          :options="storeList"
          :loading="loading"
          clearable
          remote
          @search="handleSearch"
        />
      </template>
    </common-filter-where>
  </div>
</template>

<style lang="scss" scoped>

</style>

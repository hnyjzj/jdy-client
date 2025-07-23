<script lang="ts" setup>
import type { SelectOption } from 'naive-ui'
import { NButton } from 'naive-ui'

useSeoMeta({
  title: '员工列表',
})
const { staffList, filterListToArray, total, filterList: staffWhereList, showtype } = storeToRefs(useStaff())
const { searchPage } = storeToRefs(usePages())
const { getStaffWhere, getStaffList } = useStaff()
const { staffGetStoreList } = useStores()
const { userinfo } = storeToRefs(useUser())
const { myStore } = storeToRefs(useStores())
const limits = ref(50)
const tableLoading = ref(false)
const show = ref<boolean>(false)
// 是否有更多数据
const nomore = ref<boolean>(false)
// 筛选请求数据
const filterData = ref({} as StaffWhere)
// 获取列表
const getList = async (where = {} as StaffWhere) => {
  if (nomore.value)
    return
  tableLoading.value = true
  const params = { page: searchPage.value, limit: limits.value, where: { store_id: myStore.value.id } } as ReqList<Staff>
  if (JSON.stringify(where) !== '{}') {
    params.where = { ...params.where, ...where }
  }
  const res = await getStaffList(params)
  tableLoading.value = false
  res ? nomore.value = false : nomore.value = true
}

// 筛选列表
const submitWhere = async (f: StaffWhere) => {
  filterData.value = f
  nomore.value = false
  searchPage.value = 1
  await getList(filterData.value)
  show.value = false
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
const updatePage = async (page: number) => {
  searchPage.value = page
  nomore.value = false
  await getList(filterData.value)
}
const retrieve = async () => {
  searchPage.value = 1
  nomore.value = false
  await getList()
}

const searchKeyFn = async (data: string) => {
  filterData.value = { nickname: data }
  nomore.value = false
  searchPage.value = 1
  await getList(filterData.value)
}

const pageOption = ref({
  page: searchPage,
  pageSize: 50,
  itemCount: total,
  showSizePicker: true,
  pageSizes: [50, 100, 150, 200],
  onUpdatePageSize: (pageSize: number) => {
    pageOption.value.pageSize = pageSize
    limits.value = pageSize
    updatePage(1)
  },
  onChange: (page: number) => {
    updatePage(page)
  },
})

const cols = [
  {
    title: '姓名',
    key: 'nickname',
  },
  { title: '手机号', key: 'phone' },
  { title: '性别', key: 'gender', render: (rowData: Staff) => {
    return staffWhereList.value.gender?.preset[rowData.gender as number] || '--'
  } },
  { title: '身份', key: 'gender', render: (rowData: Staff) => {
    return staffWhereList.value.identity?.preset[rowData.identity as number] || '--'
  } },
  { title: '用户名', key: 'username' },
  { title: '最后登录时间', key: '', render: (rowData: Staff) => {
    return formatISODate(rowData.last_login_at!)
  } },
  { title: '所属门店', key: '', render: (rowData: Staff) => {
    return rowData.stores?.length ? `${rowData.stores[0].name}${rowData.stores.length - 1 > 0 ? `+${rowData.stores.length - 1}` : ''}` : '--'
  } },
  { title: '负责门店', key: '', render: (rowData: Staff) => {
    return rowData.store_superiors?.length ? `${rowData.store_superiors[0].name}${rowData.store_superiors.length - 1 > 0 ? `+${rowData.store_superiors.length - 1}` : ''}` : '--'
  } },
  { title: '所属区域', key: '', render: (rowData: Staff) => {
    return rowData.regions?.length ? `${rowData.regions[0].name}${rowData.regions.length - 1 > 0 ? `+${rowData.regions.length - 1}` : ''}` : '--'
  } },
  { title: '负责门店', key: '', render: (rowData: Staff) => {
    return rowData.region_superiors?.length ? `${rowData.region_superiors[0].name}${rowData.region_superiors.length - 1 > 0 ? `+${rowData.region_superiors.length - 1}` : ''}` : '--'
  } },

  {
    title: '操作',
    key: 'action',
    render: (rowData: Staff) => {
      return h(
        NButton,
        {
          type: 'info',
          size: 'small',
          onClick: () => {
            if (!rowData.id)
              return
            navigateTo(`/manage/staffs/staff/info?id=${rowData.id}`)
          },
        },
        { default: () => '查看详情' },
      )
    },
  },
]
</script>

<template>
  <div>
    <div class="grid-12 sticky top-0 bg-gradient-linear-[180deg,#3875C5,#467EC9]  z-1">
      <div id="header" class="px-[16px] py-[12px] w-full   col-12" uno-lg="col-8 offset-2">
        <div class="flex flex-row gap-2">
          <product-manage-company class="color-[#fff]" @change="retrieve" />
          <product-filter-search
            placeholder="搜索员工" class="color-[#fff] flex-1" @submit="searchKeyFn" @clear="retrieve" />
        </div>
        <common-tool-list v-model="showtype" :total="total" @height="heightSearchFn" />
      </div>
    </div>

    <template v-if="showtype === 'list'">
      <div class="grid-12">
        <div class="flex flex-col  col-12" uno-lg="col-8 offset-2" uno-sm="col-12">
          <div class="p-[16px]">
            <template v-if="staffList.length">
              <staff-manage-card :list="staffList" :myidentity="userinfo.identity" :filter-data="staffWhereList" />
              <common-page
                v-model:page="searchPage" :total="total" :limit="limits" @update:page="updatePage" />
            </template>
            <template v-else>
              <common-emptys text="暂无数据" />
            </template>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <common-datatable :columns="cols" :list="staffList" :page-option="pageOption" :loading="tableLoading" />
    </template>
    <common-create @create="newAdd()" />
    <common-filter-where
      v-model:show="show" :data="filterData" :filter="filterListToArray" @submit="submitWhere" @reset="() => {
        filterData.store_id = undefined
      }">
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
          @focus="focus"
        />
      </template>
    </common-filter-where>
  </div>
</template>

<style lang="scss" scoped>

</style>

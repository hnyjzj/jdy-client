<script lang="ts" setup>
import { NButton } from 'naive-ui'

useSeoMeta({
  title: '员工列表',
})
const { staffList, filterListToArray, total, filterList, showtype } = storeToRefs(useStaff())
const { searchPage } = storeToRefs(usePages())
const { getStaffWhere, getStaffList } = useStaff()
const { userinfo } = storeToRefs(useUser())
const { myStore } = storeToRefs(useStores())
const limits = ref(50)
const tableLoading = ref(false)
const show = ref<boolean>(false)

// 筛选请求数据
const filterData = ref({} as StaffWhere)
// 获取列表
const getList = async (where = {} as StaffWhere) => {
  tableLoading.value = true
  const params = { page: searchPage.value, limit: limits.value, where: { store_id: myStore.value.id } } as ReqList<Staff>
  if (JSON.stringify(where) !== '{}') {
    params.where = { ...params.where, ...where }
  }
  await getStaffList(params)
  tableLoading.value = false
}

// 获取筛选条件
await getStaffWhere()
const searchKey = ref('')
const route = useRoute()
// 获取where 条件

// 读取url参数,获取列表
const handleQueryParams = async () => {
  filterData.value = {}
  const f = getQueryParams<StaffWhere>(route.fullPath, filterList.value)
  filterData.value = f

  if (filterData.value.nickname) {
    searchKey.value = filterData.value.nickname
  }
  if (f.showtype) {
    showtype.value = f.showtype
  }
  if (f.searchPage) {
    searchPage.value = Number(f.searchPage)
  }
  if (f.limits) {
    limits.value = Number(f.limits)
  }

  await getList(filterData.value as StaffWhere)
}
await handleQueryParams()
const listJump = () => {
  const url = UrlAndParams('/manage/staffs/staff/list', filterData.value)
  navigateTo(url, { external: true, replace: true, redirectCode: 200 })
}
// 筛选列表
const submitWhere = async (f: StaffWhere) => {
  filterData.value = { ...f, showtype: showtype.value, searchPage: 1, limits: limits.value }
  listJump()
}

// 重置高级筛选
const resetWhere = async () => {
  filterData.value = {}
  listJump()
}
const heightSearchFn = () => {
  show.value = !show.value
}

const newAdd = () => {
  navigateTo('/manage/staffs/staff/add')
}

const updatePage = async (page: number) => {
  filterData.value.searchPage = page
  filterData.value.limits = limits.value
  listJump()
}
const clearFn = async () => {
  delete filterData.value.nickname
  filterData.value.searchPage = 1
  listJump()
}
// 切换卡片
const changeCard = () => {
  filterData.value.showtype = showtype.value
  filterData.value.searchPage = searchPage.value
  filterData.value.limits = limits.value
  listJump()
}
const searchKeyFn = async (data: string) => {
  filterData.value.nickname = data
  filterData.value.searchPage = 1
  listJump()
}

const changeStores = async () => {
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
  { title: '手机号', key: 'phone', width: 150 },
  { title: '身份', render: (rowData: Staff) => {
    return filterList.value.identity?.preset[rowData.identity as number] || '--'
  } },
  {
    title: '状态',
    render: (rowData: Staff) => {
      return rowData.is_disabled ? '禁用' : '启用'
    },
  },

  { title: '性别', key: 'gender', render: (rowData: Staff) => {
    return filterList.value.gender?.preset[rowData.gender as number] || '--'
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
    <product-filter
      v-model:search-key="searchKey"
      v-model:showtype="showtype"
      :product-list-total="total"
      placeholder="搜索员工姓名" @change-card="changeCard" @filter="heightSearchFn" @search="searchKeyFn" @clear-search="clearFn">
      <template #company>
        <product-manage-company @change="changeStores" />
      </template>
    </product-filter>
    <template v-if="showtype === 'list'">
      <common-layout-center>
        <div class="p-[16px]">
          <template v-if="staffList.length">
            <staff-manage-card :list="staffList" :myidentity="userinfo.identity" :filter-data="filterList" />
            <common-page
              v-model:page="searchPage" :total="total" :limit="limits" @update:page="updatePage" />
          </template>
          <template v-else>
            <common-emptys text="暂无数据" />
          </template>
        </div>
      </common-layout-center>
    </template>
    <template v-else>
      <common-datatable :columns="cols" :list="staffList" :page-option="pageOption" :loading="tableLoading" />
    </template>
    <common-create @create="newAdd()" />
    <common-filter-where
      v-model:show="show" :data="filterData" :filter="filterListToArray" @submit="submitWhere" @reset="resetWhere" />
  </div>
</template>

<style lang="scss" scoped>

</style>

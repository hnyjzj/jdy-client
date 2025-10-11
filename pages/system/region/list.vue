<script setup lang="ts">
import { NButton } from 'naive-ui'

useSeoMeta({
  title: '区域',
})
const { regionList, addorUpdateForm, filterListToArray, total, showtype, filterList } = storeToRefs(useRegion())
const { searchPage } = storeToRefs(usePages())
const { reastAddForm, createRegion, getRegionList, deleteRegion, getRegionWhere } = useRegion()
const { $toast } = useNuxtApp()
// 新增门店弹窗
const addOrUpdateShow = ref<boolean>(false)
// 搜索弹窗显示状态
const show = ref<boolean>(false)
const limits = ref<number>(50)
// 筛选请求数据
const filterData = ref({} as RegionWhere)
const tableLoading = ref<boolean>(false)
// 获取列表
const getList = async (where = {} as RegionWhere) => {
  tableLoading.value = true
  const params = { page: searchPage.value, limit: limits.value } as ReqList<Region>
  if (JSON.stringify(where) !== '{}') {
    params.where = where
  }
  await getRegionList(params)
  tableLoading.value = false
}

// 获取筛选条件
await getRegionWhere()
const route = useRoute()
// 读取url参数,获取列表
const handleQueryParams = async () => {
  filterData.value = {}
  const f = getQueryParams<RegionWhere>(route.fullPath, filterList.value)
  filterData.value = f

  if (f.showtype) {
    showtype.value = f.showtype
  }
  if (f.searchPage) {
    searchPage.value = Number(f.searchPage)
  }
  if (f.limits) {
    limits.value = Number(f.limits)
  }

  await getList(filterData.value as RegionWhere)
}
await handleQueryParams()
const listJump = () => {
  const url = UrlAndParams('/system/region/list', filterData.value)
  navigateTo(url, { external: true, replace: true, redirectCode: 200 })
}
// 筛选列表
const submitWhere = async (f: RegionWhere) => {
  filterData.value = { ...f, searchPage: 1, showtype: showtype.value, limits: limits.value }
  listJump()
}

const resetwhere = async () => {
  filterData.value = {}
  listJump()
}

const updatePage = async (page: number) => {
  filterData.value.searchPage = page
  filterData.value.limits = limits.value
  listJump()
}

// 展示详情
const getStoreInfo = async (id: string) => {
  navigateTo(`/system/region/info?id=${id}`)
}

// 开发新增门店弹窗, 清空表单数据
const newAdd = () => {
  reastAddForm()
  addOrUpdateShow.value = true
}

const newRegion = async () => {
  const res = await createRegion(addorUpdateForm.value)
  if (res?.code === HttpCode.SUCCESS) {
    $toast.success('创建区域成功')
    listJump()
  }
  else {
    $toast.error(res?.message ?? '创建区域失败')
  }
}

// 当前要删除的id
const nowDeleteId = ref<string>('')
// 删除门店对话框
const deleteDialog = ref(false)
// 打开确认删除弹窗
const deleteStoreFn = async (val: string) => {
  nowDeleteId.value = val
  deleteDialog.value = true
}
// 确认删除
const confirmDelete = async () => {
  const res = await deleteRegion(nowDeleteId.value)
  if (res?.code === HttpCode.SUCCESS) {
    $toast.success('删除成功')
    listJump()
  }
  else {
    $toast.error(res?.message ?? '删除失败')
  }
}

// 修改门店编辑按钮
const edit = (val: string) => {
  addOrUpdateShow.value = true
  // 找到匹配的商店信息
  const region = regionList.value.find(item => item.id === val)
  if (!region) {
    return
  }
  // 解构赋值，简化代码
  const { name, id, address, sort, province, city, district } = region
  // 一次性更新表单数据
  Object.assign(addorUpdateForm.value, { name, id, address, sort, province, city, district })
}

// 高级搜索按钮
const heightSearchFn = () => {
  show.value = true
}

const pageOption = ref({
  page: searchPage,
  pageSize: limits,
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
  { title: '区域名称', key: 'name' },
  { title: '门店', render: (rowData: Region) => {
    return rowData.stores?.length ? `${rowData.stores[0].name}${rowData.stores.length - 1 > 0 ? `+${rowData.stores.length - 1}` : ''}` : '--'
  } },
  { title: '员工', render: (rowData: Region) => {
    return rowData.staffs?.length ? `${rowData.staffs[0].nickname}${rowData.staffs.length - 1 > 0 ? `+${rowData.staffs.length - 1}` : ''}` : '--'
  } },
  { title: '负责人', render: (rowData: Region) => {
    return rowData.superiors?.length ? `${rowData.superiors[0].nickname}${rowData.superiors.length - 1 > 0 ? `+${rowData.superiors.length - 1}` : ''}` : '--'
  } },
  { title: '管理员', render: (rowData: Region) => {
    return rowData.admins?.length ? `${rowData.admins[0].nickname}${rowData.admins.length - 1 > 0 ? `+${rowData.admins.length - 1}` : ''}` : '--'
  } },
  {
    title: '操作',
    key: 'action',
    width: 250,
    render: (rowData: Region) => {
      return [h(
        NButton,
        {
          type: 'primary',
          size: 'small',
          class: 'mr-[4px]',
          onClick: () => {
            getStoreInfo(rowData.id)
          },
        },
        { default: () => '查看详情' },
      ), h(
        NButton,
        {
          type: 'info',
          size: 'small',
          class: 'mr-[4px]',
          onClick: () => {
            edit(rowData.id)
          },
        },
        { default: () => '编辑' },
      ), h(
        NButton,
        {
          type: 'error',
          size: 'small',
          onClick: () => {
            deleteStoreFn(rowData.id)
          },
        },
        { default: () => '删除' },
      )]
    },
  },
]
</script>

<template>
  <div>
    <product-filter
      v-model:showtype="showtype" :product-list-total="total" placeholder="搜索条码" :show-input="false" @filter="heightSearchFn()" />

    <template v-if="showtype === 'list'">
      <common-layout-center>
        <div class="p-[16px]">
          <region-card @get-detail="getStoreInfo" @edit-region="edit" @delete-region="deleteStoreFn" />
          <common-page v-model:page="searchPage" :total="total" :limit="limits" @update:page="updatePage" />
        </div>
      </common-layout-center>
    </template>
    <template v-else>
      <common-datatable :columns="cols" :list="regionList" :page-option="pageOption" :loading="tableLoading" />
    </template>

    <!-- 新增或更新门店弹窗 -->
    <common-model v-model="addOrUpdateShow" :show-cancel="false" title="新增区域">
      <region-add-update
        @submit="newRegion"
      />
    </common-model>
    <common-confirm v-model:show="deleteDialog" text="确认删除此区域吗?" @submit="confirmDelete" />
    <common-create @create="newAdd()" />
    <common-filter-where v-model:show="show" :data="filterData" :filter="filterListToArray" @submit="submitWhere" @reset="resetwhere" />
  </div>
</template>

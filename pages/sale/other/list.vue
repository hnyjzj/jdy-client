<script setup lang="ts">
import { NButton } from 'naive-ui'

useSeoMeta({
  title: '其他收支单列表',
})
const { $toast } = useNuxtApp()
const { myStore } = storeToRefs(useStores())
const { getOtherOrderList, otherOrderWhere, delOtherOrder } = useOtherOrder()
const { total, orderList, filterList, filterListToArray, showtype } = storeToRefs(useOtherOrder())
const { searchPage } = storeToRefs(usePages())
const filterShow = ref(false)
const filterData = ref({} as Partial<otherOrderWhere>)
await otherOrderWhere()
// 获取列表
const limits = ref(12)
const getList = async (where = {} as Partial<otherOrderInfo>) => {
  const params = { page: searchPage.value, limit: limits.value, where: { store_id: myStore.value.id } } as ReqList<otherOrderInfo>
  if (JSON.stringify(where) !== '{}') {
    params.where = { ...params.where, ...where }
  }
  await getOtherOrderList(params)
}
await getList()
const searchOrder = async (id: string) => {
  filterData.value = { id, store_id: myStore.value.id }
  searchPage.value = 1
  await getList(filterData.value)
}
const clearFn = async () => {
  filterData.value = {}
  orderList.value = []
  searchPage.value = 1
  await getList()
}
const handleClick = () => {}
const updatePage = async (page: number) => {
  searchPage.value = page
  await getList(filterData.value as otherOrderWhere)
}
// 打开高级筛选
const openFilter = () => {
  filterShow.value = true
}

const submitWhere = async (f: otherOrderWhere) => {
  filterData.value = { ...filterData.value, ...f }
  orderList.value = []
  searchPage.value = 1
  await getList(filterData.value as otherOrderWhere)
  filterShow.value = false
}
const resetWhere = async () => {
  filterData.value = {}
}
const delDialog = ref(false)
const delId = ref('')
const delOrder = async (id: string) => {
  delId.value = id
  delDialog.value = true
}

const confirmDel = async () => {
  const res = await delOtherOrder({ id: delId.value })
  if (res) {
    $toast.success('删除成功')
    await getList()
  }
  else {
    $toast.error('删除失败')
  }
}
const changeStores = async () => {
  await getList()
}
const router = useRouter()
const newAdd = async () => {
  await router.push('/sale/other/add')
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
    title: '所属门店',
    key: 'store.name',
  },
  { title: '会员', key: 'member.name' },
  { title: '主销', key: 'clerk.nickname' },
  {
    title: '收支类型',
    key: 'member.nickname',
    render: (rowData: otherOrderInfo) => {
      return filterList.value.type?.preset[rowData.type]
    },
  },
  {
    title: '收支内容',
    key: 'content',
  },
  {
    title: '收支来源',
    key: 'name',
    render: (rowData: otherOrderInfo) => {
      return filterList.value.source?.preset[rowData.source]
    },
  },
  {
    title: '收支金额',
    key: 'amount',

  },
  {
    title: '关联销售单',
    key: 'order_id',
  },
  {
    title: '操作',
    key: 'action',
    render: (rowData: otherOrderInfo) => {
      return h(
        NButton,
        {
          type: 'info',
          size: 'small',
          onClick: () => {
            if (!rowData.id)
              return
            navigateTo(`/sale/other/add?id=${rowData.id}`)
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
          <product-manage-company class="color-[#fff]" @change="changeStores" />
          <product-filter-search
            placeholder="搜索订单号" class="color-[#fff] flex-1" @submit="searchOrder" @clear="clearFn()" />
        </div>
        <common-tool-list v-model="showtype" :total="total" @height="openFilter" />
      </div>
    </div>
    <template v-if="showtype === 'list'">
      <div class="grid-12">
        <div class="flex flex-col  col-12" uno-lg="col-8 offset-2" uno-sm="col-12">
          <div class="p-[16px]">
            <template v-if="orderList.length">
              <sale-other-list :info="orderList" :del="delOrder" :where="filterList" @user-click="handleClick" />
              <common-page v-model:page="searchPage" :total="total" :limit="limits" @update:page="updatePage" />
            </template>
            <template v-else>
              <common-emptys text="暂无数据" />
            </template>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <common-datatable :columns="cols" :list="orderList" :page-option="pageOption" />
    </template>

    <common-create @create="newAdd()" />
    <common-confirm v-model:show="delDialog" icon="error" title="删除提醒" text="确认删除此收支单吗?" @submit="confirmDel" />
    <common-filter-where v-model:show="filterShow" :data="filterData" :filter="filterListToArray" @submit="submitWhere" @reset="resetWhere" />
  </div>
</template>

<style lang="scss" scoped>

</style>

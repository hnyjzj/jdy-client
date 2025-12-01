<script setup lang="ts">
// 销售明细列表
import { NButton } from 'naive-ui'

useSeoMeta({
  title: '销售明细',
})
const { myStore } = storeToRefs(useStores())
// 获取销售明细列表
const { getStatementList, getStatementWhere, getStatementListAll } = useStatement()
const { statementList, total, filterListToArray, filterList, showtype } = storeToRefs(useStatement())
const { searchPage } = storeToRefs(usePages())
const { getFinishedWhere } = useFinished()
const { finishedFilterListToArray, finishedFilterList } = storeToRefs(useFinished())
const { getSaleWhere } = useOrder()
const { filterListToArray: salesFilterListToArray } = storeToRefs(useOrder())
const { getOldWhere } = useOld()
const { oldFilterListToArray, oldFilterList } = storeToRefs(useOld())
const { getAccessorieWhere } = useAccessorie()
const { accessorieFilterListToArray } = storeToRefs(useAccessorie())
const filterData = ref({} as Partial<StatementWhere>)
const filterShow = ref(false)
const limits = ref(50)
const tableLoading = ref(false)

await getFinishedWhere()
await getOldWhere()
await getSaleWhere()
await getAccessorieWhere()
// 获取列表
const getList = async (where = {} as Partial<StatementWhere>) => {
  tableLoading.value = true
  const params = { page: searchPage.value, limit: limits.value, where: { store_id: myStore.value.id } } as ReqList<orderInfoProducts>
  if (JSON.stringify(where) !== '{}') {
    params.where = { ...params.where, ...where }
  }
  await getStatementList(params)
  tableLoading.value = false
}
// 打开高级筛选
const openFilter = () => {
  // 打开筛选
  filterShow.value = true
}
const listJump = () => {
  const url = UrlAndParams('/sale/sales/statement', filterData.value)
  navigateTo(url, { external: true, replace: true, redirectCode: 200 })
}
const searchKey = ref('')
const route = useRoute()
// 获取where 条件
await getStatementWhere()
// 读取url参数,获取列表
const handleQueryParams = async () => {
  filterData.value = {}
  const f = getQueryParams<StatementWhere>(route.fullPath, filterList.value)
  filterData.value = f
  if (filterData.value.code) {
    searchKey.value = filterData.value.code
  }
  if (f.showtype) {
    showtype.value = f.showtype
  }
  if (f.searchPage) {
    searchPage.value = Number(f.searchPage) || 1
  }
  if (f.limits) {
    limits.value = Number(f.limits) || 50
  }

  await getList(filterData.value as Partial<StatementWhere>)
}
// 默认请求列表
await handleQueryParams()

const submitWhere = async (f: StatementWhere) => {
  filterData.value = { ...f, showtype: showtype.value, searchPage: 1, limits: limits.value }
  listJump()
}
const resetWhere = async () => {
  filterData.value = {}
  listJump()
}
// 切换卡片
const changeCard = () => {
  filterData.value.showtype = showtype.value
  filterData.value.searchPage = searchPage.value
  filterData.value.limits = limits.value
  listJump()
}

const searchOrder = async (code: string) => {
  filterData.value.code = code
  filterData.value.searchPage = 1
  listJump()
}

const clearFn = async () => {
  delete filterData.value.code
  searchKey.value = ''
  filterData.value.searchPage = 1
  listJump()
}
const updatePage = async (page: number) => {
  filterData.value.searchPage = page
  filterData.value.limits = limits.value
  listJump()
}

const changeStores = async () => {
  filterData.value.searchPage = 1
  listJump()
}

const pageOption = ref({
  page: searchPage,
  pageSize: limits,
  itemCount: total,
  showSizePicker: true,
  pageSizes: [50, 100, 150, 200],
  onUpdatePageSize: (pageSize: number) => {
    limits.value = pageSize
    updatePage(1)
  },
  onChange: (page: number) => {
    updatePage(page)
  },
})

const cols = [
  { title: '订单编号', key: 'id' },
  { title: '订单状态', render: (rowData: orderInfoProducts) => {
    return filterList.value.status?.preset[rowData.status] || '--'
  } },
  { title: '开单时间', render: (rowData: orderInfoProducts) => {
    return formatTimestampToDateTime(rowData?.order?.created_at) || '--'
  } },
  { title: '关联销售单', key: 'order_id' },
  {
    title: '所属门店',
    key: 'store.name',
  },
  { title: '会员名称', render: (rowData: orderInfoProducts) => {
    return rowData.member?.name || '--'
  } },
  { title: '会员手机', render: (rowData: orderInfoProducts) => {
    return rowData.member?.phone || '--'
  } },
  { title: '主销导购', render: (rowData: orderInfoProducts) => {
    return rowData.order?.clerks[0].salesman?.nickname || '--'
  } },

  {
    title: '产品类型',
    render: (rowData: orderInfoProducts) => {
      return returnType(rowData?.type) || '--'
    },
  },
  {
    title: '产品名称',
    render: (rowData: orderInfoProducts) => {
      if (rowData.type === GoodsType.ProductFinish) {
        return rowData.finished.product?.name || '--'
      }
      if (rowData.type === GoodsType.ProductOld) {
        return rowData.old?.product?.name || '--'
      }
      if (rowData.type === GoodsType.ProductAccessories) {
        return rowData.accessorie?.product?.name || '--'
      }
      return '--'
    },
  },
  { title: '成品条码', render: (rowData: orderInfoProducts) => {
    if (rowData.type === GoodsType.ProductFinish) {
      return rowData.finished.product?.code || '--'
    }
    if (rowData.type === GoodsType.ProductOld) {
      return rowData.old.product?.code_finished || '--'
    }
    return '--'
  } },
  { title: '旧料编号', render: (rowData: orderInfoProducts) => {
    if (rowData.type === GoodsType.ProductOld) {
      return rowData.old?.product?.code || '--'
    }
    return '--'
  } },
  { title: '所属大类', render: (rowData: orderInfoProducts) => {
    if (rowData.type === GoodsType.ProductOld) {
      return oldFilterList.value.class?.preset[rowData.old?.product?.class] || '--'
    }
    if (rowData.type === GoodsType.ProductFinish) {
      return finishedFilterList.value.class?.preset[rowData.finished?.product?.class] || '--'
    }
    return '--'
  } },
  { title: '回收类型', render: (rowData: orderInfoProducts) => {
    if (rowData.type === GoodsType.ProductOld) {
      return oldFilterList.value.recycle_type?.preset[rowData.old?.product?.recycle_type] || '--'
    }
    return '--'
  } },
  {
    title: '零售方式',
    render: (rowData: orderInfoProducts) => {
      if (rowData.type === GoodsType.ProductFinish) {
        return realtype(rowData.finished.product?.retail_type) || '--'
      }
      return '--'
    },
  },
  {
    title: '金重',
    render: (rowData: orderInfoProducts) => {
      if (rowData.type === GoodsType.ProductFinish) {
        return rowData.finished.product?.weight_metal || '--'
      }
      if (rowData.type === GoodsType.ProductOld) {
        return rowData.old?.product?.weight_metal || '--'
      }
      return '--'
    },
  },
  {
    title: '金价',
    render: (rowData: orderInfoProducts) => {
      if (rowData.type === GoodsType.ProductFinish) {
        return rowData.finished?.price_gold || '--'
      }
      return '--'
    },
  },
  {
    title: '回收金价',
    render: (rowData: orderInfoProducts) => {
      if (rowData.type === GoodsType.ProductOld) {
        return rowData.old?.product?.recycle_price_gold || '--'
      }
      return '--'
    },
  },
  {
    title: '标签价',
    render: (rowData: orderInfoProducts) => {
      if (rowData.type === GoodsType.ProductFinish) {
        return rowData.finished.product?.label_price || '--'
      }
      if (rowData.type === GoodsType.ProductOld) {
        return rowData.old?.product?.label_price || '--'
      }
      if (rowData.type === GoodsType.ProductAccessories) {
        return rowData.accessorie?.product?.price || '--'
      }
      return '--'
    },
  },
  { title: '配件数量', render: (rowData: orderInfoProducts) => {
    if (rowData.type === GoodsType.ProductAccessories) {
      return rowData.accessorie?.quantity || '--'
    }
    return '--'
  } },
  {
    title: '原价',
    render: (rowData: orderInfoProducts) => {
      if (rowData.type === GoodsType.ProductFinish) {
        return rowData.finished?.price_original || '--'
      }
      if (rowData.type === GoodsType.ProductAccessories) {
        return rowData.accessorie?.price_original || '--'
      }
      return '--'
    },
  },
  {
    title: '应付金额',
    render: (rowData: orderInfoProducts) => {
      if (rowData.type === GoodsType.ProductFinish) {
        return rowData.finished?.price || '--'
      }
      if (rowData.type === GoodsType.ProductAccessories) {
        return rowData.accessorie?.price || '--'
      }
      return '--'
    },
  },
  {
    title: '旧料抵扣',
    render: (rowData: orderInfoProducts) => {
      if (rowData.type === GoodsType.ProductOld) {
        return rowData.old?.recycle_price || '--'
      }
      return '--'
    },
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    render: (rowData: orderInfoProducts) => {
      return h(
        'span',
        {
          style: {
            color: '#0D6CE4',
            cursor: 'pointer',
            fontWeight: 'bold',
          },
          type: 'info',
          size: 'small',
          onClick: () => {
            if (!rowData.order_id)
              return
            navigateTo(`/sale/sales/order?id=${rowData.order_id}`)
          },
        },
        { default: () => '详情' },
      )
    },
  },
]

const exportExcel = async () => {
  const res = await getStatementListAll({ all: true, where: filterData.value })
  const finishedClass = finishedFilterListToArray.value.filter(item => item.name === 'class')
  finishedClass[0].name = 'finished_class'
  exportStatementListToXlsx(res, [
    ...accessorieFilterListToArray.value,
    ...salesFilterListToArray.value,
    ...finishedFilterListToArray.value,
    ...oldFilterListToArray.value,
    ...filterListToArray.value,
    ...finishedClass,
  ], '销售明细报表', [])
}
</script>

<template>
  <div>
    <product-filter
      v-model:showtype="showtype"
      v-model:search-key="searchKey"
      :product-list-total="total"
      :is-export="true"
      placeholder="搜索产品条码"
      @export="exportExcel" @change-card="changeCard" @filter="openFilter" @search="searchOrder" @clear-search="clearFn">
      <template #company>
        <product-manage-company @change="changeStores" />
      </template>
    </product-filter>
    <common-layout-center>
      <div class="p-4">
        <template v-if="showtype === 'list'">
          <template v-if="statementList.length">
            <sale-statement-sales :info="statementList" :where="filterList" :old-where="oldFilterList" :finished-where="finishedFilterList" />
            <common-page v-model:page="searchPage" :total="total" :limit="limits" @update:page="updatePage" />
          </template>
          <template v-else>
            <common-emptys text="暂无数据" />
          </template>
        </template>
        <template v-else>
          <template v-if="statementList.length">
            <common-datatable :columns="cols" :list="statementList" :page-option="pageOption" :loading="tableLoading" />
          </template>
        </template>
      </div>
    </common-layout-center>
    <common-filter-where v-model:show="filterShow" :data="filterData" :filter="filterListToArray" @submit="submitWhere" @reset="resetWhere">
      <template #order_id>
        <n-input v-model:value="filterData.order_id" placeholder="请输入销售单订单号" clearable size="large" />
      </template>
    </common-filter-where>
  </div>
</template>

<style lang="scss" scoped>

</style>

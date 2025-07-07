<script setup lang="ts">
useSeoMeta({
  title: '其他收支单列表',
})
const { $toast } = useNuxtApp()
const { myStore } = storeToRefs(useStores())
const { getOtherOrderList, otherOrderWhere, delOtherOrder } = useOtherOrder()
const { searchPage, total, orderList, filterList, filterListToArray } = storeToRefs(useOtherOrder())
const filterShow = ref(false)
const filterData = ref({} as Partial<otherOrderWhere>)
await otherOrderWhere()
// 获取列表
const getList = async (where = {} as Partial<otherOrderInfo>) => {
  const params = { page: searchPage.value, limit: 12, where: { store_id: myStore.value.id } } as ReqList<otherOrderInfo>
  if (JSON.stringify(where) !== '{}') {
    params.where = { ...params.where, ...where }
  }
  await getOtherOrderList(params)
}
await getList()
const searchOrder = async (id: string) => {
  await getOtherOrderList({ page: 1, limit: 5, where: { id, store_id: myStore.value.id } })
}
const clearFn = async () => {
  orderList.value = []
  searchPage.value = 1
  await getList()
}
const handleClick = () => {}
const updatePage = () => {}
// 打开高级筛选
const openFilter = () => {
  filterShow.value = true
}

const submitWhere = async (f: otherOrderWhere) => {
  filterData.value = { ...filterData.value, ...f }
  orderList.value = []
  searchPage.value = 1
  await getList(filterData.value as otherOrderWhere)
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
        <div class="flex-center-between gap-2 py-[16px]">
          <div class="text-size-[14px] color-[#fff]">
            共{{ total }}条数据
          </div>
          <div @click="openFilter()">
            <product-filter-senior class="color-[#fff]" />
          </div>
        </div>
      </div>
    </div>
    <div class="grid-12">
      <div class="flex flex-col  col-12" uno-lg="col-8 offset-2" uno-sm="col-12">
        <div class="p-[16px]">
          <template v-if="orderList.length">
            <sale-other-list :info="orderList" :del="delOrder" :where="filterList" @user-click="handleClick" />
            <common-page v-model:page="searchPage" :total="total" :limit="12" @update:page="updatePage" />
          </template>
          <template v-else>
            <common-emptys text="暂无数据" />
          </template>
        </div>
      </div>
    </div>
    <common-create @create="newAdd()" />
    <common-confirm v-model:show="delDialog" icon="error" title="删除提醒" text="确认删除此收支单吗?" @submit="confirmDel" />
    <common-filter-where v-model:show="filterShow" :data="filterData" :filter="filterListToArray" @submit="submitWhere" @reset="resetWhere" />
  </div>
</template>

<style lang="scss" scoped>

</style>

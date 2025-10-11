<script setup lang="ts">
useSeoMeta({
  title: '门店列表',
})

const { storesList, filterListToArray, total, filterList } = storeToRefs(useStores())
const { searchPage } = storeToRefs(usePages())
const { createStore, getStoreList, deleteStore, getStoreWhere } = useStores()
const { getMyRegion } = useRegion()
const { myRegion } = storeToRefs(useRegion())
const { $toast } = useNuxtApp()
// 新增门店弹窗
const addOrUpdateShow = ref<boolean>(false)
// 搜索弹窗显示状态
const show = ref<boolean>(false)
// 筛选请求数据
const filterData = ref({} as StoresWhere)
const limits = ref<number>(50)
// 获取列表
const getList = async (where = {} as StoresWhere) => {
  if (!Object.keys(myRegion.value).length) {
    return $toast.error('请先选择区域')
  }
  const params = { page: searchPage.value, limit: limits.value } as ReqList<Region>
  params.where = where
  params.where.region_id = myRegion.value.id
  await getStoreList(params)
}

const addorUpdateForm = ref<Partial<Stores>>({
  id: undefined,
  region_id: undefined,
  phone: '',
  name: '',
  alias: '',
  sort: undefined,
})

await getMyRegion()
const route = useRoute()
// 获取筛选条件
await getStoreWhere()
// 读取url参数,获取列表
const handleQueryParams = async () => {
  filterData.value = {}
  const f = getQueryParams<StoresWhere>(route.fullPath, filterList.value)
  filterData.value = f

  if (f.searchPage) {
    searchPage.value = Number(f.searchPage) || 1
  }
  if (f.limits) {
    limits.value = Number(f.limits) || 50
  }

  await getList(filterData.value as StoresWhere)
}
await handleQueryParams()
const listJump = () => {
  const url = UrlAndParams('/system/store/list', filterData.value)
  navigateTo(url, { external: true, replace: true, redirectCode: 200 })
}

// 筛选列表
const submitWhere = async (f: StoresWhere) => {
  filterData.value = { ...f, searchPage: 1, limits: limits.value }
  listJump()
}

const resetwhere = async () => {
  filterData.value = {}
  listJump()
}

// 展示详情
const getStoreInfo = async (id: string) => {
  navigateTo(`/system/store/info?id=${id}`)
}
const reastAddForm = () => {
  addorUpdateForm.value = {
    id: undefined,
    region_id: undefined,
    phone: '',
    name: '',
    alias: '',
    sort: undefined,
  }
}
// 开发新增门店弹窗, 清空表单数据
const newAdd = () => {
  reastAddForm()
  addOrUpdateShow.value = true
}

// 调用新增门店接口
const newStore = async () => {
  addorUpdateForm.value.region_id = myRegion.value.id
  const res = await createStore(addorUpdateForm.value)
  if (res?.code === HttpCode.SUCCESS) {
    $toast.success('创建门店成功')
    listJump()
  }
  else {
    $toast.error(res?.message ?? '创建门店失败')
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
  const res = await deleteStore(nowDeleteId.value)
  if (res?.code === HttpCode.SUCCESS) {
    $toast.success('删除成功')
    storesList.value = []
    await getStoreList({ page: searchPage.value, limit: 12, where: { region_id: myRegion.value.id } })
  }
  else {
    $toast.error(res?.message ?? '删除失败')
  }
}

// 修改门店编辑按钮
const edit = (val: string) => {
  addOrUpdateShow.value = true
  // 找到匹配的商店信息
  const store = storesList.value.find(item => item.id === val)
  if (!store) {
    return
  }
  // 解构赋值，简化代码
  const { name, id, contact, sort } = store
  // 一次性更新表单数据
  Object.assign(addorUpdateForm.value, { name, id, contact, sort })
}

// 高级搜索按钮
const heightSearchFn = () => {
  show.value = true
}

const updatePage = async (page: number) => {
  filterData.value.searchPage = page
  filterData.value.limits = limits.value
  listJump()
}

const complate = ref(0)
</script>

<template>
  <div>
    <product-filter
      v-model:id="complate" :product-list-total="total" placeholder="搜索条码" :show-input="false" @filter="heightSearchFn()">
      <template #company>
        <region-change @change="getList" />
      </template>
    </product-filter>

    <template v-if="storesList.length">
      <div class="p-[16px]">
        <stores-card @get-detail="getStoreInfo" @edit-store="edit" @delete-store="deleteStoreFn" />
      </div>
    </template>
    <template v-else>
      <common-emptys text="暂无数据" />
    </template>
    <common-page v-model:page="searchPage" :total="total" :limit="limits" @update:page="updatePage" />
    <!-- 新增或更新门店弹窗 -->
    <common-model v-model="addOrUpdateShow" :show-cancel="false" title="新增门店">
      <stores-add-update
        v-model="addorUpdateForm" @submit="newStore" />
    </common-model>
    <common-confirm v-model:show="deleteDialog" text="确认删除此门店吗?" @submit="confirmDelete" />

    <common-create @create="newAdd()" />

    <common-filter-where v-model:show="show" :data="filterData" :filter="filterListToArray" @submit="submitWhere" @reset="resetwhere" />
  </div>
</template>

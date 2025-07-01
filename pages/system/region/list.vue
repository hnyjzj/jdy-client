<script setup lang="ts">
useSeoMeta({
  title: '区域列表',
})

const { regionList, addorUpdateForm, filterListToArray, total, searchPage } = storeToRefs(useRegion())
const { reastAddForm, createRegion, getRegionList, deleteRegion, updateRegion, getRegionWhere, uploadImage } = useRegion()
const { $toast } = useNuxtApp()
// 新增门店弹窗
const addOrUpdateShow = ref<boolean>(false)
// 搜索弹窗显示状态
const show = ref<boolean>(false)

// 筛选请求数据
const filterData = ref({} as Partial<Region>)

// 获取列表
const getList = async (where = {} as Partial<Region>) => {
  const params = { page: searchPage.value, limit: 12 } as ReqList<Region>
  if (JSON.stringify(where) !== '{}') {
    params.where = where
  }
  await getRegionList(params)
}

// 筛选列表
const submitWhere = async (f: Partial<Region>) => {
  filterData.value = { ...filterData.value, ...f }
  regionList.value = []
  searchPage.value = 1
  await getList(filterData.value)
}

const resetwhere = () => {
  filterData.value = {}
}
// 获取列表数据
await getList()
// 获取筛选条件
await getRegionWhere()

// 展示详情
const getStoreInfo = async (id: string) => {
  navigateTo(`/system/region/info?id=${id}`)
}

// 开发新增门店弹窗, 清空表单数据
const newAdd = () => {
  reastAddForm()
  addOrUpdateShow.value = true
}

// 调用新增门店接口
const newStore = async () => {
  const res = await createRegion(addorUpdateForm.value)
  if (res?.code === HttpCode.SUCCESS) {
    $toast.success('创建门店成功')
    reastAddForm()
    addOrUpdateShow.value = false
    regionList.value = []
    await getRegionList({ page: 1, limit: 12 })
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
  const res = await deleteRegion(nowDeleteId.value)
  if (res?.code === HttpCode.SUCCESS) {
    $toast.success('删除成功')
    regionList.value = []
    await getRegionList({ page: 1, limit: 12 })
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

// 调用更新门店接口
const editRegion = async () => {
  const res = await updateRegion(addorUpdateForm.value)
  if (res?.code === HttpCode.SUCCESS) {
    $toast.success('更新成功')
    addOrUpdateShow.value = false
    regionList.value = []
    await getRegionList({ page: 1, limit: 12 })
    reastAddForm()
  }
}

// 高级搜索按钮
const heightSearchFn = () => {
  show.value = true
}

// 上传图片文件
const uploadFile = async (file: any, onfinish?: () => void, id?: string) => {
  try {
    const upParams = { image: file, store_id: id }
    if (!id) {
      delete (upParams.store_id)
    }
    const res = await uploadImage(upParams)
    if (res.data.value?.code !== HttpCode.SUCCESS) {
      $toast.error(res.data.value?.message || '上传失败')
      return false
    }
    // const url = res.data.value.data.url
    //  如果有id 说明是 修改logo ,没有id则是新增
    // addorUpdateForm.value.logo = url
    onfinish && onfinish()
  }
  catch {
    $toast.error('上传失败，请重试')
  }
}

const updatePage = async (page: number) => {
  searchPage.value = page
  await getList()
}
</script>

<template>
  <div>
    <div id="header" class="px-[16px]">
      <div class="col-12 grid-12 lg:col-8 lg:offset-2 pt-[12px] pb-[16px] color-[#fff]">
        <div
          class="col-8 py-[6px] px-[12px] line-height-[20px]" uno-lg="col-4 offset-2">
          共{{ total }}条数据
        </div>
        <div
          class="col-4" uno-lg="col-4" @click="heightSearchFn()">
          <product-filter-Senior />
        </div>
      </div>
    </div>

    <div class="p-[16px]">
      <region-card @get-detail="getStoreInfo" @edit-store="edit" @delete-store="deleteStoreFn" />
    </div>
    <common-page v-model:page="searchPage" :total="total" :limit="12" @update:page="updatePage" />
    <!-- 新增或更新门店弹窗 -->
    <common-popup v-model="addOrUpdateShow" :title="addorUpdateForm.id ? '编辑门店' : '新增门店'">
      <region-add-update
        @upload="uploadFile"
        @submit="newStore"
        @edit-submit="editRegion" />
    </common-popup>
    <common-confirm v-model:show="deleteDialog" text="确认删除此门店吗?" @submit="confirmDelete" />

    <common-create @create="newAdd()" />

    <common-filter-where v-model:show="show" :data="filterData" :filter="filterListToArray" @submit="submitWhere" @reset="resetwhere" />
  </div>
</template>

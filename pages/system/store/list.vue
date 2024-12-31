<script setup lang="ts">
import type { Where } from 'where'

useSeoMeta({
  title: '门店列表',
})

const { storesList, addorUpdateForm, storeDetails, filterListToArray, total } = storeToRefs(useStores())
const { getStoreDetail, reastAddForm, createStore, getStoreList, deleteStore, updateStore, getStoreWhere, uploadImage } = useStores()
const message = useMessage()

// 新增门店弹窗
const addOrUpdateShow = ref<boolean>(false)
// 搜索弹窗显示状态
const show = ref<boolean>(false)
// 搜索条件 页码
const searchPage = ref<number>(1)
// 是否有更多数据
const nomore = ref<boolean>(false)
// 显示详情页
const showModal = ref<boolean>(false)
// 筛选请求数据
const filterData = ref({} as Where<Stores>)
// 获取列表
const getList = async (where = {} as Where<Stores>) => {
  if (nomore.value)
    return
  const params = { page: searchPage.value, limit: 12 } as storesWhereReq
  if (JSON.stringify(where) !== '{}') {
    params.where = where
  }
  const res = await getStoreList(params)
  res ? nomore.value = false : nomore.value = true
}

// 筛选列表
const submitWhere = async (f: Where<Stores>) => {
  filterData.value = f
  storesList.value = []
  nomore.value = false
  searchPage.value = 1
  await getList(filterData.value)
}

// 获取列表数据
await getList()
// 获取筛选条件
await getStoreWhere()

// 展示详情
const getStoreInfo = async (val: string) => {
  await getStoreDetail({ id: val as string })
  showModal.value = true
}

// 开发新增门店弹窗, 清空表单数据
const newAdd = () => {
  reastAddForm()
  addOrUpdateShow.value = true
}

// 调用新增门店接口
const newStore = async () => {
  const res = await createStore(addorUpdateForm.value)
  if (res.code === HttpCode.SUCCESS) {
    message.success('创建门店成功')
    reastAddForm()
    addOrUpdateShow.value = false
    storesList.value = []
    await getStoreList({ page: 1, limit: 12 })
  }
  else {
    message.error(res.message)
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
  const res = await deleteStore({ id: nowDeleteId.value })
  if (res.code === HttpCode.SUCCESS) {
    message.success('删除成功')
    storesList.value = []
    await getStoreList({ page: 1, limit: 12 })
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
  const { name, id, address, contact, sort, province, city, district, logo } = store
  // 一次性更新表单数据
  Object.assign(addorUpdateForm.value, { name, id, address, contact, sort, province, city, district, logo })
}

// 调用更新门店接口
const editStore = async () => {
  const res = await updateStore(addorUpdateForm.value)
  if (res.code === HttpCode.SUCCESS) {
    message.success('更新成功')
    addOrUpdateShow.value = false
    storesList.value = []
    await getStoreList({ page: 1, limit: 12 })
    reastAddForm()
  }
}
// 更新省市区请求参数
const updateArea = (val: Stores['region']) => {
  filterData.value.region = val
}

// 高级搜索按钮
const heightSearchFn = () => {
  show.value = true
}

// 上传图片文件
const uploadFile = async (file: any, onfinish?: () => void, id?: string) => {
  try {
    const res = await uploadImage({ image: file, store_id: id || undefined })
    if (res.data.value.code !== HttpCode.SUCCESS) {
      message.error(res.data.value?.message || '上传失败')
      return false
    }
    const url = res.data.value.data.url
    //  如果有id 说明是 修改logo ,没有id则是新增
    addorUpdateForm.value.logo = url
    onfinish && onfinish()
  }
  catch {
    message.error('上传失败，请重试')
  }
}
// 获取头部高度
const height = ref<number | undefined>(0)
onMounted(() => {
  height.value = getHeight('header')
})
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
    <common-list-pull
      :distance="height"
      :nomore="nomore"
      @pull="() => {
        searchPage += 1
        getList()
      }">
      <template #default>
        <stores-card @get-detail="getStoreInfo" @edit-store="edit" @delete-store="deleteStoreFn" />
      </template>
    </common-list-pull>
    <!-- 新增或更新门店弹窗 -->
    <common-popup v-model="addOrUpdateShow" :title="addorUpdateForm.id ? '编辑门店' : '新增门店'">
      <stores-add-update
        @upload="uploadFile"
        @submit="newStore"
        @edit-submit="editStore" />
    </common-popup>

    <n-modal v-model:show="showModal">
      <stores-info :info-detail="storeDetails" />
    </n-modal>
    <van-dialog v-model:show="deleteDialog" title="删除门店" show-cancel-button @confirm="confirmDelete">
      <div class="text-center py-[16px]">
        确认删除此门店吗?
      </div>
    </van-dialog>
    <common-create @create="newAdd()" />

    <common-filter-where v-model:show="show" :data="filterData" :filter="filterListToArray" @submit="submitWhere">
      <template #region>
        <common-area-select :is-required="false" :showtitle="false" :form="filterData.region" @update="updateArea" />
      </template>
    </common-filter-where>
  </div>
</template>

<style lang="scss" scoped>
.right {
  background: linear-gradient(to bottom, #1a6beb, #6ea6ff);
  box-shadow: rgba(110, 166, 255, 0.3) 0px 6px 6px;
  --uno: 'text-[16px] py-[6px] border-none flex-1 rounded-[36px] ml-[8px] text-[#FFFFFF]';
}
</style>

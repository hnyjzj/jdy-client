<script setup lang="ts">
const store = useStores()
const { storesList, formList, addForm, storeDetails } = storeToRefs(useStores())
const { getStoreDetail } = useStores()
const { $toast } = useNuxtApp()
useSeoMeta({
  title: '门店列表',
})
const addOrUpdateFormRef = ref<any>()
const searchRef = ref<any>()
// 新增门店弹窗
const addStoreShow = ref(false)
// 编辑门店弹窗
// const editStoreShow = ref(false)
// 搜索弹窗显示状态
const show = ref(false)

useSeoMeta({
  title: '门店列表',
})
// 替换空字符串
const replaceEmptyStrings = (obj: any) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === '') {
      obj[key] = undefined
    }
  })
}
// 搜索页面
const searchPage = ref(1)
// 没有更多数据了
const nomore = ref(false)
// 搜索 获取列表数据
const searchFn = async (init = false) => {
  if (nomore.value) {
    return false
  }
  if (init) {
    storesList.value = []
  }
  replaceEmptyStrings(formList.value)
  const res = await store.getStoreList({ page: searchPage.value, limit: 12, where: formList.value })
  if (res === false) {
    nomore.value = true
  }
}
// 初始化请求列表数据
await searchFn(true)
// 显示详情页
const showModal = ref(false)
// 跳转到详情页
const getStoreInfo = async (val: string) => {
  await getStoreDetail({ id: val as string })
  showModal.value = true
}

// 开发新增门店弹窗, 清空 省市区选择
const newAdd = () => {
  store.reastAddForm()
  addStoreShow.value = true
}

// 新增门店
const newStore = async () => {
  const res = await store.createStore(addForm.value)
  if (res.code === HttpCode.SUCCESS) {
    $toast.success('创建成功')
    store.reastAddForm()
    addStoreShow.value = false
    storesList.value = []
    await store.getStoreList({ page: 1, limit: 12 })
  }
  else {
    $toast.error(res.message)
  }
}

// 编辑按钮
const edit = (val: string) => {
  addStoreShow.value = true
  // 找到匹配的商店信息
  const store = storesList.value.find(item => item.id === val)
  if (!store) {
    return
  }
  // 解构赋值，简化代码
  const { name, id, address, contact, sort, province, city, district, logo } = store
  // 一次性更新表单数据
  Object.assign(addForm.value, { name, id, address, contact, sort, province, city, district, logo })
}
// 确认更新
const editStore = async () => {
  const res = await store.updateStore(addForm.value)
  if (res.code === HttpCode.SUCCESS) {
    $toast.success('更新成功')
    addStoreShow.value = false
    storesList.value = []
    await store.getStoreList({ page: 1, limit: 12 })
    store.reastAddForm()
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
  const res = await store.deleteStore({ id: nowDeleteId.value })
  if (res.code === HttpCode.SUCCESS) {
    $toast.success('删除成功')
    storesList.value = []
    await store.getStoreList({ page: 1, limit: 12 })
  }
}

// 上传图片文件
const uploadFile = async (file: any, onfinish?: () => void, id?: string) => {
  try {
    const res = await store.uploadImage({ image: file, store_id: id || undefined })
    if (res.data.value.code !== HttpCode.SUCCESS) {
      $toast.error(res.data.value?.message || '上传失败')
      return false
    }
    const url = res.data.value.data.url
    //  如果有id 说明是 修改logo ,没有id则是新增
    addForm.value.logo = url
    onfinish && onfinish()
  }
  catch {
    $toast.error('上传失败，请重试')
  }
}

// 高级搜索按钮
const heightSearchFn = () => {
  formList.value.province = ''
  formList.value.city = ''
  formList.value.district = ''
  show.value = true
}
// 搜索确认查询列表
const searchSubmit = () => {
  searchPage.value = 1
  nomore.value = false
  storesList.value = []
  searchFn()
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
          共{{ store.total }}条数据
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
        searchFn()
      }">
      <template #default>
        <stores-card @get-detail="getStoreInfo" @edit-store="edit" @delete-store="deleteStoreFn" />
      </template>
    </common-list-pull>
    <!-- 新增或更新门店弹窗 -->
    <common-popup v-model="addStoreShow">
      <stores-add-update
        ref="addOrUpdateFormRef"
        @upload="uploadFile"
        @submit="newStore"
        @edit-submit="editStore" />
    </common-popup>
    <common-popup v-model="show" title="高级筛选">
      <stores-search
        ref="searchRef"

      />
      <template #footer>
        <common-button-rounded content="确定" @button-click="searchSubmit()" />
      </template>
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
  </div>
</template>

<style lang="scss" scoped>
.right {
  background: linear-gradient(to bottom, #1a6beb, #6ea6ff);
  box-shadow: rgba(110, 166, 255, 0.3) 0px 6px 6px;
  --uno: 'text-[16px] py-[6px] border-none flex-1 rounded-[36px] ml-[8px] text-[#FFFFFF]';
}
</style>

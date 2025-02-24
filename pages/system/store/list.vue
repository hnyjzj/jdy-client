<script setup lang="ts">
import type { SelectOption } from 'naive-ui'

useSeoMeta({
  title: '门店列表',
})
const { getOptionsStafflist } = useStaff()
const { storesList, addorUpdateForm, storeDetails, filterListToArray, total } = storeToRefs(useStores())
const { getStoreDetail, reastAddForm, createStore, getStoreList, deleteStore, updateStore, getStoreWhere, uploadImage, deleteStaff, assignStaff } = useStores()
const { $toast } = useNuxtApp()
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
const filterData = ref({} as Partial<Stores>)
// 显示分配组件
const assginShow = ref<boolean>(false)

// 获取列表
const getList = async (where = {} as Partial<Stores>) => {
  if (nomore.value)
    return
  const params = { page: searchPage.value, limit: 12 } as ReqList<Stores>
  if (JSON.stringify(where) !== '{}') {
    params.where = where
  }
  const res = await getStoreList(params)
  res ? nomore.value = false : nomore.value = true
}

// 筛选列表
const submitWhere = async (f: Partial<Stores>) => {
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
const getStoreInfo = async (id: string) => {
  await getStoreDetail(id)
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
    $toast.success('创建门店成功')
    reastAddForm()
    addOrUpdateShow.value = false
    storesList.value = []
    await getStoreList({ page: 1, limit: 12 })
  }
  else {
    $toast.error(res.message)
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
  if (res.code === HttpCode.SUCCESS) {
    $toast.success('删除成功')
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
    $toast.success('更新成功')
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
    const upParams = { image: file, store_id: id }
    if (!id) {
      delete (upParams.store_id)
    }
    const res = await uploadImage(upParams)
    if (res.data.value.code !== HttpCode.SUCCESS) {
      $toast.error(res.data.value?.message || '上传失败')
      return false
    }
    const url = res.data.value.data.url
    //  如果有id 说明是 修改logo ,没有id则是新增
    addorUpdateForm.value.logo = url
    onfinish && onfinish()
  }
  catch {
    $toast.error('上传失败，请重试')
  }
}
// 移除的员工
const deleteModel = ref<AssignStaff>({
  id: undefined,
  staff_id: [],
})
const dialog = useDialog()

//  移除员工
const deleteStoreStaffFn = async (id: string, index: number) => {
  dialog.error({
    title: '确定移除此员工吗?',
    negativeText: '取消',
    positiveText: '确定',
    onPositiveClick: async () => {
      deleteModel.value.id = storeDetails.value.id
      deleteModel.value.staff_id = [id]
      const res = await deleteStaff(deleteModel.value)
      if (res) {
        $toast.success('移除成功')
        storeDetails.value.staffs.splice(index, 1)
      }
    },
  })
}

// 获取头部高度
const height = ref<number | undefined>(0)

const wid = ref('90%')
function updateWidth() {
  const width = window.innerWidth || document.documentElement.clientWidth
  if (width >= 1500) {
    wid.value = '30%'
  }
  else if (width >= 1024) {
    wid.value = '40%'
  }
  else if (width > 768) {
    wid.value = '50%'
  }
  else if (width > 600) {
    wid.value = '70%'
  }
  else {
    wid.value = '90%'
  }
}
const assignModel = ref<AssignStaff>({
  id: undefined,
  staff_id: [],
})

const assignFn = async () => {
  assignModel.value.id = storeDetails.value.id
  const res = await assignStaff(assignModel.value)
  if (res) {
    $toast.success('分配成功')
    assignModel.value = {
      id: undefined,
      staff_id: [],
    }
    await getStoreDetail(storeDetails.value.id)
  }
}
const staffList = ref<SelectOption[]>([])
const searchStaffOptions = async (val: string) => {
  const res = await getOptionsStafflist({ page: 1, limit: 10, where: { nickname: val } })
  if (res.length) {
    staffList.value = res.map(item => ({
      label: item.nickname,
      value: item.id,
    }))
  }
}

// 添加防抖监听（避免频繁触发）
const resizeTimer = ref()
onMounted(() => {
  updateWidth()
  // 添加防抖监听（避免频繁触发）
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer.value)
    resizeTimer.value = setTimeout(updateWidth, 100)
  })

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

    <common-popup v-model="showModal" title="门店详情" placement="left" :width="wid">
      <div>
        <stores-info :info-detail="storeDetails" />
        <staff-assign-card :list="storeDetails.staffs" @delete-store-staff="deleteStoreStaffFn" @confirm="assginShow = true" />
      </div>
    </common-popup>

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
    <stores-assign
      :id="storeDetails.id"
      v-model:assign-model="assignModel"
      v-model:assgin-show="assginShow"
      :staff-list="staffList"
      @search-staff-options="searchStaffOptions"
      @assign="assignFn" />
  </div>
</template>

<style lang="scss" scoped>
.right {
  background: linear-gradient(to bottom, #1a6beb, #6ea6ff);
  box-shadow: rgba(110, 166, 255, 0.3) 0px 6px 6px;
  --uno: 'text-[16px] py-[6px] border-none flex-1 rounded-[36px] ml-[8px] text-[#FFFFFF]';
}
</style>

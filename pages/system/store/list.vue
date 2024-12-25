<script setup lang="ts">
import { useCascaderAreaData } from '@vant/area-data'

const store = useStores()
const { storesList, formList, addForm, showName, storeDetails } = storeToRefs(useStores())
const { getStoreDetail } = useStores()
const { $toast } = useNuxtApp()
useSeoMeta({
  title: '门店列表',
})

const addFormRef = ref<any>()
const editFormRef = ref<any>()
const searchRef = ref<any>()
// 新增门店弹窗
const addStoreShow = ref(false)
// 编辑门店弹窗
const editStoreShow = ref(false)
// 搜索弹窗显示状态
const show = ref(false)
// 当前选中的省市区
const cascaderValue = ref('')
// 省市区数据
const options = useCascaderAreaData()
// 地址选择器显示状态
const addressShow = ref(false)
// 用于显示 上级门店中文 和  省市区中文

// 新增门店表单数据
const editForm = ref<editStoreReq>({
  id: '',
  parent_id: undefined,
  address: '',
  name: '',
  logo: '',
  province: '',
  city: '',
  district: '',
  sort: '',
  contact: '',
})

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

definePageMeta({
  keepalive: true, // 设置为keepAlive
})

const showModal = ref(false)
// 跳转到详情页
const getStoreInfo = async (val: string) => {
  await getStoreDetail({ id: val as string })
  showModal.value = true
}

// 开发新增门店弹窗, 清空 省市区选择
const newAdd = () => {
  cascaderValue.value = ''
  showName.value.province_name = ''
  addForm.value.province = ''
  addForm.value.city = ''
  addForm.value.district = ''
  addStoreShow.value = true
}
// 重置新增表单
const reastAddForm = () => {
  addForm.value = {
    parent_id: undefined,
    address: '',
    name: '',
    logo: '',
    province: '',
    city: '',
    district: '',
    contact: '',
    sort: 0,
  }
}
// 新增门店
const newStore = async () => {
  const res = await store.createStore(addForm.value)
  if (res.code === HttpCode.SUCCESS) {
    $toast.success('创建成功')
    addStoreShow.value = false
    storesList.value = []
    await store.getStoreList({ page: 1, limit: 12 })
    reastAddForm()
  }
  else {
    $toast.error(res.message)
  }
}

// 编辑按钮
const edit = async (val: string) => {
  showName.value.province_name = ''
  editStoreShow.value = true
  storesList.value.forEach(async (item) => {
    if (item.id === val) {
      editForm.value.name = item.name
      editForm.value.id = item.id
      editForm.value.parent_id = item.parent_id
      editForm.value.address = item.address
      editForm.value.contact = item.contact
      editForm.value.sort = item.sort
      editForm.value.province = item.province
      editForm.value.city = item.city
      editForm.value.district = item.district
      editForm.value.logo = item.logo
      cascaderValue.value = item.district
      if (item.parent_id) {
        await nextTick()
        editFormRef.value?.setKeySearch(item.parent?.name)
      }
      if (item.logo) {
        await nextTick()
        // editFormRef.value?.setLogo(item.logo)
      }
      showName.value.province_name = toProvinces(item.province, item.city, item.district)
    }
  })
}
// 确认更新
const editStore = async () => {
  const res = await store.updateStore(editForm.value)
  if (res.code === HttpCode.SUCCESS) {
    $toast.success('更新成功')
    editStoreShow.value = false
    storesList.value = []
    await store.getStoreList({ page: 1, limit: 12 })
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
    editStoreShow.value = false
    storesList.value = []
    await store.getStoreList({ page: 1, limit: 12 })
  }
}

// 搜索上级门店id
const searchParentId = async (val: string) => {
  const searhParentList = ref({ page: 1, limit: 20, where: { name: '' as string | undefined } })
  searhParentList.value.where.name = val
  if (val === '') {
    searhParentList.value.where.name = undefined
    return
  }
  const res = await store.getStoreList(searhParentList.value, true)
  addFormRef.value?.showPopup(res)
  editFormRef.value?.showPopup(res)
  searchRef.value?.showPopup(res)
}
const message = useMessage()
// 上传图片文件
const uploadFile = async (file: any, onfinish?: () => void, id?: string) => {
  try {
    const res = await store.uploadImage({ image: file, store_id: id || undefined })
    if (res.data.value.code !== HttpCode.SUCCESS) {
      $toast.error(res.data.value?.message || '上传失败')
      return false
    }
    //  如果有id 说明是 修改logo ,没有id则是新增
    if (id) {
      editForm.value.logo = res.data.value.data.url
    }
    else {
      addForm.value.logo = res.data.value.data.url
    }
    onfinish && onfinish()
  }
  catch {
    message.error('上传失败，请重试')
  }
}
// 记录当前是哪个操作
const nowShow = ref<'search' | 'add' | 'edit' | null>()
// 弹窗点击选择省市区
const clickCity = (key: string) => {
  switch (key) {
    case 'add':
      addStoreShow.value = false
      nowShow.value = 'add'
      break
    case 'edit':
      editStoreShow.value = false
      nowShow.value = 'edit'
      break
    default:
      show.value = false
      nowShow.value = 'search'
      break
  }
  addressShow.value = true
}
/**
 * 筛选表单完成时操作
 */
const onFinish = (values: any) => {
  const province = values.selectedOptions[0].value
  const city = values.selectedOptions[1].value
  const district = values.selectedOptions[2].value

  switch (nowShow.value) {
    case 'add':
      addForm.value.province = province
      addForm.value.city = city
      addForm.value.district = district
      addStoreShow.value = true
      break
    case 'edit':
      editForm.value.province = province
      editForm.value.city = city
      editForm.value.district = district
      editStoreShow.value = true
      break
    default:
      formList.value.province = province
      formList.value.city = city
      formList.value.district = district
      show.value = true
      break
  }

  // 更新显示名称，合并省份、城市和地区的文本
  showName.value.province_name = values.selectedOptions[0].text + values.selectedOptions[1].text + values.selectedOptions[2].text
  // 隐藏地址选择器
  addressShow.value = false
}

// 重置省市区选择器数据 和 省市区名称
const reaset = () => {
  cascaderValue.value = ''
  showName.value.province_name = ''
}
// 高级搜索按钮
const heightSearchFn = () => {
  cascaderValue.value = ''
  showName.value.province_name = ''
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
const height = ref(0)
onMounted(() => {
  height.value = getHeight('header') as number
})
</script>

<template>
  <div>
    <!-- 筛选 -->
    <div id="header" class="px-[16px]">
      <div class="col-12 grid-12 lg:col-8 lg:offset-2 pt-[12px] pb-[16px] color-[#fff]">
        <div class="col-8 py-[6px] px-[12px] line-height-[20px]" uno-lg="col-4 offset-2">
          共{{ store.total }}条数据
        </div>
        <div
          class="col-4" uno-lg="col-4" @click="heightSearchFn()">
          <product-filter-Senior />
        </div>
      </div>
    </div>
    <div class="">
      <common-list-pull
        :distance="height"
        :nomore="nomore"
        @pull=" () => {
          searchPage += 1
          searchFn()
        }">
        <template #default>
          <stores-card @get-detail="getStoreInfo" @edit-store="edit" @delete-store="deleteStoreFn" />
        </template>
      </common-list-pull>
    </div>
    <!-- 小卡片组件 -->

    <div @click="newAdd()">
      <common-create />
    </div>
    <van-dialog v-model:show="deleteDialog" title="删除门店" show-cancel-button @confirm="confirmDelete">
      <div class="text-center py-[16px]">
        确认删除此门店吗?
      </div>
    </van-dialog>
    <!-- 新增门店弹窗 -->
    <common-popup v-model="addStoreShow">
      <div
        class="p-[16px] bg-[#F1F5FE] h-full">
        <stores-add
          ref="addFormRef"
          :show-name="showName"
          @upload="uploadFile"
          @select-city="clickCity('add')"
          @clean-province="reaset()"
          @update-parent="searchParentId"
          @submit="newStore" />
      </div>
    </common-popup>
    <!-- 编辑门店弹窗 -->
    <common-popup v-model="editStoreShow">
      <div
        class="p-[16px] bg-[#F1F5FE] h-full">
        <stores-edit
          ref="editFormRef"
          v-model="editForm"
          :show-name="showName"
          @upload="uploadFile"
          @update-parent="searchParentId"
          @select-city="clickCity('edit')"
          @clean-province="reaset()"
          @submit="editStore" />
      </div>
    </common-popup>
    <common-popup v-model="show">
      <div class="p-[16px] bg-[#F1F5FE] h-full">
        <stores-search
          ref="searchRef"
          :show-name="showName"
          @select-city="clickCity('search')"
          @update-parent="searchParentId"
          @clean-province="reaset()"
          @submit="searchSubmit()
          " />
      </div>
    </common-popup>

    <!-- 选择省市区 -->
    <van-popup v-model:show="addressShow" round position="bottom">
      <van-cascader
        v-model="cascaderValue"
        title="请选择所在地区"
        :options="options"
        @close="addressShow = false"
        @finish="onFinish"
      />
    </van-popup>

    <n-modal v-model:show="showModal">
      <stores-info :info-detail="storeDetails" />
    </n-modal>
  </div>
</template>

<style lang="scss" scoped>

</style>

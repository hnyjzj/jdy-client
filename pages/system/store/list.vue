<script setup lang="ts">
import { NButton } from 'naive-ui'

useSeoMeta({
  title: '门店列表',
})

const { storesList, addorUpdateForm, filterListToArray, total, searchPage, showtype } = storeToRefs(useStores())
const { reastAddForm, createStore, getStoreList, deleteStore, updateStore, getStoreWhere, uploadImage } = useStores()
const { $toast } = useNuxtApp()
// 新增门店弹窗
const addOrUpdateShow = ref<boolean>(false)
// 搜索弹窗显示状态
const show = ref<boolean>(false)

// 筛选请求数据
const filterData = ref({} as Partial<Stores>)
const limits = ref<number>(50)
// 获取列表
const getList = async (where = {} as Partial<Stores>) => {
  const params = { page: searchPage.value, limit: limits.value } as ReqList<Stores>
  if (JSON.stringify(where) !== '{}') {
    params.where = where
  }
  await getStoreList(params)
}

// 筛选列表
const submitWhere = async (f: Partial<Stores>) => {
  filterData.value = { ...filterData.value, ...f }
  storesList.value = []
  searchPage.value = 1
  await getList(filterData.value)
  show.value = false
}

const resetwhere = async () => {
  filterData.value = {}
}
// 获取列表数据
await getList()
// 获取筛选条件
await getStoreWhere()

// 展示详情
const getStoreInfo = async (id: string) => {
  navigateTo(`/system/store/info?id=${id}`)
}

// 开发新增门店弹窗, 清空表单数据
const newAdd = () => {
  reastAddForm()
  addOrUpdateShow.value = true
}

// 调用新增门店接口
const newStore = async () => {
  const res = await createStore(addorUpdateForm.value)
  if (res?.code === HttpCode.SUCCESS) {
    $toast.success('创建门店成功')
    reastAddForm()
    addOrUpdateShow.value = false
    storesList.value = []
    await getStoreList({ page: 1, limit: 12 })
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
    await getStoreList({ page: searchPage.value, limit: 12 })
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
  if (res?.code === HttpCode.SUCCESS) {
    $toast.success('更新成功')
    addOrUpdateShow.value = false
    storesList.value = []
    await getStoreList({ page: searchPage.value, limit: 12 })
    reastAddForm()
  }
}
// 更新省市区请求参数
const updateArea = (val: Stores['field']) => {
  filterData.value.field = val
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
    const url = res.data.value.data.url
    //  如果有id 说明是 修改logo ,没有id则是新增
    addorUpdateForm.value.logo = url
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
  { title: '店铺名称', key: 'name' },
  { title: '省市区', key: 'name', render: (rowData: Stores) => {
    return toProvinces(rowData.province, rowData.city, rowData.district)
  } },
  { title: '详细地址', key: 'address' },
  { title: '联系方式', key: 'contact' },
  {
    title: '操作',
    key: 'action',
    width: 250,
    render: (rowData: Stores) => {
      return [h(
        NButton,
        {
          type: 'primary',
          size: 'small',
          class: 'mr-[4px]',
          onClick: () => {
            if (!rowData.id)
              return
            navigateTo(`/system/store/info?id=${rowData.id}`)
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
    <div class="grid-12 sticky top-0 bg-gradient-linear-[180deg,#3875C5,#467EC9]  z-1">
      <div id="header" class="px-[16px] py-[12px] w-full   col-12" uno-lg="col-8 offset-2">
        <common-tool-list v-model="showtype" :total="total" @height="heightSearchFn" />
      </div>
    </div>

    <template v-if="showtype === 'list'">
      <div class="p-[16px]">
        <stores-card @get-detail="getStoreInfo" @edit-store="edit" @delete-store="deleteStoreFn" />
        <common-page v-model:page="searchPage" :total="total" :limit="limits" @update:page="updatePage" />
      </div>
    </template>
    <template v-else>
      <common-datatable :columns="cols" :list="storesList" :page-option="pageOption" />
    </template>

    <!-- 新增或更新门店弹窗 -->
    <common-popup v-model="addOrUpdateShow" :title="addorUpdateForm.id ? '编辑门店' : '新增门店'">
      <stores-add-update
        @upload="uploadFile"
        @submit="newStore"
        @edit-submit="editStore" />
    </common-popup>
    <common-confirm v-model:show="deleteDialog" text="确认删除此门店吗?" @submit="confirmDelete" />

    <common-create @create="newAdd()" />

    <common-filter-where v-model:show="show" :data="filterData" :filter="filterListToArray" @submit="submitWhere" @reset="resetwhere">
      <template #field>
        <common-area-select :is-required="false" :showtitle="false" :form="filterData.field" @update="updateArea" />
      </template>
    </common-filter-where>
  </div>
</template>

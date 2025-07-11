<script setup lang="ts">
const { $toast } = useNuxtApp()
const route = useRoute()
const router = useRouter()

const { getAccessorieEnterInfo, cancelAccessorieEnter, successAccessorieEnter, addAccessorieEnter, delAccessorieEnter } = useAccessorieEnter()
const { enterInfo } = storeToRefs(useAccessorieEnter())
const { accessorieFilterList } = storeToRefs(useAccessorie())
const { getAccessorieWhere } = useAccessorie()
const { categoryFilterListToArray } = storeToRefs(useAccessorieCategory())
const { getAccessorieCategoryWhere } = useAccessorieCategory()

useSeoMeta({ title: '入库单详情' })

/** 当前入库单 ID 和待删除产品 ID */
const enterId = ref('')
const deleteId = ref('')

/** 上传组件引用 */
const uploadRef = ref()

/** 控制弹窗/对话框显示状态 */
const isImportModel = ref(false)
const isChooseModel = ref(false)
const deleteDialog = ref(false)
const clearDialog = ref(false)
const cancelDialog = ref(false)
const finishDialog = ref(false)
const loading = ref(false)

/** 页面加载时，初始化数据 */
await getAccessorieCategoryWhere()
if (route.query.id) {
  enterId.value = route.query.id as string
  await fetchEnterInfo()
  await getAccessorieWhere()
}

/** 获取入库单详细信息 */
async function fetchEnterInfo() {
  if (enterId.value) {
    await getAccessorieEnterInfo(enterId.value)
  }
}

/** 跳转添加产品页面 */
function goAdd() {
  isChooseModel.value = false
  jump('/product/accessorie/enter/addproduct', { id: enterId.value })
}

/** 撤销入库单操作 */
async function cancel() {
  const res = await cancelAccessorieEnter(enterInfo.value.id)
  if (res?.code === HttpCode.SUCCESS) {
    await fetchEnterInfo()
    setTimeout(() => {
      router.back()
    }, 1000)
    $toast.success('撤销成功', 1000)
  }
  else {
    $toast.error(res?.message ?? '撤销失败')
  }
}

/** 点击清空时调用，触发确认弹窗 */
function clearFun() {
  if (!enterInfo.value?.products?.length) {
    $toast.error('货品为空')
    return
  }
  clearDialog.value = true
}

/** 点击完成按钮时调用，触发确认弹窗 */
function finishFun() {
  if (!enterInfo.value?.products?.length) {
    $toast.error('货品为空')
    return
  }
  finishDialog.value = true
}

/** 完成入库操作 */
async function finish() {
  const res = await successAccessorieEnter(enterInfo.value.id)
  if (res?.code === HttpCode.SUCCESS) {
    $toast.success('完成入库成功')
    setTimeout(() => {
      router.back()
    }, 1000)
  }
  else {
    $toast.error(res?.message ?? '完成入库失败')
  }
}

/** 删除入库单中的指定产品 */
async function delProduct() {
  const res = await delAccessorieEnter({
    enter_id: enterInfo.value.id,
    product_ids: [deleteId.value],
  })

  if (res?.code === HttpCode.SUCCESS) {
    await fetchEnterInfo()
    $toast.success('删除成功')
  }
  else {
    $toast.error(res?.message ?? '删除失败')
  }
}

/** 清空入库单中所有产品 */
async function clearProduct() {
  const ids = enterInfo.value?.products?.map(item => item.id) ?? []
  if (!ids.length)
    return $toast.warning('货品为空')

  const res = await delAccessorieEnter({
    enter_id: enterInfo.value.id,
    product_ids: ids,
  })
  if (res?.code === HttpCode.SUCCESS) {
    await fetchEnterInfo()
  }
}

/**
 * 批量上传产品信息
 * @param data - 产品数组（包含每个产品的基本数据）
 */
async function bulkupload(data: any) {
  if (!data.length) {
    return $toast.error('数据格式不正确，请添加配件信息')
  }
  loading.value = true
  const res = await addAccessorieEnter({
    enter_id: enterInfo.value.id,
    products: data,
  })

  if (res?.code === HttpCode.SUCCESS) {
    $toast.success('添加成功')
    await fetchEnterInfo()
  }
  else {
    $toast.error(res?.message ?? '添加失败')
  }
  // 关闭弹窗
  loading.value = false
  isChooseModel.value = false
  isImportModel.value = false
}
</script>

<template>
  <div class="pb-20">
    <common-layout-center>
      <div class="pt-4">
        <div class="flex flex-col gap-4">
          <accessorie-enter-base :enter-info="enterInfo" />
          <accessorie-enter-info :info="enterInfo" :filter-list="categoryFilterListToArray" @del="(e) => { deleteDialog = true;deleteId = e }" />
        </div>
      </div>
    </common-layout-center>
    <product-upload-choose v-model:is-model="isChooseModel" @go-add="goAdd" @batch="isImportModel = true" />
    <accessorie-warehouse-accessorie ref="uploadRef" v-model="isImportModel" :filter-list="accessorieFilterList" :type="1" @upload="bulkupload" />
    <!-- 状态为草稿时 功能操作 -->
    <template v-if="enterInfo.status === EnterStatus.Draft">
      <common-create @create="isChooseModel = true" />
      <common-button-bottom>
        <template #content>
          <div class="w-[100%]">
            <div class="bottom-fun grid grid-cols-[26%_26%_auto] gap-2">
              <div class="cursor-pointer cancel-btn" @click="clearFun">
                清空列表
              </div>
              <div class="cursor-pointer cancel-btn" @click="cancelDialog = true">
                撤销
              </div>
              <div class="cursor-pointer confirm-btn" @click="finishFun">
                完成入库
              </div>
            </div>
          </div>
        </template>
      </common-button-bottom>
    </template>
    <template v-if="enterInfo.status === EnterStatus.Completed">
      <common-button-one text="撤销入库" @confirm="cancelDialog = true" />
    </template>
    <common-loading v-model="loading" title="正在处理中" />
    <common-confirm v-model:show="deleteDialog" icon="error" title="删除产品" text="确认要删除此产品吗?" @submit="delProduct" />
    <common-confirm v-model:show="clearDialog" icon="error" title="清空列表" text="确认要清空所有入库的产品吗?" @submit="clearProduct" />
    <common-confirm v-model:show="cancelDialog" icon="error" title="撤销" text="确认要撤销入库单吗? 撤销后将不可进行其他操作" @submit="cancel" />
    <common-confirm v-model:show="finishDialog" icon="success" title="完成入库" text="确认要完成此入库单吗?" @submit="finish" />
  </div>
</template>

<style lang="scss" scoped>
.info-title {
  --uno: 'text-color';
}
.info-val {
  --uno: 'text-color-light';
}
.confirm-btn {
  --uno: 'py-[6px] text-center flex-1 border-rd-[36px] text-[16px] text-[#fff] font-bold ';
  background: linear-gradient(to bottom, #1a6beb, #6ea6ff);
  box-shadow: rgba(57, 113, 243, 0.24) 0px 8px 8px 0;
}
.cancel-btn {
  --uno: 'py-[6px] text-center flex-1 border-rd-[36px] text-[16px] text-[#1a6beb] font-bold';
  background: #fff;
  box-shadow: rgba(82, 130, 241, 0.24) 0px 8px 8px 0;
}
</style>

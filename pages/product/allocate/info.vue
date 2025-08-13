<script setup lang="ts">
const { getAllocateInfo, getAllocateWhere, confirmAllcate, cancelAllcate, finishAllcate, remove, add, getAllocateInfoAll, clear } = useAllocate()
const { allocateInfo, allocateFilterList, allocateFilterListToArray } = storeToRefs(useAllocate())
const { useWxWork } = useWxworkStore()
const { getFinishedWhere } = useFinished()
const { finishedFilterListToArray } = storeToRefs(useFinished())
const { getOldWhere } = useOld()
const { oldList, oldFilterListToArray } = storeToRefs(useOld())

const { getOldList } = useOld()
const { myStore } = storeToRefs(useStores())
useSeoMeta({
  title: '调拨单详情',
})
const route = useRoute()
const router = useRouter()
const type = ref<GoodsTypePure>()
const loading = ref(false)
const uploadRef = ref()

const { $toast } = useNuxtApp()
/** 添加货品弹窗显隐 */
const isAddModel = ref(false)
const isImportModel = ref(false)
const isChooseModel = ref(false)
/** 添加货品条码 */
const pCode = ref()
/** 成品条码添加还是成品条码搜索添加 */
const isOldCodeSearch = ref(false)
/** 旧料搜索选择集合 */
const selectedCategories = ref([] as ProductOlds['code'][])

async function getWhere() {
  if (GoodsTypePure.ProductFinish === type.value) {
    await getFinishedWhere()
  }
  else if (GoodsTypePure.ProductOld === type.value) {
    await getOldWhere()
  }
}
const page = ref(1)
const limit = ref(10)
async function getInfo() {
  if (!route.query.id)
    return
  const params = {
    page: page.value,
    limit: limit.value,
    id: route.query.id,
  } as AllocateInfoParams
  await getAllocateInfo(params)
}

async function pull() {
  await getInfo()
}

if (route.query.id) {
  await getInfo()
  type.value = allocateInfo.value.type
  await getAllocateWhere()
  await getWhere()
}

async function cancel() {
  loading.value = true
  const res = await cancelAllcate(allocateInfo.value?.id)
  if (res?.code === HttpCode.SUCCESS) {
    await getInfo()
    loading.value = false
    $toast.success('取消调拨成功', 1000)
    setTimeout(() => {
      router.back()
    }, 1000)
  }
  else {
    $toast.error(res?.message ?? '取消调拨失败')
  }
  loading.value = false
}

async function confirm() {
  if (type.value === GoodsTypePure.ProductFinish) {
    if (!allocateInfo.value?.product_finisheds?.length)
      return $toast.warning('请先添加调拨产品')
  }
  if (type.value === GoodsTypePure.ProductOld) {
    if (!allocateInfo.value?.product_olds?.length)
      return $toast.warning('请先添加调拨产品')
  }
  loading.value = true
  const res = await confirmAllcate(allocateInfo.value?.id)
  if (res?.code === HttpCode.SUCCESS) {
    await getInfo()
    loading.value = false
    $toast.success('确认调拨成功')
  }
  else {
    loading.value = false
    $toast.error(res?.message ?? '确认调拨失败')
  }
}
/** 完成调拨 */
async function finish() {
  loading.value = true
  const res = await finishAllcate(allocateInfo.value?.id)
  if (res?.code === HttpCode.SUCCESS) {
    await getInfo()
    loading.value = false
    $toast.success('完成调拨成功')
  }
  else {
    loading.value = false
    $toast.error(res?.message ?? '完成调拨失败')
  }
}

const delProduct = useThrottleFn(async (code: ProductFinisheds['code'] | ProductOlds['code']) => {
  loading.value = true
  const res = await remove(allocateInfo.value?.id, code)
  if (res?.code === HttpCode.SUCCESS) {
    await getInfo()
    $toast.success('删除成功')
    loading.value = false
  }
  else {
    $toast.error(res?.message ?? '删除失败')
  }
  loading.value = false
}, 200)

/** 添加产品 */
async function addProduct() {
  const params = {
    id: allocateInfo.value?.id,
    /** 旧料搜索时使用 旧料搜索code集合 */
    codes: isOldCodeSearch.value ? selectedCategories.value : [pCode.value],
  }
  const res = await add(params)
  if (res?.code === HttpCode.SUCCESS) {
    await getInfo()
    $toast.success('添加成功')
    pCode.value = ''
    loading.value = false
    isAddModel.value = false
  }
  else {
    $toast.error(res?.message ?? '添加失败')
  }
}

const scanit = useDebounceFn(async () => {
  try {
    const wx = await useWxWork()
    const code = await wx?.scanQRCode()
    if (code) {
      pCode.value = code
    }
    else {
      $toast.error('扫码失败，请重试')
    }
  }
  catch (error) {
    throw new Error(`扫码失败: ${error || '未知错误'}`)
  }
}, 1000)

/** 调拨产品列表 */
const productList = computed(() => {
  if (!type.value) {
    return []
  }
  return type.value === GoodsTypePure.ProductFinish ? allocateInfo.value.product_finisheds : allocateInfo.value.product_olds
})

/** 单条添加搜索配件参数 */
const searchParams = ref({
  label: 'code',
  val: '',
} as
{
  label: keyof ProductOlds
  val: any
})
const options = ref([
  { label: '旧料编号', value: 'code' },
  { label: '旧料名称', value: 'name' },
])

/** 搜索要入库的配件 */
async function searchOldList() {
  const obj = {} as Partial<ProductOlds>
  obj[searchParams.value.label] = searchParams.value.val
  await getOldList({ page: 1, limit: 20, where: { ...obj } })
}

/** 全选/全不选 */
function toggleSelectAll(event: any) {
  if (!oldList.value?.length)
    return
  if (event.target.checked) {
    selectedCategories.value = oldList.value.map(cat => cat.id)
  }
  else {
    selectedCategories.value = []
  }
}

/**
 * 列表导出excel表格
 */
async function downloadLocalFile() {
  loading.value = true
  try {
    const res = await getAllocateInfoAll({ all: true, id: allocateInfo.value.id })
    if (res?.code === HttpCode.SUCCESS) {
      if (!res.data.product_finisheds?.length && !res.data.product_olds?.length) {
        loading.value = false
        return $toast.error('空列表')
      }
      const summary: [string, string | number][] = [
        ['调拨单号', res.data.id],
        ['调拨数量', res.data.product_count],
        ['入网费合计', res.data.product_total_access_fee],
        ['标签价合计', res.data.product_total_label_price],
        ['金重合计', res.data.product_total_weight_metal],
        ['调出门店', res.data?.from_store?.name ?? ''],
        ['调入门店', res.data?.to_store?.name ?? ''],
      ]

      if (type.value === GoodsTypePure.ProductFinish) {
        await exportProductListToXlsx(res.data.product_finisheds, finishedFilterListToArray.value, '调拨单详情货品列表', summary)
        loading.value = false
      }
      if (type.value === GoodsTypePure.ProductOld) {
        await exportProductListToXlsx(res.data.product_olds, oldFilterListToArray.value, '调拨单详情货品列表', summary, GoodsTypePure.ProductOld)
        loading.value = false
      }
    }
  }
  catch (err) {
    $toast.error('导出失败')
    throw new Error(`${err}`)
  }
  finally {
    loading.value = false
  }
}

async function submitGoods(data: ExcelData[]) {
  const codes = data.map(item => String(item.code).trim())
  if (!codes.length)
    return $toast.error('批量导入的数据为空')
  loading.value = true
  try {
    const params = {
      id: allocateInfo.value?.id,
      codes,
    }
    const res = await add(params)
    if (res?.code === HttpCode.SUCCESS) {
      await getInfo()
      $toast.success('添加成功')
      isImportModel.value = false
    }
    else {
      $toast.error(res?.message ?? '添加失败')
    }
  }
  finally {
    pCode.value = ''
    uploadRef.value?.clearData()
    loading.value = false
  }
}

/** 清空列表 */
const clearFun = useThrottleFn(async () => {
  if (!allocateInfo.value?.product_count) {
    return $toast.error('列表为空')
  }
  loading.value = true
  try {
    const res = await clear(allocateInfo.value?.id)
    if (res?.code === HttpCode.SUCCESS) {
      await getInfo()
      $toast.success('清空成功')
    }
    else {
      $toast.error(res?.message ?? '清空失败')
    }
  }
  finally {
    loading.value = false
  }
}, 1000)
</script>

<template>
  <div class="storage pb-20 px-4">
    <div class="grid-12 pt-4">
      <div class="flex flex-col gap-4 col-12" uno-lg="col-8 offset-2" uno-sm="col-12">
        <template v-if="type === GoodsTypePure.ProductFinish">
          <product-allocate-base :info="allocateInfo" :filter-list="allocateFilterList" :filter-list-to-array="allocateFilterListToArray" :product-list="allocateInfo.product_finisheds" />
        </template>
        <template v-if="type === GoodsTypePure.ProductOld">
          <product-allocate-base :info="allocateInfo" :filter-list="allocateFilterList" :filter-list-to-array="allocateFilterListToArray" :product-list="allocateInfo.product_olds" />
        </template>

        <template v-if="productList?.length">
          <div class="p-4 blur-bgc rounded-6">
            <div class="text-[rgba(57,113,243,1)] flex mb-4" @click="downloadLocalFile">
              <icon name="i-svg:download" :size="16" color="#666" />
              导出数据
            </div>
            <template v-if="type === GoodsTypePure.ProductFinish">
              <template v-for="(item, index) in allocateInfo.product_finisheds" :key="index">
                <div class="mb-2">
                  <sale-order-nesting :title="item.name" :info="allocateInfo">
                    <template #left>
                      <!-- 状态为盘点中时可以删除 -->
                      <template v-if="allocateInfo.status === 1">
                        <icon class="cursor-pointer" name="i-svg:reduce" :size="20" @click="delProduct(item.id)" />
                      </template>
                      <common-tags type="pink" :text="GoodsStatusMap[item.status as GoodsStatus]" :is-oval="true" />
                    </template>
                    <template #info>
                      <product-base-info :info="item" :filter-list="finishedFilterListToArray" />
                    </template>
                  </sale-order-nesting>
                </div>
              </template>
            </template>
            <template v-if="type === GoodsTypePure.ProductOld">
              <template v-for="(item, index) in allocateInfo.product_olds" :key="index">
                <sale-order-nesting :title="item.name" :info="allocateInfo">
                  <template #left>
                    <!-- 状态为盘点中时可以删除 -->
                    <template v-if="allocateInfo.status === 1">
                      <icon class="cursor-pointer" name="i-svg:reduce" :size="20" @click="delProduct(item.id)" />
                    </template>
                    <common-tags type="pink" :text="GoodsStatusMap[item.status as GoodsStatus]" :is-oval="true" />
                  </template>
                  <template #info>
                    <product-base-info :info="item" :filter-list="oldFilterListToArray" />
                  </template>
                </sale-order-nesting>
              </template>
            </template>
            <common-page
              v-model:page="page" :total="allocateInfo.product_count" :limit="limit" @update:page="() => {
                pull()
              }
              " />
          </div>
        </template>
      </div>
    </div>
    <common-model v-model="isAddModel" title="添加" :show-ok="true" cancel-text="取消" confirm-text="确认添加" @confirm="addProduct()">
      <div class="min-h-[140px]">
        <template v-if="type === GoodsTypePure.ProductFinish">
          <div class="flex justify-center items-center mb-6">
            <n-input v-model:value="pCode" placeholder="输入成品条码" round @focus="focus" />
            <icon class="ml-2" name="i-icon:scanit" :size="18" @click="scanit" />
          </div>
        </template>
        <template v-else-if="type === GoodsTypePure.ProductOld">
          <div class="navbar">
            <div :class="!isOldCodeSearch ? 'selectNav' : 'nav'" @click="isOldCodeSearch = false">
              扫码添加
            </div>
            <div :class="isOldCodeSearch ? 'selectNav' : 'nav'" @click="isOldCodeSearch = true">
              搜索
            </div>
          </div>
          <template v-if="!isOldCodeSearch">
            <div class="flex justify-center items-center mb-6">
              <n-input v-model:value="pCode" placeholder="输入产品条码" round @focus="focus" />
              <icon class="ml-2" name="i-icon:scanit" :size="18" @click="scanit" />
            </div>
          </template>
          <template v-else>
            <div class="grid grid-cols-[30%_60%_10%] items-center gap-2 text-color">
              <div class="">
                <n-select
                  v-model:value="searchParams.label"
                  :options="options" @focus="focus"
                  @change="searchParams.val = ''" />
              </div>
              <div>
                <n-input v-model:value="searchParams.val" placeholder="请搜索" @keydown.enter="searchOldList" @focus="focus" />
              </div>
              <div @click="searchOldList">
                搜索
              </div>
            </div>
            <div class="m-4 category-list max-h-[400px] min-h-[200px] overflow-y-auto">
              <table>
                <thead>
                  <tr class="table-color">
                    <th class="sticky-left table-color px-2">
                      <input type="checkbox" :disabled="oldList?.length === 0" @change="toggleSelectAll" @focus="focus">
                    </th>
                    <th class="tabel-text">
                      旧料编号
                    </th>
                    <th class="tabel-text">
                      条码
                    </th>
                    <th class="tabel-text">
                      货品名称
                    </th>
                    <th class="tabel-text">
                      标签价
                    </th>
                    <th class="tabel-text">
                      金重
                    </th>
                  </tr>
                </thead>

                <template v-if="oldList?.length">
                  <tbody class="pt-2">
                    <div>{{ selectedCategories }}</div>
                    <template v-for="(old, i) in oldList" :key="i">
                      <tr class="table-color">
                        <td class="sticky-left table-color py-1 px-2">
                          <input v-model="selectedCategories" type="checkbox" :value="old.code" @focus="focus">
                        </td>
                        <td class="tabel-text">
                          {{ old.id }}
                        </td>
                        <td class="tabel-text">
                          {{ old.code }}
                        </td>
                        <td class="tabel-text">
                          {{ old.name }}
                        </td>
                        <td class="tabel-text">
                          {{ old.label_price }}
                        </td>
                        <td class="tabel-text">
                          {{ old.weight_metal }}
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </template>
              </table>
              <template v-if="!oldList?.length">
                <div class="flex justify-center items-center">
                  <common-empty size="100" text="暂无数据" />
                </div>
              </template>
            </div>
          </template>
        </template>
      </div>
    </common-model>
    <!-- 调出门店者操作 -->
    <template v-if="allocateInfo.status === AllocateStatus.Draft && myStore.id === allocateInfo.from_store_id">
      <common-button-bottom>
        <template #content>
          <div class="w-[100%]">
            <div class="bottom-fun grid grid-cols-[26%_26%_auto] gap-2">
              <div class="cursor-pointer cancel-btn" @click="clearFun">
                清空列表
              </div>
              <div class="cursor-pointer cancel-btn" @click="cancel">
                撤销
              </div>
              <div class="cursor-pointer confirm-btn" @click="confirm">
                开始调拨
              </div>
            </div>
          </div>
        </template>
      </common-button-bottom>
    </template>
    <!-- 调入门店者操作 调拨方式未调拨入库是没有权限设置 -->
    <template v-if="allocateInfo.status === AllocateStatus.InTransit">
      <template v-if="allocateInfo.method === 2 || myStore.id === allocateInfo.to_store_id">
        <common-button-bottom cancel-text="取消调拨" confirm-text="完成调拨" @cancel="cancel" @confirm="finish" />
      </template>
      <template v-if="myStore?.id === allocateInfo.from_store_id">
        <common-button-one text="取消调拨" @confirm="cancel" />
      </template>
    </template>
    <!-- 状态为草稿中 增加产品 -->
    <template v-if="allocateInfo.status === AllocateStatus.Draft && myStore.id && myStore.id === allocateInfo.from_store_id">
      <common-create @click="isChooseModel = true" />
    </template>
    <product-upload-choose v-model:is-model="isChooseModel" title="调拨" @go-add="isChooseModel = false; isAddModel = true" @batch="isImportModel = true" />
    <product-allocate-force ref="uploadRef" v-model="isImportModel" @upload="submitGoods" />
    <correspond-store :correspond-ids="[allocateInfo.from_store_id, allocateInfo.to_store_id]" />
    <common-loading v-model="loading" title="正在处理中" />
  </div>
</template>

<style lang="scss" scoped>
.key {
  --uno: 'text-size-[14px] color-[#666] dark:color-[#CBCDD1] mr-2 whitespace-nowrap';
}
.value {
  --uno: 'text-size-[14px] color-[#333] dark:color-[#fff] w-[60%]';
  text-overflow: ellipsis; /* 超出显示省略号 */
  white-space: nowrap; /* 禁止换行 */
  overflow: hidden;
}
.info-row {
  --uno: 'flex justify-between mb-2';
  .info-title {
    --uno: 'text-color';
  }
  .info-val {
    --uno: 'text-color-light w-70% text-right';
  }
}
.tabel-text {
  --uno: 'whitespace-nowrap px-2 py-1 text-center text-color';
}

.navbar {
  --uno: 'flex grid gap-4 justify-center mb-4';

  .selectNav {
    --uno: 'text-[rgb(47,128,237)] font-bold pb-1';
    border-bottom: solid 2px rgb(47, 128, 237);
  }
  .nav {
    --uno: 'text-color';
  }
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

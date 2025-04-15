<script setup lang="ts">
const { getAllocateInfo, getAllocateWhere, confirmAllcate, cancelAllcate, finishAllcate, remove, add } = useAllocate()
const { allocateInfo, allocateFilterList, allocateFilterListToArray } = storeToRefs(useAllocate())
const { useWxWork } = useWxworkStore()
const { getFinishedWhere, getFinishedList } = useFinished()
const { finishedFilterListToArray, finishedList } = storeToRefs(useFinished())
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

const { $toast } = useNuxtApp()
/** 添加货品弹窗显隐 */
const isAddModel = ref(false)
/** 添加货品条码 */
const pCode = ref()
/** 成品条码添加还是成品条码搜索添加 */
const isOldCodeSearch = ref(false)

async function getWhere() {
  if (GoodsTypePure.ProductFinish === type.value) {
    await getFinishedWhere()
  }
  else if (GoodsTypePure.ProductOld === type.value) {
    await getOldWhere()
  }
}

if (route.query.id) {
  await getAllocateInfo(route.query.id as string)
  type.value = allocateInfo.value.type
  await getAllocateWhere()
  await getWhere()
}

async function cancel() {
  const res = await cancelAllcate(allocateInfo.value?.id)
  if (res?.code === HttpCode.SUCCESS) {
    await getAllocateInfo(route.query.id as string)
    $toast.success('取消调拨成功', 1000)
    setTimeout(() => {
      router.back()
    }, 1000)
  }
  else {
    $toast.error(res?.message ?? '取消调拨失败')
  }
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

  const res = await confirmAllcate(allocateInfo.value?.id)
  if (res?.code === HttpCode.SUCCESS) {
    await getAllocateInfo(route.query.id as string)
    $toast.success('确认调拨成功')
  }
  else {
    $toast.error(res?.message ?? '确认调拨失败')
  }
}
/** 完成调拨 */
async function finish() {
  const res = await finishAllcate(allocateInfo.value?.id)
  if (res?.code === HttpCode.SUCCESS) {
    await getAllocateInfo(route.query.id as string)
    $toast.success('完成调拨成功')
  }
  else {
    $toast.error(res?.message ?? '完成调拨失败')
  }
}

const delProduct = useThrottleFn(async (code: ProductFinisheds['code']) => {
  const res = await remove(allocateInfo.value?.id, code)
  if (res?.code === HttpCode.SUCCESS) {
    await getAllocateInfo(route.query.id as string)
    $toast.success('删除成功')
  }
  else {
    $toast.error(res?.message ?? '删除失败')
  }
}, 200)

function create() {
  isAddModel.value = true
}

/** 产品code获取产品id */
async function getProductId() {
  await getFinishedList({ page: 1, limit: 1, where: { store_id: myStore.value.id, code: pCode.value } })
  if (finishedList.value?.length) {
    return [finishedList.value[0].id]
  }
  return []
}

/** 产品code获取产品id */
async function getOldId() {
  await getOldList({ page: 1, limit: 1, where: { store_id: myStore.value.id, code: pCode.value } })
  if (oldList.value?.length) {
    return [oldList.value[0].id]
  }
  return []
}

/** 添加产品 */
async function addProduct() {
  let ids
  if (type.value === GoodsTypePure.ProductFinish) {
    ids = await getProductId()
  }
  else {
    if (isOldCodeSearch.value) {
      ids = await getOldids()
    }
    else {
      ids = await getOldId()
    }
  }
  if (!ids) {
    return
  }
  if (!ids.length) {
    $toast.warning('没有找到相关货品')
    return
  }
  const res = await add(allocateInfo.value?.id, ids)
  if (res?.code === HttpCode.SUCCESS) {
    await getAllocateInfo(route.query.id as string)
    $toast.success('添加成功')
    pCode.value = ''
    isAddModel.value = false
  }
  else {
    $toast.error(res?.message ?? '添加失败')
  }
}

async function scanit() {
  try {
    const wx = await useWxWork()
    pCode.value = wx?.scanQRCode()
    const result = await wx?.scanQRCode()
    if (result) {
      pCode.value = result
    }
    else {
      $toast.error('扫码失败，请重试')
    }
  }
  catch (error) {
    throw new Error(`扫码失败: ${error || '未知错误'}`)
  }
}

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

const selectedCategories = ref([] as ProductOlds['id'][])

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
/** 多选 */
async function getOldids() {
  const product: ProductOlds['id'][] = []
  selectedCategories.value.forEach((id: ProductAccessories['id']) => {
    oldList.value?.forEach((cat) => {
      if (cat.id === id) {
        product.push(JSON.parse(JSON.stringify(cat)).id)
      }
    })
  })
  return product
}
</script>

<template>
  <div class="storage pb-20">
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
            <div class="text-[14px] pb-4 text-color">
              共 {{ productList.length }} 条数据
            </div>
            <template v-if="type === GoodsTypePure.ProductFinish">
              <template v-for="(item, index) in allocateInfo.product_finisheds" :key="index">
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
          </div>
        </template>
      </div>
    </div>
    <common-model v-model="isAddModel" title="添加" :show-ok="true" cancel-text="取消" confirm-text="确认添加" @confirm="addProduct">
      <div class="min-h-[140px]">
        <template v-if="type === GoodsTypePure.ProductFinish">
          <div class="flex justify-center items-center mb-6">
            <n-input v-model:value="pCode" placeholder="输入成品条码" round />
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
              <n-input v-model:value="pCode" placeholder="输入产品条码" round />
              <icon class="ml-2" name="i-icon:scanit" :size="18" @click="scanit" />
            </div>
          </template>
          <template v-else>
            <div class="grid grid-cols-[30%_60%_10%] items-center gap-2 text-color">
              <div class="">
                <n-select
                  v-model:value="searchParams.label" :options="options"
                  @change="searchParams.val = ''" />
              </div>
              <div>
                <n-input v-model:value="searchParams.val" placeholder="请搜索" @keydown.enter="searchOldList" />
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
                      <input type="checkbox" :disabled="oldList?.length === 0" @change="toggleSelectAll">
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
                    <template v-for="(old, i) in oldList" :key="i">
                      <tr class="table-color">
                        <td class="sticky-left table-color py-1 px-2">
                          <input v-model="selectedCategories" type="checkbox" :value="old.id">
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
    <template v-if="allocateInfo.status === 1 && myStore.id === allocateInfo.from_store_id">
      <common-button-bottom cancel-text="取消调拨" confirm-text="开始调拨" @cancel="cancel" @confirm="confirm" />
    </template>
    <!-- 调入门店者操作 调拨方式未调拨入库是没有权限设置 -->
    <template v-if="allocateInfo.status === 2">
      <template v-if="allocateInfo.method === 2 || myStore.id === allocateInfo.to_store_id">
        <common-button-bottom cancel-text="取消调拨" confirm-text="完成调拨" @cancel="cancel" @confirm="finish" />
      </template>
    </template>
    <!-- 状态为盘点中 增加产品 -->
    <template v-if="allocateInfo.status === 1">
      <common-create @click="create" />
    </template>
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
</style>

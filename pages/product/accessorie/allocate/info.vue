<script setup lang="ts">
const { getAccessorieAllocateInfo, getAccessorieAllocateInfoTotal, getAccessorieAllocateWhere, confirmAllcate, cancelAllcate, finishAllcate, remove, clear, addAccessorieAllocate } = useAccessorieAllocate()
const { accessorieFilterListToArray } = storeToRefs(useAccessorie())
const { getAccessorieWhere } = useAccessorie()
const { accessorieAllocateInfo, accessorieAllocateFilterList, accessorieAllocateFilterListToArray } = storeToRefs(useAccessorieAllocate())
const { myStore } = storeToRefs(useStores())
const { getMyStore } = useStores()

useSeoMeta({
  title: '调拨单详情',
})
const route = useRoute()
const router = useRouter()
const { $toast } = useNuxtApp()
const allocateId = ref()
const clearDialog = ref(false)
const isChooseModel = ref(false)
const isImportModel = ref(false)
const uploadRef = ref()
const page = ref(1)
const limit = ref(20)
if (route.query.id) {
  allocateId.value = route.query.id
  await getInfo()
  await getAccessorieAllocateWhere()
  await getAccessorieWhere()
  await getMyStore()
}

async function getInfo() {
  const parmas = {
    id: route.query?.id,
    page: page.value,
    limit: limit.value,
  } as AccessorieAllocateInfoParams
  await getAccessorieAllocateInfo(parmas)
}

async function cancel() {
  const res = await cancelAllcate(accessorieAllocateInfo.value?.id)
  if (res?.code === HttpCode.SUCCESS) {
    page.value = 1
    await getInfo()
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
  if (!accessorieAllocateInfo.value?.products?.length) {
    $toast.error('请添加调拨配件')
    return
  }
  const res = await confirmAllcate(accessorieAllocateInfo.value?.id)
  if (res?.code === HttpCode.SUCCESS) {
    page.value = 1
    await getInfo()
    $toast.success('确认调拨成功')
  }
  else {
    $toast.error(res?.message ?? '确认调拨失败')
  }
}
/** 完成调拨 */
async function finish() {
  const res = await finishAllcate(accessorieAllocateInfo.value?.id)
  if (res?.code === HttpCode.SUCCESS) {
    page.value = 1
    await getInfo()
    $toast.success('完成调拨成功')
  }
  else {
    $toast.error(res?.message ?? '完成调拨失败')
  }
}

/** 删除产品 */
async function delProduct(id: string) {
  const params = {
    id: accessorieAllocateInfo.value?.id,
    product_id: id,
  } as AddAccessorieAllocateDel

  const res = await remove(params)
  if (res?.code === HttpCode.SUCCESS) {
    page.value = 1
    await getInfo()
    $toast.success('删除成功')
  }
  else {
    $toast.error(res?.message ?? '删除失败')
  }
}
const debouncedDelProduct = useThrottleFn((id: string) => {
  delProduct(id)
}, 200)

/** 点击清空时调用，触发确认弹窗 */
function clearFun() {
  if (!accessorieAllocateInfo.value?.products?.length) {
    $toast.error('配件列表为空')
    return
  }
  clearDialog.value = true
}

/** 清空调拨单中所有产品 */
async function clearProduct() {
  const ids = accessorieAllocateInfo.value?.products?.map(item => item.id) ?? []
  if (!ids.length)
    return $toast.error('配件列表为空')
  const res = await clear(accessorieAllocateInfo.value?.id)

  if (res?.code === HttpCode.SUCCESS) {
    page.value = 1
    await getInfo()
    $toast.success('清空成功')
  }
  else {
    $toast.error(res?.message ?? '清空调拨单配件失败')
  }
}

const updatePage = async (e: number) => {
  page.value = e
  await getInfo()
}

async function submitGoods(e: AddAccessorieAllocateProduct[]) {
  const params = {
    id: accessorieAllocateInfo.value?.id,
    products: e,
  }
  const res = await addAccessorieAllocate(params)
  if (res?.code === HttpCode.SUCCESS) {
    $toast.success('添加成功')
    uploadRef.value.clearData()
    await getInfo()
  }
  else {
    uploadRef.value.clearData()
    $toast.error(res?.message ?? '添加失败')
  }
}

// 打印
const showPrintModel = ref(false)
const printFn = async () => {
//  调接口
  await getAccessorieAllocateInfoTotal({ id: accessorieAllocateInfo.value?.id })
  showPrintModel.value = true
}
</script>

<template>
  <div class="storage pb-20 px-4">
    <product-allocate-access-print v-model="showPrintModel" />
    <div class="grid-12 pt-4">
      <div class="flex flex-col gap-4 col-12" uno-lg="col-8 offset-2" uno-sm="col-12">
        <div class="rounded-6 bg-white w-auto blur-bga top">
          <common-gradient title="基础信息">
            <template #body>
              <div class="flex flex-col gap-4">
                <div class="operation-information flex flex-col gap-1">
                  <div class="other-information flex flex-col gap-1">
                    <div class="info-row">
                      <div class="info-title">
                        状态
                      </div>
                      <div class="info-val">
                        {{ accessorieAllocateFilterList.status?.preset[accessorieAllocateInfo.status] }}
                      </div>
                    </div>
                    <template v-for="(item, index) in accessorieAllocateFilterListToArray" :key="index">
                      <template v-if="item.info">
                        <div class="info-row">
                          <div class="info-title">
                            {{ item.label }}
                          </div>
                          <template v-if="item.type === 'date'">
                            <div class="val">
                              {{ accessorieAllocateInfo[item.name] ? formatTimestampToDateTime(accessorieAllocateInfo[item.name] as string || '') : '' }}
                            </div>
                          </template>
                          <template v-else-if="item.name === 'product_count'">
                            <div class="val">
                              {{ accessorieAllocateInfo?.product_count }}
                            </div>
                          </template>
                          <template v-else-if="item.name === 'product_total'">
                            <div class="val">
                              {{ accessorieAllocateInfo?.product_total }}
                            </div>
                          </template>
                          <template v-else>
                            <template v-if="item.input === 'text'">
                              <div class="info-val">
                                {{ accessorieAllocateInfo[item.name] }}
                              </div>
                            </template>
                            <template v-else-if="item.input === 'select'">
                              <div class="info-val">
                                {{ accessorieAllocateFilterList[item.name]?.preset[accessorieAllocateInfo[item.name] as number] }}
                              </div>
                            </template>
                            <template v-else-if="item.input === 'search'">
                              <template v-if="item.name === 'to_region_id'">
                                <div class="val">
                                  {{ accessorieAllocateInfo?.to_region?.name || '' }}
                                </div>
                              </template>
                              <template v-if="item.name === 'to_store_id'">
                                <div class="val">
                                  {{ accessorieAllocateInfo?.to_store?.alias || '' }}
                                </div>
                              </template>
                              <template v-if="item.name === 'from_store_id'">
                                <div class="val">
                                  {{ accessorieAllocateInfo?.from_store?.alias || '' }}
                                </div>
                              </template>
                              <template v-if="item.name === 'receiver_id'">
                                <div class="val">
                                  {{ accessorieAllocateInfo?.receiver?.nickname || '' }}
                                </div>
                              </template>
                              <template v-if="item.name === 'initiator_id'">
                                <div class="val">
                                  {{ accessorieAllocateInfo?.initiator?.nickname || '' }}
                                </div>
                              </template>
                            </template>
                          </template>
                        </div>
                      </template>
                    </template>
                  </div>
                </div>
              </div>
            </template>
          </common-gradient>
        </div>
        <template v-if="accessorieAllocateInfo.products?.length">
          <div class="p-4 blur-bgc rounded-6">
            <div class="flex justify-between pb-4 items-center">
              <div class="text-[14px] text-color">
                共 {{ accessorieAllocateInfo.product_count }} 条数据
              </div>
              <div
                class="text-center bg-[#1b6ceb] color-[#fff] px-[8px] py-[4px] rounded-[8px] cursor-pointer"
                @click="printFn">
                打印
              </div>
            </div>
            <template v-for="(item, index) in accessorieAllocateInfo.products" :key="index">
              <div class="grid mb-3">
                <sale-order-nesting :title="item.name || ''" :index="index" :info="accessorieAllocateInfo">
                  <template #left>
                    <!-- 状态为盘点中时可以删除 -->
                    <template v-if="accessorieAllocateInfo.status === 1">
                      <icon class="cursor-pointer" name="i-svg:reduce" :size="20" @click="debouncedDelProduct(item.id)" />
                    </template>
                  </template>
                  <template #info>
                    <div class="px-[16px] pb-4 grid grid-cols-2 justify-between sm:grid-cols-3 md:grid-cols-4 gap-4">
                      <template v-for="(filter, findex) in accessorieFilterListToArray" :key="findex">
                        <template v-if="filter.info && (filter.name as string) !== 'created_at' && item[filter.name]">
                          <div class="flex">
                            <div class="key">
                              {{ filter.label }}
                            </div>
                            <template v-if="filter.input === 'select'">
                              <div class="value">
                                <common-tooltip :val="filter.preset[item[filter.name] as string]" />
                              </div>
                            </template>
                            <template v-else>
                              <div class="value">
                                <common-tooltip :val="item[filter.name]" />
                              </div>
                            </template>
                          </div>
                        </template>
                      </template>
                    </div>
                  </template>
                  <common-page v-model:page="page" :total="accessorieAllocateInfo.product_count" :limit="20" @update:page="updatePage" />
                </sale-order-nesting>
              </div>
            </template>
            <common-page
              v-model:page="page" :total="accessorieAllocateInfo.product_count" :limit="limit" @update:page="() => {
                getInfo()
              }
              " />
          </div>
        </template>
      </div>
    </div>
    <template v-if="accessorieAllocateInfo.status === AllocateStatus.Draft && myStore?.id === accessorieAllocateInfo.from_store_id">
      <common-button-bottom cancel-text="取消调拨" confirm-text="确认调拨" @cancel="cancel" @confirm="confirm">
        <template #content>
          <div class="w-[100%]">
            <div class="bottom-fun grid grid-cols-[26%_26%_auto] gap-2">
              <div class="cursor-pointer cancel-btn" @click="clearFun">
                清空列表
              </div>
              <div class="cursor-pointer cancel-btn" @click="cancel">
                取消调拨
              </div>
              <div class="cursor-pointer confirm-btn" @click="confirm">
                确认调拨
              </div>
            </div>
          </div>
        </template>
      </common-button-bottom>
    </template>
    <template v-if="accessorieAllocateInfo.status === AllocateStatus.InTransit">
      <template v-if="myStore?.id === accessorieAllocateInfo.to_store_id">
        <common-button-bottom cancel-text="取消调拨" confirm-text="完成调拨" @cancel="cancel" @confirm="finish" />
      </template>
      <template v-if="myStore?.id === accessorieAllocateInfo.from_store_id">
        <common-button-one text="取消调拨" @confirm="cancel" />
      </template>
    </template>
    <common-confirm v-model:show="clearDialog" icon="error" title="清空列表" text="确认要清空所有调拨的产品吗?" @submit="clearProduct" />
    <!-- 状态为草稿中 增加产品 -->
    <template v-if="accessorieAllocateInfo.status === AllocateStatus.Draft && myStore?.id === accessorieAllocateInfo.from_store_id">
      <common-create @create="isChooseModel = true" />
    </template>
    <product-upload-choose v-model:is-model="isChooseModel" title="调拨" @go-add="jump('/product/accessorie/allocate/addproduct', { id: accessorieAllocateInfo.id })" @batch="isImportModel = true" />
    <accessorie-warehouse-force ref="uploadRef" v-model="isImportModel" @upload="submitGoods" />
    <correspond-store :correspond-ids="[accessorieAllocateInfo.from_store_id || '', accessorieAllocateInfo.to_store_id || '']" />
  </div>
</template>

<style lang="scss" scoped>
.key {
  --uno: 'text-size-[14px] whitespace-nowrap color-[#666] dark:color-[#CBCDD1] mr-2';
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

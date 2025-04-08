<script setup lang="ts">
const { getAllocateInfo, confirmAllcate, cancelAllcate, finishAllcate, remove, add } = useAllocate()
const { allocateInfo, allocateFilterList } = storeToRefs(useAllocate())
const { useWxWork } = useWxworkStore()
const { getFinishedWhere } = useFinished()
const { finishedFilterListToArray } = storeToRefs(useFinished())
useSeoMeta({
  title: '调拨单详情',
})
const route = useRoute()
const { $toast } = useNuxtApp()
/** 添加货品弹窗显隐 */
const isAddModel = ref(false)
/** 添加货品条码 */
const pCode = ref()
if (route.query.id) {
  await getAllocateInfo(route.query.id as string)
  await getFinishedWhere()
}

type ProductKey = keyof ProductFinisheds
/** 汇总 */
function sum(key: ProductKey) {
  return allocateInfo.value?.products?.reduce((sum, item) => sum + item[key], 0) ?? 0
}

const goodsStatus = {
  0: '全部',
  1: '正常',
  2: '报损',
  3: '调拨',
  4: '已售',
  5: '退货',
  6: '盘点中',
}
async function cancel() {
  const res = await cancelAllcate(allocateInfo.value?.id)
  if (res?.code === HttpCode.SUCCESS) {
    await getAllocateInfo(route.query.id as string)
    $toast.success('取消调拨成功')
  }
  else {
    $toast.error(res?.message ?? '取消调拨失败')
  }
}

async function confirm() {
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

/** 删除产品 */
async function delProduct(code: ProductFinisheds['code']) {
  const res = await remove(allocateInfo.value?.id, code)
  if (res?.code === HttpCode.SUCCESS) {
    await getAllocateInfo(route.query.id as string)
    $toast.success('删除成功')
  }
  else {
    $toast.error(res?.message ?? '删除失败')
  }
}

function create() {
  isAddModel.value = true
}
/** 添加产品 */
async function addProduct() {
  const res = await add(allocateInfo.value?.id, pCode.value)
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
</script>

<template>
  <div class="storage pb-20">
    <div class="grid-12 pt-4">
      <div class="flex flex-col gap-4 col-12" uno-lg="col-8 offset-2" uno-sm="col-12">
        <div class="w-[40%] text-[#fff]">
          <product-manage-company />
        </div>
        <div class="rounded-6 bg-white w-auto blur-bga top">
          <common-gradient title="基础信息">
            <template #body>
              <div class="flex flex-col gap-4">
                <div class="operation-information flex flex-col gap-1">
                  <div class="info-row">
                    <div class="info-title">
                      操作人
                    </div>
                    <div class="info-val">
                      {{ allocateInfo.operator?.nickname }}
                    </div>
                  </div>
                  <div class="info-row">
                    <div class="info-title">
                      调拨单号
                    </div>
                    <div class="info-val">
                      {{ allocateInfo.id }}
                    </div>
                  </div>
                  <div class="info-row">
                    <div class="info-title">
                      状态
                    </div>
                    <div class="info-val">
                      {{ allocateFilterList.status?.preset[allocateInfo.status] }}
                    </div>
                  </div>
                  <div class="h-0.5 bg-[#E6E6E8]" />
                  <div class="other-information flex flex-col gap-1">
                    <div class="info-row">
                      <div class="info-title">
                        调出门店
                      </div>
                      <div class="info-val">
                        {{ allocateInfo?.from_store?.name }}
                      </div>
                    </div>
                    <div class="info-row">
                      <div class="info-title">
                        调入门店
                      </div>
                      <div class="info-val">
                        {{ allocateInfo?.to_store.name }}
                      </div>
                    </div>
                    <div class="info-row">
                      <div class="info-title">
                        调拨方式
                      </div>
                      <div class="info-val">
                        {{ allocateFilterList.method?.preset[allocateInfo.method] }}
                      </div>
                    </div>
                    <div class="info-row">
                      <div class="info-title">
                        调拨原因
                      </div>
                      <div class="info-val">
                        {{ allocateFilterList.reason?.preset[allocateInfo.reason] }}
                      </div>
                    </div>
                    <div class="info-row">
                      <div class="info-title">
                        调拨状态
                      </div>
                      <div class="info-val">
                        {{ allocateFilterList.status?.preset[allocateInfo.status] }}
                      </div>
                    </div>
                    <div class="info-row">
                      <div class="info-title">
                        仓库类型
                      </div>
                      <div class="info-val">
                        {{ allocateFilterList.type?.preset[allocateInfo.type] }}
                      </div>
                    </div>
                    <div class="info-row">
                      <div class="info-title">
                        备注
                      </div>
                      <div class="info-val">
                        {{ allocateInfo.remark }}
                      </div>
                    </div>
                    <div class="info-row">
                      <div class="info-title">
                        创建时间
                      </div>
                      <div class="info-val">
                        {{ formatTimestampToDateTime(allocateInfo.created_at) }}
                      </div>
                    </div>
                    <div class="info-row">
                      <div class="info-title">
                        完成时间
                      </div>
                      <div class="info-val">
                        {{ formatTimestampToDateTime(allocateInfo.updated_at) }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="h-0.5 bg-[#E6E6E8]" />
                <div class="product-information flex flex-col gap-1">
                  <div class="info-row">
                    <div class="info-title">
                      总件数
                    </div>
                    <div class="info-val">
                      {{ allocateInfo.products?.length }}
                    </div>
                  </div>
                  <div class="info-row">
                    <div class="info-title">
                      总金重
                    </div>
                    <div class="info-val">
                      {{ sum('weight_metal') }}
                    </div>
                  </div>
                  <div class="info-row">
                    <div class="info-title">
                      总标价
                    </div>
                    <div class="info-val">
                      {{ sum('label_price') }}
                    </div>
                  </div>
                  <div class="info-row">
                    <div class="info-title">
                      总入网费
                    </div>
                    <div class="info-val">
                      {{ sum('access_fee') }}
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </common-gradient>
        </div>

        <template v-if="allocateInfo.products?.length">
          <div class="p-4 blur-bgc rounded-6">
            <div class="text-[14px] pb-4 text-color">
              共 {{ allocateInfo.products.length }} 条数据
            </div>
            <template v-for="(item, index) in allocateInfo.products" :key="index">
              <div class="grid mb-3">
                <sale-order-nesting :title="item.name" :info="allocateInfo">
                  <template #left>
                    <!-- 状态为盘点中时可以删除 -->
                    <template v-if="allocateInfo.status === 1">
                      <icon class="cursor-pointer" name="i-svg:reduce" :size="20" @click="delProduct(item.code)" />
                    </template>
                    <common-tags type="pink" :text="goodsStatus[item.status]" :is-oval="true" />
                  </template>
                  <template #info>
                    <div class="px-[16px] pb-4 grid grid-cols-2 justify-between sm:grid-cols-3 md:grid-cols-4 gap-4">
                      <template v-for="(filter, findex) in finishedFilterListToArray" :key="findex">
                        <template v-if="filter.find">
                          <div class="flex">
                            <div class="key">
                              {{ filter.label }}
                            </div>
                            <template v-if="filter.input === 'select'">
                              <div class="value">
                                {{ filter.preset[item[filter.name]] }}
                              </div>
                            </template>
                            <template v-else>
                              <div class="value">
                                {{ item[filter.name] }}
                              </div>
                            </template>
                          </div>
                        </template>
                      </template>
                      <div>
                        <span class="key">
                          工艺
                        </span>
                        <span class="value ml-auto">
                          {{ item.craft }}
                        </span>
                      </div>
                    </div>
                  </template>
                </sale-order-nesting>
              </div>
            </template>
          </div>
        </template>
      </div>
    </div>
    <common-model v-model="isAddModel" title="添加" :show-ok="true" cancel-text="取消" confirm-text="确认添加" @confirm="addProduct">
      <div class="flex justify-center items-center mb-6">
        <n-input v-model:value="pCode" placeholder="输入产品条码" round />
        <icon class="ml-2" name="i-icon:scanit" :size="18" @click="scanit" />
      </div>
    </common-model>
    <template v-if="allocateInfo.status === 1">
      <common-button-one text="确认调拨" @confirm="confirm" />
    </template>
    <template v-if="allocateInfo.status === 2">
      <common-button-bottom cancel-text="取消调拨" confirm-text="完成调拨" @cancel="cancel" @confirm="finish" />
    </template>
    <!-- 状态为盘点中 增加产品 -->
    <template v-if="allocateInfo.status === 1">
      <common-create @click="create" />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.key {
  --uno: 'text-size-[14px] color-[#666] dark:color-[#CBCDD1] mr-2';
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
</style>

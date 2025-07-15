<script setup lang="ts">
const { getAccessorieAllocateInfo, getAccessorieAllocateWhere, confirmAllcate, cancelAllcate, finishAllcate, remove } = useAccessorieAllocate()
const { accessorieAllocateInfo, accessorieAllocateFilterList, accessorieAllocateFilterListToArray } = storeToRefs(useAccessorieAllocate())
const { categoryFilterListToArray } = storeToRefs(useAccessorieCategory())
const { getAccessorieCategoryWhere } = useAccessorieCategory()
const { myStore, storesList } = storeToRefs(useStores())
const { getStoreList } = useStores()
useSeoMeta({
  title: '调拨单详情',
})
const route = useRoute()
const router = useRouter()
const { $toast } = useNuxtApp()
const allocateId = ref()
const correspondIds = ref()
if (route.query.id) {
  allocateId.value = route.query.id
  await getAccessorieAllocateInfo(route.query.id as string)
  await getAccessorieCategoryWhere()
  await getAccessorieAllocateWhere()
  await getStoreList({ limit: 20, page: 1 })
  await setCorrespondId()
}
/** 判断相应门店是否是当前门店 收集相应id */
function setCorrespondId() {
  const arr = []
  if (accessorieAllocateInfo.value?.to_store_id) {
    arr.push(accessorieAllocateInfo.value.to_store_id)
  }

  if (accessorieAllocateInfo.value?.from_store_id) {
    arr.push(accessorieAllocateInfo.value.from_store_id)
  }
  correspondIds.value = arr
}

async function cancel() {
  const res = await cancelAllcate(accessorieAllocateInfo.value?.id)
  if (res?.code === HttpCode.SUCCESS) {
    await getAccessorieAllocateInfo(route.query.id as string)
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
    await getAccessorieAllocateInfo(route.query.id as string)
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
    await getAccessorieAllocateInfo(route.query.id as string)
    $toast.success('完成调拨成功')
  }
  else {
    $toast.error(res?.message ?? '完成调拨失败')
  }
}

/** 删除产品 */
async function delProduct(id: string) {
  const res = await remove(accessorieAllocateInfo.value?.id, id)
  if (res?.code === HttpCode.SUCCESS) {
    await getAccessorieAllocateInfo(route.query.id as string)
    $toast.success('删除成功')
  }
  else {
    $toast.error(res?.message ?? '删除失败')
  }
}
const debouncedDelProduct = useThrottleFn((id: string) => {
  delProduct(id)
}, 200)

/** id获取门店名称 */
function getStoreName(id: Stores['id']) {
  const store = storesList.value.find((item: Stores) => item.id === id)
  return store?.name ?? ''
}
</script>

<template>
  <div class="storage pb-20">
    <div class="grid-12 pt-4">
      <div class="flex flex-col gap-4 col-12" uno-lg="col-8 offset-2" uno-sm="col-12">
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
                      {{ accessorieAllocateInfo.operator?.nickname }}
                    </div>
                  </div>
                  <div class="info-row">
                    <div class="info-title">
                      调拨单号
                    </div>
                    <div class="info-val">
                      {{ accessorieAllocateInfo.id }}
                    </div>
                  </div>
                  <div class="info-row">
                    <div class="info-title">
                      状态
                    </div>
                    <div class="info-val">
                      {{ accessorieAllocateFilterList.status?.preset[accessorieAllocateInfo.status] }}
                    </div>
                  </div>
                  <div class="h-0.5 bg-[#E6E6E8]" />
                  <div class="other-information flex flex-col gap-1">
                    <template v-for="(item, index) in accessorieAllocateFilterListToArray" :key="index">
                      <div class="info-row">
                        <div class="info-title">
                          {{ item.label }}
                        </div>
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
                        <template v-else-if="item.input === 'date'">
                          <div v-if="item.name === 'start_time'" class="info-val">
                            {{ formatTimestampToDateTime(accessorieAllocateInfo.created_at) }}
                          </div>
                          <div v-if="item.name === 'end_time'" class="info-val">
                            {{ formatTimestampToDateTime(accessorieAllocateInfo.updated_at) }}
                          </div>
                        </template>
                        <template v-else-if="item.input === 'search'">
                          <div class="info-val">
                            {{ getStoreName(accessorieAllocateInfo[item.name] as Stores['id']) }}
                          </div>
                        </template>
                      </div>
                    </template>
                  </div>
                </div>
                <div class="h-0.5 bg-[#E6E6E8]" />
                <div class="product-information flex flex-col gap-1">
                  <div class="info-row">
                    <div class="info-title">
                      总件数
                    </div>
                    <div class="info-val">
                      {{ accessorieAllocateInfo.product_total }}
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </common-gradient>
        </div>
        <template v-if="accessorieAllocateInfo.products?.length">
          <div class="p-4 blur-bgc rounded-6">
            <div class="text-[14px] pb-4 text-color">
              共 {{ accessorieAllocateInfo.product_count }} 条数据
            </div>
            <template v-for="(item, index) in accessorieAllocateInfo.products" :key="index">
              <div class="grid mb-3">
                <sale-order-nesting :title="item.product.category.name" :index="index" :info="accessorieAllocateInfo">
                  <template #left>
                    <!-- 状态为盘点中时可以删除 -->
                    <template v-if="accessorieAllocateInfo.status === 1">
                      <icon class="cursor-pointer" name="i-svg:reduce" :size="20" @click="debouncedDelProduct(item.product?.id)" />
                    </template>
                  </template>
                  <template #info>
                    <div class="px-[16px] pb-4 grid grid-cols-2 justify-between sm:grid-cols-3 md:grid-cols-4 gap-4">
                      <div class="flex">
                        <div class="key">
                          调拨数量
                        </div>
                        <div class="value">
                          {{ item.quantity }}
                        </div>
                        <div class="value" />
                      </div>
                      <template v-for="(filter, findex) in categoryFilterListToArray" :key="findex">
                        <template v-if="filter.create">
                          <div class="flex">
                            <div class="key">
                              {{ filter.label }}
                            </div>
                            <template v-if="filter.input === 'select'">
                              <div class="value">
                                {{ filter.preset[item.product.category[filter.name] as string] || '--' }}
                              </div>
                            </template>
                            <template v-else>
                              <div class="value">
                                {{ item.product.category[filter.name] || '--' }}
                              </div>
                            </template>
                          </div>
                        </template>
                      </template>
                    </div>
                  </template>
                </sale-order-nesting>
              </div>
            </template>
          </div>
        </template>
      </div>
    </div>
    <template v-if="accessorieAllocateInfo.status === AllocateStatus.Draft && myStore?.id === accessorieAllocateInfo.from_store_id">
      <common-button-bottom cancel-text="取消调拨" text="确认调拨" @cancel="cancel" @confirm="confirm" />
    </template>
    <template v-if="accessorieAllocateInfo.status === AllocateStatus.InTransit">
      <template v-if="accessorieAllocateInfo.method === 2 || myStore?.id === accessorieAllocateInfo.to_store_id">
        <common-button-bottom cancel-text="取消调拨" confirm-text="完成调拨" @cancel="cancel" @confirm="finish" />
      </template>
      <template v-if="myStore?.id === accessorieAllocateInfo.from_store_id">
        <common-button-one text="取消调拨" @confirm="cancel" />
      </template>
    </template>
    <!-- 状态为盘点中 增加产品 -->
    <template v-if="accessorieAllocateInfo.status === 1">
      <common-create @create="jump('/product/accessorie/allocate/addproduct', { id: accessorieAllocateInfo.id })" />
    </template>
    <correspond-store :correspond-ids="correspondIds" />
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
</style>

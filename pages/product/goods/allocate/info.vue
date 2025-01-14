<script setup lang="ts">
const { getAllocateInfo, confirmAllcate, cancelAllcate, finishAllcate, remove } = useAllocate()
const { allocateInfo, filterList } = storeToRefs(useAllocate())
useSeoMeta({
  title: '调拨单详情',
})
const route = useRoute()
const { $toast } = useNuxtApp()

if (route.query.id) {
  await getAllocateInfo(route.query.id as string)
}

type ProductKey = keyof Product
/** 汇总 */
function sum(key: ProductKey) {
  return allocateInfo.value?.product?.reduce((sum, item) => sum + item[key], 0)
}

async function cancel() {
  const res = await cancelAllcate(allocateInfo.value?.id)
  if (res.code === HttpCode.SUCCESS) {
    await getAllocateInfo(route.query.id as string)
    $toast.success('取消调拨成功')
  }
  else {
    $toast.error(res.message ?? '取消调拨失败')
  }
}

async function confirm() {
  const res = await confirmAllcate(allocateInfo.value?.id)
  if (res.code === HttpCode.SUCCESS) {
    await getAllocateInfo(route.query.id as string)
    $toast.success('确认调拨成功')
  }
  else {
    $toast.error(res.message ?? '确认调拨失败')
  }
}
/** 完成调拨 */
async function finish() {
  const res = await finishAllcate(allocateInfo.value?.id)
  if (res.code === HttpCode.SUCCESS) {
    await getAllocateInfo(route.query.id as string)
    $toast.success('完成调拨成功')
  }
  else {
    $toast.error(res.message ?? '完成调拨失败')
  }
}

/** 删除产品 */
async function delProduct(code: Product['code']) {
  const res = await remove(allocateInfo.value?.id, code)
  if (res.code === HttpCode.SUCCESS) {
    await getAllocateInfo(route.query.id as string)
    $toast.success('删除成功')
  }
  else {
    $toast.error(res.message ?? '删除失败')
  }
}
</script>

<template>
  <div class="storage">
    <div class="grid-12">
      <div class="flex flex-col gap-4 col-12" uno-lg="col-8 offset-2" uno-sm="col-12">
        <div class="rounded-6 bg-white w-auto blur-bga top">
          <common-gradient title="基础信息">
            <template #body>
              <div class="flex flex-col gap-4">
                <div class="operation-information flex flex-col gap-1">
                  <div class="flex-start gap-3 text-sm font-normal">
                    <div class="color-[#666666]">
                      操作人
                    </div>
                    <div class="color-[#333333]">
                      {{ allocateInfo.operator?.nickname }}
                    </div>
                  </div>
                  <div class="flex-start gap-3 text-sm font-normal">
                    <div class="color-[#666666]">
                      入库单号
                    </div>
                    <div class="color-[#333333]">
                      {{ allocateInfo.id }}
                    </div>
                  </div>
                  <div class="flex-start gap-3 text-sm font-normal">
                    <div class="color-[#666666]">
                      状态
                    </div>
                    <div class="color-[#333333]">
                      {{ filterList.status?.preset[allocateInfo.status] }}
                    </div>
                  </div>
                  <div class="h-0.5 bg-[#E6E6E8]" />
                  <div class="product-information flex flex-col gap-1">
                    <div class="flex-start gap-3 text-sm font-normal">
                      <div class="color-[#666666]">
                        总件数
                      </div>
                      <div class="color-[#333333]">
                        {{ allocateInfo.product?.length }}
                      </div>
                    </div>
                    <div class="flex-start gap-3 text-sm font-normal">
                      <div class="color-[#666666]">
                        总金重
                      </div>
                      <div class="color-[#333333]">
                        {{ sum('weight_metal') }}
                      </div>
                    </div>
                    <div class="flex-start gap-3 text-sm font-normal">
                      <div class="color-[#666666]">
                        总标价
                      </div>
                      <div class="color-[#333333]">
                        {{ sum('price') }}
                      </div>
                    </div>
                    <div class="flex-start gap-3 text-sm font-normal">
                      <div class="color-[#666666]">
                        总入网费
                      </div>
                      <div class="color-[#333333]">
                        {{ sum('access_fee') }}
                      </div>
                    </div>
                  </div>
                  <div class="h-0.5 bg-[#E6E6E8]" />
                  <div class="other-information flex flex-col gap-1">
                    <div class="flex-start gap-3 text-sm font-normal">
                      <div class="color-[#666666]">
                        备注
                      </div>
                      <div class="color-[#333333]">
                        {{ allocateInfo.remark }}
                      </div>
                    </div>
                    <div class="flex-start gap-3 text-sm font-normal">
                      <div class="color-[#666666]">
                        创建时间
                      </div>
                      <div class="color-[#333333]">
                        {{ allocateInfo.created_at }}
                      </div>
                    </div>
                    <div class="flex-start gap-3 text-sm font-normal">
                      <div class="color-[#666666]">
                        完成时间
                      </div>
                      <div class="color-[#333333]">
                        {{ allocateInfo.updated_at }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </common-gradient>
        </div>
      </div>
    </div>
    <template v-if="allocateInfo.product?.length">
      <div class="mt-4 p-4 blur-bgc rounded-6">
        <template v-for="(item, index) in allocateInfo.product" :key="index">
          <sale-order-nesting :title="item.name" :info="allocateInfo">
            <template #right>
              <!-- 状态为盘点中时可以删除 -->
              <template v-if="allocateInfo.status === 1">
                <icon class="cursor-pointer" name="i-svg:reduce" :size="20" @click="delProduct(item.code)" />
              </template>
              <common-tags type="pink" text="调拨" :is-oval="true" />
            </template>
            <template #info>
              <div class="flex flex-col gap-[12px] px-[16px]">
                <div class="flex flex-row gap-[12px]">
                  <div class="grid grid-cols-[1fr_1fr] gap-[12px]">
                    <div class="flex">
                      <div class="left">
                        条码
                      </div>
                      <div class="right">
                        {{ item.code }}
                      </div>
                    </div>
                    <div class="flex">
                      <div class="left">
                        工艺
                      </div>
                      <div class="right">
                        {{ item.craft }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </sale-order-nesting>
        </template>
      </div>
    </template>
    <template v-if="allocateInfo.status === 1">
      <common-button-one text="确认调拨" @confirm="confirm" />
    </template>
    <template v-if="allocateInfo.status === 2">
      <common-button-bottom cancel-text="取消调拨" confirm-text="完成调拨" @cancel="cancel" @confirm="finish" />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.left {
  --uno: 'text-size-[14px] color-[#666] dark:color-[#CBCDD1]';
  grid-template-columns: 1fr auto;
}
.right {
  --uno: 'text-size-[14px] color-[#333] dark:color-[#fff] ml1';
}
</style>

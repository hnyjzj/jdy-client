<script setup lang="ts">
const { getEnterInfo } = useEnter()
const { enterInfo } = storeToRefs(useEnter())
const { getProductWhere } = useProductManage()
const { filterListToArray } = storeToRefs(useProductManage())
useSeoMeta({
  title: '入库单详情',
})
const route = useRoute()
if (route.query.id) {
  await getEnterInfo(route.query.id as string)
  await getProductWhere()
}
type ProductKey = keyof Product
/** 汇总 */
function sum(key: ProductKey) {
  return enterInfo.value?.products?.reduce((sum, item) => sum + Number(item[key]), 0) ?? 0
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
                  <div class="flex-start gap-3 text-sm font-normal">
                    <div class="color-[#666666]">
                      操作人
                    </div>
                    <div class="color-[#333333]">
                      {{ enterInfo.operator?.nickname }}
                    </div>
                  </div>
                  <div class="flex-start gap-3 text-sm font-normal">
                    <div class="color-[#666666]">
                      入库单号
                    </div>
                    <div class="color-[#333333]">
                      {{ enterInfo.id }}
                    </div>
                  </div>
                  <div class="other-information flex flex-col gap-1">
                    <div class="flex-start gap-3 text-sm font-normal">
                      <div class="color-[#666666]">
                        创建时间
                      </div>
                      <div class="color-[#333333]">
                        {{ formatTimestampToDateTime(enterInfo.created_at) }}
                      </div>
                    </div>
                    <div class="flex-start gap-3 text-sm font-normal">
                      <div class="color-[#666666]">
                        完成时间
                      </div>
                      <div class="color-[#333333]">
                        {{ formatTimestampToDateTime(enterInfo.updated_at) }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="h-0.5 bg-[#E6E6E8]" />
                <div class="product-information flex flex-col gap-1">
                  <div class="flex-start gap-3 text-sm font-normal">
                    <div class="color-[#666666]">
                      总件数
                    </div>
                    <div class="color-[#333333]">
                      {{ enterInfo.products?.length }}
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
                      {{ sum('label_price') }}
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
              </div>
            </template>
          </common-gradient>
        </div>

        <template v-if="enterInfo.products?.length">
          <div class="p-4 blur-bgc rounded-6">
            <div class="text-[14px] pb-4">
              共 {{ enterInfo.products.length }} 条数据
            </div>
            <template v-for="(item, index) in enterInfo.products" :key="index">
              <div class="grid mb-3">
                <sale-order-nesting :title="item.name" :info="enterInfo">
                  <template #info>
                    <div class="px-[16px] pb-4 grid grid-cols-2 justify-between sm:grid-cols-3 md:grid-cols-4 gap-4">
                      <template v-for="(filter, findex) in filterListToArray" :key="findex">
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
                    </div>
                  </template>
                </sale-order-nesting>
              </div>
            </template>
          </div>
        </template>
      </div>
    </div>
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
</style>

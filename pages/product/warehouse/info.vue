<script setup lang="ts">
const { $toast } = useNuxtApp()
// const { myStore } = storeToRefs(useStores())
const { getEnterInfo, delEnterProduct } = useEnter()
const { enterInfo } = storeToRefs(useEnter())
const { filterList, filterListToArray } = storeToRefs(useProductManage())
const { getProductWhere } = useProductManage()

useSeoMeta({
  title: '入库单详情',
})
const route = useRoute()

const enterStatus = {
  1: '草稿',
  2: '已完成',
  3: '已撤销',
}
const isImportModel = ref(false)
const isChooseModel = ref(false)

if (route.query.id) {
  await getEnterInfo(route.query.id as string)
  await getProductWhere()
}
type ProductKey = keyof Product
/** 汇总 */
function sum(key: ProductKey) {
  return enterInfo.value?.products?.reduce((sum, item) => sum + Number(item[key]), 0) ?? 0
}
async function del(params: DelEnterProduct) {
  const res = await delEnterProduct(params)
  if (res.code === HttpCode.SUCCESS) {
    return $toast.success('删除成功')
  }
  $toast.error(res.message ?? '删除失败')
}
/** 删除入库单里的产品 */
async function delProduct(code: Product['code']) {
  if (!code)
    return
  const params = {
    product_enter_id: enterInfo.value.id,
    product_ids: [code],
  }
  await del(params)
}
function goAdd() {
  isChooseModel.value = false
  jump('/product/warehouse/add', { type: 1 })
}
// 提交入库
async function submitGoods(data: Product[]) {
  console.log(data)

//   if (data?.length) {
//     const { code, message } = await importProduct({ products: data, store_id: myStore.value?.id })
//     if (code === HttpCode.SUCCESS) {
//       isChooseModel.value = false
//       isImportModel.value = false
//       pages.value = 1
//       return $toast.success('导入成功')
//     }
//     $toast.error(message ?? '导入失败')
//   }
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
                      {{ enterInfo?.operator?.nickname }}
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
                  <div class="flex-start gap-3 text-sm font-normal">
                    <div class="color-[#666666]">
                      状态
                    </div>
                    <div class="color-[#333333]">
                      {{ enterStatus[enterInfo.status] }}
                    </div>
                  </div>
                  <div class="flex-start gap-3 text-sm font-normal">
                    <div class="color-[#666666]">
                      备注
                    </div>
                    <div class="color-[#333333]">
                      {{ enterInfo.remark }}
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
                      入库数量
                    </div>
                    <div class="color-[#333333]">
                      {{ enterInfo.products?.length }}
                    </div>
                  </div>
                  <div class="flex-start gap-3 text-sm font-normal">
                    <div class="color-[#666666]">
                      入网费合计
                    </div>
                    <div class="color-[#333333]">
                      {{ sum('access_fee') }}
                    </div>
                  </div>
                  <div class="flex-start gap-3 text-sm font-normal">
                    <div class="color-[#666666]">
                      标签价合计
                    </div>
                    <div class="color-[#333333]">
                      {{ sum('label_price') }}
                    </div>
                  </div>
                  <div class="flex-start gap-3 text-sm font-normal">
                    <div class="color-[#666666]">
                      金重合计
                    </div>
                    <div class="color-[#333333]">
                      {{ sum('weight_metal') }}
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
              共 {{ enterInfo.products.length }}
            </div>
            <template v-for="(item, index) in enterInfo.products" :key="index">
              <div class="grid mb-3">
                <sale-order-nesting :title="item.name" :info="enterInfo">
                  <template #left>
                    <template v-if="1">
                      <icon class="cursor-pointer" name="i-svg:reduce" :size="20" @click="delProduct(item.code)" />
                    </template>
                    <common-tags type="pink" text="sdf" :is-oval="true" />
                  </template>
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
    <product-upload-choose v-model:is-model="isChooseModel" @go-add="goAdd" @batch="isImportModel = true" />
    <product-upload-warehouse v-model="isImportModel" :filter-list="filterList" :type="1" @upload="submitGoods" />
    <!-- <common-create @create="jump('/product/warehouse/add', { type: 1, storageId: enterInfo.id })" /> -->

    <common-create @create="isChooseModel = true" />
    <common-button-bottom>
      <template #content>
        <div class="w-[100%]">
          <div class="bottom-fun grid grid-cols-[26%_26%_auto] gap-2">
            <div class="cursor-pointer cancel-btn">
              清空列表
            </div>
            <div class="cursor-pointer cancel-btn">
              撤销
            </div>
            <div class="cursor-pointer confirm-btn">
              完成入库
            </div>
          </div>
        </div>
      </template>
    </common-button-bottom>
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

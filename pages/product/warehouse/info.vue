<script setup lang="ts">
const { $toast } = useNuxtApp()
// const { myStore } = storeToRefs(useStores())
const { getEnterInfo, delEnterProduct, cancelEnter, finishEnter, addEnterProduct } = useEnter()
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
const deleteDialog = ref(false)
const clearDialog = ref(false)
const cancelDialog = ref(false)
const finishDialog = ref(false)

/** 要删除的产品code */
const deleteId = ref('')
const enterId = ref('')
if (route.query.id) {
  enterId.value = route.query.id as string
  await getInfo()
  await getProductWhere()
}
async function getInfo() {
  getEnterInfo(enterId.value)
}
type ProductKey = keyof Product
/** 汇总 */
function sum(key: ProductKey) {
  return enterInfo.value?.products?.reduce((sum, item) => sum + Number(item[key]), 0) ?? 0
}
async function del(params: DelEnterProduct) {
  const res = await delEnterProduct(params)
  if (res.code === HttpCode.SUCCESS) {
    await getInfo()
    return $toast.success('删除成功')
  }
  $toast.error(res.message ?? '删除失败')
}
/** 删除入库单里的产品 */
async function delProduct() {
  if (!deleteId.value)
    return
  const params = {
    product_enter_id: enterInfo.value.id,
    product_ids: [deleteId.value],
  }
  await del(params)
}
/** 清空产品列表 */
async function clearProduct() {
  const idAll = enterInfo.value?.products?.map(item => item.id)
  if (!idAll || !idAll.length) {
    return
  }
  const params = {
    product_enter_id: enterInfo.value.id,
    product_ids: idAll,
  }
  await del(params)
}
function goAdd() {
  isChooseModel.value = false
  jump('/product/warehouse/add', { type: 1, id: enterInfo.value.id })
}

// 提交入库
async function submitGoods(data: Product[]) {
  if (data?.length) {
    const { code, message } = await addEnterProduct({ products: data, product_enter_id: enterInfo.value.id })
    if (code === HttpCode.SUCCESS) {
      isChooseModel.value = false
      isImportModel.value = false
      await getInfo()
      return $toast.success('批量导入成功')
    }
    $toast.error(message ?? '上传失败')
  }
}

/** 撤销入库 */
async function cancel() {
  const res = await cancelEnter(enterInfo.value.id)
  if (res.code === HttpCode.SUCCESS) {
    await getInfo()
    return $toast.success('撤销成功')
  }
  $toast.error(res.message ?? '撤销失败')
}

function clearFun() {
  if (!enterInfo.value.products?.length) {
    return $toast.warning('货品为空')
  }
  clearDialog.value = true
}

/** 完成入库 */
function finishFun() {
  if (!enterInfo.value.products?.length) {
    return $toast.error('请添加货品入库记录')
  }
  finishDialog.value = true
}

async function finish() {
  const res = await finishEnter(enterInfo.value.id)
  if (res.code === HttpCode.SUCCESS) {
    await getInfo()
    return $toast.success('完成入库成功')
  }
  $toast.error(res.message ?? '完成入库失败')
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
                    <template v-if="enterInfo.status === 1">
                      <icon class="cursor-pointer" name="i-svg:reduce" :size="20" @click="deleteDialog = true;deleteId = item.id" />
                    </template>
                    <!-- <common-tags type="pink" text="sdf" :is-oval="true" /> -->
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
    <template v-if="enterInfo.status === 1">
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
    <common-confirm v-model:show="deleteDialog" icon="error" title="删除产品" text="确认要删除此产品吗?" @submit="delProduct" />
    <common-confirm v-model:show="clearDialog" icon="error" title="清空列表" text="确认要清空所有入库的产品吗?" @submit="clearProduct" />
    <common-confirm v-model:show="cancelDialog" icon="error" title="撤销" text="确认要撤销入库单吗? 撤销后将不可进行其他操作" @submit="cancel" />
    <common-confirm v-model:show="finishDialog" icon="success" title="完成入库" text="确认要完成此入库单吗?" @submit="finish" />
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

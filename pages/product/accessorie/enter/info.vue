<script setup lang="ts">
const { $toast } = useNuxtApp()
const { getAccessorieEnterInfo, cancelAccessorieEnter, successAccessorieEnter, addAccessorieEnter, delAccessorieEnter } = useAccessorieEnter()
const { enterInfo } = storeToRefs(useAccessorieEnter())
const { accessorieFilterList } = storeToRefs(useAccessorie())
const { getAccessorieWhere } = useAccessorie()
const { categoryFilterListToArray } = storeToRefs(useAccessorieCategory())
const { getAccessorieCategoryWhere } = useAccessorieCategory()

useSeoMeta({
  title: '入库单详情',
})
const route = useRoute()
const router = useRouter()
// 入库状态
const enterStatus = {
  1: '草稿',
  2: '已完成',
  3: '已撤销',
}
const uploadRef = ref()
const isImportModel = ref(false)
const isChooseModel = ref(false)
const deleteDialog = ref(false)
const clearDialog = ref(false)
const cancelDialog = ref(false)
const finishDialog = ref(false)

await getAccessorieCategoryWhere()

/** 要删除的产品code */
const deleteId = ref('')
const enterId = ref('')
if (route.query.id) {
  enterId.value = route.query.id as string
  await getInfo()
  await getAccessorieWhere()
}

async function getInfo() {
  await getAccessorieEnterInfo(enterId.value)
}

/** 汇总 */
function sum(key: string) {
  return enterInfo.value?.products?.reduce((sum, item) => sum + Number(item[key]), 0) ?? 0
}

function goAdd() {
  isChooseModel.value = false
  jump('/product/accessorie/enter/addproduct', { id: enterId.value })
}

/** 撤销入库 */
async function cancel() {
  const res = await cancelAccessorieEnter(enterInfo.value.id)
  if (res?.code === HttpCode.SUCCESS) {
    await getInfo()
    setTimeout(() => {
      router.go(-1)
    }, 1000)
    return $toast.success('撤销成功')
  }
  $toast.error(res?.message ?? '撤销失败')
}

function clearFun() {
  if (!enterInfo.value?.products || enterInfo.value.products.length === 0) {
    return $toast.warning('货品为空')
  }
  clearDialog.value = true
}

function finishFun() {
  if (!enterInfo.value.products?.length) {
    return $toast.error('请添加货品入库记录')
  }
  finishDialog.value = true
}

/** 完成入库 */
async function finish() {
  const res = await successAccessorieEnter(enterInfo.value.id)
  if (res?.code === HttpCode.SUCCESS) {
    await getInfo()
    return $toast.success('完成入库成功')
  }
  $toast.error(res?.message ?? '完成入库失败')
}

/** 删除入库的条目 */
async function delProduct() {
  const params = {
    enter_id: enterInfo.value.id,
    product_ids: [deleteId.value],
  } as DelAccessorieEnter
  const res = await delAccessorieEnter(params)
  if (res?.code === HttpCode.SUCCESS) {
    await getInfo()
  }
}

/** 清空已经入库的条目 */
async function clearProduct() {
  const idAll = enterInfo.value?.products?.map(item => item.id)
  if (!idAll || !idAll.length) {
    return
  }
  const params = {
    enter_id: enterInfo.value.id,
    product_ids: idAll,
  } as DelAccessorieEnter
  const res = await delAccessorieEnter(params)
  if (res?.code === HttpCode.SUCCESS) {
    await getInfo()
  }
}

async function bulkupload(e: any) {
  const params = {} as AccessorieEnterReq
  params.enter_id = enterInfo.value.id
  params.products = e
  const res = await addAccessorieEnter(params)
  if (res?.code === HttpCode.SUCCESS) {
    $toast.success('添加成功')
    await getInfo()
  }
  isChooseModel.value = false
  isImportModel.value = false
}
</script>

<template>
  <div class="pb-20">
    <common-layout-center>
      <div class="pt-4">
        <div class="flex flex-col gap-4">
          <div class="w-[40%] text-[#fff]">
            <product-manage-company />
          </div>
          <div class="rounded-6 bg-white w-auto blur-bga top">
            <common-gradient title="基础信息">
              <template #body>
                <div class="flex flex-col gap-4">
                  <div class="operation-information flex flex-col gap-1">
                    <div class="flex-start gap-3 text-sm font-normal">
                      <div class="info-title">
                        操作人
                      </div>
                      <div class="info-val">
                        {{ enterInfo?.operator?.nickname }}
                      </div>
                    </div>
                    <div class="flex-start gap-3 text-sm font-normal">
                      <div class="info-title">
                        入库单号
                      </div>
                      <div class="info-val">
                        {{ enterInfo.id }}
                      </div>
                    </div>
                    <div class="flex-start gap-3 text-sm font-normal">
                      <div class="info-title">
                        状态
                      </div>
                      <div class="info-val">
                        {{ enterStatus[enterInfo.status] }}
                      </div>
                    </div>
                    <div class="flex-start gap-3 text-sm font-normal">
                      <div class="info-title">
                        备注
                      </div>
                      <div class="info-val">
                        {{ enterInfo.remark }}
                      </div>
                    </div>
                    <div class="flex-start gap-3 text-sm font-normal">
                      <div class="info-title">
                        总件数
                      </div>
                      <div class="info-val">
                        {{ enterInfo.products?.length || 0 }}
                      </div>
                    </div>
                    <div class="flex-start gap-3 text-sm font-normal">
                      <div class="info-title">
                        总重量
                      </div>
                      <div class="info-val">
                        {{ sum('weight') || 0 }}
                      </div>
                    </div>
                    <div class="other-information flex flex-col gap-1">
                      <div class="flex-start gap-3 text-sm font-normal">
                        <div class="info-title">
                          创建时间
                        </div>
                        <div class="info-val">
                          {{ formatTimestampToDateTime(enterInfo.created_at) }}
                        </div>
                      </div>
                      <div class="flex-start gap-3 text-sm font-normal">
                        <div class="info-title">
                          完成时间
                        </div>
                        <div class="info-val">
                          {{ formatTimestampToDateTime(enterInfo.updated_at) }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="h-0.5 bg-[#E6E6E8]" />
                  <div class="product-information flex flex-col gap-1">
                    <div class="flex-start gap-3 text-sm font-normal">
                      <div class="info-title">
                        入库数量
                      </div>
                      <div class="info-val">
                        {{ enterInfo.products?.length }}
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </common-gradient>
          </div>

          <template v-if="enterInfo.products?.length">
            <div class="p-4 blur-bgc rounded-6">
              <div class="text-[14px] pb-4 text-color">
                共 {{ enterInfo.products.length }}
              </div>
              <template v-for="(item, index) in enterInfo.products" :key="index">
                <div class="grid mb-3">
                  <sale-order-nesting :title="item.name" :info="enterInfo">
                    <template #left>
                      <template v-if="enterInfo.status === 1">
                        <icon class="cursor-pointer" name="i-svg:reduce" :size="20" @click="deleteDialog = true;deleteId = item.id" />
                      </template>
                    </template>
                    <template #info>
                      <div class="px-[16px] pb-4 grid grid-cols-2 justify-between sm:grid-cols-3 gap-4">
                        <template v-for="(filter, findex) in categoryFilterListToArray" :key="findex">
                          <template v-if="filter.find">
                            <div class="flex">
                              <div class="key">
                                {{ filter.label }}
                              </div>
                              <template v-if="filter.input === 'select'">
                                <div class="value">
                                  {{ filter.preset[item.category[filter.name]] }}
                                </div>
                              </template>
                              <template v-else-if="filter.input === 'switch'">
                                <div class="value">
                                  {{ item.category[filter.name] ? '是' : '否' }}
                                </div>
                              </template>
                              <template v-else>
                                <div class="value">
                                  {{ item.category[filter.name] }}
                                </div>
                              </template>
                            </div>
                          </template>
                        </template>
                        <div class="flex">
                          <div class="key">
                            入库数量
                          </div>
                          <div class="value">
                            {{ item.stock }}
                          </div>
                        </div>
                        <div class="flex">
                          <div class="key">
                            入库入网费
                          </div>
                          <div class="value">
                            {{ item.access_fee }}
                          </div>
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
    </common-layout-center>
    <product-upload-choose v-model:is-model="isChooseModel" @go-add="goAdd" @batch="isImportModel = true" />
    <accessorie-warehouse-accessorie ref="uploadRef" v-model="isImportModel" :filter-list="accessorieFilterList" :type="1" @upload="bulkupload" />
    <!-- 状态为草稿时 功能操作 -->
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

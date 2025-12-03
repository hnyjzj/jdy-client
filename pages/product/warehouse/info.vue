<script setup lang="ts">
const { $toast } = useNuxtApp()
const { getFinishedEnterInfo, delFinishedEnter, cancelFinishedEnter, successFinishedEnter, addFinishedEnter, editFinishedEnter, clearFinishedEnter, getFinishedEnterInfoAll } = useFinishedEnter()
const { enterInfo } = storeToRefs(useFinishedEnter())
const { finishedFilterList, finishedFilterListToArray } = storeToRefs(useFinished())
const { getFinishedWhere } = useFinished()
const { myStore } = storeToRefs(useStores())

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
const pages = ref(1)
const isImportModel = ref(false)
const isChooseModel = ref(false)
const isEditModel = ref(false)
const deleteDialog = ref(false)
const clearDialog = ref(false)
const cancelDialog = ref(false)
const finishDialog = ref(false)
const loading = ref(false)
const productParams = ref({} as Partial<ProductFinisheds>)
/** 要删除的产品code */
const deleteId = ref('')
const enterId = ref('')
if (route.query.id) {
  enterId.value = route.query.id as string
  await getInfo()
  await getFinishedWhere()
}
async function getInfo() {
  const params = {
    id: enterId.value,
    page: pages.value,
    limit: 10,
  } as EnterInfoParams
  await getFinishedEnterInfo(params)
}
async function del(params: DelProductFinishedEnter) {
  const res = await delFinishedEnter(params)
  if (res?.code === HttpCode.SUCCESS) {
    await getInfo()
    return $toast.success('删除成功')
  }
  $toast.error(res?.message ?? '删除失败')
}
/** 删除入库单里的产品 */
async function delProduct() {
  if (!deleteId.value)
    return
  if (!enterInfo.value.id)
    return
  const params = {
    enter_id: enterInfo.value.id,
    product_ids: [deleteId.value],
  }
  await del(params)
}
/** 清空产品列表 */
async function clearProduct() {
  if (!enterInfo.value.id)
    return
  const res = await clearFinishedEnter(enterInfo.value.id)
  if (res?.code === HttpCode.SUCCESS) {
    await getInfo()
    return $toast.success('清空成功')
  }
  $toast.error(res?.message ?? '清空失败')
}
function goAdd() {
  isChooseModel.value = false
  jump('/product/warehouse/add', { type: enterInfo.value.type, id: enterInfo.value.id })
}
const uploadRef = ref()

// 提交入库
async function submitGoods(req: ProductFinisheds[]) {
  if (!req?.length) {
    return
  }
  isChooseModel.value = false
  isImportModel.value = false
  loading.value = true
  try {
    const res = await addFinishedEnter({ products: req, enter_id: enterInfo.value.id })
    uploadRef.value.clearData()
    if (res?.code === HttpCode.SUCCESS) {
      await getInfo()
      return $toast.success('批量导入成功')
    }
    else if (res?.code === HttpCode.ERROR) {
      return $toast.error(res?.message ?? '批量导入失败')
    }
    $toast.error(res?.message ?? '上传失败')
  }
  finally {
    loading.value = false
    uploadRef.value.clearData()
  }
}

/** 撤销入库 */
async function cancel() {
  const res = await cancelFinishedEnter(enterInfo.value.id)
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
  const res = await successFinishedEnter(enterInfo.value.id)
  if (res?.code === HttpCode.SUCCESS) {
    await getInfo()
    return $toast.success('完成入库成功')
  }
  $toast.error(res?.message ?? '完成入库失败')
}

const productEdittIng = ref({} as ProductFinisheds)

function edit(product: ProductFinisheds) {
  productEdittIng.value = product
  finishedFilterListToArray.value.forEach((item) => {
    if (item.update) {
      productParams.value[item.name] = product[item.name]
      if (item.type === 'float') {
        productParams.value[item.name] = Number.parseFloat(product[item.name])
      }
    }
  })
  if (!product.certificate || !product.certificate.length) {
    productParams.value.certificate = ['']
  }

  isEditModel.value = true
}

/** 编辑货品 */
async function submitEdit() {
  const params = {
    enter_id: enterInfo.value.id,
    product_id: productEdittIng.value.id,
    product: productParams.value,
  }
  const res = await editFinishedEnter(params)
  if (res?.code === HttpCode.SUCCESS) {
    isEditModel.value = false
    await getInfo()
    return $toast.success('编辑成功')
  }
  $toast.error(res?.message ?? '编辑失败')
}

/** 值为0时 找不到匹配项 显示未选择不 */
function filteredOptions(preset: any, val: number) {
  if (val === 0) {
    const obj = { label: '未选择', value: 0 }
    preset.unshift(obj)
  }
  return preset
}
function pull() {
  getInfo()
}

/**
 * 列表导出excel表格
 */
async function downloadLocalFile() {
  loading.value = true
  try {
    const res = await getFinishedEnterInfoAll({ all: true, id: enterInfo.value.id })
    if (res?.code === HttpCode.SUCCESS) {
      if (!res.data.products || !res.data.products?.length) {
        return $toast.error('列表是空的')
      }
      const summary: [string, string | number][] = [
        ['入库单号', res.data.id],
        ['入库数量', res.data.product_count],
        ['入网费合计', res.data.product_total_access_fee],
        ['标签价合计', res.data.product_total_label_price],
        ['金重合计', res.data.product_total_weight_metal],
      ]
      await exportProductListToXlsx(res.data.products, finishedFilterListToArray.value, '入库单货品列表', summary)
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
</script>

<template>
  <div class="storage pb-20 px-4" style="position: relative;">
    <common-loading v-model="loading" title="正在处理中" />
    <common-layout-center>
      <div class="pt-4">
        <div class="flex flex-col gap-4">
          <div class="rounded-6 bg-white w-auto blur-bga top">
            <common-gradient title="基础信息">
              <template #body>
                <div class="flex flex-col gap-4">
                  <div class="operation-information flex flex-col gap-1">
                    <div class="flex-start gap-3 text-sm font-normal">
                      <div class="info-title">
                        所属门店
                      </div>
                      <div class="info-val">
                        {{ enterInfo?.store?.name }}
                      </div>
                    </div>
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
                        {{ enterInfo.product_count }}
                      </div>
                    </div>
                    <div class="flex-start gap-3 text-sm font-normal">
                      <div class="info-title">
                        入网费合计
                      </div>
                      <div class="info-val">
                        {{ enterInfo.product_total_access_fee }}
                      </div>
                    </div>
                    <div class="flex-start gap-3 text-sm font-normal">
                      <div class="info-title">
                        标签价合计
                      </div>
                      <div class="info-val">
                        {{ enterInfo.product_total_label_price }}
                      </div>
                    </div>
                    <div class="flex-start gap-3 text-sm font-normal">
                      <div class="info-title">
                        金重合计
                      </div>
                      <div class="info-val">
                        {{ enterInfo.product_total_weight_metal }}
                      </div>
                    </div>

                    <div class="text-[rgba(57,113,243,1)] flex" @click="downloadLocalFile">
                      <icon name="i-svg:download" :size="16" color="#666" />
                      导出数据
                    </div>
                  </div>
                </div>
              </template>
            </common-gradient>
          </div>

          <template v-if="enterInfo.products?.length">
            <div class="p-4 blur-bgc rounded-6">
              <template v-for="(item, index) in enterInfo.products" :key="index">
                <div class="grid mb-3">
                  <sale-order-nesting :title="item.name" :info="enterInfo">
                    <template #left>
                      <template v-if="enterInfo.status === 1">
                        <!-- <div class="text-[rgba(221,146,0,1)] cursor-pointer" @click="edit(item)">
                        编辑
                      </div> -->
                        <icon class="cursor-pointer" name="i-svg:reduce" :size="20" @click="deleteDialog = true;deleteId = item.id" />
                      </template>
                      <div class="text-[rgba(221,146,0,1)] cursor-pointer" @click="edit(item)">
                        <common-tags type="orange" text="编辑" :is-oval="true" />
                      </div>
                    </template>
                    <template #info>
                      <div class="px-[16px] pb-4 grid grid-cols-2 justify-between sm:grid-cols-3 md:grid-cols-4 gap-4">
                        <template v-for="(filter, findex) in finishedFilterListToArray" :key="findex">
                          <template v-if="filter.find">
                            <template v-if="filter.input === 'list'">
                              <template v-for="(certificate, i) in item[filter.name]" :key="i">
                                <div class="flex">
                                  <div class="key">
                                    证书{{ i + 1 }}
                                  </div>
                                  <div class="value">
                                    {{ certificate }}
                                  </div>
                                </div>
                              </template>
                            </template>
                            <template v-else>
                              <div class="flex">
                                <div class="key">
                                  {{ filter.label }}
                                </div>
                                <template v-if="filter.input === 'select'">
                                  <div class="value">
                                    <common-tooltip :val="filter.preset[item[filter.name]]" />
                                  </div>
                                </template>
                                <template v-else-if="filter.input === 'switch'">
                                  <div class="value">
                                    {{ item[filter.name] ? '是' : '否' }}
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
                        </template>
                        <div class="flex">
                          <div class="key">
                            入库时间
                          </div>
                          <div class="value">
                            <common-tooltip :val="formatTimestampToDateTime(item.enter_time)" />
                          </div>
                        </div>
                      </div>
                    </template>
                  </sale-order-nesting>
                </div>
              </template>
              <common-page
                v-model:page="pages" :total="enterInfo.product_count" :limit="10" @update:page="() => {
                  pull()
                }
                " />
            </div>
          </template>
        </div>
      </div>
    </common-layout-center>
    <product-upload-choose v-model:is-model="isChooseModel" @go-add="goAdd" @batch="isImportModel = true" />
    <product-upload-warehouse ref="uploadRef" v-model="isImportModel" :filter-list="finishedFilterList" :type="1" @upload="submitGoods" />
    <!-- 状态为草稿时 功能操作 -->
    <template v-if="enterInfo.status === 1 && myStore.id === enterInfo.store_id">
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
    <template v-if="enterInfo.status === EnterStatus.Completed && enterInfo.store_id === myStore.id">
      <common-button-bottom confirm-text="整单调拨" cancel-text="撤销入库" @cancel="cancelDialog = true" @confirm="jump('/product/allocate/add', { enter_id: enterInfo.id })" />
    </template>
    <correspond-store :correspond-ids="[enterInfo.store_id]" />

    <common-confirm v-model:show="deleteDialog" icon="error" title="删除产品" text="确认要删除此产品吗?" @submit="delProduct" />
    <common-confirm v-model:show="clearDialog" icon="error" title="清空列表" text="确认要清空所有入库的产品吗?" @submit="clearProduct" />
    <common-confirm v-model:show="cancelDialog" icon="error" title="撤销" text="确认要撤销入库单吗? 撤销后将不可进行其他操作" @submit="cancel" />
    <common-confirm v-model:show="finishDialog" icon="success" title="完成入库" text="确认要完成此入库单吗?" @submit="finish" />
    <common-model v-model="isEditModel" title="编辑" :show-ok="true" @confirm="submitEdit">
      <div class="max-h-[400px] overflow-auto">
        <template v-for="(item, index) in finishedFilterListToArray" :key="index">
          <template v-if="item.update">
            <div class="flex flex-col gap-4 col-12" uno-lg="col-8 offset-2" uno-sm="col-12">
              <div class="mb-4">
                <div class="text-color pb-1">
                  {{ item.label }}
                </div>
                <template v-if="item.input === 'text'">
                  <n-input
                    v-model:value="productParams[item.name]"
                    :placeholder="`输入${item.label}`"
                    @focus="focus"
                  />
                </template>
                <template v-else-if="item.input === 'number'">
                  <n-input-number
                    v-model:value="productParams[item.name]"
                    :placeholder="String(productParams[item.name])"
                    :default-value="0"
                    min="0"
                    @focus="focus"
                  />
                </template>
                <template v-else-if="item?.input === 'select'">
                  <n-select
                    v-model:value="productParams[item.name]"
                    :default-value="null"
                    menu-size="large"
                    :placeholder="`请选择${item.label}`"
                    :options="filteredOptions(optonsToSelect(item.preset), productParams[item.name])"
                    filterable
                    @focus="focus"
                  />
                </template>
                <template v-else-if="item?.input === 'switch'">
                  <n-switch v-model:value="productParams[item.name]" />
                </template>
                <template v-else-if="item?.input === 'textarea'">
                  <n-input
                    v-model:value="productParams[item.name]"
                    :placeholder="String(productParams[item.name])"
                    @focus="focus"
                  />
                </template>
                <template v-else-if="item?.input === 'list'">
                  <template v-for="(certific, i) in productParams[item.name]" :key="i">
                    <div class="grid grid-cols-[50px_auto_80px] gap-2 items-center">
                      <div class="w-[60px] text-[14px] text-color-light">
                        编号{{ i + 1 }}：
                      </div>
                      <n-input
                        v-model:value="productParams[item.name][i]"
                        :placeholder="certific"
                        @focus="focus"
                      />
                      <div class="flex gap-1 items-center">
                        <div class="w-[32px] h-[32px] rounded-full bg-[#FFF] flex justify-center items-center" @click="productParams[item.name].splice(i, 1)">
                          <icon name="i-svg:subtract" size="16" />
                        </div>
                        <template v-if="i === productParams[item.name].length - 1">
                          <div class="w-[32px] h-[32px] rounded-full bg-[#FFF] flex justify-center items-center" @click="productParams[item.name].push('')">
                            <icon name="i-svg:add" size="16" />
                          </div>
                        </template>
                      </div>
                    </div>
                  </template>
                </template>
              </div>
            </div>
          </template>
        </template>
      </div>
    </common-model>
  </div>
</template>

<style lang="scss" scoped>
.key {
  --uno: 'text-size-[14px] color-[#666] dark:color-[#CBCDD1] mr-2';
  white-space: nowrap;
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

<script setup lang="ts">
const { checkInfo, checkFilterList } = storeToRefs(useCheck())
const { getCheckInfo, getCheckWhere, changeCheckStatus } = useCheck()
const { $toast } = useNuxtApp()
const route = useRoute()

// 当前选择的盘点类型
const product_status = ref(0)
const changeShow = ref(false)
const changeStatusVal = ref()
const statusCol = ref()

// 盘点单详情
useSeoMeta({ title: '盘点单详情' })

if (route.query.id) {
  getInfo()
  await getCheckWhere()
}

/** 获取详情 */
async function getInfo() {
  if (route.query.id) {
    await getCheckInfo(route.query.id as string, product_status.value)
  }
}

/** 多选值 */
function getMultipleVal(key: keyof Where<Check>, val: any) {
  if (!val || !key || !checkFilterList.value[key])
    return ''
  return val.map((item: number) => checkFilterList.value[key]?.preset[item] || '').join('')
}

/** 单选值 */
function getRadioVal(key: keyof Where<Check>, val: any) {
  return (!key || !val || !checkFilterList.value[key]) ? '' : checkFilterList.value[key]?.preset[val] || ''
}

// 盘点单tab切换选项
const inventoryOptions = computed(() => [
  { label: '应盘', count: checkInfo.value.count_should || 0, value: 0 },
  { label: '实盘', count: checkInfo.value.count_actual || 0, value: 1 },
  { label: '盘亏', count: checkInfo.value.count_loss || 0, value: 2 },
  { label: '盘盈', count: checkInfo.value.count_extra || 0, value: 3 },
])

// 步骤条描述文本定义
const step = [
  { title: '盘点中', subs: 1 },
  { title: '盘点结束', subs: 2 },
  { title: '导出盘点差异', subs: 3 },
  { title: '已完成', subs: 4 },
]

// 切换盘点状态
function changeStatus(val: number) {
  product_status.value = val
  getInfo()
}

/** 获取可选状态 */
function getSelectStatus() {
  const statusOptions: Record<number, { label: string, value: number }[]> = {
    1: [
      { label: '盘点中', value: 2 },
      { label: '盘点取消', value: 6 },
    ],
    2: [
      { label: '待验证', value: 3 },
      { label: '盘点异常', value: 5 },
      { label: '盘点取消', value: 6 },
    ],
    3: [
      { label: '盘点完场', value: 4 },
      { label: '盘点异常', value: 5 },
      { label: '盘点取消', value: 6 },
    ],
    5: [
      { label: '盘点中', value: 2 },
      { label: '盘点取消', value: 6 },
    ],
    6: [{ label: '盘点中', value: 2 }],
  }
  statusCol.value = statusOptions[checkInfo.value.status] || []
}

/** 提交盘点更改状态 */
async function sumbitChange() {
  const res = await changeCheckStatus(checkInfo.value.id, changeStatusVal.value)
  if (res.code === 200) {
    $toast.success('变更成功')
    changeShow.value = false
    getInfo()
  }
}
/** 货品状态 */
const goodsStatus = {
  0: '全部',
  1: '正常',
  2: '报损',
  3: '调拨',
  4: '已售',
  5: '退货',
  6: '盘点中',
}
</script>

<template>
  <div class="pt-6">
    <common-dark />
    <div class="grid-12">
      <div class="flex flex-col gap-4 col-12" uno-lg="col-8 offset-2" uno-sm="col-12">
        <div class="rounded-6 w-auto top">
          <common-gradient title="基础信息">
            <template #body>
              <div class="flex flex-col gap-4">
                <div class="operation-information flex flex-col gap-1">
                  <div class="part">
                    <div class="left">
                      盘点人
                    </div>
                    <div class="right">
                      {{ checkInfo.inventory_person?.nickname }}
                    </div>
                  </div>
                  <div class="part">
                    <div class="left">
                      监盘人
                    </div>
                    <div class="right">
                      {{ checkInfo.inspector?.nickname }}
                    </div>
                  </div>
                  <div class="part">
                    <div class="left">
                      盘点单号
                    </div>
                    <div class="right">
                      {{ checkInfo.id }}
                    </div>
                  </div>
                </div>
                <div class="h-0.5 bg-[#E6E6E8]" />
                <div class="other-information flex flex-col gap-1">
                  <div class="part">
                    <div class="left">
                      盘点品牌
                    </div>
                    <div class="right">
                      {{ getMultipleVal('brand', checkInfo.brand) }}
                    </div>
                  </div>
                  <div class="part">
                    <div class="left">
                      盘点仓库
                    </div>
                    <div class="right">
                      {{ checkInfo.store_id }}
                    </div>
                  </div>
                  <div class="part">
                    <div class="left">
                      备注
                    </div>
                    <div class="right">
                      {{ checkInfo.remark }}
                    </div>
                  </div>
                  <div class="part">
                    <div class="left">
                      状态
                    </div>
                    <div class="right">
                      <common-tags type="lake" :text="getRadioVal('status', checkInfo.status)" />
                    </div>
                  </div>
                </div>
                <div class="h-0.5 bg-[#E6E6E8]" />
                <div class="product-information flex flex-col gap-1">
                  <div class="part">
                    <div class="left">
                      盘点范围
                    </div>
                    <div class="right">
                      {{ getRadioVal('range', checkInfo.range) }}
                    </div>
                  </div>
                  <div class="part">
                    <div class="left">
                      大类
                    </div>
                    <div class="right">
                      {{ getMultipleVal('class', checkInfo.class) }}
                    </div>
                  </div>
                  <div class="part">
                    <div class="left">
                      品类
                    </div>
                    <div class="right">
                      {{ getMultipleVal('category', checkInfo.category) }}
                    </div>
                  </div>
                  <div class="part">
                    <div class="left">
                      工艺
                    </div>
                    <div class="right">
                      {{ getMultipleVal('craft', checkInfo.craft) }}
                    </div>
                  </div>
                </div>
                <div class="h-0.5 bg-[#E6E6E8]" />
                <div class="product-information flex flex-col gap-1">
                  <div class="part">
                    <div class="left">
                      总件数
                    </div>
                    <div class="right">
                      {{ checkInfo.cont_quantity }}
                    </div>
                  </div>
                  <div class="part">
                    <div class="left">
                      总金重
                    </div>
                    <div class="right">
                      {{ checkInfo.count_weight_metal }}
                    </div>
                  </div>
                  <div class="part">
                    <div class="left">
                      总标价
                    </div>
                    <div class="right">
                      {{ checkInfo.count_price }}
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </common-gradient>
        </div>
        <div class="info flex flex-col gap-4 rounded-6 blur-bga w-auto px-4 py-4 mb-6">
          <div class="flex flex-col gap-3">
            <common-tab-secondary :current-selected="product_status" :options="inventoryOptions" @change-status="changeStatus" />
            <common-step :description="step" :active-index="1" />
          </div>
          <div class="color-[#333333] dark:color-[#FFFFFF] font-normal text-[14px]">
            共 {{ checkInfo.products?.length }} 件条数据
          </div>
          <template v-if="!checkInfo.products?.length">
            <common-empty img="/images/empty/bag.png" size="160" text="暂无数据" />
          </template>
          <template v-for="(item, index) in checkInfo.products" :key="index">
            <div class="grid mb-3">
              <sale-order-nesting :title="item.product.name" :info="checkInfo">
                <template #left>
                  <common-tags type="pink" :text="goodsStatus[item.product.status]" :is-oval="true" />
                </template>
                <template #info>
                  <div class="px-[16px] pb-4 grid grid-cols-2 justify-between sm:grid-cols-3 md:grid-cols-4 gap-4">
                    <div class="flex">
                      <div class="key">
                        条码
                      </div>
                      <div class="value text-[rgba(57,113,243,1)]">
                        {{ item.product.code }}
                      </div>
                    </div>
                    <div class="flex">
                      <div class="key">
                        工艺
                      </div>
                      <div class="value">
                        {{ item.product.craft }}
                      </div>
                    </div>
                    <div class="flex">
                      <div class="key">
                        零售方式
                      </div>
                      <div class="value">
                        {{ item.product.retail_type }}
                      </div>
                    </div>
                    <div class="flex">
                      <div class="key">
                        金重
                      </div>
                      <div class="value">
                        {{ item.product.weight }}
                      </div>
                    </div>
                    <div class="flex">
                      <div class="key">
                        价格
                      </div>
                      <div class="value text-[rgba(57,113,243,1)]">
                        {{ item.product.price }}
                      </div>
                    </div>
                    <div class="flex">
                      <div class="key">
                        特价
                      </div>
                      <div class="value">
                        <span class="bg-[rgba(230,230,232,1)] px-2 py-[1.5px] rounded-[8px] text-[rgba(128,128,137,1)]">
                          {{ item.product.is_special_offer ? '是' : '否' }}</span>
                      </div>
                    </div>
                  </div>
                </template>
              </sale-order-nesting>
            </div>
          </template>
        </div>
      </div>
    </div>
    <common-model v-model="changeShow" title="更改状态" :show-ok="true" @confirm="sumbitChange">
      <div class="min-h-[100px]">
        <n-select
          v-model:value="changeStatusVal"
          :default-value="0 || '' || undefined || null"
          menu-size="large"
          filterable
          placeholder="更改盘点单状态"
          :options="statusCol"
          @focus="() => getSelectStatus()"
        />
      </div>
    </common-model>
    <!-- 盘点单完成时 盘点结束不更改状态 -->
    <template v-if="checkInfo.status !== 4">
      <common-button-one text="变换盘点单状态" @confirm="changeShow = true" />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.part {
  --uno: 'flex-start gap-3 text-sm font-normal';

  .left {
    --uno: 'color-[#666666] dark:color-[#CBCDD1]';
  }

  .right {
    --uno: 'color-[#333333] dark:color-[#FFFFFF]';
  }
}
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
</style>

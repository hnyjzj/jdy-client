<script setup lang="ts">
const { checkInfo, checkFilterList } = storeToRefs(useCheck())
const { getCheckInfo, getCheckWhere, changeCheckStatus, addCheckProduct, remove } = useCheck()
const { userinfo } = useUser()
const { $toast } = useNuxtApp()
const { useWxWork } = useWxworkStore()

const route = useRoute()

const { finishedFilterListToArray } = storeToRefs(useFinished())
const { getFinishedWhere } = useFinished()
const { oldFilterListToArray } = storeToRefs(useOld())
const { getOldWhere } = useOld()

// 当前选择的盘点类型
const product_status = ref(2)

// 盘点单详情
useSeoMeta({ title: '盘点单详情' })

interface funBtn {
  status: CheckInfo['status']
  text: string
  add?: boolean
  finish?: boolean
}

const inputModel = ref(false)
const uploadModel = ref(false)
const importModel = ref(false)
const confirmShow = ref(false)
const loading = ref(false)

/** 上传组件引用 */
const uploadRef = ref()

/** 单个添加盘点的货品code */
const goodCode = ref('')
// **先声明并初始化 funbtns**
const funbtns = ref<funBtn[]>([])

// 获取按钮列表的函数
function getFunBtn() {
  funbtns.value = [] // 清空按钮数组
  // 根据状态添加按钮
  if (checkInfo.value.inventory_person_ids?.indexOf(userinfo.id) !== -1 && checkInfo.value.status === CheckStatus.Draft) {
    funbtns.value.push({ status: CheckStatus.Cancel, text: '取消盘点' })
    funbtns.value.push({ status: CheckStatus.Checking, text: '开始盘点' })
  }
  if (checkInfo.value.inventory_person_ids?.indexOf(userinfo.id) !== -1 && checkInfo.value.status === CheckStatus.Checking) {
    funbtns.value.push({ status: CheckStatus.ToBeVerified, text: '结束盘点', finish: true })
    funbtns.value.push({ status: CheckStatus.ToBeVerified, text: '开始盘点', add: true })
  }
  if (checkInfo.value.inventory_person_ids?.indexOf(userinfo.id) !== -1 && checkInfo.value.status === CheckStatus.ToBeVerified) {
    funbtns.value.push({ status: CheckStatus.Abnormal, text: '异常' })
    funbtns.value.push({ status: CheckStatus.Checked, text: '验证通过' })
  }
}

const page = ref(1)
const limit = ref(20)
/** 获取详情 */
async function getInfo() {
  if (!route.query.id)
    return

  const params = {
    id: route.query.id,
    page: page.value,
    limit: limit.value,
  } as CheckInfoParams
  await getCheckInfo(params)
  getFunBtn() // 调用 getFunBtn，更新 funbtns
}

/** 多选值 */
function getMultipleVal(key: keyof Where<Check>, val: any) {
  if (!val || !key || !checkFilterList.value[key])
    return ''
  return val.map((item: number) => checkFilterList.value[key]?.preset[item] || '').join('、')
}

/** 单选值 */
function getRadioVal(key: keyof Where<Check>, val: any) {
  return (!key || !val || !checkFilterList.value[key]) ? '' : checkFilterList.value[key]?.preset[val] || ''
}

// 盘点单tab切换选项
const inventoryOptions = computed(() => [
  { label: '应盘', count: checkInfo.value.count_should || 0, value: 1 },
  { label: '实盘', count: checkInfo.value.count_actual || 0, value: 2 },
  { label: '盘盈', count: checkInfo.value.count_extra || 0, value: 3 },
  { label: '盘亏', count: checkInfo.value.count_loss || 0, value: 4 },
])

// 步骤条描述文本定义
const step = [
  { title: '待盘点', subs: 1 },
  { title: '盘点中', subs: 2 },
  { title: '待验证', subs: 3 },
  { title: '已完成', subs: 4 },
]

// 切换盘点状态
function changeStatus(val: number) {
  product_status.value = val
  getInfo()
}

/** 提交盘点更改状态 */
async function submitChange(status: CheckInfo['status']) {
  const res = await changeCheckStatus(checkInfo.value.id, status)
  if (res?.code === 200) {
    $toast.success('变更成功')
    getInfo()
  }
}
// 如果路由中有 id，则获取详情
if (route.query.id) {
  await getCheckWhere()
  await getFinishedWhere()
  await getOldWhere()
  await getInfo()
}

function handleClick(item: funBtn) {
  if (item.add) {
    uploadModel.value = true
    return
  }
  if (item.finish) {
    confirmShow.value = true
    return
  }
  submitChange(item.status)
}

/**
 * 添加货品
 * @params params: AddCheckProduct
 * @params isClose: boolean 是否关闭添加弹窗
 */
async function addCheckGood(params: AddCheckProduct, isClose = true) {
  const res = await addCheckProduct(params)
  if (res?.code === HttpCode.SUCCESS) {
    await getInfo()
    $toast.success('添加成功', 1000)
    goodCode.value = ''
  }
  else {
    $toast.error(res?.message || '添加失败', 1000)
  }
  loading.value = false
  inputModel.value = isClose
}

async function submitGoods() {
  const params: AddCheckProduct = {
    id: checkInfo.value.id,
    codes: [goodCode.value],
  }
  loading.value = true
  await addCheckGood(params)
}
/** 批量上传盘点货品 */
async function bulkupload(data: string[]) {
  if (!data || !data.length) {
    $toast.error('请上传正确的货品编号文件')
    return
  }
  loading.value = true
  const params: AddCheckProduct = {
    id: checkInfo.value.id,
    codes: data,
  }
  await addCheckGood(params, false)
}

async function ConfirmUse() {
  submitChange(CheckStatus.ToBeVerified)
}

/** 当前nav货品数据 */
const product = computed(() => {
  switch (product_status.value) {
    case 1:
      return checkInfo.value.should_products
    case 2:
      return checkInfo.value.actual_products
    case 3:
      return checkInfo.value.extra_products
    case 4:
      return checkInfo.value.loss_products
    default:
      return []
  }
})

/** 当前nav货品数据 */
const infoTotal = computed(() => {
  switch (product_status.value) {
    case 1:
      return checkInfo.value.should_count
    case 2:
      return checkInfo.value.actual_count
    case 3:
      return checkInfo.value.extra_count
    case 4:
      return checkInfo.value.loss_count
    default:
      return 0
  }
})

function getStateColor() {
  switch (checkInfo.value.status) {
    case CheckStatus.Draft:
      return 'orange'
    case CheckStatus.Checking:
      return 'blue'
    case CheckStatus.ToBeVerified:
      return 'lake'
    case CheckStatus.Abnormal:
      return 'red'
    default:
      return 'ash'
  }
}

async function pull() {
  await getInfo()
}

/** 扫码 */
const scanCode = async () => {
  const wx = await useWxWork()
  const code = await wx?.scanQRCode()
  if (code) {
    goodCode.value = code
  }
}

const removeDict = useDebounceFn(async (product_id) => {
  const res = await remove(checkInfo.value.id, product_id)
  if (res?.code === HttpCode.SUCCESS) {
    $toast.success('删除成功')
    await getInfo()
  }
  else {
    $toast.error(res?.message || '删除失败')
  }
}, 1000)
</script>

<template>
  <div class="pt-6">
    <div class="grid-12 pb-10">
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
                      {{ checkInfo.inventory_persons.map(v => v.nickname).join('、') }}
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
                      {{ getMultipleVal('brand', checkInfo.brand) || '--' }}
                    </div>
                  </div>
                  <div class="part">
                    <div class="left">
                      盘点仓库
                    </div>
                    <div class="right">
                      {{ checkInfo.type === GoodsType.ProductFinish ? '成品' : checkInfo.type === GoodsType.ProductOld ? '旧料' : '--' }}
                    </div>
                  </div>
                  <div class="part">
                    <div class="left">
                      备注
                    </div>
                    <div class="right">
                      {{ checkInfo.remark || '--' }}
                    </div>
                  </div>
                  <div class="part">
                    <div class="left">
                      状态
                    </div>
                    <div class="right">
                      <common-tags :type="getStateColor()" :text="getRadioVal('status', checkInfo.status)" />
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
                  <template v-if="checkInfo.range === 1">
                    <div class="part">
                      <div class="left">
                        大类
                      </div>
                      <div class="right">
                        {{ checkInfo.type === GoodsTypePure.ProductFinish ? getMultipleVal('class_finished', checkInfo.class_finished) : getMultipleVal('class_old', checkInfo.class_old) }}
                      </div>
                    </div>
                    <div class="part">
                      <div class="left">
                        品类
                      </div>
                      <div class="right">
                        {{ getMultipleVal('category', checkInfo.category) || '--' }}
                      </div>
                    </div>
                    <div class="part">
                      <div class="left">
                        工艺
                      </div>
                      <div class="right">
                        {{ getMultipleVal('craft', checkInfo.craft) || '--' }}
                      </div>
                    </div>
                  </template>
                  <!-- 按材质 -->
                  <template v-if="checkInfo.range === 2">
                    <div class="part">
                      <div class="left">
                        品类
                      </div>
                      <div class="right">
                        {{ getMultipleVal('category', checkInfo.category) || '--' }}
                      </div>
                    </div>
                    <div class="part">
                      <div class="left">
                        工艺
                      </div>
                      <div class="right">
                        {{ getMultipleVal('craft', checkInfo.craft) || '--' }}
                      </div>
                    </div>
                    <div class="part">
                      <div class="left">
                        材质
                      </div>
                      <div class="right">
                        {{ getMultipleVal('material', checkInfo.material) || '--' }}
                      </div>
                    </div>
                    <div class="part">
                      <div class="left">
                        成色
                      </div>
                      <div class="right">
                        {{ getMultipleVal('quality', checkInfo.quality) || '--' }}
                      </div>
                    </div>
                    <div class="part">
                      <div class="left">
                        主石
                      </div>
                      <div class="right">
                        {{ getMultipleVal('gem', checkInfo.gem) || '--' }}
                      </div>
                    </div>
                  </template>
                </div>
                <div class="h-0.5 bg-[#E6E6E8]" />
                <div class="product-information flex flex-col gap-1">
                  <div class="part">
                    <div class="left">
                      总件数
                    </div>
                    <div class="right">
                      {{ checkInfo.count_quantity }}
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
            <common-tab-secondary :current-selected="product_status" :options="inventoryOptions" :info="checkInfo" @change-status="changeStatus" />
            <common-step :description="step" :active-index="checkInfo.status" />
          </div>
          <template v-if="!product?.length">
            <common-empty img="/images/empty/bag.png" size="160" text="暂无数据" />
          </template>
          <template v-for="(item, index) in product" :key="index">
            <div class="grid mb-3">
              <sale-order-nesting :title="checkInfo.type === GoodsType.ProductFinish ? item.product_finished?.name : item.product_old?.name" :info="checkInfo">
                <template #left>
                  <template v-if="checkInfo.status === CheckStatus.Checking">
                    <icon class="cursor-pointer" name="i-svg:reduce" :size="20" @click="removeDict(item.id)" />
                  </template>
                  <template v-if="checkInfo.type === GoodsType.ProductFinish">
                    <common-tags type="pink" :text="GoodsStatusMap[item.product_finished?.status as GoodsStatus]" :is-oval="true" />
                  </template>
                </template>
                <template #info>
                  <div>
                    <template v-if="checkInfo.type === GoodsType.ProductFinish">
                      <product-base-info :info="item.product_finished" :code="item.product_code" :filter-list="finishedFilterListToArray" />
                    </template>
                    <template v-else-if="checkInfo.type === GoodsType.ProductOld">
                      <product-base-info :info="item.product_old" :code="item.product_code" :filter-list="oldFilterListToArray" />
                    </template>
                  </div>
                </template>
              </sale-order-nesting>
            </div>
          </template>
          <template v-if="infoTotal && product">
            <common-page
              v-model:page="page" :total="infoTotal" :limit="limit" @update:page="() => {
                pull()
              }
              " />
          </template>
        </div>
      </div>
    </div>
    <template v-if="funbtns?.length">
      <div class="btn">
        <template v-for="(item, index) in funbtns" :key="index">
          <button class="btntext cursor-pointer" @click="handleClick(item)">
            {{ item.text }}
          </button>
        </template>
      </div>
    </template>
    <product-upload-choose v-model:is-model="uploadModel" title="正在盘点" @go-add="uploadModel = false;inputModel = true" @batch="importModel = true" />
    <common-model v-model="inputModel" title="正在盘点" :show-ok="true" @confirm="submitGoods">
      <div class="mb-8 relative min-h-[200px]">
        <div class="uploadInp cursor-pointer flex">
          <n-input v-model:value="goodCode" placeholder="请输入条码" />
          <div
            class="flex items-center justify-end cursor-pointer"
            @click="scanCode()">
            <icon class="ml-2" name="i-icon:scanit" :size="20" />
          </div>
        </div>
      </div>
    </common-model>
    <common-confirm
      v-model:show="confirmShow"
      title="结束盘点"
      text="结束盘点，您将不能继续录入条码，如果盘点还未完成，请不要结束盘点，直接返回，之后随时可进入此页面继续开始盘点?"
      icon="warning"
      @submit="ConfirmUse"
      @cancel="confirmShow = false"
    />
    <common-loading v-show="loading" text="正在处理中" />
    <product-check-warehouse ref="uploadRef" v-model="importModel" @upload="bulkupload" />
  </div>
</template>

<style lang="scss" scoped>
.part {
  --uno: 'flex gap-3 text-sm font-normal';

  .left {
    --uno: 'color-[#666666] dark:color-[#CBCDD1] w-60px whitespace-nowrap shrink-0';
  }

  .right {
    --uno: 'color-[#333333] dark:color-[#FFFFFF]';
    overflow-wrap: break-word;
    word-break: break-word;
    white-space: normal;
  }
}

.btn {
  --uno: 'z-99 fixed bottom-0 left-0 right-0 blur-bga p-[12px_16px] text-[16px] font-bold grid-12 offset-2';
}

.btntext:first-child {
  background: #ffffff;
  box-shadow: 0px 6px 6px rgba(110, 166, 255, 0.3);
  --uno: 'text-[16px] py-[8px] border-none text-center rounded-[36px] mr-[8px] col-span-4 offset-1';
}

.btntext:last-child {
  background: linear-gradient(to bottom, #1a6beb, #6ea6ff);
  box-shadow: rgba(110, 166, 255, 0.3) 0px 6px 6px;
  --uno: 'text-[16px] py-[8px] border-none flex-1 rounded-[36px] ml-[8px] text-[#FFFFFF] col-span-6';
}
</style>

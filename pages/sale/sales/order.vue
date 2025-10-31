<script lang="ts" setup>
import PrintTemp from '@/components/print/Board.vue'
import usePrint from 'vue3-use-print'
// 销售单详情
useSeoMeta({
  title: '销售单详情',
})
const { $toast } = useNuxtApp()
const { getMemberWhere } = useMemberManage()
const { getPrintTempList, getTempInfo } = useSystemPrint()
const { printList, PrintTemplate } = storeToRefs(useSystemPrint())
const { searchPage } = storeToRefs(usePages())
const { filterList: memberFiler } = storeToRefs(useMemberManage())
const { OrderDetail, filterList } = storeToRefs(useOrder())
const { getOrderDetail, getSaleWhere, returnOrderGoods, revokedOrder, payOrder, retreatOrder } = useOrder()
const { getFinishedWhere } = useFinished()
const { finishedFilterList } = storeToRefs(useFinished())
const { getOldWhere } = useOld()
const { oldFilterList } = storeToRefs(useOld())
const { myStore } = storeToRefs(useStores())
const { getAccessorieWhere } = useAccessorie()
const { accessorieFilterList } = storeToRefs(useAccessorie())
const { userinfo } = storeToRefs(useUser())
const { getUserInfo } = useUser()
await getUserInfo()

const route = useRoute()
if (route.query.id) {
  await getOrderDetail({ id: route.query.id as string })
  await getMemberWhere()
  await getSaleWhere()
  await getFinishedWhere()
  await getOldWhere()
  await getAccessorieWhere()
}
const showModel = ref(false)
const mustSelect = ref<any[]>([])

const returnGoods = async (req: ReturnGoods) => {
  const res = await returnOrderGoods(req)
  if (res.code === HttpCode.SUCCESS) {
    showModel.value = false
    $toast.success('退货成功')
    await getOrderDetail({ id: route.query.id as string })
    return true
  }
  else {
    $toast.error(res.message || '退货失败')
    return false
  }
}

const gather = ref('')

const getMethod = () => {
  const method = OrderDetail.value.payments.map(item => item.payment_method)
  const name = method.map(item => filterList.value.payment_method?.preset[item])

  gather.value = name.join('、')
}

const limit = 12
const tempList = ref<{ label: string, value: string }[]>([])
// 获取类别1(销售单)的打印模板
async function getList(where = {} as Partial<PrintTemplate>) {
  const params = { page: searchPage.value, limit, where: { store_id: myStore.value.id, type: 1 } } as ReqList<Member>
  if (JSON.stringify(where) !== '{}') {
    params.where = where
  }
  await getPrintTempList(params)
  tempList.value = printList.value.map(item => ({ label: item.name, value: item.id as string }))
}

await getList()

const chosen = ref(null)
const sign = ref(false)
const tempInfo = ref<PrintTemplate>({} as PrintTemplate)

const getSpecificInfo = async () => {
  if (chosen.value) {
    await getTempInfo({ id: chosen.value, type: 1, store_id: myStore.value.id })
    tempInfo.value = JSON.parse(JSON.stringify(PrintTemplate.value))
  }
  else if (sign.value) {
    tempInfo.value = JSON.parse(JSON.stringify(printList.value[0]))
  }
}
// 是否批量打印  false整单打印  true 批量打印
// 判断当前环境
const isMobile = ref(false)
const tabActive = ref<'p' | 'd'>('p')
const printPre = () => {
  const printDetail = ref<OrderInfo>({} as OrderInfo)
  printDetail.value = JSON.parse(JSON.stringify(OrderDetail.value))
  if (tabActive.value === 'p') {
    printDetail.value.products = []
    OrderDetail.value.products.forEach((item: any) => {
      if (mustSelect.value.find(i => i === item.id)) {
        printDetail.value.products.push(item)
      }
    })
  }

  const PrintComponent = defineComponent({
    render() {
      return h(PrintTemp, { details: printDetail.value, type: 1, payMethod: gather.value, numerical: tempInfo.value, finishedWhere: finishedFilterList.value })
    },
  })
  getMethod()
  usePrint(PrintComponent)
}

const isModel = ref(false)

const clear = () => {
  chosen.value = null
  sign.value = false
  tempInfo.value = {} as PrintTemplate
  isModel.value = false
}

// 弹窗确认
const modelConfirm = async () => {
  if (sign.value) {
    await getSpecificInfo()
    printPre()
    clear()
  }
  else {
    $toast.error('请先选择打印模板')
  }
}

// 撤销订单
const cancelOrder = async () => {
  const res = await revokedOrder({ id: route.query.id as string })
  if (res) {
    $toast.success('撤销成功')
    await getOrderDetail({ id: route.query.id as string })
  }
  else {
    $toast.error('撤销失败')
  }
}
// 支付订单确认完成
const payOrderConfirm = async () => {
  const res = await payOrder({ id: route.query.id as string })
  if (res) {
    $toast.success('支付成功')
    await getOrderDetail({ id: route.query.id as string })
  }
  else {
    $toast.error('支付失败')
  }
}

const laberComputed = (item: orderInfoProducts) => {
  if (item.type === GoodsType.ProductFinish) {
    return `成品-${item.finished.product?.name || '暂无名称'}`
  }
  if (item.type === GoodsType.ProductOld) {
    return `旧料-${item.old.product?.name || '暂无名称'}`
  }
  if (item.type === GoodsType.ProductAccessories) {
    return `配件-${item.accessorie.product?.name || '暂无名称'}`
  }
  return ''
}
const ReturnOrderShow = ref(false)
const secondAddShow = ref(false)
// 退单
const retreatOrderConfirm = async () => {
  const res = await retreatOrder({ id: route.query.id as string })
  if (res.code === HttpCode.SUCCESS) {
    $toast.success('退单成功')
    if (OrderDetail.value?.order_deposits?.length) {
      secondAddShow.value = false
    }
    else {
      secondAddShow.value = true
    }
    await getOrderDetail({ id: route.query.id as string })
  }
  else {
    $toast.error(res.message || '退单失败')
  }
}
const { orderObject } = storeToRefs(useOrder())
const handleCancel = (info: OrderInfo) => {
  orderObject.value = {} as Orders
  orderObject.value.source = info.source
  orderObject.value.cashier_id = info.cashier_id
  orderObject.value.clerks = []
  orderObject.value.remarks = info.remarks || []
  orderObject.value.round_off = Number(info.round_off) || 0
  orderObject.value.integral_deduction = Number(info.integral_deduction) || 0
  orderObject.value.discount_rate = Number(info.discount_rate) || 100
  orderObject.value.payments = []
  orderObject.value.member = info.member
  orderObject.value.member_id = info.member_id
  orderObject.value.showProductList = []
  orderObject.value.showMasterialsList = []
  orderObject.value.showPartsList = []
  info.payments.forEach((item) => {
    orderObject.value.payments.push({
      payment_method: item.payment_method,
      amount: Number(item.amount) || 0,
    })
  })
  info.clerks.forEach((item) => {
    orderObject.value.clerks.push({
      performance_rate: Number(item.performance_rate) || 0,
      is_main: item.is_main,
      salesman_id: item.salesman_id,
    })
  })
  info.products.forEach((item) => {
    if (item.type === GoodsType.ProductFinish) {
      orderObject.value.showProductList?.push({
        ...item.finished.product!,
        labor_fee: Number(item.finished.labor_fee) || 0,
        price_gold: Number(item.finished.price_gold) || 0,
        product_id: item.finished.product_id,
      })
    }
    if (item.type === GoodsType.ProductOld) {
      orderObject.value.showMasterialsList?.push({
        ...item.old.product as any,
        quality_actual: Number(item.old.product?.quality_actual) || undefined,
        weight_metal: Number(item.old.product?.weight_metal) || 0,
        recycle_price_gold: Number(item.old.product?.recycle_price_gold) || undefined,
        recycle_price_labor: Number(item.old.product?.recycle_price_labor) || undefined,
        weight_gem: Number(item.old.product?.weight_gem) || undefined,
        weight_other: Number(item.old.product?.weight_other) || undefined,
        weight_total: Number(item.old.product?.weight_total) || undefined,
        recycle_price: Number(item.old.product?.recycle_price) || undefined,
        label_price: Number(item.old.product?.label_price) || undefined,
        product_id: item.old.product?.is_our ? item.old.product_id : undefined,
      })
    }
    if (item.type === GoodsType.ProductAccessories) {
      orderObject.value.showPartsList?.push({
        ...item.accessorie.product!,
        quantity: item.accessorie.quantity,
        price: Number(item.accessorie.product?.price) || 0,
        product_id: item.accessorie.product_id,
      })
    }
  })
}
// 跳转添加订单页面
const containAdd = () => {
  handleCancel(OrderDetail.value)
  navigateTo('/sale/sales/add', { external: true, replace: true, redirectCode: 200 })
}

// 打印订单
const printOrder = async () => {
  if (myStore?.value.id === OrderDetail.value.store_id) {
    isModel.value = true
  }
  else {
    $toast.error('当前门店与操作门店不匹配,无法操作')
  }
}

onMounted(() => {
  isMobile.value = checkEnv()
})
</script>

<template>
  <div>
    <common-model
      v-model="isModel"
      :show-ok="true"
      title="选择打印模板"
      @confirm="modelConfirm"
      @cancel="() => {
        clear()
      }"
    >
      <n-tabs v-model:value="tabActive" type="line" animated>
        <n-tab-pane name="p" tab="批量打印">
          <div class="flex flex-col gap-[16px] p-[12px]">
            <div class="describe font-size-[16px] text-color-[#333]">
              请先选择打印模板。
            </div>
            <div class="">
              <n-space vertical>
                <n-select
                  v-model:value="chosen"
                  :options="tempList"
                  @focus="getList()"
                  @blur="() => {
                    const loc = tempList.findIndex(item => item.value === chosen)
                    sign = loc === -1 ? false : true
                  }"
                />
              </n-space>
            </div>
            <div class="flex flex-col">
              <div class="font-size-[16px] pb-[6px]">
                选择要打印的货品
              </div>
              <div>
                <n-select
                  v-model:value="mustSelect" multiple :options="OrderDetail.products.map(v => ({
                    label: laberComputed(v),
                    value: v.id,
                  }))" />
              </div>
            </div>
          </div>
          <div />
        </n-tab-pane>
        <n-tab-pane name="d" tab="打印">
          <div class="flex flex-col gap-[16px] px-[12px]">
            <div class="describe font-size-[16px] text-color-[#333] pt-[32px]">
              请先选择打印模板。
            </div>
            <div class="pb-[32px]">
              <n-space vertical>
                <n-select
                  v-model:value="chosen"
                  :options="tempList"
                  @focus="getList()"
                  @blur="() => {
                    const loc = tempList.findIndex(item => item.value === chosen)
                    sign = loc === -1 ? false : true
                  }"
                />
              </n-space>
            </div>
          </div>
        </n-tab-pane>
      </n-tabs>
    </common-model>

    <div class="p-[16px] pb-[80px]">
      <sale-order-detail
        v-model:dialog="showModel"
        :identity="userinfo.identity"
        :old-filter="oldFilterList"
        :member-filer="memberFiler"
        :order-where="filterList"
        :product-filter="finishedFilterList"
        :orders="OrderDetail"
        :return-goods="returnGoods"
        :store="myStore.id"
        :part-filter="accessorieFilterList"
      />
      <template v-if="!route?.query?.embedded">
        <template v-if="OrderDetail.status === OrderStatusText.OrderSalesProductStatusWaitPay">
          <template v-if="OrderDetail.cashier_id === userinfo.id ">
            <template v-if=" OrderDetail.store_id === myStore.id">
              <common-button-bottom
                confirm-text="支付"
                cancel-text="撤销"
                @confirm="payOrderConfirm"
                @cancel="cancelOrder"
              >
                <template #cancel>
                  <div class="color-[rgba(255,47,47,1)]">
                    <span>撤销</span>
                  </div>
                </template>
                <template #confirm>
                  <span>
                    支付
                  </span>
                </template>
              </common-button-bottom>
            </template>
          </template>
        </template>
        <template v-else>
          <div class="bg-[#fff] fixed bottom-0 left-0 z-1 w-full grid-12">
            <div class="flex-around col-10 offset-1 gap-[12px]" uno-sm="col-6 offset-3">
              <template v-if="OrderDetail.status === OrderStatusText.OrderSalesProductStatusComplete">
                <template v-if="OrderDetail.cashier_id === userinfo.id || OrderDetail.operator_id === userinfo.id">
                  <button
                    class="btn-left flex-1" @click="ReturnOrderShow = true">
                    退单
                  </button>
                </template>
              </template>
              <template v-if="OrderDetail?.status === OrderStatusText.OrderSalesProductStatusComplete || OrderDetail?.status === OrderStatusText.OrderSalesProductStatusWaitPay">
                <template v-if="!isMobile">
                  <button
                    class="btn-right flex-1" @click="printOrder">
                    打印
                  </button>
                </template>
              </template>
            </div>
          </div>
        </template>
      </template>
    </div>

    <common-confirm
      v-model:show="ReturnOrderShow"
      icon="warning"
      text="确认要退单吗？"
      @submit="retreatOrderConfirm()"
    />

    <common-confirm
      v-model:show="secondAddShow"
      text="是否重新新增订单？"
      @submit="containAdd()"
    />

    <correspond-store :correspond-ids="[OrderDetail.store_id]" />
  </div>
</template>

<style>
.n-base-selection {
  border-radius: 8px;
}
</style>

<style lang="scss" scoped>
.footer {
  border-top: 1px solid #e6e6e8;
  --uno: 'fixed bottom-0 left-0 block w-full bg-[#F1F5FE] dark:bg-[rgba(0,0,0,0.6)] blur-8px py-3';
}
.info {
  --uno: 'bg-[#fff] dark:bg-[rgb(245,245,245,0.1)] border-solid border-1 border-[#EFF0F6] dark:border-[rgb(239,240,246,0.1)] rounded-[24px] overflow-hidden';
}
.btn {
  --uno: 'fixed bottom-0 left-0 right-0 blur-bgc p-[12px_16px] text-[16px] font-bold';
  border-top: rgba(230, 230, 232, 1) solid 1px;
  &-left {
    box-shadow: 0px 6px 6px rgba(110, 166, 255, 0.3);
    --uno: 'text-[16px] py-[8px] my-[16px] border-none flex-1 text-center rounded-[36px]  bg-#F24E4D color-#fff';
  }

  &-right {
    background: linear-gradient(to bottom, #1a6beb, #6ea6ff);
    box-shadow: rgba(110, 166, 255, 0.3) 0px 6px 6px;
    --uno: 'text-[16px] py-[8px] my-[16px] border-none flex-1 rounded-[36px] text-[#FFFFFF]';
  }
}
</style>

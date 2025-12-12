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
// 判断当前环境
const isMobile = ref(false)
const tabActive = ref<'p' | 'd'>('d')
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
const cancelOrderShow = ref(false)
const payOrderShow = ref(false)
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
        <n-tab-pane name="d" tab="打印">
          <div class="flex flex-col gap-[16px] p-[12px]">
            <div class="font-size-[16px] text-color-[#333]">
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
        <n-tab-pane name="p" tab="批量打印">
          <div class="flex flex-col gap-[16px] p-[12px]">
            <div class="font-size-[16px] text-color-[#333]">
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
        <div class="fixed bottom-0 left-0 z-1 w-full grid-12 blur-bga" style="box-shadow: 0px -1px 15px 0px #0000001a;">
          <div class="flex justify-between col-10 offset-1 gap-[12px]" uno-sm="col-4 offset-4">
            <!--  订单状态 为 待付款 -->
            <template v-if="[OrderStatusText.OrderSalesProductStatusWaitPay].includes(OrderDetail.status)">
              <!-- 订单门店 为 当前门店id -->
              <template v-if="[OrderDetail.store_id].includes(myStore.id)">
                <!-- 订单收银员 为 当前用户id -->
                <template v-if="[OrderDetail.cashier_id].includes(userinfo.id)">
                  <common-button-rounded :full="true" margin="16px 0px" bgc="transparent" color="#3971F3" border="1px solid #3971F3" content="撤销" @button-click="cancelOrderShow = true" />
                  <common-button-rounded :full="true" margin="16px 0px" bgc="#059669" content="支付" @button-click="payOrderShow = true" />
                </template>
              </template>
            </template>
            <!-- 订单状态 为 已完成 -->
            <template v-if="[OrderStatusText.OrderSalesProductStatusComplete].includes(OrderDetail.status)">
              <!-- 订单门店 为 当前门店id -->
              <template v-if="[OrderDetail.store_id].includes(myStore.id)">
                <!-- 订单操作人 或 订单收银员 为 当前用户id -->
                <template v-if="[OrderDetail.operator_id, OrderDetail.cashier_id].includes(userinfo.id)">
                  <common-button-rounded :full="true" margin="16px 0px" bgc="#F24E4D" content="退单" @button-click="ReturnOrderShow = true" />
                </template>
              </template>
            </template>
            <!-- 订单状态 为 已完成 或 已退单 -->
            <template
              v-if="[OrderStatusText.OrderSalesProductStatusComplete, OrderStatusText.OrderSalesProductStatusRefund].includes(OrderDetail.status)">
              <template v-if="!isMobile">
                <common-button-rounded :full="true" margin="16px 0px" content="打印" @button-click="printOrder" />
              </template>
            </template>
          </div>
        </div>
      </template>
    </div>
    <correspond-store :correspond-ids="[OrderDetail.store_id]" />
    <common-confirm
      v-model:show="payOrderShow"
      icon="warning"
      text="确认要支付吗？"
      @submit="payOrderConfirm()"
    />

    <common-confirm
      v-model:show="cancelOrderShow"
      icon="warning"
      text="确认要撤销吗？"
      @submit="cancelOrder()"
    />

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
  </div>
</template>

<style>

</style>

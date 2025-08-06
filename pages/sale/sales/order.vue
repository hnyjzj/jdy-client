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
const { getOrderDetail, getSaleWhere, returnOrderGoods, revokedOrder, payOrder } = useOrder()
const { getFinishedWhere } = useFinished()
const { finishedFilterList } = storeToRefs(useFinished())
const { getOldWhere } = useOld()
const { oldFilterList } = storeToRefs(useOld())
const { myStore } = storeToRefs(useStores())

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
}
const showModel = ref(false)
const isSelectModel = ref(false)
const mustSelect = ref<any[]>([])

const returnGoods = async (req: ReturnGoods) => {
  const res = await returnOrderGoods(req)
  if (res) {
    showModel.value = false
    $toast.success('退货成功')
    await getOrderDetail({ id: route.query.id as string })
  }
}

const gather = ref('')

const getMethod = () => {
  const method = OrderDetail.value.payments.map(item => item.payment_method)
  const name = method.map(item => filterList.value.payment_method?.preset[item])

  gather.value = name.join('、')
}

const limit = 12

// 获取类别1(销售单)的打印模板
async function getList(where = {} as Partial<PrintTemplate>) {
  const params = { page: searchPage.value, limit, where: { store_id: myStore.value.id, type: 1 } } as ReqList<Member>
  if (JSON.stringify(where) !== '{}') {
    params.where = where
  }
  await getPrintTempList(params)
}

await getList()

const chosen = ref(null)
const sign = ref(false)
const tempInfo = ref<PrintTemplate>({} as PrintTemplate)

const tempList = printList.value.map(item => ({ label: item.name, value: item.id }))

const getSpecificInfo = async () => {
  if (chosen.value) {
    await getTempInfo({ id: chosen.value, type: 1, store_id: myStore.value.id })
    tempInfo.value = JSON.parse(JSON.stringify(PrintTemplate.value))
  }
  else if (sign.value) {
    tempInfo.value = JSON.parse(JSON.stringify(printList.value[0]))
  }
}

const printPre = () => {
  const printDetail = ref<OrderInfo>({} as OrderInfo)
  printDetail.value = JSON.parse(JSON.stringify(OrderDetail.value))
  printDetail.value.products = []
  OrderDetail.value.products.forEach((item: any) => {
    if (mustSelect.value.find(i => i === item.id)) {
      printDetail.value.products.push(item)
    }
  })

  const PrintComponent = defineComponent({
    render() {
      return h(PrintTemp, { details: printDetail.value, type: 1, payMethod: gather.value, numerical: tempInfo.value })
    },
  })
  getMethod()
  usePrint(PrintComponent)
}

const isModel = ref(false)

const jumpPre = () => {
  isModel.value = true
}

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
  return '123'
}
// 判断当前环境
const isMobile = ref(false)
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
      <div class="flex flex-col gap-[16px] px-[12px]">
        <div class="describe font-size-[16px] text-color-[#333] pt-[32px]">
          请先选择打印模板。
        </div>
        <div class="pb-[32px]">
          <n-space vertical>
            <n-select
              v-model:value="chosen"
              :options="tempList"
              @blur="() => {
                const loc = tempList.findIndex(item => item.value === chosen)
                sign = loc === -1 ? false : true
              }"
            />
          </n-space>
        </div>
      </div>
    </common-model>
    <common-model
      v-model="isSelectModel"
      :show-ok="true"
      title="批量打印设置"
      @confirm="modelConfirm"
      @cancel="() => {
        clear()
      }"
    >
      <div class="flex flex-col gap-[16px] px-[12px]">
        <div class="describe font-size-[16px] text-color-[#333]">
          请先选择打印模板。
        </div>
        <div class="">
          <n-space vertical>
            <n-select
              v-model:value="chosen"
              :options="tempList"
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
      />
      <template v-if="!route?.query?.embedded">
        <template v-if=" OrderDetail.status === OrderStatusText.OrderSalesProductStatusWaitPay">
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
      </template>
    </div>

    <template v-if="!route?.query?.embedded">
      <template v-if="OrderDetail?.status === 3 || OrderDetail?.status === 4">
        <template v-if="!isMobile">
          <common-button-bottom
            confirm-text="打印"
            cancel-text="批量打印"
            @confirm="() => {
              if (myStore.id === OrderDetail.store_id){
                jumpPre()
              }
              else {
                $toast.error('当前门店与操作门店不匹配,无法操作')
              }
            }"
            @cancel="() => {
              if (myStore.id === OrderDetail.store_id){
                isSelectModel = true
              }
              else {
                $toast.error('当前门店与操作门店不匹配,无法操作')
              }
            }"
          />
        </template>
      </template>
    </template>
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
</style>

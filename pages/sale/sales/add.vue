<script lang="ts" setup>
// 新增销售单
import type { FormInst, FormRules } from 'naive-ui'
import { calc } from 'a-calc'

useSeoMeta({
  title: '新增销售单',
})
const { $toast } = useNuxtApp()
const { myStore, StoreStaffList } = storeToRefs(useStores())
const { getFinishedList, getFinishedWhere, getFinishedsClass } = useFinished()
const { getStoreStaffList } = useStores()
const { getOldList, getSaleWhere, submitOrder, OldMaterialsWhere, initObjForm } = useOrder()
const { getGoldPrice } = useGoldPrice()
const { goldList } = storeToRefs(useGoldPrice())
const { OldObj, filterList, oldFilterListToArray, orderObject, oldFilterList } = storeToRefs(useOrder())
const { getMemberList } = useMemberManage()
const { getOldClass, getOldScoreProportion } = useOld()
const { getSetInfo } = useBillingSetStore()
const { billingSet, disScore } = storeToRefs(useBillingSetStore())
const { memberList } = storeToRefs(useMemberManage())
const { getAccessorieList, getAccessorieWhere, getAccessorieScoreRate } = useAccessorie()
const { accessorieList, accessorieFilterList } = storeToRefs(useAccessorie())
const { finishedList } = storeToRefs(useFinished())
const { createMember } = useMemberManage()
const { getOrderDetail, getDepositList } = useDepositOrder()
const { OrderDetail, OrdersList } = storeToRefs(useDepositOrder())
const { getPhraseList } = usePhrase()
const route = useRoute()
const Key = ref()

// 获取备注列表
const getSearchPhrase = async (value: string) => {
  const res = await getPhraseList({ page: 1, limit: 10, where: { store_id: myStore.value.id, content: value || '' } })
  return res || [] as Phrase[]
}
// 获取订金单列表
const searchDepositOrders = async (val?: string) => {
  await getDepositList({ page: 1, limit: 5, where: { id: val, status: DepositOrderStatus.Booking, store_id: myStore.value.id } })
  return OrdersList.value || []
}
// 获取会员列表
const getMember = async (val: string) => {
  await getMemberList({ page: 1, limit: 1, where: { phone: val } })
  return memberList.value || []
}
// 获取门店员工列表
const getStaff = async () => {
  const res = await getStoreStaffList({ id: myStore.value.id })
  if (res) {
    $toast.error(res?.data.value?.message || '获取员工列表失败')
  }
}
// 获取配件积分比例
const checkAccessoriesScore = async (params: { classes: ProductAccessories['type'][] }) => await getAccessorieScoreRate(params)
// 新增会员
const addNewMember = async (val: Member) => await createMember(val)
// 搜索成品,查询list
const searchProductList = async (data: { val: string }) => {
  if (data.val) {
    await getFinishedList({ page: 1, limit: 10, where: { code: data.val, status: ProductFinishedsStatus.Normal } })
  }
  return finishedList.value || []
}
// 搜索旧料
const searchOlds = async (val: string) => {
  if (val) {
    await getOldList({ page: 1, limit: 10, where: { code: val, status: ProductFinishedsStatus.Sold } })
  }
  return OldObj.value || {}
}
// 搜索配件
const searchParts = async (val: string) => {
  await getAccessorieList({ page: 1, limit: 10, where: { name: val, store_id: myStore.value.id } })
  if (!accessorieList.value.length) {
    $toast.error('搜索货品不存在')
  }
  return accessorieList.value || []
}
// 获取成品积分比例
const checkProductClass = async (params: { class: number }) => {
  const data = await getFinishedsClass(params)
  return data?.rate ? data.rate : '0'
}

const addMemberRef = ref()
const rules = ref<FormRules>({
  cashier_id: {
    required: true,
    trigger: ['blur', 'change'],
    message: '请选择收银员',
  },
  source: {
    type: 'number',
    required: true,
    trigger: ['blur', 'change'],
    message: '请选择订单来源',
  },
})
// 定金单列表
const showDepositList = ref<DepositOrderInfo[]>([])
// 选择的订金单列表
const selectDepositList = ref<DepositOrderInfo[]>([])

// 初始化导购员 和 收款方式 和 积分
const initOptions = () => {
  orderObject.value.payments ??= [{ payment_method: 1, amount: undefined }]
  orderObject.value.clerks ??= [{ salesman_id: undefined, performance_rate: 100, is_main: true }]
  orderObject.value.has_integral ??= false
}

// 添加商品
const addProduct = async (product: DepositOrderInfoProducts) => {
  orderObject.value.showProductList ??= []
  const index = orderObject.value.showProductList.findIndex(item => item.id === product.product_finished?.id)
  //   添加成品到列表中
  if (index === -1) {
    const data = {
      id: product.product_finished.id,
      product_id: product.product_finished.id,
      name: product.product_finished.name,
      retail_type: product.product_finished.retail_type,
      label_price: product.product_finished.label_price,
      weight_metal: product.product_finished.weight_metal,
      code: product.product_finished.code,
      class: product.product_finished.class,
      discount_fixed: 100, // 折扣
      discount_member: 100, // 会员折扣
      labor_fee: Number(product.product_finished.labor_fee),
    } as OrderProductFinished
    const rate = await checkProductClass({ class: data.class })
    data.rate = (rate && rate !== '0') ? Number(rate) : 0
    orderObject.value.showProductList.push(data)
  }
}

await getSaleWhere()
await OldMaterialsWhere()
await getFinishedWhere()
await getAccessorieWhere()
if (myStore.value.id) {
  await getStaff()
  await getGoldPrice(myStore.value.id)
  await getSetInfo({ store_id: myStore.value.id })
}
// 设置积分抵扣值

const handleIsInterChange = () => {
  if (!orderObject.value.has_integral) {
    // 清空积分
    orderObject.value.showProductList?.forEach((item) => {
      item.integral = 0
    })
    orderObject.value.showMasterialsList?.forEach((item) => {
      item.integral = 0
    })
  }
  else {
    orderObject.value.showProductList?.forEach((item) => {
      if (item.price && item.rate && Number(item.rate) !== 0) {
        // 计算应得的积分 +
        item.integral = calc('(a / b) | =0 ~5 ,!n', {
          a: item.price,
          b: item.rate,
        })
      }
      else {
        item.integral = 0
      }
    })
    orderObject.value.showMasterialsList?.forEach((item) => {
      if (item.recycle_price && item.rate && Number(item.rate) !== 0) {
        item.integral = calc('(a / b)| =0 ~5, !n', {
          a: item.recycle_price || 0,
          b: item?.rate || 0,
        })
      }
      else {
        item.integral = 0
      }
    })
  }
}

// 获取旧料大类，并获取旧料积分比例
const CheckOldClass = async (params: Partial<OrderMaterial>) => {
  const res = await getOldClass(params)
  if (res?.value) {
    const data = await getOldScoreProportion({ class: res?.value })
    return { rate: data, res }
  }
}

// 判断定金单商品是否全部选中
const judgeProdcut = (): boolean => {
  // 提取产品ID集合，避免重复创建
  const orderProductIds = new Set(orderObject.value.showProductList?.map(obj => obj.id))
  // 检查是否有缺失的产品
  const hasMissingProduct = selectDepositList.value?.some(orderDeposit =>
    orderDeposit.products.some(product =>
      product.product_finished.id && !orderProductIds.has(product.product_finished.id),
    ),
  )
  if (hasMissingProduct) {
    $toast.error('请完整添加订金单中的产品')
    return false
  }
  return true
}

// 判断业绩比例
const judgePerformance_rate = (): boolean => {
  const totalRate = orderObject.value.clerks?.reduce((sum, item) => sum + (item.performance_rate ?? 0), 0)
  return totalRate === 100 || ($toast.error('业绩比例总合必须等于100%'), false)
}

const formRef = ref<FormInst | null>(null)
// 开单
const handleValidateButtonClick = async (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      if (!orderObject.value.member_id) {
        $toast.error('请先添加会员')
        return
      }
      // 判断业绩比例是否等于百分之100
      if (!judgePerformance_rate()) {
        return
      }
      // 判断定金单商品是否全部选中
      if (!judgeProdcut()) {
        return
      }
      orderObject.value.store_id = myStore.value.id
      orderObject.value.order_deposit_ids = []
      selectDepositList.value?.forEach((item) => {
        orderObject.value.order_deposit_ids?.push(item.id)
      })
      // 成品旧料配件赋值
      orderObject.value.product_accessories = orderObject.value.showPartsList || []
      orderObject.value.product_finisheds = orderObject.value.showProductList || []
      orderObject.value.product_olds = orderObject.value.showMasterialsList || []
      // 添加备注
      if (orderObject.value.userRemark && orderObject.value.userRemark.trim()) {
        orderObject.value.remarks?.push(orderObject.value.userRemark)
      }

      try {
        const res = await submitOrder(orderObject.value)
        if (res?.code === HttpCode.SUCCESS) {
          $toast.success('开单成功')
          navigateTo('/sale/sales/list', { external: true, replace: true, redirectCode: 200 })
          initObjForm()
          Key.value = Date.now().toString()
        }
        else {
          $toast.error(res?.message ?? '开单失败')
        }
      }
      catch (error: any) {
        throw new Error(error)
      }
    }
    else {
      $toast.error(errors[0][0].message as string)
    }
  })
}
// 切换门店的操作
const changeStore = async () => {
  await getSetInfo({ store_id: myStore.value.id })
  initObjForm()
  initOptions()
  Key.value = Date.now().toString()
}

// 更新订金单中的货品到成品展示列表中
const updateDepostitProduct = () => {
  showDepositList.value.forEach((item) => {
    item.products.forEach((product) => {
      if (product.is_our) {
        addProduct(product)
      }
    })
  })
}
if (route?.query?.id) {
  // 判断是否有定金单订单详情
  await getOrderDetail({ id: route?.query?.id as string })
  showDepositList.value.push(OrderDetail.value)
  updateDepostitProduct()
  setTimeout(() => {
    addMemberRef.value?.setMbid(OrderDetail.value.member_id, OrderDetail.value.member?.phone)
  }, 200)
}

// 提示是否继续添加的弹窗
const tipForm = ref(false)
const tipFormVisible = () => {
  return !!(Object.keys(orderObject.value).filter((i) => {
    switch (i) {
      case 'has_integral':
        return false
      case 'payments':
        return false
      case 'clerks':
        return false
      default:
        return true
    }
  })?.length > 0)
}
const initFinished = ref(false)
const loading = ref(true)
onMounted(async () => {
  // 设置表单显示状态
  tipForm.value = tipFormVisible()
  initOptions()
  initFinished.value = true
  loading.value = false
})
</script>

<template>
  <div :key="Key" class="grid-12 pb-[16px]">
    <template
      v-if="initFinished">
      <div class="flex flex-col w-auto gap-[16px] px-[16px] py-[16px] pb-[80px] col-12" uno-xs="col-12" uno-sm="col-8 offset-2" uno-md="col-6 offset-3">
        <n-form
          ref="formRef"
          :model="orderObject"
          :rules="rules"
          label-align="left"
          size="large"
        >
          <div class="w-[120px] color-[#fff] pb-[12px]">
            <product-manage-company :confirm="true" @change="changeStore" />
          </div>
          <sale-add-base
            v-model="orderObject"
            :filter-list="filterList"
            :store-staff="StoreStaffList"
            :get-staff="getStaff"
            :set-score="handleIsInterChange"
          />
          <sale-add-member
            ref="addMemberRef"
            v-model="orderObject"
            :get-member="getMember"
            :store="myStore"
            :staffs="StoreStaffList"
            :get-staffs="getStaff"
            :add-new-member="addNewMember"
            @set-member-id="orderObject.member_id = $event"
          />
          <sale-add-product
            v-model="orderObject"
            :price="goldList"
            :billing-set="billingSet"
            :search-product-list="searchProductList"
            :check-product-class="checkProductClass"
          />
          <sale-add-masterials
            v-model="orderObject"
            v-model:now-old-master="OldObj"
            :price="goldList"
            :search-olds="searchOlds"
            :check-old-class="CheckOldClass"
            :old-filter-list="oldFilterList"
            :old-filter-list-to-array="oldFilterListToArray"
            :billing-set="billingSet"
          />
          <sale-add-parts
            v-model="orderObject"
            :check-accessories-score="checkAccessoriesScore"
            :is-integral="orderObject.has_integral"
            :billing-set="billingSet"
            :search-parts="searchParts"
            :part-filter="accessorieFilterList"
          />
          <template v-if="route.query.id">
            <sale-add-depositorder
              v-model:list="showDepositList"
              v-model:select="selectDepositList"
              :search-deposit-orders="searchDepositOrders"
              :order-detail="OrderDetail"
              @update-product="updateDepostitProduct()"
            />
          </template>

          <sale-add-settlement
            v-model:form="orderObject"
            v-model:deposit="selectDepositList"
            :filter-list="filterList"
            :dis-score="disScore"
            :get-search-phrase="getSearchPhrase"
            :billing-set="billingSet"
          />

          <div class="h-[80px] bg-[#fff] fixed z-1">
            <div class="btn grid-12 px-[16px]">
              <div class="col-12 cursor-pointer" uno-xs="col-12" uno-sm="col-8 offset-2" uno-md="col-6 offset-3" @click="handleValidateButtonClick">
                <common-button-rounded content="开单" />
              </div>
            </div>
          </div>
        </n-form>
      </div>
    </template>
    <common-confirm
      v-model:show="tipForm" icon="warning" title="提醒" text="检测到有未完成的新增订单,是否继续填写?" @cancel="() => {
        initObjForm()
        initOptions()
      }"
      @submit="async () => {
        await getStaff()
      }" />
    <common-loading v-model="loading" />
  </div>
</template>

<style lang="scss" scoped>
.n-input-number {
  width: 100%;
}
.btn {
  --uno: 'fixed bottom-0 left-0 right-0 blur-bga pt-20px pb-[28px] text-[16px] font-bold border-t-[1px] border-t-solid border-[#E0E0E0]';
  &-right {
    background: linear-gradient(to bottom, #1a6beb, #6ea6ff);
    box-shadow: rgba(110, 166, 255, 0.3) 0px 6px 6px;
    --uno: 'text-[16px] py-[8px] border-none flex-1 rounded-[36px] ml-[8px] text-[#FFFFFF]';
  }
}
</style>

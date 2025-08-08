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
const { OldObj, filterList, oldFilterListToArray, orderObject } = storeToRefs(useOrder())
const { getMemberList } = useMemberManage()
const { getOldClass, getOldScoreProportion } = useOld()
const { getSetInfo } = useBillingSetStore()
const { memberList } = storeToRefs(useMemberManage())
const { getAccessorieList, getAccessorieWhere, getAccessorieScoreRate } = useAccessorie()
const { accessorieList, accessorieFilterList } = storeToRefs(useAccessorie())
const { finishedList } = storeToRefs(useFinished())
const { createMember } = useMemberManage()
const { getOrderDetail, getDepositList } = useDepositOrder()
const { OrderDetail, OrdersList } = storeToRefs(useDepositOrder())
const { getPhraseList } = usePhrase()
const layoutLoading = ref(false)
const getSearchPhrase = async (value: string) => {
  const res = await getPhraseList({ page: 1, limit: 10, where: { store_id: myStore.value.id, content: value || '' } })
  return res || [] as Phrase[]
}
const addMemberRef = ref()
const Key = ref()
const formRef = ref<FormInst | null>(null)

const userremark = ref('')

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
const route = useRoute()
const billingSet = ref({
  // 金额进位控制"
  rounding: 0,
  // 金额小数点控制"
  decimal_point: 0,
  // 积分抵扣比例
  discount_rate: '',
  // "是否弹窗二次确认"
  use_confirm: false,
} as BillingSet)
// 是否禁止修改积分抵扣  true:禁止 false:允许
const disScore = ref(false)

// 定金单列表
const showDepositList = ref<DepositOrderInfo[]>([])
// 选择的订金单列表
const selectDepositList = ref<DepositOrderInfo[]>([])

// 获取成品积分比例
const checkProductClass = async (params: { class: number }) => {
  const data = await getFinishedsClass(params)
  if (data?.rate) {
    return data.rate as string
  }
  else {
    return '0'
  }
}
const searchDepositOrders = async (val?: string) => {
  await getDepositList({ page: 1, limit: 5, where: { id: val, status: DepositOrderStatus.Verified, store_id: myStore.value.id } })
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
const tipForm = ref(false)
if (myStore.value.id) {
  await getStaff()
}
onMounted(async () => {
  const formData = orderObject.value.formData
  const showLists = orderObject.value
  // 检查是否需要显示表单
  const shouldShowTipForm
  = formData.cashier_id
  || (!formData.cashier_id && formData.clerks[0]?.salesman_id)
  || formData.has_integral
  || formData.member_id
  || formData.discount_rate !== 100
  || formData.round_off !== 0
  || formData.integral_deduction !== 0
  || formData.payments.some(item => item.amount !== undefined)
  || formData.remarks.length > 0
  || showLists.showProductList.length > 0
  || showLists.showMasterialsList.length > 0
  || showLists.showPartsList.length > 0
  // 设置表单显示状态
  tipForm.value = !!shouldShowTipForm
})

// 添加商品
const addProduct = async (product: ProductFinisheds) => {
  const index = orderObject.value.showProductList.findIndex(item => item.product_id === product?.id)
  //   添加成品到列表中
  if (index === -1) {
    const data = {
      id: product.id,
      name: product.name,
      retail_type: product.retail_type,
      label_price: product.label_price,
      weight_metal: product.weight_metal,
      code: product.code,
      price_gold: 0, // 金价
      discount_fixed: 100, // 折扣
      price: 0, // 应付金额
      product_id: product?.id as string, // 商品id
      labor_fee: 0, // 工费
      round_off: 0, // 抹零
      discount_final: 0, // 显示折扣
      price_original: 0, // 原始价格
      discount_member: 100, // 会员折扣
      integral: 0, // 积分
      integral_deduction: 0, // 积分抵扣
      rate: 0, // 积分比例
      class: product.class,
    }
    data.labor_fee = Number(product.labor_fee)

    const rate = await checkProductClass({ class: data.class })
    if (rate && rate !== '0') {
      data.rate = Number(rate)
    }
    else {
      data.rate = 0
    }

    orderObject.value.showProductList.push(data)
  }
  else {
    $toast.error('该商品已经添加过')
  }
}

if (route?.query?.id) {
  // 判断是否有定金单订单详情
  await getOrderDetail({ id: route?.query?.id as string })
  showDepositList.value.push(OrderDetail.value)
  OrderDetail.value.products.forEach((item) => {
    if (item.is_our) {
      addProduct(item.product_finished)
    }
  })
  await getStaff()
  orderObject.value.formData.clerks[0] = {
    salesman_id: OrderDetail.value.clerk_id,
    performance_rate: 100,
    is_main: true,
  }

  setTimeout(() => {
    addMemberRef.value?.setMbid(OrderDetail.value.member_id, OrderDetail.value.member?.phone)
  }, 200)
}

await getSaleWhere()
await OldMaterialsWhere()
await getFinishedWhere()
await getAccessorieWhere()
await getGoldPrice(myStore.value.id)
// 获取开单设置 金额进位等等
const getbillingSet = async () => {
  const setInfo = await getSetInfo({ store_id: myStore.value.id })
  if (setInfo) {
    const { decimal_point, rounding, discount_rate, use_confirm } = setInfo
    billingSet.value = { decimal_point, rounding, discount_rate, use_confirm }
    if (setInfo.discount_rate && setInfo.discount_rate !== '0') {
      disScore.value = true
    }
  }
}
await getbillingSet()

// 新增会员
const addNewMember = async (val: Member) => await createMember(val)
// 是否积分 设置

// 设置积分抵扣值
const handleIsInterChange = () => {
  if (!orderObject.value.formData.has_integral) {
    // 清空积分
    orderObject.value.showProductList.forEach((item) => {
      item.integral = 0
    })
    orderObject.value.showMasterialsList.forEach((item) => {
      item.integral = 0
    })
    orderObject.value.showPartsList.forEach((item) => {
      item.integral = 0
    })
  }
  else {
    orderObject.value.showProductList.forEach((item) => {
      // 计算应得的积分 +
      item.integral = calc('(a / b) | =0 ~5 ,!n', {
        a: item.price,
        b: item.rate,
      })
    })
    orderObject.value.showMasterialsList.forEach((item) => {
      item.integral = calc('(a / b)| =0 ~5, !n', {
        a: item.recycle_price,
        b: item.rate,
      })
    })
    orderObject.value.showPartsList.forEach((item) => {
      item.integral = calc('(a / b) | =0 ~5 ,!n', {
        a: item.amount,
        b: item.rate,
      })
    })
  }
}

// 搜索成品,查询list
const searchProductList = async (data: { val: string, type: string }) => {
  if (data.val === '' && data.type === 'name') {
    $toast.error('请输入商品名称')
    return []
  }
  else if (data.val === '' && data.type === 'code') {
    $toast.error('请输入商品条码')
    return []
  }

  if (data.type === 'name') {
    const res = await getFinishedList({ page: 1, limit: 10, where: { name: data.val } })
    if (res?.data.total === 0) {
      $toast.error('商品不存在')
    }
  }
  else {
    const res = await getFinishedList({ page: 1, limit: 10, where: { code: data.val } })
    if (res?.data.total === 0) {
      $toast.error('商品不存在')
    }
  }
  return finishedList.value || []
}
// 搜索旧料
const searchOlds = async (val: string) => {
  if (val) {
    await getOldList({ page: 1, limit: 10, where: { code: val, status: ProductFinishedsStatus.Sold } })
    if (!OldObj.value.product_id) {
      $toast.error('商品不存在')
    }
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

// 获取旧料大类，并获取旧料积分比例
const CheckOldClass = async (params: Partial<ProductOld>) => {
  const res = await getOldClass(params)
  if (res?.value) {
    const data = await getOldScoreProportion({ class: res?.value })
    return { rate: data, res }
  }
  else {
    $toast.error('获取大类失败！')
  }
}
// 获取配件积分比例
const checkAccessoriesScore = async (params: { classes: ProductAccessories['type'][] }) => await getAccessorieScoreRate(params)

// 开单
const handleValidateButtonClick = async (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      if (!orderObject.value.formData.member_id) {
        $toast.error('请先添加会员')
        return
      }
      orderObject.value.formData.product_accessories = []
      // 成功的操作
      orderObject.value.formData.product_finisheds = orderObject.value.showProductList
      orderObject.value.formData.store_id = myStore.value.id
      orderObject.value.formData.product_olds = orderObject.value.showMasterialsList
      orderObject.value.showPartsList.forEach((item) => {
        const data = {
          product_id: item.id,
          quantity: item.quantity,
          price: item.amount,
          integral: item.integral,
        }
        orderObject.value.formData.product_accessories?.push(data)
      })
      // 添加备注
      if (userremark.value && userremark.value.trim()) {
        const trimmedRemark = userremark.value.trim()
        const exists = orderObject.value.formData.remarks?.includes(trimmedRemark)
        if (!exists) {
          orderObject.value.formData.remarks?.push(trimmedRemark)
        }
      }
      // 业绩比例
      const result = ref(0)
      orderObject.value.formData.clerks.forEach((item) => {
        result.value += item.performance_rate || 0
      })

      if (result.value > 100) {
        $toast.error('业绩比例总合必须等于100%')
        return
      }
      else if (result.value < 100) {
        $toast.error('业绩比例总合必须等于100%')
        return
      }
      layoutLoading.value = true
      try {
        const res = await submitOrder(orderObject.value.formData)
        if (res?.code === HttpCode.SUCCESS) {
          $toast.success('开单成功')
          navigateTo('/sale/sales/list', { external: true, replace: true, redirectCode: 200 })
          initObjForm()
          orderObject.value.showProductList = []
          orderObject.value.showMasterialsList = []
          orderObject.value.showPartsList = []
          Key.value = Date.now().toString()
        }
        else {
          $toast.error(res?.message ?? '开单失败')
        }
        layoutLoading.value = false
      }
      catch (error: any) {
        layoutLoading.value = false
        throw new Error(error)
      }
    }
    else {
      $toast.error(errors[0][0].message as string)
    }
  })
}

// 切换门店的操作
const changeStore = () => {
  getbillingSet()
  orderObject.value.showProductList = []
  orderObject.value.showPartsList = []
  orderObject.value.showMasterialsList = []
  initObjForm()
  Key.value = Date.now().toString()
}
</script>

<template>
  <div :key="Key" class="grid-12 pb-[16px]">
    <div class="flex flex-col w-auto gap-[16px] px-[16px] py-[16px] pb-[80px] col-12" uno-xs="col-12" uno-sm="col-8 offset-2" uno-md="col-6 offset-3">
      <n-form
        ref="formRef"
        :model="orderObject.formData"
        :rules="rules"
        label-align="left"
        size="large"
      >
        <div class="w-[120px] color-[#fff] pb-[12px]">
          <product-manage-company :confirm="true" @change="changeStore" />
        </div>
        <div class="pb-[16px]">
          <sale-add-base
            v-model="orderObject.formData"
            v-model:integral="orderObject.formData.has_integral"
            :filter-list="filterList"
            :store-staff="StoreStaffList"
            :get-staff="getStaff"
            :set-score="handleIsInterChange"
          />
        </div>

        <sale-add-member
          ref="addMemberRef"
          :get-member="getMember"
          :store="myStore"
          :staffs="StoreStaffList"
          :get-staffs="getStaff"
          :add-new-member="addNewMember"
          @set-member-id="orderObject.formData.member_id = $event"
        />
        <div class="pb-[16px]">
          <sale-add-product
            v-model="orderObject.showProductList"
            v-model:form-data="orderObject.formData"
            v-model:product-set="orderObject.ProductListSet"
            title="成品"
            :search-product-list="searchProductList"
            :price="goldList"
            :is-integral="orderObject.formData.has_integral"
            :check-product-class="checkProductClass"
            :billing-set="billingSet"
          />
        </div>
        <div class="pb-[16px]">
          <sale-add-masterials
            v-model:list="orderObject.showMasterialsList"
            v-model:now-old-master="OldObj"
            title="旧料"
            :price="goldList"
            :search-olds="searchOlds"
            :check-old-class="CheckOldClass"
            :old-filter-list-to-array="oldFilterListToArray"
            :is-integral="orderObject.formData.has_integral"
            :billing-set="billingSet"
          />
        </div>
        <div class="pb-[16px]">
          <sale-add-parts
            v-model:list="orderObject.showPartsList"
            title="配件礼品"
            :check-accessories-score="checkAccessoriesScore"
            :is-integral="orderObject.formData.has_integral"
            :billing-set="billingSet"
            :search-parts="searchParts"
            :part-filter="accessorieFilterList"
            @clear-list="() => accessorieList = [] "
          />
        </div>
        <template v-if="route.query.id">
          <div class="pb-[16px]">
            <sale-add-depositorder
              v-model:list="showDepositList"
              v-model:select="selectDepositList"
              title="订金单"
              :search-deposit-orders="searchDepositOrders"
              :order-detail="OrderDetail"
              @set-order-ids="orderObject.formData.order_deposit_ids = $event"
            />
          </div>
        </template>

        <sale-add-settlement
          v-model:userremark="userremark"
          v-model:form="orderObject.formData"
          v-model:show-list="orderObject.showProductList"
          v-model:master="orderObject.showMasterialsList"
          v-model:parts="orderObject.showPartsList"
          v-model:deposit="selectDepositList"
          :filter-list="filterList"
          :dis-score="disScore"
          :get-search-phrase="getSearchPhrase"
          :billing-set="billingSet"
        >
          <template #score />
        </sale-add-settlement>

        <div class="h-[80px] bg-[#fff] fixed z-1">
          <div class="btn grid-12 px-[16px]">
            <div class="col-12 cursor-pointer" uno-xs="col-12" uno-sm="col-8 offset-2" uno-md="col-6 offset-3" @click="handleValidateButtonClick">
              <common-button-rounded content="开单" />
            </div>
          </div>
        </div>
      </n-form>
    </div>
    <common-confirm
      v-model:show="tipForm" icon="warning" title="提醒" text="检测到有未完成的新增订单,是否继续填写?" @cancel="() => {
        initObjForm()
      }"
      @submit="async () => {
        await getStaff()
      }" />
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

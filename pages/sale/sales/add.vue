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
const { submitOrder, getOrderDetail, getOldList, getSaleWhere } = useOrder()
const { getGoldPrice } = useGoldPrice()
const { goldList } = storeToRefs(useGoldPrice())

const { OldObj, filterList } = storeToRefs(useOrder())
const { getMemberList } = useMemberManage()
const { getOldWhere, getOldClass, getOldScoreProportion } = useOld()
const { getSetInfo } = useBillingSetStore()
const { memberList } = storeToRefs(useMemberManage())
const { getAccessorieList, getAccessorieWhere, getAccessorieScoreRate } = useAccessorie()
const { accessorieList } = storeToRefs(useAccessorie())
const { finishedList } = storeToRefs(useFinished())
const { createMember } = useMemberManage()
const { oldFilterListToArray } = storeToRefs(useOld())

const formRef = ref<FormInst | null>(null)
const formData = ref<Orders>({
  amount: 0, // 应付金额
  type: undefined, // 订单类型
  source: undefined, // 订单来源
  remark: '', // 备注
  discount_rate: undefined, // 整单折扣
  amount_reduce: 0, // 抹零金额
  integral_use: 0, //  使用积分
  member_id: undefined, // 会员ID
  store_id: '', // 门店ID
  cashier_id: undefined, // 收银员ID
  //   积分抵扣
  deduction_points: undefined,
  isIntegral: true,
  products: [], // 商品列表
  salesmans: [{
    salesman_id: undefined,
    performance_rate: 100,
    is_main: true,
  }],
  payment_method: [{ method: undefined, money: 0 }], // 支付方式
})
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
// 展示商品列表
const showProductList = ref<OrderProducts[]>([])
const showPartsList = ref<ProductAccessories[]>([])
const showMasterialsList = ref<ProductOlds[]>([])
await getSaleWhere()
await getOldWhere()
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
getbillingSet()
// 获取会员列表
const getMember = async (val: string) => await getMemberList({ page: 1, limit: 5, where: { phone: val } })
// 获取门店员工列表
const getStaff = async () => await getStoreStaffList({ id: myStore.value.id })
// 新增会员
const addNewMember = async (val: Member) => await createMember(val)
// 是否积分 设置

const handleIsInterChange = () => {
  if (!formData.value.isIntegral) {
    // 清空积分
    showProductList.value.forEach((item) => {
      item.integral = 0
    })
    showMasterialsList.value.forEach((item) => {
      item.score = 0
    })
    showPartsList.value.forEach((item) => {
      item.integral = 0
    })
  }
  else {
    showProductList.value.forEach((item) => {
      // 计算应得的积分 +
      item.integral = calc('(a / b) | =0 ~5 ,!n', {
        a: item.amount,
        b: item.rate,
      })
    })
    showMasterialsList.value.forEach((item) => {
      item.score = calc('(a / b)| =0 ~5, !n', {
        a: item.recycle_price,
        b: item.rate,
      })
    })
    showPartsList.value.forEach((item) => {
      item.integral = calc('(a / b) | =0 ~5 ,!n', {
        a: item.amount,
        b: item.rate,
      })
    })
  }
}

const rules = ref<FormRules>({
  member_id: {
    required: true,
    trigger: ['blur', 'change'],
    message: '请选择会员',
  },
  type: {
    type: 'number',
    required: true,
    trigger: ['blur', 'change'],
    message: '请选择订单类型',
  },
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
  await getOldList({ page: 1, limit: 10, where: { code: val, status: 5 } })
  return OldObj.value || []
}
// 搜索配件
const searchParts = async (val: string, type: string) => {
  if (type === 'number') {
    await getAccessorieList({ page: 1, limit: 10, where: { id: val, store_id: myStore.value.id } })
  }
  if (type === 'code') {
    await getAccessorieList({ page: 1, limit: 10, where: { code: val, store_id: myStore.value.id } })
  }
  if (type === 'name') {
    await getAccessorieList({ page: 1, limit: 10, where: { name: val, store_id: myStore.value.id } })
  }
  return accessorieList.value || []
}

// 获取成品积分比例
const checkProductClass = async (params: { class: number }) => {
  const data = await getFinishedsClass(params)
  if (data.rate) {
    return data.rate as string
  }
}

// 获取旧料大类，并获取旧料积分比例
const CheckOldClass = async (params: Partial<ProductOlds>) => {
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
const checkAccessoriesScore = async (params: { classes: AccessorieCategory['type_part'][] }) => await getAccessorieScoreRate(params)

// 开单
const handleValidateButtonClick = async (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      // 成功的操作
      formData.value.products = [] // 清空商品列表
      showProductList.value.forEach((item) => {
        const data = {
          product_id: item.product?.id || item.product_id,
          quantity: item.quantity || 1,
          discount: item.discount,
        }
        formData.value.products.push(data)
      })
      const result = ref(0)
      formData.value.salesmans.forEach((item) => {
        result.value += item.performance_rate || 0
      })
      if (result.value > 100) {
        $toast.error('业绩比例总合必须等于100%')
        return false
      }
      else if (result.value < 100) {
        $toast.error('业绩比例总合必须等于100%')
        return false
      }
      formData.value.store_id = myStore.value.id
      const res = await submitOrder(formData.value)
      if (res?.code === HttpCode.SUCCESS) {
        $toast.success('添加成功')
        await getOrderDetail({ id: res.data.id as string })
        await navigateTo({ path: '/sale/sales/order' })
      }
      else {
        $toast.error(res?.message ?? '添加失败')
      }
    }
    else {
      $toast.error('请填写必填信息')
    }
  })
}
// 初始化表单数据
const initFormData = {
  amount: 0, // 应付金额
  type: undefined, // 订单类型
  source: undefined, // 订单来源
  remark: '', // 备注
  discount_rate: undefined, // 整单折扣
  amount_reduce: 0, // 抹零金额
  integral_use: 0, //  使用积分
  member_id: undefined, // 会员ID
  store_id: '', // 门店ID
  cashier_id: undefined, // 收银员ID
  deduction_points: undefined,
  isIntegral: true,
  products: [], // 商品列表
  salesmans: [{
    salesman_id: undefined,
    performance_rate: 100,
    is_main: true,
  }],
  payment_method: [{ method: undefined, money: 0 }], // 支付方式
}
const Key = ref()
// 切换门店的操作
const changeStore = () => {
  getbillingSet()
  showProductList.value = []
  showPartsList.value = []
  showMasterialsList.value = []
  formData.value = { ...initFormData }
  Key.value = Date.now().toString()
}
</script>

<template>
  <div class="grid-12">
    <div class="flex flex-col w-auto gap-[16px] px-[16px] py-[16px] pb-[80px] col-12" uno-xs="col-12" uno-sm="col-8 offset-2" uno-md="col-6 offset-3">
      <n-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-align="left"
        size="large"
      >
        <div class="w-[120px] color-[#fff] pb-[12px]">
          <product-manage-company :confirm="true" @change="changeStore" />
        </div>
        <div :key="Key" class="pb-[16px]">
          <!-- :filter-list="filterList" -->
          <sale-add-base
            v-model="formData"
            v-model:integral="formData.isIntegral"
            :filter-list="filterList"
            :store-staff="StoreStaffList"
            :get-staff="getStaff"
            :set-score="handleIsInterChange"
          />
        </div>
        <div class="pb-[16px]">
          <sale-add-member
            v-model:form-data="formData"
            :get-member="getMember"
            :member-list="memberList"
            :billing-set="billingSet"
            :store="myStore"
            :staffs="StoreStaffList"
            :get-staffs="getStaff"
            :add-new-member="addNewMember"
          />
        </div>
        <div class="pb-[16px]">
          <sale-add-product
            v-model="showProductList"
            :search-product-list="searchProductList"
            :price="goldList"
            :is-integral="formData.isIntegral"
            :check-product-class="checkProductClass"
            :billing-set="billingSet"
          />
        </div>

        <div class="pb-[16px]">
          <sale-add-masterials
            v-model:list="showMasterialsList"
            v-model:now-old-master="OldObj"
            :search-olds="searchOlds"
            :check-old-class="CheckOldClass"
            :old-filter-list-to-array="oldFilterListToArray"
            :is-integral="formData.isIntegral"
          />
        </div>
        <div class="pb-[16px]">
          <sale-add-parts
            v-model:list="showPartsList"
            :check-accessories-score="checkAccessoriesScore"
            :is-integral="formData.isIntegral"
            :billing-set="billingSet"
            :search-parts="searchParts"
            @clear-list="() => accessorieList = [] "
          />
        </div>
        <!--   :filter-list="filterList" -->
        <sale-add-settlement
          v-model:form="formData"
          v-model:show-list="showProductList"
          v-model:master="showMasterialsList"
          v-model:parts="showPartsList"
          :filter-list="filterList"
          :dis-score="disScore"
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

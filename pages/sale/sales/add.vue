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
const { finishedFilterList } = storeToRefs(useFinished())
const { getStoreStaffList } = useStores()
const { getSaleWhere, submitOrder, getOrderDetail, getOldList } = useOrder()
const { getGoldPrice } = useGoldPrice()
const { goldList } = storeToRefs(useGoldPrice())
const { filterList, OldObj } = storeToRefs(useOrder())
const { getMemberList } = useMemberManage()
const { getOldWhere, getOldClass, getOldScoreProportion } = useOld()
const { getSetInfo } = useBillingSetStore()
const { memberList } = storeToRefs(useMemberManage())
const { getAccessorieList, getAccessorieWhere, getAccessorieScoreRate } = useAccessorie()
const { accessorieList, accessorieFilterListToArray } = storeToRefs(useAccessorie())
const { finishedList } = storeToRefs(useFinished())
const { createMember } = useMemberManage()

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
    billingSet.value.decimal_point = setInfo.decimal_point
    billingSet.value.rounding = setInfo.rounding
    billingSet.value.discount_rate = setInfo.discount_rate
    billingSet.value.use_confirm = setInfo.use_confirm
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
// 是否积分
const isIntegral = ref(true)
const isIntegralOpts = [
  {
    value: true,
    label: '积分',
  },
  {
    value: false,
    label: '不积分',
  },

]
const handleIsInterChange = () => {
  if (!isIntegral.value) {
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
// 搜索点击,查询list
const searchProductList = async (val: string, type: string) => {
  if (val === '' && type === 'name') {
    $toast.error('请输入商品名称')
    return
  }
  else if (val === '' && type === 'code') {
    $toast.error('请输入商品条码')
    return
  }

  if (type === 'name') {
    const res = await getFinishedList({ page: 1, limit: 10, where: { name: val } })
    if (res?.data.total === 0) {
      $toast.error('商品不存在')
    }
  }
  else {
    const res = await getFinishedList({ page: 1, limit: 10, where: { code: val } })
    if (res?.data.total === 0) {
      $toast.error('商品不存在')
    }
  }
}

const searchOlds = async (val: string) => {
  await getOldList({ page: 1, limit: 10, where: { code: val, status: 5 } })
}

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

// 点击验证表单
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
const openProductListFn = () => {
  finishedList.value = []
}
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

// 更新抵扣值
const updateDedution = (val?: number) => {
  if (val) {
    // 如果存在
    formData.value.deduction_points = calc('(a * b) |!n', {
      a: val,
      b: billingSet.value.discount_rate,
    })
  }
  else {
    const total = ref(0)
    showProductList.value.forEach((item) => {
      total.value += item.scoreDeduction
    })

    if (total.value !== 0) {
      formData.value.deduction_points = calc('(a * b) |!n', {
        a: total.value,
        b: Number(billingSet.value.discount_rate),
      })
    }
    else {
      formData.value.deduction_points = 0
    }
  }
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
          <sale-add-base
            v-model="formData"
            :filter-list="filterList"
            :store-staff="StoreStaffList"
            :get-staff="getStaff"
          >
            <template #score>
              <n-form-item-gi
                :span="12"
                label="是否积分" label-placement="top"
              >
                <n-radio-group v-model:value="isIntegral" name="radiogroup" @update:value="handleIsInterChange">
                  <n-space>
                    <n-radio
                      v-for="(items, index) in isIntegralOpts" :key="index" :value="items.value" :style="{
                        '--n-box-shadow-hover': 'inset 0 0 0 1px #0068ff',
                        '--n-box-shadow-active': 'inset 0 0 0 1px #0068ff',
                        '--n-dot-color-active': '#0068ff',
                        '--n-box-shadow-focus': 'inset 0 0 0 1px #0068ff, 0 0 0 2px rgba(24, 65, 160, 0.2)' }">
                      {{ items.label }}
                    </n-radio>
                  </n-space>
                </n-radio-group>
              </n-form-item-gi>
            </template>
          </sale-add-base>
        </div>
        <div class="pb-[16px]">
          <sale-add-member
            v-model="formData"
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
            :product-list="finishedList"
            :finished-filter-list="finishedFilterList"
            :price="goldList"
            :is-integral="isIntegral"
            :check-product-class="checkProductClass"
            :billing-set="billingSet"
            @search="searchProductList"
            @open-product-list="openProductListFn"
            @update-score-de-deduction="updateDedution"
          />
        </div>

        <div class="pb-[16px]">
          <sale-add-masterials
            v-model:list="showMasterialsList"
            v-model:now-old-master="OldObj"
            :check-old-class="CheckOldClass"
            :is-integral="isIntegral"
            @search="searchOlds"
          />
        </div>
        <div class="pb-[16px]">
          <sale-add-parts
            v-model:list="showPartsList"
            :where="accessorieFilterListToArray"
            :part-list="accessorieList"
            :check-accessories-score="checkAccessoriesScore"
            :is-integral="isIntegral"
            :billing-set="billingSet"
            @search="searchParts"
            @clear-list="() => accessorieList = [] "
          />
        </div>
        <sale-add-settlement
          v-model:form="formData"
          v-model:show-list="showProductList"
          v-model:master="showMasterialsList"
          v-model:parts="showPartsList"
          :filter-list="filterList">
          <template #score>
            <div>
              <n-grid :cols="24">
                <n-form-item-gi
                  :span="16"
                  label="积分抵扣" label-placement="left"
                >
                  <n-input-number
                    v-model:value="formData.deduction_points"
                    min="0"

                    :disabled="disScore"
                    placeholder="抵扣积分值"
                  />
                </n-form-item-gi>
              </n-grid>

              <div class="text-[12px] color-[#666]">
                1.注意这里只会扣减填写的积分，不会添加积分抵扣金额，请手动添加或使用整单优惠
              </div>
              <div class="text-[12px] color-[#666]">
                2.设置了开单积分抵扣比例的，这里不能填写积分，会根据积分抵扣金额自动算积分
              </div>
            </div>
          </template>
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

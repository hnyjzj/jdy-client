<script lang="ts" setup>
// 新增销售单
import type { FormInst, FormRules } from 'naive-ui'

useSeoMeta({
  title: '新增销售单',
})
const { $toast } = useNuxtApp()
const { myStore, StoreStaffList } = storeToRefs(useStores())
const { getStoreStaffList } = useStores()
const { OldObj, filterList, oldFilterListToArray, orderObject, oldFilterList } = storeToRefs(useOrder())
const { getSaleWhere, submitOrder, OldMaterialsWhere, initObjForm, initOptions } = useOrder()
const { goldList } = storeToRefs(useGoldPrice())
const { getGoldPrice } = useGoldPrice()
const { billingSet, disScore } = storeToRefs(useBillingSetStore())
const { getSetInfo } = useBillingSetStore()
const { accessorieFilterList } = storeToRefs(useAccessorie())
const { getAccessorieWhere } = useAccessorie()
const { OrderDetail } = storeToRefs(useDepositOrder())
const { getOrderDetail } = useDepositOrder()
const { getFinishedWhere, getFinishedsClass } = useFinished()
const { getMemberWhere } = useMemberManage()
const { userinfo } = storeToRefs(useUser())
const route = useRoute()
const Key = ref()
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

// 获取门店员工列表
const getStaff = async () => {
  const res = await getStoreStaffList({ id: myStore.value.id })
  if (res) {
    $toast.error(res?.data.value?.message || '获取员工列表失败')
  }
}
// 获取成品积分比例
const checkProductClass = async (params: { class: number }) => {
  const data = await getFinishedsClass(params)
  return data?.rate ? data.rate : '0'
}
// 定金单列表
const showDepositList = ref<DepositOrderInfo[]>([])
// 选择的订金单列表
const selectDepositList = ref<DepositOrderInfo[]>([])
await getMemberWhere()
await getSaleWhere()
await OldMaterialsWhere()
await getFinishedWhere()
await getAccessorieWhere()
if (myStore.value.id) {
  await getStaff()
  await getGoldPrice(myStore.value.id)
  await getSetInfo({ store_id: myStore.value.id })
}
// 弹窗确认继续新增
const ContinueAdd = async () => {
  // 如果没有id , 全部门店,则清空数据重置
  if (!myStore.value?.id) {
    initObjForm()
    initOptions()
    $toast.error('请先选择门店')
  }
  else {
    await getStaff()
    await getGoldPrice(myStore.value.id)
    await getSetInfo({ store_id: myStore.value.id })
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
const handleValidateButtonClick = async () => {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      if (!orderObject.value.member_id) {
        $toast.error('请先添加会员')
        return
      }
      // 判断是否开单人是否是收银员或者导购员,不是则不能开单
      const isCashierOrGuide = orderObject.value.clerks?.filter(
        item => item.salesman_id === userinfo.value.id,
      )
      if ((userinfo.value.id !== orderObject.value.cashier_id) || !isCashierOrGuide.length) {
        $toast.error('开单人必须是收银员或者导购员')
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
        orderObject.value.remarks ??= []
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
  await getGoldPrice(myStore.value.id)
  initObjForm()
  initOptions()
  Key.value = Date.now().toString()
}
// 添加商品
const addProduct = async (product: DepositOrderInfoProducts) => {
  orderObject.value.showProductList ??= []
  if (product.product_finished.retail_type === 1 && Number(product.product_finished.label_price) <= 0) {
    $toast.error('计件商品标签价格不能小于等于0')
    return
  }
  const index = orderObject.value?.showProductList?.findIndex(item => item.id === product?.product_finished?.id)
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
    data.discount_fixed = Number(orderObject.value.discount_rate || 100)
    // 匹配金价
    const exists = goldList.value.filter(item =>
      item.product_type === GoodsType.ProductFinish
      && item.product_material === product.product_finished.material
      && item.product_quality.includes(product.product_finished.quality)
      && item.product_brand?.includes(product.product_finished.brand),
    )
    data.price_gold = (exists && exists.length > 0) ? Number(exists[0].price) : undefined
    const rate = await checkProductClass({ class: data.class })
    data.rate = (rate && rate !== '0') ? Number(rate) : 0
    orderObject.value.showProductList.push(data)
  }
}
// 更新订金单中的货品到成品展示列表中
const updateDepostitProduct = () => {
  showDepositList.value?.forEach((item) => {
    item.products?.forEach((product) => {
      if (product.is_our) {
        addProduct(product)
      }
    })
  })
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

  if (route?.query?.id) {
  // 判断是否有定金单订单详情
    await getOrderDetail({ id: route?.query?.id as string })
    showDepositList.value.push(OrderDetail.value)
    updateDepostitProduct()
    await nextTick()
    addMemberRef.value?.setMbid(OrderDetail.value.member_id, OrderDetail.value.member?.phone)
  }
})
</script>

<template>
  <div :key="Key" class="pb-[100px]">
    <div class="blur-bgc mb-4">
      <common-layout-center>
        <div class="flex flex-row gap-2">
          <product-manage-company :confirm="true" @change="changeStore" />
        </div>
      </common-layout-center>
    </div>
    <template
      v-if="initFinished">
      <common-layout-center>
        <n-form
          ref="formRef"
          :model="orderObject"
          :rules="rules"
          label-align="left"
          size="large"
        >
          <sale-add-base
            v-model="orderObject"
            :filter-list="filterList"
            :store-staff="StoreStaffList"
            :get-staff="getStaff"
          />
          <sale-add-member
            ref="addMemberRef"
            v-model="orderObject"
            :store="myStore"
            :staffs="StoreStaffList"
            :get-staffs="getStaff"
            @set-member-id="orderObject.member_id = $event"
          />
          <sale-add-product
            v-model="orderObject"
            :price="goldList"
            :billing-set="billingSet"
            :check-product-class="checkProductClass"
          />
          <sale-add-masterials
            v-model="orderObject"
            v-model:now-old-master="OldObj"
            :price="goldList"
            :old-filter-list="oldFilterList"
            :old-filter-list-to-array="oldFilterListToArray"
            :billing-set="billingSet"
            :storeid="myStore.id"
          />
          <sale-add-parts
            v-model="orderObject"
            :is-integral="orderObject.has_integral"
            :billing-set="billingSet"
            :storeid="myStore.id"
            :part-filter="accessorieFilterList"
          />
          <template v-if="route.query.id">
            <sale-add-depositorder
              v-model:list="showDepositList"
              v-model:select="selectDepositList"
              :order-detail="OrderDetail"
              :storeid="myStore.id"
              @update-product="updateDepostitProduct()"
            />
          </template>
          <sale-add-settlement
            v-model:form="orderObject"
            v-model:deposit="selectDepositList"
            :filter-list="filterList"
            :dis-score="disScore"
            :storeid="myStore.id"
            :billing-set="billingSet"
          />
          <common-button-bottom :cancle-show="false" confirm-text="开单" @confirm="handleValidateButtonClick" />
        </n-form>
      </common-layout-center>
    </template>
    <common-confirm
      v-model:show="tipForm" icon="warning" title="提醒" text="检测到有未完成的新增订单,是否继续填写?" @cancel="() => {
        initObjForm()
        initOptions()
      }"
      @submit="ContinueAdd" />
    <common-loading v-model="loading" />
  </div>
</template>

<style lang="scss" scoped>
.n-input-number {
  width: 100%;
}
</style>

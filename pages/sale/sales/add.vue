<script lang="ts" setup>
// 新增销售单
import type { FormInst, FormRules } from 'naive-ui'

useSeoMeta({
  title: '新增销售单',
})
const { $toast } = useNuxtApp()
const { myStore } = storeToRefs(useStores())
const { getProductList } = useProductManage()
const { getStoreStaffList } = useStores()
const { getSaleWhere, getTodayPrice, submitOrder } = useSale()
const { todayPrice } = storeToRefs(useSale())
const { getMemberList } = useMemberManage()
const formRef = ref<FormInst | null>(null)
const formData = ref<addSale>({
  type: undefined, // 订单类型
  source: undefined, // 订单来源
  remark: '', // 备注
  discount_rate: undefined, // 整单折扣
  amount_reduce: 0, // 抹零金额
  integral_use: 0, //  使用积分
  member_id: null, // 会员ID
  store_id: '1872153787930513408', // 门店ID
  cashier_id: '1864219635784617985', // 收银员ID
  products: [], // 商品列表
  salesmens: [],
})
// 展示商品列表
const showProductList = ref<OrderProduct[]>([])
await getSaleWhere()
await getTodayPrice()
await getMemberList({ page: 1, limit: 20, where: { id: myStore.value.id } })
await getStoreStaffList({ id: myStore.value.id })

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
  salesmens: {
    salesman_id: {
      required: true,
      trigger: ['blur', 'change'],
      message: '请选择导购员',
    },
    performance_amount: {
      type: 'number',
      required: true,
      trigger: ['blur', 'change'],
      message: '请设置业绩金额',
    },
    performance_rate: {
      type: 'number',
      required: true,
      trigger: ['blur', 'change'],
      message: '请设置业绩比例',
    },
  },

})
// 搜索点击添加商品
const searchProductList = (val: string) => {
  getProductList({ page: 1, limit: 10, where: { name: val } })
}

// 点击验证表单
const handleValidateButtonClick = async (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      // 成功的操作
      formData.value.products = [] // 清空商品列表
      showProductList.value.forEach((item) => {
        formData.value.products.push({
          product_id: item.id,
          quantity: item.quantity || 1,
          discount: item.discount,
        })
      })
      const res = await submitOrder(formData.value)
      if (res.code === HttpCode.SUCCESS) {
        $toast.success('添加成功')
      }
      else {
        $toast.error(res.message)
      }
    }
    else {
      $toast.error('请填写必填信息')
    }
  })
}
</script>

<template>
  <div class="grid-12">
    <div class="flex flex-col w-auto gap-[16px] px-[16px] py-[16px] col-12" uno-lg="col-8 offset-2" uno-sm="col-12">
      <n-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-align="left"
      >
        <div class="w-[120px] color-[#fff] pb-[12px]">
          <product-manage-company />
        </div>
        <sale-add-base v-model="formData" />

        <div class="py-[16px]">
          <sale-add-product
            v-model="showProductList"
            @search="searchProductList">
            <div class=" px-[16px] pb-[16px]">
              <sale-add-list v-model="showProductList" :price="todayPrice" />
            </div>
          </sale-add-product>
        </div>
        <sale-add-settlement v-model:form="formData" v-model:show-list="showProductList" />
        <div class="h-[80px]">
          <div class="btn grid-12 offset-2">
            <button class="btn-right col-span-12 cursor-pointer" @click="handleValidateButtonClick">
              开单
            </button>
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
  --uno: 'fixed bottom-0 left-0 right-0 blur-bga p-[12px_16px] text-[16px] font-bold';
  &-right {
    background: linear-gradient(to bottom, #1a6beb, #6ea6ff);
    box-shadow: rgba(110, 166, 255, 0.3) 0px 6px 6px;
    --uno: 'text-[16px] py-[8px] border-none flex-1 rounded-[36px] ml-[8px] text-[#FFFFFF]';
  }
}
</style>

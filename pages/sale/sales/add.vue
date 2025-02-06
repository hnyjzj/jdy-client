<script lang="ts" setup>
// 新增销售单
import type { FormInst, FormRules } from 'naive-ui'

useSeoMeta({
  title: '新增销售单',
})
const { myStore } = storeToRefs(useStores())
const { getProductList } = useProductManage()
const { productList } = storeToRefs(useProductManage())
const { getStoreStaffList, StoreStaffList } = useStores()
const { getSaleWhere, getTodayPrice } = useSale()
const { filterList, todayPrice } = storeToRefs(useSale())
const { getMemberList } = useMemberManage()
const { memberList } = storeToRefs(useMemberManage())
const showModal = ref(false)
const formRef = ref<FormInst | null>(null)
const formData = ref<addSale>({
  type: 1, // 订单类型
  source: 0, // 订单来源
  remark: '', // 备注
  discount_rate: 1, // 整单折扣
  amount_reduce: 0, // 抹零金额
  integral_use: 0, //  使用积分
  member_id: null, // 会员ID
  store_id: null, // 门店ID
  cashier_id: null, // 收银员ID
  products: [], // 商品列表
  salesmens: [],
})
await getSaleWhere()
await getMemberList({ page: 1, limit: 20, where: { id: myStore.value.id } })
await getStoreStaffList({ id: myStore.value.id })
await getTodayPrice()

// 收银员列表参数
const cashierOptions = StoreStaffList.map(
  v => ({
    label: v.nickname,
    value: v.id,
  }),
)
// 会员列表参数
const memberListOptions = memberList.value.map(
  v => ({
    label: v.nickname ? v.nickname : v.name,
    value: v.id,
  }),
)

const PresetArr = (presetObject: SaleItemsPreset, radix: number = 20) => {
  return Object.entries(presetObject).map(([key, value]) => ({
    label: value,
    value: Number.parseInt(key, radix),
  }))
}
// 订单类型参数
const typeOptions: { label: string, value: number }[] = PresetArr(filterList.value.type?.preset) || []
// 订单来源参数
const sourceOptions: { label: string, value: number }[] = PresetArr(filterList.value.source?.preset) || []
// 点击验证表单
const handleValidateButtonClick = async (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate((errors) => {
    if (!errors) {
      // 成功的操作
    }
    else {
      // 失败操作

    }
  })
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
})

const searchProduct = ref('')

const searchProductList = () => {
  getProductList({ page: 1, limit: 10, where: { name: searchProduct.value } })
}
const showProductList = ref<Product[]>([])
const addProduct = (product: Product) => {
  // 判断是否已经添加过该商品,如果已经添加过,则数量加一
  const index = showProductList.value.findIndex(item => item.id === product.id)
  if (index !== -1 && showProductList.value[index].quantity) {
    showProductList.value[index].quantity++
    return
  }
  else if (
    index !== -1 && !showProductList.value[index].quantity
  ) {
    showProductList.value[index].quantity = 1
    return
  }

  showProductList.value.push({ ...product, quantity: 1, discount: undefined, payable_amount: 0 })
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
        <sale-add-base>
          <div>
            <n-form-item label="订单类型" path="type">
              <n-select
                v-model:value="formData.type"
                placeholder="订单类型"
                :options="typeOptions"

              />
            </n-form-item>
            <n-form-item label="收银员" path="cashier_id">
              <n-select
                v-model:value="formData.cashier_id"
                placeholder="请选择收银员"
                :options="cashierOptions"
              />
            </n-form-item>
            <n-form-item label="会员" path="member_id">
              <n-select
                v-model:value="formData.member_id"
                placeholder="请选择会员"
                :options="memberListOptions"
              />
            </n-form-item>

            <n-form-item label="来源" path="source">
              <n-select
                v-model:value="formData.source"
                placeholder="请选择来源"
                :options="sourceOptions"
              />
            </n-form-item>
          </div>
        </sale-add-base>

        <div class="py-[16px]">
          <sale-add-product
            @open=" () => {
              showModal = true
            }">
            <div class=" px-[16px] pb-[16px]">
              <sale-add-list :list="showProductList" :price="todayPrice" />
            </div>
          </sale-add-product>
        </div>
        <sale-add-settlement>
          <div>
            <n-form-item
              label="整单折扣" label-placement="left"
            >
              <n-input
                v-model="formData.discount_rate"
                placeholder="0"
                round
                type="text"
              />
            </n-form-item>

            <n-form-item
              label="抹零金额" label-placement="left"
            >
              <n-input
                v-model="formData.amount_reduce"
                placeholder="0"
                round
                type="text"
              />
            </n-form-item>
            <n-form-item
              label="使用积分" label-placement="left"
            >
              <n-input
                v-model="formData.integral_use"
                placeholder="0"
                round
                type="text"
              />
            </n-form-item>

            <div class="border-y-[#E6E6E8] border border-y-solid py-[12px]">
              <div class="text-[16px] color-[#3971F3] line-height-[24px] pb-[10px] text-right font-semibold">
                实付金额:xxxxxxxx
              </div>
              <div class="text-[16px] color-[#3971F3] line-height-[24px] text-right font-semibold">
                积分合计:xxxxxxxx
              </div>
            </div>
            <n-form-item
              label="备注信息"
            >
              <n-input
                v-model:value="formData.remark"
                placeholder="备注信息"
                type="textarea"
              />
            </n-form-item>
            <div class="color-[#FF2F2F] text-[16px] line-height-[24px] font-semibold">
              剩余未支付:0.00
            </div>
          </div>
        </sale-add-settlement>
        <div class="">
          <n-button round type="primary" @click="handleValidateButtonClick">
            验证
          </n-button>
        </div>
      </n-form>

      <div class="h-[80px]">
        <common-button-bottom confirm-text="开单" cancel-text="取消" />
      </div>
    </div>
    <n-modal v-model:show="showModal">
      <n-card
        title="搜商品"
        style="width: 600px"
        :bordered="false"
      >
        <div class="flex items-center">
          <div class="flex-1">
            <n-input v-model:value="searchProduct" type="text" placeholder="请输入商品名称" />
          </div>
          <div class="pl-[16px]">
            <n-button type="info" @click="searchProductList">
              搜索商品
            </n-button>
          </div>
        </div>
        <div class="pt-[20px]">
          <template v-for="(item, index) in productList" :key="index">
            <div class="py-[6px] flex justify-between items-center">
              <div>{{ item.name }} -- {{ item.code }}</div>
              <n-button size="small" strong secondary round type="info" @click="addProduct(item)">
                添加
              </n-button>
            </div>
          </template>
        </div>
        <template #footer />
      </n-card>
    </n-modal>
  </div>
</template>

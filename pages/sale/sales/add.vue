<script lang="ts" setup>
// 新增销售单
import type { FormInst, FormRules } from 'naive-ui'
import { calc } from 'a-calc'

useSeoMeta({
  title: '新增销售单',
})
const { myStore } = storeToRefs(useStores())
const { getProductList } = useProductManage()
const { productList } = storeToRefs(useProductManage())
const { getStoreStaffList, StoreStaffList } = useStores()
const { getSaleWhere, getTodayPrice, submitOrder } = useSale()
const { filterList, todayPrice } = storeToRefs(useSale())
const { getMemberList } = useMemberManage()
const { memberList } = storeToRefs(useMemberManage())
const dialog = useDialog()
const showModal = ref(false)
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
// 订单类型参数
const typeOptions = optonsToSelect(filterList.value.type?.preset)
// 订单来源参数
const sourceOptions = optonsToSelect(filterList.value.source?.preset)

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

// 展示商品列表
const showProductList = ref<OrderProduct[]>([])
// 添加商品
const addProduct = (product: Product) => {
  // 判断是否已经添加过该商品,如果已经添加过,则数量加一
  const index = showProductList.value.findIndex(item => item.id === product.id)
  if (index !== -1 && showProductList.value[index].quantity) {
    showProductList.value[index].quantity++
    return
  }
  else if (
    // 如果没添加 并且数量为空,则数量为1
    index !== -1 && !showProductList.value[index].quantity
  ) {
    showProductList.value[index].quantity = 1
    return
  }
  showProductList.value.push({ ...product, quantity: 1, discount: undefined, payable_amount: 0 })
}

// 删除商品
const deleteProduct = (index: number) => {
  dialog.error({
    title: '确定删除此商品吗?',
    negativeText: '取消',
    positiveText: '确定',
    onPositiveClick: () => {
      showProductList.value.splice(index, 1)
    },
  })
}

// 点击验证表单
const handleValidateButtonClick = async (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate((errors) => {
    if (!errors) {
      // 成功的操作
      showProductList.value.forEach((item) => {
        formData.value.products.push({
          product_id: item.id,
          quantity: item.quantity || 1,
          discount: item.discount,
        })
      })

      //   formData.value.products.

      submitOrder(formData.value)
    }
    else {
      // 失败操作

    }
  })
}

// 计算应付金额
const payMoney = computed(() => {
  const total = ref(0)
  total.value = showProductList.value.reduce((total, item) => {
    return calc('(t + i) | <=2,!n', { t: total, i: item.payable_amount })
  }, 0)
  total.value = calc('(t * r) | <=2,!n', { t: total.value, r: ((formData.value.discount_rate || 10) * 0.1) })
  return total.value
})
// 新增销售员
const addNewSale = async () => {
  formData.value.salesmens.push({
    salesman_id: '1864219635784617985',
    performance_amount: 0,
    performance_rate: 0,
    is_main: !formData.value.salesmens.length,
  })
}
// 设置主销售员
const handleSwitch = (index: number) => {
  formData.value.salesmens.forEach((item) => {
    item.is_main = false
  })
  formData.value.salesmens[index].is_main = true
}
// 删除销售
const deleteSale = (index: number) => {
  dialog.error({
    title: '确定删除此导购吗',
    negativeText: '取消',
    positiveText: '确定',
    onPositiveClick: () => {
      formData.value.salesmens.splice(index, 1)
      const aliveMain = formData.value.salesmens.filter(item => item.is_main === true)
      if (!aliveMain.length) {
        formData.value.salesmens[0].is_main = true
      }
    },
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
        <sale-add-base>
          <div>
            <div class="flex justify-between">
              <n-form-item label="订单类型" path="type" class="w-[45%]">
                <n-select
                  v-model:value="formData.type"
                  placeholder="订单类型"
                  :options="typeOptions"

                />
              </n-form-item>
              <n-form-item label="收银员" path="cashier_id" class="w-[45%]">
                <n-select
                  v-model:value="formData.cashier_id"
                  placeholder="请选择收银员"
                  :options="cashierOptions"
                />
              </n-form-item>
            </div>
            <div class="flex justify-between">
              <n-form-item label="会员" path="member_id" class="w-[45%]">
                <n-select
                  v-model:value="formData.member_id"
                  placeholder="请选择会员"
                  :options="memberListOptions"
                />
              </n-form-item>

              <n-form-item label="来源" path="source" class="w-[45%]">
                <n-select
                  v-model:value="formData.source"
                  placeholder="请选择来源"
                  :options="sourceOptions"
                />
              </n-form-item>
            </div>
          </div>

          <template v-for="(item, index) in formData.salesmens" :key="index">
            <div class="pt-[26px] border-t-[1px] border-t-solid border-t-[#ccc]">
              <div class="flex justify-between">
                <n-form-item label="导购员" path="type" label-placement="top" class="w-[45%]">
                  <n-select
                    v-model:value="item.salesman_id"
                    placeholder="导购员"
                    :options="typeOptions"
                  />
                </n-form-item>
                <n-form-item label="是否主销" label-placement="top" class="w-[45%]">
                  <div class="flex justify-between items-center w-full">
                    <n-switch v-model:value="item.is_main" @update:value="handleSwitch(index)">
                      <template #checked>
                        主销
                      </template>
                      <template #unchecked>
                        辅销
                      </template>
                    </n-switch>
                    <div class="p-[8px] col-2 flex-center-row cursor-pointer" @click="deleteSale(index)">
                      <icon name="i-svg:delete" :size="16" />
                    </div>
                  </div>
                </n-form-item>
              </div>
              <div class="flex justify-between">
                <n-form-item label="业绩金额" path="type" label-placement="top" class="w-[45%]">
                  <n-input-number v-model:value="item.performance_amount" :precision="2" :min="0">
                    <template #suffix>
                      元
                    </template>
                  </n-input-number>
                </n-form-item>
                <n-form-item label="业绩比例" path="type" label-placement="top" class="w-[45%]">
                  <n-input-number v-model:value="item.performance_rate" :min="0">
                    <template #suffix>
                      %
                    </template>
                  </n-input-number>
                </n-form-item>
              </div>

              <div />
            </div>
          </template>
          <div class="flex-center-row">
            <n-button type="info" @click="addNewSale">
              新增导购员
            </n-button>
          </div>
        </sale-add-base>

        <div class="py-[16px]">
          <sale-add-product
            @open=" () => {
              showModal = true
            }">
            <div class=" px-[16px] pb-[16px]">
              <sale-add-list :list="showProductList" :price="todayPrice" @deleteproduct="deleteProduct" />
            </div>
          </sale-add-product>
        </div>
        <sale-add-settlement>
          <div>
            <div class="flex justify-between">
              <n-form-item
                label="整单折扣" label-placement="top"
                class="w-[45%]"
              >
                <n-input-number
                  v-model:value="formData.discount_rate"
                  placeholder="请输入折扣"
                  round
                  :precision="2"
                  min="1"
                  max="10"
                  type="text"
                />
              </n-form-item>

              <n-form-item
                label="抹零金额" label-placement="top"
                class="w-[45%]"
              >
                <n-input-number
                  v-model:value="formData.amount_reduce"
                  placeholder="0"
                  round
                  min="0"
                  type="text"
                />
              </n-form-item>
            </div>
            <div class="border-y-[#E6E6E8] border border-y-solid py-[12px]">
              <div class="text-[16px] color-[#3971F3] line-height-[24px] pb-[10px] text-right font-semibold">
                实付金额:{{ payMoney }}
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

<style lang="scss" scoped>
.n-input-number {
  width: 100%;
}
</style>

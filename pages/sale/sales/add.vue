<script lang="ts" setup>
// 新增销售单
import type { FormInst, FormRules, SelectOption } from 'naive-ui'

const { staffGetStoreList } = useStores()
useSeoMeta({
  title: '新增销售单',
})

const formRef = ref<FormInst | null>(null)
const formData = ref<addSale>({
  type: 1, // 订单类型
  source: 0, // 订单来源
  remark: '', // 备注
  discount_rate: 1, // 整单折扣
  amount_reduce: 0, // 抹零金额
  integral_use: 0, //  使用积分
  member_id: '', // 会员ID
  store_id: '', // 门店ID
  cashier_id: '', // 收银员ID
  products: [], // 商品列表
  salesmens: [],
})
const generalOptions = ['groode', 'veli good', 'emazing', 'lidiculous'].map(
  v => ({
    label: v,
    value: v,
  }),
)
const sourceOptions = [{
  label: '自然客流',
  value: 0,
}, {
  label: '营销转化',
  value: 1,
}, {
  label: '回访邀约',
  value: 2,
}, {
  label: '老带新',
  value: 3,
}]
const typeOptions = [{
  label: '销售单',
  value: 1,
}, {
  label: '定金单',
  value: 2,
}, {
  label: '维修单',
  value: 3,
}]
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
  store_id: {
    required: true,
    trigger: ['blur', 'change'],
    message: '请选择门店',
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
const storeList = ref<SelectOption[]>([])
const loading = ref(false)
const getStores = useDebounceFn(async (query: string) => {
  const res = await staffGetStoreList({ page: 1, limit: 10, where: { name: query } })
  loading.value = false
  if (res.length) {
    storeList.value = res.map(item => ({
      label: item.name,
      value: item.id,
    }))
  }
}, 500)

const searchStores = (val: string) => {
  loading.value = true
  getStores(val)
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
        <sale-add-base>
          <div>
            <n-form-item label="订单类型" path="type">
              <n-select
                v-model:value="formData.type"
                placeholder="订单类型"
                :options="typeOptions"
                @blur="() => {
                  console.log(formData);
                }"
              />
            </n-form-item>
            <n-form-item label="收银员" path="cashier_id">
              <n-select
                v-model:value="formData.cashier_id"
                placeholder="请选择收银员"
                :options="generalOptions"
              />
            </n-form-item>
            <n-form-item label="会员" path="member_id">
              <n-select
                v-model:value="formData.member_id"
                placeholder="请选择会员"
                :options="generalOptions"
              />
            </n-form-item>
            <n-form-item label="门店" path="store_id">
              <n-select
                v-model:value="formData.store_id"
                filterable
                placeholder="搜索门店"
                clearable
                remote
                :loading="loading"
                :options="storeList"
                @search="searchStores"
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
          <sale-add-product>
            <div class=" px-[16px] pb-[16px]">
              <sale-add-list />
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
                实付金额:xxxx
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
  </div>
</template>

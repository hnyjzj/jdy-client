<script lang="ts" setup>
useSeoMeta({
  title: '新增定金单',
})
const { submitDepositOrder, getSaleWhere } = useDepositOrder()
const { getFinishedWhere, getFinishedList } = useFinished()
const { myStore, StoreStaffList } = storeToRefs(useStores())
const { filterList } = storeToRefs(useDepositOrder())
const { finishedList, finishedFilterList } = storeToRefs(useFinished())
const { memberList } = storeToRefs(useMemberManage())
const { createMember } = useMemberManage()
const { getStoreStaffList } = useStores()
const { getMemberList } = useMemberManage()
const { $toast } = useNuxtApp()
const { getPhraseList } = usePhrase()
const Key = ref()
const layoutLoading = ref(false)
const getSearchPhrase = async (value: string) => {
  const res = await getPhraseList({ page: 1, limit: 10, where: { store_id: myStore.value.id, content: value || '' } })
  return res || [] as Phrase[]
}
const userremark = ref<string>('')
// 展示成品列表
const showProductList = ref<DepositOrderProduct[]>([])
await getSaleWhere()
await getFinishedWhere()
// 获取会员列表
const getMember = async (val: string) => {
  await getMemberList({ page: 1, limit: 5, where: { phone: val } })
  return memberList.value || []
}
// 获取门店员工列表
const getStaff = async () => await getStoreStaffList({ id: myStore.value.id })
// 新增会员
const addNewMember = async (val: Member) => await createMember(val)

const searchProductList = async (val: string) => {
  const res = await getFinishedList({ page: 1, limit: 10, where: { code: val } })
  if (res?.data.total === 0) {
    $toast.error('商品不存在')
    return []
  }
  return finishedList.value || []
}
const formRef = ref()
const initForm = ref<DepositOrder>({
  remarks: [], // 备注
  member_id: undefined, // 会员ID
  store_id: '', // 门店ID
  cashier_id: undefined, // 收银员ID
  products: [], // 商品列表
  clerk_id: undefined,
  payments: [{ amount: undefined, payment_method: 1 }], // 支付方式
})
const formData = ref<DepositOrder>({
  remarks: [], // 备注
  member_id: undefined, // 会员ID
  store_id: '', // 门店ID
  cashier_id: undefined, // 收银员ID
  products: [], // 商品列表
  clerk_id: undefined,
  payments: [{ amount: undefined, payment_method: 1 }], // 支付方式
})
const rules = {
  cashier_id: {
    required: true,
    trigger: ['blur', 'change'],
    message: '请选择收银员',
  },
}
const orderObject = ref<Orders>({} as Orders)
// 点击验证表单
const handleValidateButtonClick = async (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate(async (errors: any) => {
    if (!errors) {
      // 成功的操作
      if (!formData.value.member_id) {
        $toast.error('请先添加会员')
        return
      }
      formData.value.products = [...showProductList.value]
      formData.value.store_id = myStore.value.id
      // 添加备注
      if (userremark.value && userremark.value.trim()) {
        const trimmedRemark = userremark.value.trim()
        const exists = formData.value.remarks?.includes(trimmedRemark)
        if (!exists) {
          formData.value.remarks?.push(trimmedRemark)
        }
      }
      layoutLoading.value = true
      try {
        const res = await submitDepositOrder(formData.value)
        if (res?.code === HttpCode.SUCCESS) {
          $toast.success('下单成功')
          navigateTo('/sale/deposit/list', { external: true, replace: true, redirectCode: 200 })
          formData.value = { ...initForm.value }
          showProductList.value = []
          Key.value = Date.now().toString()
        }
        else {
          $toast.error('创建订单失败')
        }
        layoutLoading.value = false
      }
      catch (error: any) {
        layoutLoading.value = false
        throw new Error(error)
      }
    }
    else {
      $toast.error('请填写必填信息')
    }
  })
}
// 切换门店的操作
const changeStore = () => {
  showProductList.value = []
  formData.value = { ...initForm.value }
  Key.value = Date.now().toString()
}
</script>

<template>
  <div :key="Key">
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
          <sale-deposit-staff v-model:form-data="formData" :staffs="StoreStaffList" :get-staffs="getStaff" />
          <sale-add-member
            v-model="orderObject"
            :get-member="getMember"
            :store="myStore"
            :staffs="StoreStaffList"
            :get-staffs="getStaff"
            :add-new-member="addNewMember"
            @set-member-id="formData.member_id = $event"
          />

          <div class="pb-[16px]">
            <sale-deposit-product
              v-model="showProductList"
              :search-product-list="searchProductList"
              :filter-list="finishedFilterList"
            />
          </div>

          <div class="pb-[16px]">
            <sale-deposit-balance v-model:userremark="userremark" v-model="formData" v-model:list="showProductList" :filter-list="filterList" :get-search-phrase="getSearchPhrase" />
          </div>

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
    <common-loading v-model="layoutLoading" />
  </div>
</template>

<style lang="scss" scoped>
.btn {
  --uno: 'fixed bottom-0 left-0 right-0 blur-bga pt-20px pb-[28px] text-[16px] font-bold border-t-[1px] border-t-solid border-[#E0E0E0]';
  &-right {
    background: linear-gradient(to bottom, #1a6beb, #6ea6ff);
    box-shadow: rgba(110, 166, 255, 0.3) 0px 6px 6px;
    --uno: 'text-[16px] py-[8px] border-none flex-1 rounded-[36px] ml-[8px] text-[#FFFFFF]';
  }
}
</style>

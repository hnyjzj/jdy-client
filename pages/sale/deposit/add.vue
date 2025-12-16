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
const { createMember, getMemberList, getMemberWhere } = useMemberManage()
const { getStoreStaffList } = useStores()
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

await getMemberWhere()
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
const handleValidateButtonClick = async (e?: Event) => {
  e?.preventDefault?.()
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
  <div :key="Key" class="pb-[100px]">
    <div class="blur-bgc mb-4">
      <common-layout-center>
        <div class="flex flex-row gap-2">
          <product-manage-company :confirm="true" @change="changeStore" />
        </div>
      </common-layout-center>
    </div>
    <common-layout-center>
      <n-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-align="left"
        size="large"
      >
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

        <common-button-bottom content="开单" :cancle-show="false" @click="handleValidateButtonClick" />
      </n-form>
    </common-layout-center>
    <common-loading v-model="layoutLoading" />
  </div>
</template>

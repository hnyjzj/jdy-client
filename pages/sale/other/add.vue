<script lang="ts" setup>
import type { FormRules } from 'naive-ui'

const title = ref('新增收支单')
useSeoMeta({
  title,
})
const { $toast } = useNuxtApp()
const { myStore, StoreStaffList } = storeToRefs(useStores())
const { getStoreStaffList } = useStores()
const { otherOrderWhere, addOtherOrder, getOtherOrderDetail, updateOtherOrder } = useOtherOrder()
const { filterList, otherOrderDetail } = storeToRefs(useOtherOrder())
const { getMemberList } = useMemberManage()
const { memberList } = storeToRefs(useMemberManage())
const { createMember } = useMemberManage()
const { getSaleWhere } = useDepositOrder()
const { filterList: salewhere } = storeToRefs(useDepositOrder())
// 回去员工 列表
const getStaff = async () => await getStoreStaffList({ id: myStore.value.id })
await otherOrderWhere()
await getSaleWhere()
const route = useRoute()

const Key = ref()
const formRef = ref()
const initForm = ref<otherOrderCreate>({
  store_id: '',
  content: '',
  type: 1,
  clerk_id: undefined,
  member_id: '',
  order_id: '',
  amount: '',
  source: undefined,
  payments: [{ payment_method: 1, amount: undefined }],
})
const formData = ref<otherOrderCreate>({
  store_id: '',
  content: '',
  type: 1,
  clerk_id: undefined,
  member_id: '',
  order_id: '',
  amount: '',
  source: undefined,
  payments: [{ payment_method: 1, amount: undefined }],
})
const rules = ref<FormRules>({
  type: {
    required: true,
  },
  content: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入收支内容',
  },
  source: {
    type: 'number',
    required: true,
    trigger: ['blur'],
    message: '请输入收支来源',
  },
})
// 新增会员
const addNewMember = async (val: Member) => await createMember(val)
// 获取会员列表
const getMember = async (val: string) => {
  await getMemberList({ page: 1, limit: 5, where: { phone: val } })
  return memberList.value || []
}
const addMemberRef = ref()
// 更新订单
const loadOrder = async () => {
  if (route.query.id) {
    title.value = '修改其他收支'
    await getOtherOrderDetail({ id: route.query.id as string })
    await getStaff()
    const { content, clerk_id, source, type, order_id, member } = otherOrderDetail.value
    Object.assign(formData.value, { content, clerk_id, source, type, order_id })
    formData.value.id = route.query.id as string
    formData.value.payments = []
    otherOrderDetail.value?.payments.forEach((item: Payment) => {
      formData.value.payments.push({ payment_method: Number(item.payment_method), amount: Number(item.amount) })
    })
    setTimeout(() => {
      addMemberRef.value?.setMbid(member.id, member.phone)
    }, 100)
  }
}
loadOrder()
const handleValidateButtonClick = (e: any) => {
  e.preventDefault()
  formRef.value?.validate(async (errors: any) => {
    if (!errors) {
      // 成功的操作
      formData.value.store_id = myStore.value.id
      if (!route.query.id) {
        // 新增
        const res = await addOtherOrder(formData.value)
        if (res?.value?.code === HttpCode.SUCCESS) {
          $toast.success('下单成功')
          navigateTo('/sale/other/list', { external: true, replace: true, redirectCode: 200 })
          formData.value = { ...initForm.value }
          Key.value = Date.now().toString()
        }
      }
      else {
        // 修改
        const res = await updateOtherOrder(formData.value)
        if (res?.value?.code === HttpCode.SUCCESS) {
          $toast.success('更新成功')
        }
      }
    }
    else {
      $toast.error(errors[0][0].message)
    }
  })
}
</script>

<template>
  <div :key="Key">
    <div class="grid-12 pb-[16px]">
      <div class="flex flex-col w-auto gap-[16px] px-[16px] py-[16px] pb-[80px] col-12" uno-xs="col-12" uno-sm="col-8 offset-2" uno-md="col-6 offset-3">
        <n-form
          ref="formRef"
          :model="formData"
          :rules="rules"
          label-align="left"
          size="large"
        >
          <div class="w-[120px] color-[#fff] pb-[12px]">
            <product-manage-company />
          </div>
          <div>
            <sale-other-add-base
              v-model:form="formData"
              :store-staff="StoreStaffList"
              :filter-list="filterList"
              :get-staff="getStaff" />
          </div>

          <sale-add-member
            ref="addMemberRef"
            :get-member="getMember"
            :store="myStore"
            :staffs="StoreStaffList"
            :get-staffs="getStaff"
            :add-new-member="addNewMember"
            @set-member-id="formData.member_id = $event"
          />
          <sale-other-balance v-model:form="formData" :filter-list="salewhere" />
          <div class="h-[80px] bg-[#fff] fixed z-1">
            <div class="btn grid-12 px-[16px]">
              <div class="col-12 cursor-pointer" uno-xs="col-12" uno-sm="col-8 offset-2" uno-md="col-6 offset-3" @click="handleValidateButtonClick">
                <common-button-rounded :content="`${!route.query.id ? '新增' : '更新'}`" />
              </div>
            </div>
          </div>
        </n-form>
      </div>
    </div>
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

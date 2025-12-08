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
const { getMemberList, getMemberWhere, createMember } = useMemberManage()
const { memberList } = storeToRefs(useMemberManage())
const { getSaleWhere } = useDepositOrder()
const { filterList: salewhere } = storeToRefs(useDepositOrder())
const layoutLoading = ref(false)
// 回去员工 列表
const getStaff = async () => await getStoreStaffList({ id: myStore.value.id })
await otherOrderWhere()
await getSaleWhere()
await getMemberWhere()
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
      if (otherOrderDetail.value.store_id !== myStore.value.id && route.query.id) {
        $toast.error('当前门店与操作门店不匹配,无法操作')
        return
      }
      if (!formData.value.member_id) {
        $toast.error('请先添加会员')
        return
      }
      // 成功的操作
      formData.value.store_id = myStore.value.id
      layoutLoading.value = true
      if (!route.query.id) {
        // 新增
        try {
          const res = await addOtherOrder(formData.value)
          if (res?.value?.code === HttpCode.SUCCESS) {
            $toast.success('下单成功')
            navigateTo('/sale/other/list', { external: true, replace: true, redirectCode: 200 })
            formData.value = { ...initForm.value }
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
        // 修改
        try {
          const res = await updateOtherOrder(formData.value)
          if (res?.value?.code === HttpCode.SUCCESS) {
            $toast.success('更新成功')
          }
          layoutLoading.value = false
        }
        catch (error: any) {
          layoutLoading.value = false
          throw new Error(error)
        }
      }
    }
    else {
      $toast.error(errors[0][0].message)
    }
  })
}

const orderObject = ref<Orders>({} as Orders)
</script>

<template>
  <div :key="Key">
    <common-layout-center>
      <div class="pb-[100px]">
        <n-form
          ref="formRef"
          :model="formData"
          :rules="rules"
          label-align="left"
          size="large"
        >
          <div class="w-fit color-[#fff] pb-[12px]">
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
            v-model="orderObject"
            :get-member="getMember"
            :store="myStore"
            :staffs="StoreStaffList"
            :get-staffs="getStaff"
            :add-new-member="addNewMember"
            @set-member-id="formData.member_id = $event"
          />

          <sale-other-balance v-model:form="formData" :filter-list="salewhere" />

          <common-button-bottom :content="`${!route.query.id ? '新增' : '更新'}`" :cancle-show="false" @click="handleValidateButtonClick" />
        </n-form>
      </div>
    </common-layout-center>
    <template v-if="otherOrderDetail.store_id && otherOrderDetail.store_id !== '' && route.query.id">
      <correspond-store :correspond-ids="[otherOrderDetail.store_id]" />
    </template>
    <common-loading v-model="layoutLoading" />
  </div>
</template>

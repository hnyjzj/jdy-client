<script lang="ts" setup>
useSeoMeta({
  title: '新增定金单',
})
const { getSaleWhere } = useOrder()

const { myStore, StoreStaffList } = storeToRefs(useStores())
const { filterList } = storeToRefs(useOrder())
const { getFinishedList } = useFinished()
const { finishedList } = storeToRefs(useFinished())
const { memberList } = storeToRefs(useMemberManage())
const { createMember } = useMemberManage()
const { getStoreStaffList } = useStores()
const { getMemberList } = useMemberManage()
const { $toast } = useNuxtApp()
// 展示成品列表
const showProductList = ref<DepositOrderProducts[]>([])
await getSaleWhere()
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
  }
}
const formRef = ref()
const formData = ref({
  payments: [{ payment_method: undefined, amount: 0 }], // 支付方式
  clerks: [{
    salesman_id: undefined,
    performance_rate: 100,
    is_main: true,
  }],
} as Orders)
const rules = {
  cashier_id: {
    required: true,
    trigger: ['blur', 'change'],
    message: '请选择收银员',
  },
}

// 点击验证表单
const handleValidateButtonClick = async (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate(async (errors: any) => {
    if (!errors) {
      // 成功的操作

    }
    else {
      $toast.error('请填写必填信息')
    }
  })
}
</script>

<template>
  <div>
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
            <product-manage-company />
          </div>
          <div class="pb-[16px]">
            <common-fold title="基础信息" :is-collapse="false">
              <div class="p-[16px]">
                <n-grid :cols="24" :x-gap="8">
                  <n-form-item-gi
                    :span="12"
                    label="收银员" label-placement="top" path="cashier_id"
                  >
                    <n-select
                      v-model:value="formData.cashier_id"
                      placeholder="请输入收银员"
                      :options="StoreStaffList.map(v => ({
                        label: v.nickname,
                        value: v.id,
                      }))"
                      clearable
                      remote
                      @focus="() => { getStaff() }"
                    />
                  </n-form-item-gi>
                  <template v-for="(item, index) in formData.clerks" :key="index">
                    <n-form-item-gi
                      :span="12"
                      label="主销导购" label-placement="top"
                      :path="`salesmans[${index}].salesman_id`"
                    >
                      <n-select
                        v-model:value="item.salesman_id"
                        placeholder="请选择"
                        :options="StoreStaffList.map(v => ({
                          label: v.nickname,
                          value: v.id,
                        }))"
                        clearable
                        remote
                        @focus="() => { getStaff() }"
                      />
                    </n-form-item-gi>
                  </template>
                </n-grid>
              </div>
            </common-fold>
          </div>
          <div class="pb-[16px]">
            <sale-add-member
              v-model:form-data="formData"
              :get-member="getMember"
              :store="myStore"
              :staffs="StoreStaffList"
              :get-staffs="getStaff"
              :add-new-member="addNewMember"
            />
          </div>
          <div class="pb-[16px]">
            <sale-deposit-product
              v-model="showProductList"
              :product-list="finishedList"
              @search="searchProductList" />
          </div>

          <div class="pb-[16px]">
            <sale-deposit-balance v-model="formData" v-model:list="showProductList" :filter-list="filterList" />
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

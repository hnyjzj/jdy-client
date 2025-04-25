<script lang="ts" setup>
useSeoMeta({
  title: '新增定金单',
})
const { myStore, StoreStaffList } = storeToRefs(useStores())
const { getFinishedList } = useFinished()
const { finishedList } = storeToRefs(useFinished())
const { memberList } = storeToRefs(useMemberManage())
const { createMember } = useMemberManage()
const { getStoreStaffList } = useStores()
const { getMemberList } = useMemberManage()
const { $toast } = useNuxtApp()
// 展示成品列表
const showProductList = ref<DepositOrderProduct[]>([])

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
const formData = ref()
const rules = {}
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
                    label="收银员" label-placement="top"
                  >
                    123
                  </n-form-item-gi>
                  <n-form-item-gi
                    :span="12"
                    label="主销导购" label-placement="top"
                  >
                    123
                  </n-form-item-gi>
                </n-grid>
              </div>
            </common-fold>
          </div>
          <div class="pb-[16px]">
            <sale-add-member
              v-model="formData"
              :get-member="getMember"
              :member-list="memberList"
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
        </n-form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>

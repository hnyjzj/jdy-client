<script setup lang="ts">
const { $toast } = useNuxtApp()

useSeoMeta({
  title: '新增会员',
})

const { createMember } = useMemberManage()

const { myStore, StoreStaffList } = storeToRefs(useStores())

const { getMyStore, getStoreStaffList } = useStores()

const memberParams = ref<Member>({
  // 初始化store_id为当前门店id
  store_id: myStore.value.id,
} as Member)

await getMyStore()
const getStaff = async () => {
  const res = await getStoreStaffList({ id: myStore.value.id })
  if (res) {
    $toast.error(res.data.value?.message || '获取员工失败')
  }
}

const backtrack = () => {
  const { back } = useRouter()
  back()
}

const execute = async () => {
  // 校验手机号码参数
  const phone = memberParams.value.phone
  if (phone && phone.length < 11) {
    $toast.warning('手机号码格式不正确')
    return
  }

  const res = await createMember(memberParams.value)
  if (res?.code === HttpCode.SUCCESS) {
    $toast.success('新增成功')
    backtrack()
  }
  else {
    $toast.warning(res?.message || '创建失败')
  }
}
</script>

<template>
  <div>
    <div class="blur-bgc">
      <common-layout-center>
        <div class="grid-12 color-[#fff]">
          <div class="col-5" uno-sm="col-3" uno-lg="col-2">
            <product-manage-company />
          </div>
        </div>
      </common-layout-center>
    </div>
    <div class="p-4">
      <common-layout-center>
        <common-card-info title="会员归属">
          <template #info>
            <member-lists-new v-model:rely="memberParams" :staff-list="StoreStaffList" :get-staff-list="getStaff" />
          </template>
        </common-card-info>
      </common-layout-center>
    </div>

    <common-button-bottom confirm-text="提交新增" :cancle-show="false" @confirm="execute" @cancel="backtrack" />
  </div>
</template>

<style>
.n-base-selection-label {
  height: 40px !important;
}

.n-input-wrapper {
  border-radius: 20px !important;
}

.n-date-picker {
  border-radius: 20px;
}
</style>

<style scoped lang="scss">
</style>

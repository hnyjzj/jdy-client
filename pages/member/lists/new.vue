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

await getMyStore({ page: 1, limit: 20 })
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
    <div class="grid-12 pb-[80px]">
      <product-manage-company class="color-[#fff] col-4 px-[16px] pt-[16px]" uno-lg="offset-2" />
      <div class="col-12 px-[16px] py-[16px]" uno-lg="col-8 offset-2">
        <div class="flex flex-col gap-[16px]">
          <div class="primary">
            <common-gradient title="会员归属" theme="gradient" :italic="true">
              <template #body>
                <member-lists-new v-model:rely="memberParams" :staff-list="StoreStaffList" @get-staff-list="getStaff" />
              </template>
            </common-gradient>
          </div>
        </div>
      </div>
    </div>
    <common-button-bottom confirm-text="确认新增" cancel-text="取消" @confirm="execute" @cancel="backtrack" />
  </div>
</template>

<style>
.n-base-selection {
  border-radius: 20px;
}

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

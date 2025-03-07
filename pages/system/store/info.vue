<script lang="ts" setup>
const { $toast } = useNuxtApp()
const { storeDetails } = storeToRefs(useStores())
const { getStoreDetail, deleteStaff } = useStores()
const route = useRoute()
useSeoMeta({
  title: '门店详情',
})

if (route.query.id) {
  await getStoreDetail(route.query.id as Stores['id'])
}

const dialog = useDialog()
// 移除的员工
const deleteModel = ref<AssignStaff>({
  id: undefined,
  staff_id: [],
})
//  移除员工
const deleteStoreStaffFn = async (id: string) => {
  dialog.error({
    title: '确定移除此员工吗?',
    negativeText: '取消',
    positiveText: '确定',
    onPositiveClick: async () => {
      deleteModel.value.id = storeDetails.value.id
      deleteModel.value.staff_id = [id]
      const res = await deleteStaff(deleteModel.value)
      if (res) {
        $toast.success('移除成功')
        await getStoreDetail(route.query.id as Stores['id'])
      }
    },
  })
}
const assign = () => {
  navigateTo(`/system/store/assign?id=${storeDetails.value.id}`)
}
</script>

<template>
  <div class="grid-12 p-[16px]">
    <div class="col-12" uno-md="col-8 offset-2" uno-lg="col-6 offset-3">
      <stores-info :info-detail="storeDetails" />
      <staff-assign-card :list="storeDetails.staffs" @delete-store-staff="deleteStoreStaffFn" @confirm="assign" />
      <template v-if="storeDetails.staffs.length === 0">
        <common-emptys text="暂未分配员工" />
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>

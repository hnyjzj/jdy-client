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

// 移除的员工
const deleteModel = ref<AssignStaff>({
  id: undefined,
  staff_id: [],
})

const dialogShow = ref(false)
//  移除员工
const deleteStoreStaffFn = async (id: string) => {
  dialogShow.value = true
  deleteModel.value.id = storeDetails.value.id
  deleteModel.value.staff_id = [id]
}
const confirmDelete = async () => {
  const res = await deleteStaff(deleteModel.value)
  if (res) {
    $toast.success('移除成功')
    await getStoreDetail(route.query.id as Stores['id'])
  }
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
      <common-confirm v-model:show="dialogShow" title="提示" text="确认移除此员工吗?" @submit="confirmDelete" />
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>

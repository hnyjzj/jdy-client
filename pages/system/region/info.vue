<script lang="ts" setup>
const { $toast } = useNuxtApp()
const { regionDetails } = storeToRefs(useRegion())
const { getRegionDetail, deleteStaff, Delsuperiors, DelRegionStore } = useRegion()
const route = useRoute()
useSeoMeta({
  title: '区域详情',
})

if (route.query.id) {
  await getRegionDetail(route.query.id as Stores['id'])
}

// 移除的员工
const deleteModel = ref<AssignStaff>({
  id: undefined,
  staff_id: [],
})

const dialogShow = ref(false)
const deleteObj = ref<string>('')
//  移除员工
const deleteRegionStaffFn = async (id: string) => {
  deleteObj.value = 'staff'
  dialogShow.value = true
  deleteModel.value.id = regionDetails.value.id
  deleteModel.value.staff_id = [id]
}
// 移除负责人
const deleteRegionSuperFn = async (id: string) => {
  deleteObj.value = 'super'
  dialogShow.value = true
  deleteModel.value.id = regionDetails.value.id
  deleteModel.value.staff_id = [id]
}
const deleteRegionStoreFn = async (id: string) => {
  deleteObj.value = 'store'
  dialogShow.value = true
  deleteModel.value.id = regionDetails.value.id
  deleteModel.value.staff_id = [id]
}

const confirmDelete = async () => {
  if (deleteObj.value === 'super') {
    const params = ref<RegionAssignsuperior>({
      id: '',
      superior_id: [],
    })
    const { id, staff_id } = deleteModel.value
    params.value.id = id
    params.value.superior_id = staff_id
    const res = await Delsuperiors(params.value)
    if (res) {
      $toast.success('移除成功')
      await getRegionDetail(route.query.id as Stores['id'])
    }
    else {
      $toast.error('移除失败')
    }
  }
  if (deleteObj.value === 'store') {
    const params = ref<RegionassignStores>({
      id: '',
      store_id: [],
    })
    const { id, staff_id } = deleteModel.value
    params.value.id = id
    params.value.store_id = staff_id
    const res = await DelRegionStore(params.value)
    if (res) {
      $toast.success('移除成功')
      await getRegionDetail(route.query.id as Stores['id'])
    }
    else {
      $toast.error('移除失败')
    }
  }
  if (deleteObj.value === 'staff') {
    const res = await deleteStaff(deleteModel.value)
    if (res) {
      $toast.success('移除成功')
      await getRegionDetail(route.query.id as Stores['id'])
    }
    else {
      $toast.error('移除失败')
    }
  }
}
const assign = (data: string) => {
  if (data === 'store') {
    navigateTo(`/system/region/assignstore?id=${regionDetails.value.id}`)
  }
  else {
    navigateTo(`/system/region/assign?id=${regionDetails.value.id}&type=${data}`)
  }
}

const showDeleteText = computed(() => {
  return deleteObj.value === 'staff' ? '确认移除此员工吗?' : deleteObj.value === 'store' ? '确认移除此门店吗' : '确认移除此负责人吗'
})
</script>

<template>
  <div class="grid-12 p-[16px]">
    <div class="col-12" uno-md="col-8 offset-2" uno-lg="col-4 offset-4">
      <region-info :info-detail="regionDetails" />
      <region-assign-super
        :stores="regionDetails.stores"
        :list="regionDetails.staffs"
        :super="regionDetails.superiors"
        @delete-region-staff="deleteRegionStaffFn"
        @delete-region-super="deleteRegionSuperFn"
        @delete-region-store="deleteRegionStoreFn"
        @confirm="assign" />
      <template v-if="regionDetails.staffs.length === 0">
        <common-emptys text="暂未分配员工" />
      </template>
      <common-confirm v-model:show="dialogShow" title="提示" :text="showDeleteText" @submit="confirmDelete" />
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>

<script lang="ts" setup>
const { $toast } = useNuxtApp()
const { regionDetails } = storeToRefs(useRegion())
const { getRegionDetail, deleteStaff, Delsuperiors, DelRegionStore, DelAdmins } = useRegion()
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
// 移除员工、负责人、门店、管理员的通用函数
const deleteRegionItem = async (type: 'staff' | 'super' | 'store' | 'admin', id: string) => {
  deleteObj.value = type
  dialogShow.value = true
  deleteModel.value.id = regionDetails.value.id
  deleteModel.value.staff_id = [id]
}
// 移除成功提示
const toastTips = async (res: boolean) => {
  if (res) {
    $toast.success('移除成功')
    await getRegionDetail(route.query.id as Stores['id'])
  }
  else {
    $toast.error('移除失败')
  }
}
const confirmDelete = async () => {
  // 删除管理员
  if (deleteObj.value === 'admin') {
    const res = await DelAdmins({
      id: deleteModel.value.id,
      admin_id: deleteModel.value.staff_id,
    })
    await toastTips(res)
  }
  //   删除负责人
  if (deleteObj.value === 'super') {
    const res = await Delsuperiors({
      id: deleteModel.value.id,
      superior_id: deleteModel.value.staff_id,
    })
    await toastTips(res)
  }
  // 删除门店
  if (deleteObj.value === 'store') {
    const res = await DelRegionStore({
      id: deleteModel.value.id,
      store_id: deleteModel.value.staff_id,
    })
    await toastTips(res)
  }
  // 删除员工
  if (deleteObj.value === 'staff') {
    const res = await deleteStaff(deleteModel.value)
    await toastTips(res)
  }
}
const isModel = ref(false)
const isModelStaff = ref(false)
const nowid = ref<string>('')
const nowidStaff = ref<string>('')
const nowidtype = ref<'super' | 'staff' | 'admin'>('staff')
const assign = (data: 'super' | 'staff' | 'store' | 'admin') => {
  if (data === 'store') {
    nowid.value = regionDetails.value.id
    isModel.value = true
  }
  else {
    isModelStaff.value = true
    nowidStaff.value = regionDetails.value.id
    nowidtype.value = data
  }
}

const showDeleteText = computed(() => {
  switch (deleteObj.value) {
    case 'staff':
      return '确认移除此员工吗?'
    case 'store':
      return '确认移除此门店吗'
    case 'super':
      return '确认移除此负责人吗'
    case 'admin':
      return '确认移除此管理员吗'
  }
  return '确认移除吗?'
})
</script>

<template>
  <div class="grid-12 p-[16px]">
    <div class="col-12" uno-md="col-6 offset-3" uno-lg="col-6 offset-3" uno-xl="col-4 offset-4">
      <region-info />
      <region-assign-super
        :stores="regionDetails.stores"
        :list="regionDetails.staffs"
        :super="regionDetails.superiors"
        :admins="regionDetails.admins"
        @delete-region="deleteRegionItem"
        @confirm="assign" />
      <common-confirm v-model:show="dialogShow" title="提示" :text="showDeleteText" @submit="confirmDelete" />
    </div>

    <common-model v-model="isModel" title="添加门店" :show-ok="false" :show-cancel="false">
      <region-assignstore
        :nowid="nowid" @close="async () => {
          isModel = false
          await getRegionDetail(route.query.id as Stores['id'])
        }" />
    </common-model>
    <common-model v-model="isModelStaff" title="添加员工" :show-ok="false" :show-cancel="false">
      <region-assign-staff
        :nowid-staff="nowidStaff" :nowidtype="nowidtype" @close="async () => {
          isModelStaff = false
          await getRegionDetail(route.query.id as Stores['id'])
        }" />
    </common-model>
  </div>
</template>

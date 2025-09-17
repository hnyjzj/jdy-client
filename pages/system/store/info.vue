<script lang="ts" setup>
const { $toast } = useNuxtApp()
const { storeDetails } = storeToRefs(useStores())
const { getStoreDetail, deleteStaff, deleteSuperior } = useStores()
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
const deleteObj = ref('')
//  移除员工
const deleteStoreStaffFn = async (id: string) => {
  deleteObj.value = 'staff'
  dialogShow.value = true
  deleteModel.value.id = storeDetails.value.id
  deleteModel.value.staff_id = [id]
}
// 移除负责人
//  移除员工
const deleteStoreSuperiorFn = async (id: string) => {
  deleteObj.value = 'superior'
  dialogShow.value = true
  deleteModel.value.id = storeDetails.value.id
  deleteModel.value.staff_id = [id]
}

const confirmDelete = async () => {
  if (deleteObj.value === 'staff') {
    const res = await deleteStaff(deleteModel.value)
    if (res) {
      $toast.success('移除成功')
    }
  }
  if (deleteObj.value === 'superior') {
    const params = ref<AssignSuperior>({
      id: '',
      superior_id: [],
    })
    const { id, staff_id } = deleteModel.value
    params.value.id = id
    params.value.superior_id = staff_id
    const res = await deleteSuperior(params.value)
    if (res) {
      $toast.success('移除成功')
    }
  }

  await getStoreDetail(route.query.id as Stores['id'])
}

const isModelStaff = ref(false)

const nowidStaff = ref('')
const nowidtype = ref('')
const assign = (data: string) => {
  isModelStaff.value = true
  nowidStaff.value = storeDetails.value.id
  nowidtype.value = data
}
</script>

<template>
  <div class="grid-12 p-[16px]">
    <div class="col-12" uno-md="col-8 offset-2" uno-lg="col-6 offset-3">
      <stores-info />
      <div class="mt-[12px]">
        <n-tabs type="segment" animated>
          <n-tab-pane name="chap1" tab="分配员工">
            <staff-assign-card :list="storeDetails.staffs" @delete-store-staff="deleteStoreStaffFn" @confirm="assign" />
          </n-tab-pane>
          <n-tab-pane name="chap2" tab="分配负责人">
            <staff-assign-superior :list="storeDetails.superiors" @delete-store-staff="deleteStoreSuperiorFn" @confirm="assign" />
          </n-tab-pane>
        </n-tabs>
      </div>

      <template v-if="storeDetails.staffs.length === 0">
        <common-emptys text="暂未分配员工" />
      </template>
      <common-confirm v-model:show="dialogShow" title="提示" :text="`确认移除此${deleteObj === 'staff' ? '员工' : '负责人'}吗?`" @submit="confirmDelete" />
    </div>
    <common-model v-model="isModelStaff" title="添加员工" :show-ok="false" :show-cancel="false" confirm-text="导入货品">
      <stores-assign-staff
        :nowid-staff="nowidStaff" :nowidtype="nowidtype" @close="async () => {
          isModelStaff = false
          await getStoreDetail(route.query.id as Stores['id'])
        }" />
    </common-model>
  </div>
</template>

<style lang="scss" scoped>
:deep(.n-tabs-nav) {
  width: 300px;
}
</style>

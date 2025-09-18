<script lang="ts" setup>
const { $toast } = useNuxtApp()
const { storeDetails } = storeToRefs(useStores())
const { getStoreDetail, deleteStaff, deleteSuperior, deleteAdmin } = useStores()
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
const deleteStoreStaffFn = async (type: 'staff' | 'admin' | 'superior', id: string) => {
  deleteObj.value = type
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
    const res = await deleteSuperior({
      id: deleteModel.value.id,
      superior_id: deleteModel.value.staff_id,
    })
    if (res) {
      $toast.success('移除成功')
    }
  }
  if (deleteObj.value === 'admin') {
    const res = await deleteAdmin({
      id: deleteModel.value.id,
      admin_id: deleteModel.value.staff_id,
    })
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

const confirmTitle = computed(() => {
  return `确认移除此${deleteObj.value === 'staff' ? '员工' : deleteObj.value === 'superior' ? '负责人' : '管理员'}吗?`
})
</script>

<template>
  <div class="grid-12 p-[16px]">
    <div class="col-12" uno-md="col-8 offset-2" uno-lg="col-6 offset-3">
      <stores-info />
      <div class="mt-[12px]">
        <n-tabs type="segment" animated>
          <n-tab-pane name="chap1" tab="分配员工">
            <staff-assign-staff-card
              :list="storeDetails.staffs"
              title="员工"
              button-text="分配员工"
              button-type="staff"
              @delete-store-staff="deleteStoreStaffFn"
              @confirm="assign"
            />
          </n-tab-pane>
          <n-tab-pane name="chap2" tab="分配负责人">
            <staff-assign-staff-card
              :list="storeDetails.superiors"
              title="负责人"
              button-text="分配负责人"
              button-type="superior"
              @delete-store-staff="deleteStoreStaffFn"
              @confirm="assign"
            />
          </n-tab-pane>
          <n-tab-pane name="chap3" tab="分配管理员">
            <staff-assign-staff-card
              :list="storeDetails.admins"
              title="管理员"
              button-text="分配管理员"
              button-type="admin"
              @delete-store-staff="deleteStoreStaffFn"
              @confirm="assign"
            />
          </n-tab-pane>
        </n-tabs>
      </div>

      <template v-if="storeDetails.staffs.length === 0">
        <common-emptys text="暂未分配员工" />
      </template>
      <common-confirm v-model:show="dialogShow" title="提示" :text="confirmTitle" @submit="confirmDelete" />
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

<script lang="ts" setup>
const { storeDetails } = storeToRefs(useStores())
const { getStoreDetail } = useStores()
const route = useRoute()
useSeoMeta({
  title: '门店详情',
})

if (route.query.id) {
  await getStoreDetail(route.query.id as Stores['id'])
}
</script>

<template>
  <div class="p-[16px]">
    <common-layout-center>
      <div>
        <stores-info />
        <div class="">
          <n-tabs
            type="segment" animated
          >
            <n-tab-pane name="chap1" tab="分配员工">
              <staff-assign-staff-card
                :list="storeDetails.staffs"
                title="员工"
                button-text="分配员工"
                button-type="staff"
              />
            </n-tab-pane>
            <n-tab-pane name="chap2" tab="分配负责人">
              <staff-assign-staff-card
                :list="storeDetails.superiors"
                title="负责人"
                button-text="分配负责人"
                button-type="superior"
              />
            </n-tab-pane>
            <n-tab-pane name="chap3" tab="分配管理员">
              <staff-assign-staff-card
                :list="storeDetails.admins"
                title="管理员"
                button-text="分配管理员"
                button-type="admin"
              />
            </n-tab-pane>
          </n-tabs>
        </div>
      </div>
    </common-layout-center>
  </div>
</template>

<style lang="scss" scoped>
:deep(.n-tabs-nav) {
  width: 300px;
}
</style>

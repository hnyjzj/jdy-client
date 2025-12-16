<script lang="ts" setup>
const { regionDetails } = storeToRefs(useRegion())
const { getRegionDetail } = useRegion()
const route = useRoute()
useSeoMeta({
  title: '区域详情',
})
if (route.query.id) {
  await getRegionDetail(route.query.id as Stores['id'])
}
</script>

<template>
  <div class="p-[16px]">
    <common-layout-center>
      <div>
        <region-info />
        <region-assign-super
          :stores="regionDetails.stores"
          :list="regionDetails.staffs"
          :super="regionDetails.superiors"
          :admins="regionDetails.admins"
        />
      </div>
    </common-layout-center>
  </div>
</template>

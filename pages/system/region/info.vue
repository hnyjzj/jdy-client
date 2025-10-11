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
  <div class="grid-12 p-[16px]">
    <div class="col-12" uno-md="col-6 offset-3" uno-lg="col-6 offset-3" uno-xl="col-4 offset-4">
      <region-info />
      <region-assign-super
        :stores="regionDetails.stores"
        :list="regionDetails.staffs"
        :super="regionDetails.superiors"
        :admins="regionDetails.admins"
      />
    </div>
  </div>
</template>

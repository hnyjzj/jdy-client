<script setup lang="ts">
// 成品列表详情
useSeoMeta({
  title: '列表详情',
})
const {
  storeDetails,
} = toRefs(useStores())
const { getStoreDetail } = useStores()
const route = useRoute()

await getStoreDetail({ id: route.query.id as string })
</script>

<template>
  <div>
    <stores-info :info-detail="storeDetails" />
  </div>
</template>

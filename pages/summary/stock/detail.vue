<script lang="ts" setup>
useSeoMeta({
  title: '库存大类分布详情',
})
const list = ref(['足金(克)', '足金(件)', '金750', '金916', '铂金', '银饰'])
</script>

<template>
  <div>
    <summary-stock-list :list="list" />
    <common-button-bottom />
  </div>
</template>

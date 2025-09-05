<script lang="ts" setup>
useSeoMeta({
  title: '营销分析',
})
const data = ref([
  {
    name: '旧料总件数',
    value: 43244,
  },
  {
    name: '旧料总重数',
    value: 43244,
  },
  {
    name: '总入网费',
    value: 43244,
  },
  {
    name: '总标签价',
    value: 43244,
  },
  {
    name: '总重量',
    value: 43244,
  },
])
function addto(e: number) {
  jump('/analyze/marketing/editlump', { id: e })
}
</script>

<template>
  <div class="px-[16px]">
    <common-dark />
    <!-- <summary-total :data="data" :col="3" title="营销分析数据汇总" /> -->
    <analyze-marketing-list />
    <analyze-addto @addto="addto" />
  </div>
</template>

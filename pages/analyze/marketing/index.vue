<script lang="ts" setup>
useSeoMeta({
  title: '营销分析',
})
function addto(e: number) {
  jump('/analyze/marketing/editlump', { id: e })
}
</script>

<template>
  <div class="px-[16px]">
    <common-dark />
    <analyze-marketing-list />
    <analyze-addto @addto="addto" />
  </div>
</template>

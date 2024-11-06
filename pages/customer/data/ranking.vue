<script lang="ts" setup>
useSeoMeta({
  title: '会员数据排行',
})
// 当前选中导航
const currentNav = ref(0)
const navList = ref(['销售金额', '销售件数', '退货金额'])
const data = ref([
  { name: '销售金额', value: 335 },
  { name: '销售件数', value: 310 },
  { name: '旧货抵制', value: 234 },
  { name: '配件礼品', value: 135 },
  { name: '退货金额', value: 135 },
])
const transcriptList = ref([
  {
    top: 1,
    name: '张三三',
    value: 335,
  },
  {
    top: 2,
    name: '李四四',
    value: 310,
  },
  {
    top: 3,
    name: '王五五',
    value: 234,
  },
  {
    top: 4,
    name: '赵 六',
    value: 135,
  },
  {
    top: 5,
    name: '钱七',
    value: 135,
  },
])
const transcriptTitle = ref(['排名', '姓名', '销售金额'])
</script>

<template>
  <common-layout-center>
    <div class="p-[16px]">
      <common-dark />
      <customer-data-sumup :data="data" />
      <div class="my-4">
        <common-tab-ellipses v-model="currentNav" :nav-list="transcriptTitle" />
      </div>
      <div class="my-4">
        <common-tab-round v-model="currentNav" :nav-list="navList" />
      </div>
      <customer-data-transcript :transcript-list="transcriptList" :transcript-title="transcriptTitle" />
    </div>
  </common-layout-center>
</template>

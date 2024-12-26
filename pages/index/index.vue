<script setup lang="ts">
useSeoMeta({
  title: '待办',
})

interface DemoItem { title: string, number: number }

const demoList = ref<DemoItem[]>([
  { title: '销售金额', number: 100 },
  { title: '销售件数', number: 100 },
  { title: '旧货抵扣', number: 100 },
  { title: '退货金额', number: 100 },
])

const actlist = ref<actionList[]>([{
  icon: 'i-svg:product-target',
  title: '销售目标',
}, {
  icon: 'i-svg:product-neworder',
  title: '门店任务',
}, {
  icon: 'i-svg:product-newuser',
  title: '新增会员',
}])

const demoListt = ref<DemoItem[]>([{ title: '销售金额', number: 100 }, { title: '销售金额', number: 100 }, { title: '销售件数', number: 100 }, { title: '旧货抵扣', number: 100 }, { title: '退货金额', number: 100 },
])
</script>

<template>
  <div class="grid-12 pb-[120px]!">
    <div class="col-12  px-[16px] pt-[48px] pos-relative" uno-sm="col-10 offset-1" uno-lg="col-8 offset-2" uno-xl="col-6 offset-3">
      <div class="absolute right-0 top-[-10px] ">
        <img src="/images/banner/work.png" class="w-[200px]" @click="navigateTo('/staff/list/add')">
      </div>
      <work-card-greet />
      <common-dark />
      <work-card-digitalization left-title="今日销售" />
      <work-card-action :action-list="actlist" />
      <work-card-information left-title="今日销售" :list="demoList" />
      <work-card-information left-title="销售目标" :list="demoList" />
      <work-card-information left-title="今日销售" :list="demoList" />
      <work-card-information left-title="会员数据" :list="demoListt" rb-text="查看员工排行" />
      <n-button type="success">
        Success
      </n-button>
    </div>

    <common-tabbar text="todo" />
  </div>
</template>

<style scoped lang="scss">

</style>

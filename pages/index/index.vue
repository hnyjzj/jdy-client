<script setup lang="ts">
definePageMeta({
  layout: 'table',
})

useSeoMeta({
  title: '待办',
})
// const useUser = useDemo()

onMounted(async () => {
//   const data = await useUser.increment()
//   console.log(data, 'data')
})
interface DemoItem { title: string, number: number }

const demoList = ref<DemoItem[]>([
  { title: '销售金额', number: 100 },
  { title: '销售件数', number: 100 },
  { title: '旧货抵扣', number: 100 },
  { title: '退货金额', number: 100 },
])
const demoListt = ref<DemoItem[]>([{ title: '销售金额', number: 100 }, { title: '销售金额', number: 100 }, { title: '销售件数', number: 100 }, { title: '旧货抵扣', number: 100 }, { title: '退货金额', number: 100 },
])
</script>

<template>
  <div class="grid-12 pb-[120px]">
    <div class="col-12  px-[16px] pt-[48px] pos-relative" uno-sm="col-10 offset-1" uno-lg="col-8 offset-2" uno-xl="col-6 offset-3">
      <div class="absolute right-0 top-[-10px] ">
        <nuxt-img src="/images/banner/work.png" class="w-[200px]" />
      </div>

      <work-card-greet />
      <common-dark />
      <work-card-digitalization left-title="boss看板" />
      <work-card-action />
      <work-card-information left-title="今日销售" :list="demoList" />
      <work-card-information left-title="销售目标" :list="demoList" />
      <work-card-information left-title="今日销售" :list="demoList" />
      <work-card-information left-title="会员数据" :list="demoListt" rb-text="查看员工排行" />
    </div>

    <common-tabbar text="todo" />
  </div>
</template>

<style scoped lang="scss">

</style>

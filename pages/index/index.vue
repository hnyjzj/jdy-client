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
  url: '',
}, {
  icon: 'i-svg:product-neworder',
  title: '门店任务',
  url: '',
}, {
  icon: 'i-svg:product-newuser',
  title: '新增会员',
  url: '/member/lists/new',
}])

const userJump = (url: string) => {
  jump(url)
}

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
      <div class="pb-[16px]">
        <div class="blur-bgc rounded-[16px] py-[8px] px-[16px] flex-between items-center">
          <div class="flex-1 dark:color-[#fff]">
            郑州紫金山与二七总店联合经营店
          </div>
          <div class="bg-[#0068FF] py-[8px] px-[16px] rounded-[40px] color-[#fff] flex items-center w-auto">
            <icon name="i-icon:product-toggle" :size="16" /> <div class="pl-[4px]">
              切换门店
            </div>
          </div>
        </div>
      </div>
      <work-card-digitalization left-title="今日销售" />
      <work-card-action :action-list="actlist" @user-jump="userJump" />
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

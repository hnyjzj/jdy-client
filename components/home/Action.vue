<script lang="ts" setup>
const userJump = (url: string) => {
  jump(url)
}
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
</script>

<template>
  <div class="grid-12 gap-[8px] mb-[16px]">
    <template v-for="(item, index) in actlist" :key="index">
      <div
        class="py-[15px] px-[9px] rounded-[16px] blur-bgc flex-center-row col-4 cursor-pointer"
        @click="userJump(item.url)"
      >
        <icon :name="item.icon" :size="22" />
        <span class="text-[14px]  line-height-[24px] color-[#428EFF] dark:color-[#fff] ml-[8px]">{{ item.title }}</span>
      </div>
    </template>
  </div>
</template>

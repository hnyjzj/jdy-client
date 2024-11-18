<script lang="ts" setup>
const emits = defineEmits<{
  other: [val: string]
}>()

const otherList = ref([{
  name: 'wxwork',
  icon: 'i-svg:qwicon',
}])
</script>

<template>
  <div>
    <div class="px-[20px]  flex-center-row">
      <div class="h-[1px] w-[58px] color-[#9E9E9E] dark:color-[#fff] bg-gradient-linear-[90deg,#CCCCCC00,#CCCCCC]" />
      <div class="color-[#9E9E9E] dark:color-[#fff] px-[9px] text-[12px]">
        其他登录方式
      </div>
      <div class="h-[1px] w-[58px]  color-[#9E9E9E] dark:color-[#fff] bg-gradient-linear-[270deg,#CCCCCC00,#CCCCCC] " />
    </div>
    <template v-for="(item, index) in otherList" :key="index">
      <div class="flex-center-row py-[24px]">
        <div class="wh-[32px] rounded-full flex-center-row" @click="emits('other', item.name)">
          <icon :name="item.icon" size="32" />
        </div>
      </div>
    </template>
  </div>
</template>

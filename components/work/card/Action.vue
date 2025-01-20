<script lang="ts" setup>
const porps = defineProps<{
  actionList: actionList[]
}>()

const emits = defineEmits<{
  userJump: [url: string]
}>()
</script>

<template>
  <div class="grid-12 gap-[8px] mb-[16px]">
    <template v-for="(item, index) in porps.actionList" :key="index">
      <div
        class="py-[15px] px-[9px] rounded-[16px] blur-bgc flex-center-row col-4 cursor-pointer"
        @click="emits('userJump', item.url)"
      >
        <icon :name="item.icon" :size="30" />
        <span class="text-[12px] sm:text-[14px] line-height-[24px] color-[#428EFF] dark:color-[#fff] ml-[8px]">{{ item.title }}</span>
      </div>
    </template>
  </div>
</template>

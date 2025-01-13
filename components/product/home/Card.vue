<script lang="ts" setup>
const props = defineProps<{ img: string, text: string, num: number }>()
</script>

<template>
  <div class="">
    <div class="flex-start">
      <div>
        <icon :name="props.img" :size="30" />
      </div>
      <div>
        <div class="color-[#428EFF] dark:color-[#fff] text-size-xs line-height-[24px]">
          {{ props.text }}
        </div>
        <div class="color-[#3971F3] dark:color-[#fff] text-size-xl line-height-[24px]">
          {{ props.num }}
          <span class="text-[14px]">个</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
  list: { name: string, icon: string, title: string }[]
  text?: string
  status?: 'wxwork' | 'phone'
}>(), {
  text: '其他登录方式',
  status: 'wxwork',
})
const emits = defineEmits<{
  other: [val: 'wxwork' | 'phone']
}>()
</script>

<template>
  <div>
    <div class="px-[20px]  flex-center-row">
      <div class="h-[1px] w-[58px] color-[#9E9E9E] dark:color-[#fff] bg-gradient-linear-[90deg,#CCCCCC00,#CCCCCC]" />
      <div class="color-[#9E9E9E] dark:color-[#fff] px-[9px] text-[12px]">
        {{ props.text }}
      </div>
      <div class="h-[1px] w-[58px]  color-[#9E9E9E] dark:color-[#fff] bg-gradient-linear-[270deg,#CCCCCC00,#CCCCCC] " />
    </div>
    <template v-if="props.status === 'wxwork'">
      <div class="flex-center-col py-[24px] cursor-pointer">
        <div class="wh-[32px] rounded-full flex-center-row" @click.stop="emits('other', 'phone')">
          <icon name="i-icon:phone-icon" :size="32" />
        </div>
      </div>
    </template>
    <template v-if="props.status === 'phone'">
      <div class="flex-center-col py-[24px] cursor-pointer">
        <div class="wh-[32px] rounded-full flex-center-row" @click.stop="emits('other', 'wxwork')">
          <icon name="i-svg:qwicon" :size="32" />
        </div>
      </div>
    </template>
  </div>
</template>

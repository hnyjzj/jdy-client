<script lang="ts" setup>
const props = defineProps<{
  title: string
}>()
const emit = defineEmits<{
  titleClick: []
}>()
const CARD_CONFIGS = [
  { title: '今日销售', icon: '/images/icon/today-sale.png' },
  { title: '今日收支', icon: '/images/icon/today-receive.png' },
  { title: '今日库存', icon: '/images/icon/today-stock.png' },
]

const getIconUrl = (title: string): string => {
  const config = CARD_CONFIGS.find(item => item.title === title)
  return config?.icon || '/images/icon/today-sale.png'
}
</script>

<template>
  <div
    class="rounded-[8px] px-[16px] py-[12px] bg"
    uno-bg="[linear-gradient(180deg,_#A1C9FF_0%,_#FFFFFF_33.17%,_#FFFFFF_71.15%)]"
    uno-dark:bg="[linear-gradient(_#1D2C60)]"
  >
    <div class="flex flex-row justify-between items-center pb-[16px] ">
      <div class="flex gap-[6px] items-center" @click="emit('titleClick')">
        <img :src="getIconUrl(props.title)" class="wh-[24px]">
        <div class="font-bold text-[#1A6DD8] text-[16px]">
          {{ props.title }}
        </div>
        <slot name="gold" />
      </div>
      <div>
        <slot name="right" />
      </div>
    </div>
    <slot name="default" />
  </div>
</template>

<style lang="scss" scoped>
.bg {
  box-shadow: 4px 4px 10px 4px #0000000f;
}
</style>

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
  <div class="rounded-[8px] px-[16px] py-[12px] bg">
    <div class="flex flex-row justify-between items-center pb-[16px] ">
      <div class="flex gap-[6px]" @click="emit('titleClick')">
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
  background: linear-gradient(180deg, #daeaff 0%, #ffffff 30.77%, #ffffff 71.15%);
  box-shadow: 0px 5px 20px 0px #0000000a;
}
</style>

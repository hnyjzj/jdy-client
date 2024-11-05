<!-- 矩形选项卡 -->
<script lang="ts" setup>
const props = defineProps<{
  navList: string[]
}>()
const current = defineModel({ type: Number, default: 0 })

function changeNav(i: number) {
  current.value = i
}
</script>

<template>
  <div class="nav">
    <template v-for="(item, index) in props.navList" :key="index">
      <div class="item" :class="current === index ? 'selected' : 'unselect'" @click="changeNav(index)">
        {{ item }}
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.nav {
  --uno: 'flex gap-4 w-fit h-fit mx-auto transition-all duration-300';
  .item {
    --uno: 'shrink-0 px-4 py-1 text-[14px] text-[#000000] rounded-6px transition-all duration-500';
  }
  .unselect {
    --uno: 'font-400 bg-#FFFFFF';
  }
  .selected {
    background: linear-gradient(to right, #b4d1fa, #bde2fc);
    --uno: 'font-bold relative';
    &::after {
      content: '';
      position: absolute;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 6px solid #b4d1fa;
      bottom: -6px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
</style>

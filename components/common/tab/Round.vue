<!-- 圆角选项卡 -->
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
  border: 1px #2c86fe solid;
  --uno: 'flex w-fit h-fit mx-auto rounded-full overflow-hidden transition-all duration-500';
  .item {
    --uno: 'text-14px text-center py-8px px-16px bg-[#fff] shrink-0 transition-all duration-500';
    &:not(:last-child) {
      border-right: 1px solid #2c86fe;
    }
  }
  .unselect {
    --uno: 'text-#8C8C8C';
  }
  .selected {
    --uno: 'bg-#2c86fe text-#fff';
  }
}
</style>

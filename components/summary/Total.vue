<script lang="ts" setup>
const props = withDefaults(defineProps<{
  data: any[]
  /**
   * 一行几列?
   */
  col?: number
  /**
   * 标题
   */
  title: string
}>(), {
  col: 4,
})
</script>

<template>
  <div class="total">
    <div class="icon">
      <img width="52" height="46" src="/images/summary/stock.png">
    </div>
    <div class="flex items-center">
      <div class="label" />
      <div>{{ props.title }}</div>
    </div>
    <div class="box" :style="`grid-template-columns: repeat(${props.col}, 1fr)`">
      <template v-for="(item, index) in props.data" :key="index">
        <div class="flex">
          <div class="obj">
            <div class="text-[16px]">
              {{ item.value }}
            </div>
            <div class="text-[12px] mt-1">
              {{ item.name }}
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.total {
  --uno: 'relative blur-bgc text-color p-16px rounded-24px text-14px';
  .icon {
    --uno: 'absolute top-12px right-16px';
  }
  .box {
    --uno: 'mt-24px grid gap-y-16px text-12px';
    place-items: center;
  }
  .obj {
    --uno: 'flex flex-col items-center font-400';
  }
  .label {
    --uno: 'mr-1 w-4px h-16px rounded-4px';
    background: linear-gradient(to bottom, #1a6beb, #6ea6ff);
  }
}
</style>

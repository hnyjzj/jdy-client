<script lang="ts" setup>
const props = withDefaults(defineProps<{
  data: Record<string, string>
  title: string
}>(), {

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
    <div class="box grid-cols-3 md:grid-cols-4" style="">
      <template v-for="(value, key, index) in props.data" :key="index">
        <div class="flex">
          <div class="obj text-[14px]">
            <div>
              {{ key }}
            </div>
            <div class="mt-1">
              {{ value }}
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

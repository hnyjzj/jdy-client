<script lang="ts" setup>
const props = withDefaults(defineProps<{
  text: string
}>(), {
  text: '暂未分配门店',
})
</script>

<template>
  <div>
    <div class="pt-[100px]">
      <icon name="i-svg:empty" dark="dark:i-svg:empty-dark" class="!text-[150px]" :size="200" />
      <div class="flex-center-row text-[16px] dark:color-[#fff]">
        {{ props.text }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>

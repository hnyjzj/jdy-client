<script lang="ts" setup>
const props = withDefaults(defineProps<{
  icon?: string
  dark?: `dark:${string}`
  text?: string
}>(), {
  icon: 'i-svg:empty',
  dark: 'dark:i-svg:empty-dark',
  text: '暂无数据',
})
</script>

<template>
  <div>
    <div class="pt-[20px]">
      <Icon :name="props.icon" :dark="props.dark" class="!text-[120px]" :size="200" />
      <div class="flex-center-row text-[16px] color-[#666] dark:color-[#fff]">
        {{ props.text }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>

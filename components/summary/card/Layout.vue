<script lang="ts" setup>
const props = defineProps<{
  title: string
}>()
const emit = defineEmits<{
  titleClick: []
}>()
</script>

<template>
  <div class="rounded-[8px] px-[16px] py-[12px] bg">
    <div class="flex flex-row justify-between items-center pb-[16px] ">
      <div class="flex gap-[12px]" @click="emit('titleClick')">
        <icon name="i-icon:upload" :size="16" color="#000" />
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

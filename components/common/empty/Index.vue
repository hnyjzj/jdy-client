<script setup lang="ts">
const props = withDefaults(defineProps<{
  img?: string
}>(), {
  img: '/images/empty/record.png',
})
</script>

<template>
  <div class="flex justify-center items-center py-[24px]">
    <div class="empty">
      <NuxtImg class="empty-icon" :src="props.img" height="120" />
      <div class="super">
        <div class="super-bg">
          <icon name="i-icon:crosspath" size="18" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.empty {
  --uno: 'w-[150px] h-[150px] rounded-[50%] relative';
  box-shadow: rgba(239, 242, 255, 1) 0 5px 20px 0;
  .empty-icon {
    --uno: 'absolute top-[34px] left-[50%] translate-x-[-50%]';
  }
  .super {
    --uno: 'absolute top-[14px] right-[14px]';
    .super-bg {
      --uno: 'w-[36px] h-[36px] rounded-[50%] bg-[#FFFFFF] flex justify-center items-center';
      background: linear-gradient(to bottom, rgba(255, 152, 152, 1), rgba(255, 79, 79, 1));
      box-shadow: 0 0 20px 2px rgba(255, 152, 152, 1);
    }
  }
}
</style>

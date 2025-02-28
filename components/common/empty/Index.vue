<script setup lang="ts">
const props = withDefaults(defineProps<{
  img?: string
  showRT?: boolean
  deg?: string
  size?: string
  isShadow?: boolean
  text?: string
}>(), {
  img: '/images/empty/record.png',
  showRT: true,
  size: '100%',
  isShadow: true,
  text: '',
})
</script>

<template>
  <div class="flex flex-col justify-center items-center py-[16px]">
    <div class="empty" :style="{ boxShadow: isShadow ? 'rgba(239, 242, 255, 1) 0 5px 20px 0' : 'none' }">
      <img class="block" :src="props.img" :width="props.size" :height="props.size">
      <template v-if="props.showRT">
        <slot name="rt">
          <div class="super">
            <div class="bg" :style="{ rotate: deg }">
              <icon name="i-svg:crosspath" :size="18" />
            </div>
          </div>
        </slot>
      </template>
    </div>
    <template v-if="props.text">
      <div class="font-size-[14px] color-[#606266] pt-[24px]">
        {{ props.text }}
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.empty {
  --uno: 'rounded-[50%] relative';
  //   box-shadow: rgba(239, 242, 255, 1) 0 5px 20px 0;
  .super {
    --uno: 'absolute top-[14px] right-[14px]';
    .bg {
      --uno: 'w-[36px] h-[36px] rounded-[50%] bg-[#FFFFFF] flex justify-center items-center';
      background: linear-gradient(to bottom, rgba(255, 152, 152, 1), rgba(255, 79, 79, 1));
      box-shadow: 0 0 20px 2px rgba(255, 152, 152, 1);
    }
  }
}
</style>
